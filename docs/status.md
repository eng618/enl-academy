# ENL Academy Status

## Current focus

Roadmap slice 2: auth and invite acceptance flow.

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

## Completed in slice 2 (in progress)

- Login route implemented at `src/app/auth/login/page.tsx`.
- Auth callback route implemented at `src/app/auth/callback/page.tsx`.
- Invite acceptance route implemented at `src/app/invite/[token]/page.tsx`.
- Admin invite creation UI activated at `src/app/admin/invite/page.tsx`.
- Secure invite APIs implemented:
  - `POST /api/invites`
  - `GET /api/invites/[token]`
  - `POST /api/invites/accept`
- Server-side invite acceptance uses invite-derived role/family and marks tokens as accepted.

## Remaining in slice 2

- Add explicit route guards/middleware for protected admin-only pages.
- Add role-aware post-login UX refinements and role-specific landing polish.
- Add tests for invite token lifecycle edge cases.

## Deployment wiring

- Cloudflare Workers wiring added via OpenNext adapter.
- Repository now includes `wrangler.jsonc`, `open-next.config.ts`, and `public/_headers`.
- CI build now validates both Next build and OpenNext worker bundle build.

## Notes

- Canonical database changes now belong under `supabase/migrations`.
- Personalized household data should not be committed as canonical seed data.
- `register` now serves as an invite-token entry point during slice 2.
