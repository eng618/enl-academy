# ENL Academy Agent Framework

## Mission

Build ENL Academy in small, testable slices aligned with the implementation plan in docs/overview.md.

## Source of truth

1. docs/overview.md
2. .github/instructions/\*.instructions.md
3. Existing code and project conventions

If any guidance conflicts, follow the highest item in this list.

## Required delivery order

1. Multi-tenant foundations: families, profiles, roles, invites, RLS
2. Auth + invite onboarding + role redirects
3. Role dashboards: global_admin, parent, student
4. Math-U-See curriculum model + task generation
5. Days off + auto-slide scheduling
6. Reading list model + UI
7. Attendance + exports

Do not skip ahead to later phases unless the user explicitly requests it.

## Working rules

- Keep each change focused on one feature slice.
- Prefer server-side authorization checks for all writes.
- Every app table must include tenant-safe access strategy (family_id or equivalent).
- Every write path must be idempotent when practical.
- Prefer small migrations over large one-shot schema changes.
- Add/update docs when behavior changes.

## Definition of done for each slice

- DB schema/migration is present (if needed)
- RLS policy is present (if table is app-facing)
- API/server action behavior is implemented
- Minimal UI path exists and is role-aware
- Happy-path verification was run
- Relevant docs were updated

## Testing baseline

- Validate typecheck and lint for changed code.
- Validate Supabase SQL in isolated migration files.
- Add unit/integration coverage for non-trivial logic when feasible.

## UX baseline

- Use @gv-tech/ui-web components first.
- Keep parent/student experiences simple and task-oriented.
- Prefer clear status and progress states over dense tables.

## Security baseline

- Never trust client-provided role/family values.
- Derive role/family from authenticated profile on server.
- Keep invite tokens single-use and expiring.
- Avoid exposing cross-family data in queries or aggregations.
