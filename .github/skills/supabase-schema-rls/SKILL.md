---
name: supabase-schema-rls
description: Build or update Supabase schema with multi-tenant-safe RLS policies.
---

# Skill: Supabase Schema + RLS

## Use when

- Adding new domain tables
- Updating family ownership model
- Introducing role-sensitive read/write paths

## Inputs

- Target feature slice from docs/overview.md
- Table list and required fields
- Role access expectations

## Checklist

1. Create or update SQL migration for schema changes.
2. Add explicit foreign keys and useful indexes.
3. Enable RLS for every app-facing table.
4. Add select/insert/update/delete policies with tenant checks.
5. Add global_admin override policy only where needed.
6. Seed minimal local data for manual verification.
7. Document schema and policy intent in docs.

## Guardrails

- Do not ship app-facing tables without RLS.
- Do not use auth.uid() alone when family_id ownership is required.
- Avoid permissive policies that allow cross-family reads.

## Done criteria

- Migration applies cleanly.
- Policies enforce tenant boundaries.
- Basic read/write path works for expected role.
