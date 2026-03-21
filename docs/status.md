# ENL Academy Status

## Current focus

Roadmap slice 1: multi-tenant foundations for families, profiles, roles, invites, and row-level security.

## Completed in this slice

- Canonical Supabase migration created for:
  - `families`
  - `profiles`
  - `invites`
  - `app_role` enum
- Tenant-safe RLS policies added for families, profiles, and invites.
- Helper SQL functions added for current profile, current family, and global admin checks.
- Sanitized seed example added for local bootstrap.
- Remote Supabase migration applied successfully:
  - `20260320173000_foundations_families_profiles_invites.sql`
- Safe remote seed migration applied successfully:
  - `20260321110000_seed_initial_family_and_admin.sql`
- Planner route repurposed into a foundation dashboard that verifies auth, profile linkage, and family assignment.
- Premature later-slice pages replaced with placeholders so the app no longer depends on unimplemented tables.

## Pending in slice 1

- Verify RLS behavior against an authenticated user and service-role workflows.
- Validate seeded rows in remote DB using Docker-enabled CLI flow:
  - `supabase db dump --linked --data-only --schema public --file /tmp/enl-public-data.sql`
  - inspect `public.families` and `public.profiles` in the dump or via Supabase Table Editor.

## Next slice

Roadmap slice 2: auth and invite acceptance flow.

## Notes

- Canonical database changes now belong under `supabase/migrations`.
- Personalized household data should not be committed as canonical seed data.
- The `register`, `admin/invite`, and richer planner flows stay intentionally deferred until the auth slice is implemented.
