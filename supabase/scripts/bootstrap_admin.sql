-- bootstrap_admin.sql
-- ─────────────────────────────────────────────────────────────────────────────
-- Run this in the Supabase SQL Editor (it executes as the service role, so
-- RLS policies are bypassed — that is intentional for the initial bootstrap).
--
-- Steps:
--   1. Sign up at /auth/login with your admin email + password first.
--   2. Fill in your values in the CONFIGURATION block below.
--   3. Paste the whole script into the Supabase SQL Editor and click Run.
--   4. Sign in at /auth/login and confirm you land on /dashboard/global-admin.
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare
  -- ── CONFIGURATION ────────────────────────────────────────────────────────
  v_admin_email    text := 'you@example.com';   -- ← replace with your email
  v_display_name   text := 'Admin';             -- ← replace with your name
  v_family_name    text := 'My Family';         -- ← replace with your family name
  -- ─────────────────────────────────────────────────────────────────────────

  v_user_id     uuid;
  v_family_id   uuid;
begin
  -- 1. Look up the auth user by email
  select id
  into v_user_id
  from auth.users
  where email = lower(trim(v_admin_email))
  limit 1;

  if v_user_id is null then
    raise exception
      'No auth user found for email "%". Sign up at /auth/login first.',
      v_admin_email;
  end if;

  -- 2. Get or create the family
  select id
  into v_family_id
  from public.families
  order by created_at asc
  limit 1;

  if v_family_id is null then
    insert into public.families (name)
    values (v_family_name)
    returning id into v_family_id;

    raise notice 'Created family "%" → %', v_family_name, v_family_id;
  else
    raise notice 'Using existing family → %', v_family_id;
  end if;

  -- 3. Upsert the global_admin profile
  insert into public.profiles (user_id, family_id, role, display_name, grade_level)
  values (v_user_id, v_family_id, 'global_admin'::public.app_role, v_display_name, null)
  on conflict (user_id)
  do update set
    family_id    = excluded.family_id,
    role         = 'global_admin'::public.app_role,
    display_name = excluded.display_name,
    updated_at   = timezone('utc', now());

  raise notice 'Admin profile ready for user % (%)', v_display_name, v_user_id;
end;
$$;

-- Quick verification — should return one row with role = global_admin
select
  p.display_name,
  p.role,
  p.family_id,
  f.name as family_name,
  u.email
from public.profiles p
join public.families f on f.id = p.family_id
join auth.users u on u.id = p.user_id
where p.role = 'global_admin'
order by p.created_at;
