# Overview and implementation plan

Perfect, that context helps a lot. Below I’ll lay out concrete sub‑tasks for:

- Roles + invite‑only onboarding (multi‑family ready but used by yours)
- Initial data model (families, users, curriculum, reading list)
- First pass at Math‑U‑See weekly/worksheet structure
- A bit of NC record‑keeping alignment so you don’t paint yourself into a corner

You can then turn each sub‑task into issues or TODOs in the repo.

---

## 1. Data model foundations (families, users, roles)

Since you may allow multiple families later, design for multi‑tenant now, even if only your family exists. [antstack](https://www.antstack.com/blog/multi-tenant-applications-with-rls-on-supabase-postgress/)

**Tables (Supabase):**

- `families`
  - `id` (uuid)
  - `name` (e.g. “Garcia Family”)
- `profiles`
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → `auth.users.id`)
  - `family_id` (uuid, FK → `families.id`)
  - `role` (enum: `global_admin`, `parent`, `student`)
  - `display_name`
  - `grade_level` (nullable, for students)
- `family_memberships` (optional, if you want flexibility later)
  - `id`
  - `family_id`
  - `profile_id`
  - `role_in_family` (parent/student)

**RLS essentials:**

- Enable RLS on all application tables. [supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- Pattern: each table has `family_id`; policies allow access when row.family_id matches the logged‑in profile’s family.
- Extra policy: `global_admin` can see all families (for future multi‑family use).

**Sub‑tasks:**

- [ ] Create the tables in Supabase (SQL migration or via dashboard).
- [ ] Add a `role` enum type and use it in `profiles`.
- [ ] Implement RLS policies for `families`, `profiles`, and future tables (curriculum, reading list).
- [ ] Seed one `families` row manually for your household and a `profiles` row as `global_admin`.

---

## 2. Auth + invite‑only onboarding flow

Goal: only invited users can create profiles, and each invite pins them to a role + family.

**Tables:**

- `invites`
  - `id` (uuid)
  - `email`
  - `family_id`
  - `role` (parent/student)
  - `created_by_profile_id`
  - `token` (random string)
  - `expires_at`
  - `accepted_at` (nullable)

**Flow:**

1. You (global_admin) log in via Supabase auth (your account seeded as `global_admin`).
2. From an “Admin → Invites” page, you:
   - Choose family (your family for now).
   - Choose role (parent or student).
   - Enter email (or even a fake “local” email if kids are too young to own one yet).
   - Backend creates an `invites` entry with a token.
3. App shows you an invite URL like `/invite/{token}` (you can copy/share manually).
4. When someone hits `/invite/{token}`:
   - If not logged in, route them through signup/login.
   - After Supabase auth, you create a `profiles` row linked to `auth.users.id`, using `family_id` + `role` from the invite.
   - Mark `accepted_at` on the invite and invalidate it.

**Next.js implementation slices:**

- [ ] Set up Supabase client for server components / route handlers. [blog.logrocket](https://blog.logrocket.com/build-full-stack-app-next-js-supabase/)
- [ ] Public routes: `/auth/login`, `/auth/callback`, `/invite/[token]`.
- [ ] Protected app routes: everything else; middleware redirects unauthenticated users to `/auth/login`.
- [ ] Admin “Invites” page (list + create form).
- [ ] Invite acceptance page that:
  - Validates token and expiration.
  - On first login, creates the `profile` and redirects to correct dashboard (parent/student).

---

## 3. Basic dashboards per role

Minimal but clear “home pages” to make onboarding feel complete.

**Global admin (you):**

- [ ] View families (list; for now just yours).
- [ ] View all profiles in a family.
- [ ] Manage invites.

**Parent (your wife, you in “parent” role):**

- [ ] See a list of students in the family.
- [ ] For each student: quick stats (number of tasks today, current Math‑U‑See level, reading list count).
- [ ] Link to “Curriculum” and “Reading list” sections.

**Student:**

- [ ] Simple “Today” page (even before scheduling logic is finished):
  - Placeholder for “Today’s tasks” list.
  - Reading list widget (“currently reading” book).

These can all be built with your `@gv-tech/ui-web` components so you get a consistent look early. [npmjs](https://www.npmjs.com/package/@gv-tech%2Fui-web)

---

## 4. Math‑U‑See curriculum and tasks (simplified)

Given your description and the usual Math‑U‑See pattern (A–G sheets + tests). [homemadeourway](https://homemadeourway.com/implementing-math-u-see/)

**Tables:**

- `curricula`
  - `id`
  - `family_id` (nullable if global template)
  - `name` (e.g. “Math‑U‑See Beta”)
  - `subject` (“Math”)
- `curriculum_levels`
  - `id`
  - `curriculum_id`
  - `level_index` (1..30 for lessons)
  - `label` (“Lesson 1”, “Lesson 2”, …)
- `worksheets`
  - `id`
  - `curriculum_level_id`
  - `type` (enum: `practice`, `review`, `enrichment`, `test`)
  - `code` (“A”, “B”, … “G”)
  - `sequence_index` (1..7 within lesson)

- `student_enrollments`
  - `id`
  - `student_profile_id`
  - `curriculum_level_start_id` (or just level number)
  - `current_level_id`
  - `start_date`
  - `school_days_per_week` (default 5)
  - `status` (active/completed)

- `tasks`
  - `id`
  - `student_profile_id`
  - `worksheet_id` (nullable if you later support generic tasks)
  - `date`
  - `status` (pending/completed/skipped)
  - `completed_at`
  - `grade` (enum `pass`/`fail`/`ungraded`)

**Generation logic v1 (simple):**

- For each enrollment:
  - Generate one task per worksheet, in order A–G for each lesson, lessons in sequence.
  - Assign dates by walking school days (M–F), 1 worksheet per school day.
  - If the student completes multiple tasks in one day, that’s fine; future days remain pre‑populated, but you’ll see them “early” in the UI.

Later, you can enhance to generate only a few weeks ahead and reflow tasks when many are completed early.

**Sub‑tasks:**

- [ ] Seed a single Math‑U‑See curriculum and a small subset of lessons/worksheets into the DB (can be a seed script or manual insert).
- [ ] Implement `student_enrollments` and a function (API/route handler) that generates `tasks` for an enrollment over, say, the next 60–90 days.
- [ ] Parent UI: enroll a student in “Math‑U‑See Alpha/Beta/etc.” and view generated tasks.
- [ ] Student UI: show “Today’s Math” by reading `tasks` for today.

---

## 5. Days off, standardized testing, and auto‑slide

NC requires you to keep attendance and standardized test results; you already want days off to slide everything forward. [hslda](https://hslda.org/post/the-importance-of-recordkeeping-in-north-carolina)

**Tables:**

- `days_off`
  - `id`
  - `family_id`
  - `date`
  - `reason` (e.g. “Sick”, “Standardized testing”)
  - `is_standardized_testing` (boolean)

**Behaviour:**

- When you create a `days_off` row for a date:
  - Mark that day as non‑school.
  - For each student’s `tasks` on that date, move them to the next available school day and slide all later tasks accordingly (algorithm can be a server function or cron).

- Attendance:
  - You can derive “attendance” as: school day and at least 1 completed task, or manually toggle attendance in a separate `attendance` table if you want explicit control.

**Sub‑tasks:**

- [ ] Implement `days_off` table and parent UI to mark a day off.
- [ ] Implement a server‑side function to recompute task dates from that date forward for each affected student.
- [ ] Add a simple “Attendance” view per student that shows present/absent per day (even if just derived for now).

---

## 6. Reading list feature

This will support Sonlight later and also give your kids a nice sense of progress.

**Tables:**

- `books`
  - `id`
  - `family_id` (nullable for global book catalog)
  - `title`
  - `author`
  - `isbn` (nullable)
  - `notes`
- `student_books`
  - `id`
  - `student_profile_id`
  - `book_id`
  - `status` (enum: `upcoming`, `reading`, `completed`)
  - `started_at`
  - `completed_at`
  - `notes` (e.g. narration summaries)

**Sub‑tasks:**

- [ ] Parent UI: add books to family catalog (title, author, optional ISBN).
- [ ] Parent UI: assign books to a student with initial status (`upcoming`/`reading`).
- [ ] Student UI:
  - “Reading” section:
    - Currently reading (1–3 books)
    - Upcoming (queue)
    - Completed (history).
- [ ] When a student marks a book as completed, set `completed_at` and maybe prompt a quick note (for portfolio style records).

Later, when you model Sonlight, you can link `lessons` or “reading tasks” directly to `book_id`.

---

## 7. NC record‑keeping alignment

NC law focuses on attendance, immunizations, and standardized tests; everything else (grades, reading logs) is helpful but not legally required. [nche](https://nche.com/law/record-review-meetings/)

Given that:

- Your app can:
  - Track attendance (derived from `tasks` + `days_off`, or via explicit `attendance` table).
  - Attach “standardized testing” as special `days_off` with `is_standardized_testing = true` and optionally store test scores in a `test_results` table later.
  - Provide reading logs and pass/fail grades for your own portfolio.

**Sub‑tasks:**

- [ ] Add an export function (CSV or simple printable view) for:
  - Attendance per student.
  - Reading list per student.
  - Pass/fail course summary (e.g. “Math‑U‑See Beta: Pass”).
- [ ] Later: a `test_results` table if you want to keep those scores in the same system.

---

## 8. Suggested implementation order

Given your preference (roles/onboarding first, then Math‑U‑See), I’d implement in this order:

1. Data model + RLS for `families`, `profiles`, `invites`.
2. Auth + invite flow + dashboards for global_admin, parent, student.
3. Math‑U‑See core tables (`curricula`, `curriculum_levels`, `worksheets`, `student_enrollments`, `tasks`).
4. “Today’s tasks” + basic calendar/agenda view fed from `tasks`.
5. Pass/fail grading at the task level (or lesson level) and a simple per‑student summary.
6. `days_off` + auto‑slide algorithm.
7. Reading list tables + UI.
8. Attendance + simple export views (for NC documentation).

To help you create issues: would it be most useful if I next produce concrete Supabase table definitions (SQL) and a minimal ERD for the families/profiles/invites + Math‑U‑See + reading list, or would you rather start with page/route structure in Next.js (file tree + high‑level components)?
