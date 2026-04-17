# ENL Academy Status

## Current focus

Roadmap slice 4: Math-U-See curriculum model + task generation.

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

## Completed in slice 3

- Role landing path now routes to `src/lib/role-landing.ts`, with role-specific dashboard paths.
- Added dashboard core pages:
  - `src/app/dashboard/page.tsx`
  - `src/app/dashboard/global-admin/page.tsx`
  - `src/app/dashboard/parent/page.tsx`
  - `src/app/dashboard/student/page.tsx`
- Added dashboard layout at `src/app/dashboard/layout.tsx` with shared `SiteHeader`.
- Updated entrypoint references from `/planner` to `/dashboard` and sticky header links accordingly.
- Fixed anchor hash links to use absolute root paths (`/#welcome`, etc.) so they work from dashboard context.
- Added unit tests for `getRoleLandingPath` in `src/lib/role-landing.test.ts`.
- Verified no lint/analysis issues and tests pass (`bun test`).
- Added middleware protection for dashboard role routes and admin routes using server-side profile role lookup.
- Role cookie is now refreshed from server-side profile state on protected routes and cleared on sign-out.
- Added invite acceptance edge-case tests for unauthenticated, invalid, used, expired, mismatched-email, and success cases.
- **Global Admin dashboard** now shows live families + profiles table with view-detail toggle per row.
- **Parent dashboard** now shows student profile cards for the parent's family; curriculum/reading listed as coming-soon.
- **Student dashboard** now shows a "Today" view with Today's Tasks and Currently Reading empty-state placeholders.
- Dashboard layout now uses `DashboardHeader` (`src/components/site/dashboard-header.tsx`) with role-aware nav links (global_admin: Families · Invites; parent: Students · Invites; student: Today).
- Typecheck and lint pass on all changed files.

## Remaining in slice 2

- Add role-aware post-login UX refinements and role-specific landing polish.

## Deployment wiring

- Cloudflare Workers wiring added via OpenNext adapter.
- Repository now includes `wrangler.jsonc`, `open-next.config.ts`, and `public/_headers`.
- CI build now validates both Next build and OpenNext worker bundle build.

## Notes

- Canonical database changes now belong under `supabase/migrations`.
- Personalized household data should not be committed as canonical seed data.
- `register` now serves as an invite-token entry point during slice 2.
