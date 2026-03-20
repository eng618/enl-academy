---
name: feature-slice-delivery
description: Deliver one roadmap slice from schema through UI with acceptance checks.
---

# Skill: Feature Slice Delivery

## Use when

- Implementing any single slice from docs/overview.md

## Slice workflow

1. Confirm exact slice scope and excluded items.
2. Implement schema/migrations first (if needed).
3. Implement server logic and authorization checks.
4. Implement minimal role-aware UI path.
5. Add or update tests for critical logic.
6. Update docs with behavior and limitations.
7. Run validation (lint/typecheck/tests as applicable).

## Scope rules

- Keep one vertical slice per change set.
- Avoid mixing unrelated refactors.
- Leave clear TODO markers for deferred roadmap items.

## Output template

- What changed
- Access/security impact
- Validation performed
- Follow-up tasks
