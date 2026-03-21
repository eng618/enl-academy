create extension if not exists pgcrypto;

create type public.app_role as enum ('global_admin', 'parent', 'student');

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  family_id uuid references public.families (id) on delete set null,
  role public.app_role not null,
  display_name text not null,
  grade_level text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  family_id uuid not null references public.families (id) on delete cascade,
  role public.app_role not null,
  created_by_profile_id uuid not null references public.profiles (id) on delete restrict,
  token text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  constraint invites_non_admin_role check (role <> 'global_admin')
);

create index if not exists profiles_family_id_idx on public.profiles (family_id);
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists invites_family_id_idx on public.invites (family_id);
create index if not exists invites_email_idx on public.invites (lower(email));
create index if not exists invites_expires_at_idx on public.invites (expires_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.profiles
  where user_id = auth.uid()
  limit 1;
$$;

create or replace function public.current_profile_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where user_id = auth.uid()
  limit 1;
$$;

create or replace function public.current_profile_family_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select family_id
  from public.profiles
  where user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_global_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'global_admin'::public.app_role, false);
$$;

create or replace function public.can_access_family(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    public.is_global_admin()
    or public.current_profile_family_id() = target_family_id,
    false
  );
$$;

alter table public.families enable row level security;
alter table public.profiles enable row level security;
alter table public.invites enable row level security;

drop policy if exists families_select_accessible on public.families;
create policy families_select_accessible
on public.families
for select
using (public.can_access_family(id));

drop policy if exists families_insert_global_admin on public.families;
create policy families_insert_global_admin
on public.families
for insert
with check (public.is_global_admin());

drop policy if exists families_update_global_admin on public.families;
create policy families_update_global_admin
on public.families
for update
using (public.is_global_admin())
with check (public.is_global_admin());

drop policy if exists profiles_select_accessible on public.profiles;
create policy profiles_select_accessible
on public.profiles
for select
using (
  user_id = auth.uid()
  or public.is_global_admin()
  or (
    family_id is not null
    and public.can_access_family(family_id)
  )
);

drop policy if exists profiles_insert_global_admin on public.profiles;
create policy profiles_insert_global_admin
on public.profiles
for insert
with check (public.is_global_admin());

drop policy if exists profiles_update_global_admin on public.profiles;
create policy profiles_update_global_admin
on public.profiles
for update
using (public.is_global_admin())
with check (public.is_global_admin());

drop policy if exists invites_select_accessible on public.invites;
create policy invites_select_accessible
on public.invites
for select
using (public.can_access_family(family_id));

drop policy if exists invites_insert_family_admin on public.invites;
create policy invites_insert_family_admin
on public.invites
for insert
with check (
  public.is_global_admin()
  or (
    public.current_profile_role() = 'parent'::public.app_role
    and family_id = public.current_profile_family_id()
    and created_by_profile_id = public.current_profile_id()
  )
);

drop policy if exists invites_update_creator_or_global_admin on public.invites;
create policy invites_update_creator_or_global_admin
on public.invites
for update
using (
  public.is_global_admin()
  or created_by_profile_id = public.current_profile_id()
)
with check (
  public.is_global_admin()
  or (
    created_by_profile_id = public.current_profile_id()
    and family_id = public.current_profile_family_id()
  )
);
