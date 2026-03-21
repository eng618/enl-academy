# ENL Academy

ENL Academy is a Next.js and Supabase application for a multi-family-capable homeschool planner, delivered in ordered roadmap slices.

## Current slice

The repository is currently aligned to roadmap slice 1:

- families
- profiles
- roles
- invites
- row-level security

Later slices for invite onboarding, dashboards, curriculum, scheduling, reading, and exports remain intentionally deferred.

## Local development

Run the app:

```bash
bun dev
```

Run local CI checks:

```bash
bun validate
bun validate --fix
```

## Cloudflare Workers wiring

This repo is wired for Next.js on Cloudflare Workers using OpenNext.

Worker config files:

- `wrangler.jsonc`
- `open-next.config.ts`
- `public/_headers`

Useful scripts:

```bash
bun run preview # build + local worker preview
bun run deploy  # build + deploy worker
bun run upload  # build + upload worker bundle
bun run cf-typegen
```

For local Worker runtime variables, create `.dev.vars` (already gitignored).

## Supabase foundation

Canonical SQL now lives under `supabase/`:

- `supabase/migrations/20260320173000_foundations_families_profiles_invites.sql`
- `supabase/seed.example.sql`

Recommended bootstrap flow:

1. Apply migrations:
   - `supabase db push`
2. Create an auth user in the Supabase dashboard.
3. Use `supabase/seed.example.sql` as a template to insert:
   - one family row
   - one `global_admin` profile linked to that auth user
4. Optional verification (requires Docker running):
   - `supabase db dump --linked --data-only --schema public --file /tmp/enl-public-data.sql`
   - inspect `public.families` and `public.profiles` rows in the dump file
5. Sign in through the app and visit `/planner` to verify the profile and family linkage.

Applied remotely in current progress:

- `20260320173000_foundations_families_profiles_invites.sql`
- `20260321110000_seed_initial_family_and_admin.sql`

## Roadmap source of truth

See:

- `docs/overview.md`
- `docs/status.md`
- `AGENTS.md`

## Notes

- Database changes should be committed as migrations, not as ad hoc top-level SQL snapshots.
- Personalized household seed data should stay out of the canonical repository seed path.
