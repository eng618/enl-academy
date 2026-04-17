# ENL Academy

ENL Academy is a Next.js and Supabase application for a multi-family-capable homeschool planner, delivered in ordered roadmap slices.

## Current slice

Slices 1–3 are complete (foundations, auth/invites, role dashboards). The next slice is 4: Math-U-See curriculum + task generation.

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

## Admin bootstrap

There is no public admin registration flow — `global_admin` accounts must be provisioned manually. Follow these steps for any new admin:

### 1. Sign up via the app

Go to `/auth/login` and click **Sign up** using the admin's email and a strong password. If Supabase email confirmation is enabled, verify the email first.

### 2. Run the bootstrap script

Open `supabase/scripts/bootstrap_admin.sql` in an editor, fill in the three variables at the top:

```sql
v_admin_email  := 'you@example.com';  -- the email used in step 1
v_display_name := 'Your Name';
v_family_name  := 'Your Family';      -- ignored if a family already exists
```

Then paste the entire script into the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql) and click **Run**. The SQL editor runs as the service role, which bypasses RLS — that is intentional for the one-time bootstrap only.

The script will:

- Look up the auth user by email (fails with a clear message if not found)
- Create a family row if none exists yet (or reuse the existing one)
- Upsert a `global_admin` profile linked to that user

### 3. Sign in and verify

Go to `/auth/login`, sign in, and confirm you land on `/dashboard/global-admin` with your family and profile visible.

### Adding more admins

Repeat steps 1–3 with the new admin's email. The script is idempotent — re-running it on an existing profile updates the role and display name without creating duplicates.

> **Note:** The invite flow (`/admin/invite`) deliberately cannot create `global_admin` invites (enforced by a DB constraint). All admin provisioning goes through this script.

## Roadmap source of truth

See:

- `docs/overview.md`
- `docs/status.md`
- `AGENTS.md`

## Notes

- Database changes should be committed as migrations, not as ad hoc top-level SQL snapshots.
- Personalized household seed data should stay out of the canonical repository seed path.

## Auth troubleshooting

If sign-in appears successful but the app stays on `/auth/login`, the browser may be blocking Supabase auth cookies or auth requests.

Common causes:

- Built-in ad blockers or strict tracking protection
- Privacy extensions that block storage or cross-site requests
- Aggressive cookie restrictions in browser privacy settings

Quick checks:

1. Disable ad/tracking blocking for this site and try again.
2. Open `/auth/login` after signing in; authenticated users should be redirected away from login.
3. If needed, retry in a private window with extensions disabled.

This app also enforces a server-side redirect in middleware for authenticated visits to `/auth/login`, but browser-level blocking can still prevent the session from being persisted correctly.
