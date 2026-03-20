---
description: Enforce ENL Academy implementation sequencing, data boundaries, and role-aware delivery.
applyTo: '**/*'
---

# ENL Academy Roadmap Rules

Use docs/overview.md as the canonical roadmap and deliver work in ordered slices.

## Ordered slices

1. Families/profiles/roles/invites + RLS
2. Auth and invite acceptance flow
3. Role dashboards (global_admin, parent, student)
4. Math-U-See curriculum, enrollments, tasks
5. Days off and auto-slide scheduling
6. Reading list and student book status
7. Attendance and exports

Do not build slice N+1 before slice N unless the user asks to reorder priorities.

## Multi-tenant and access rules

- Assume multi-family support from day one.
- Tables that store family-owned data should include family_id.
- RLS policies must check family ownership or global_admin status.
- Never rely on client-only checks for role/tenant access.

## Auth/invite rules

- Invite-only profile creation for non-admin users.
- Invite tokens must be single-use and expiring.
- Profile role and family must be derived from invite record at acceptance time.

## Curriculum/tasking rules

- Task generation should follow worksheet order and school-day cadence.
- Support completion ahead of schedule without data corruption.
- Date-shift behavior must be deterministic when days_off is added.

## NC records alignment

- Preserve enough data to produce attendance, reading logs, and pass/fail summaries.
- Keep export-friendly structures (stable dates, statuses, and ownership fields).

## Delivery discipline

- Prefer incremental migrations and feature flags when needed.
- Keep PR-sized changes minimal and independently verifiable.
- Update docs when introducing new tables, statuses, or flows.
