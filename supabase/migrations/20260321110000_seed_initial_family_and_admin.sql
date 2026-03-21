do $$
declare
  seeded_family_id uuid;
  first_auth_user_id uuid;
begin
  select id
  into seeded_family_id
  from public.families
  order by created_at asc
  limit 1;

  if seeded_family_id is null then
    insert into public.families (name)
    values ('Founding Family')
    returning id into seeded_family_id;
  end if;

  select id
  into first_auth_user_id
  from auth.users
  order by created_at asc
  limit 1;

  if first_auth_user_id is not null then
    insert into public.profiles (user_id, family_id, role, display_name, grade_level)
    values (
      first_auth_user_id,
      seeded_family_id,
      'global_admin'::public.app_role,
      'Initial Global Admin',
      null
    )
    on conflict (user_id)
    do update set
      family_id = excluded.family_id,
      role = 'global_admin'::public.app_role,
      display_name = excluded.display_name;
  end if;
end;
$$;
