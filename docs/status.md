# ENL Academy Homeschool Planner - Project Status

## Completed

- Supabase authentication wired (magic link + password option)
- Role model: `admin`, `parent`, `student`
- Invitation flow: `admin/invite` and `register` via `token`
- `profiles`, `invitations`, `households`, `students`, `curriculums`, `blackout_dates`, `tasks` SQL schema and TypeScript types
- RLS policies authored in `supabase-policies.sql` (household-based access)
- UI flows:
  - `planner` dashboard + task/blackout UI
  - `admin/students` CRUD
  - `admin/invite` request
- API / table-level protection with Supabase auth checks inside app
- Stripe: not yet implemented (was not in scope yet)

## In progress

- `planner` user display: fallback `unlinked` when profile not found
- Data seed and admin onboarding docs

## Remaining

1. fullcalendar-style combined and per-student calendar rendering
2. student & curriculum dedicated CRUD pages (with edit/delete)
3. server-side APIs (`api/blackout`, `api/tasks`) for business validation
4. end-to-end test coverage for RLS and roles
5. improve UI with validation, toasts, and mobile table layout

## Notes

- If UI shows `Signed in as ... (unlinked)`, check `profiles` row for user_id and household membership.
- Create initial admin via Supabase console user + profile insert, or use invite flow.
