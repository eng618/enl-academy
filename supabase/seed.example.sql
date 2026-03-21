-- Slice 1 bootstrap example
-- Replace the placeholder UUIDs and names before running.
-- 1. Create a family row.
insert into
  public.families (name)
values
  ('Example Family') returning id;

-- 2. Create or identify an auth user in the Supabase dashboard.
-- 3. Insert the initial global admin profile using the auth user's UUID.
insert into
  public.profiles (
    user_id,
    family_id,
    role,
    display_name,
    grade_level
  )
values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'global_admin',
    'Example Admin',
    null
  );

-- Optional verification
-- select id, name from public.families order by created_at;
-- select user_id, family_id, role, display_name from public.profiles order by created_at;
