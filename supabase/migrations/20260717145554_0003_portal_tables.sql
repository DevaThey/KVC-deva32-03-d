/*
# Portal Tables — Schedule, Cleaning Duty (Piket), and Assignments

## Purpose
Tables backing the student portal. These reference the core entity tables
(subjects, teachers, rooms, students) created in migration 0001. All
single-tenant with anon+authenticated CRUD policies.

## 1. New Tables

### schedule_slots
Weekly class schedule — one row per time slot per day.
- `id` (uuid, PK)
- `day` (day_of_week, NOT NULL) — which weekday
- `start_time` (time, NOT NULL) — e.g. '07:30'
- `end_time` (time, NOT NULL) — e.g. '09:00'
- `subject_id` (uuid, FK → subjects.id, NOT NULL)
- `teacher_id` (uuid, FK → teachers.id, NOT NULL)
- `room_id` (uuid, FK → rooms.id, NOT NULL)
- `sort_order` (int, default 0) — within-day ordering fallback
- `created_at`, `updated_at`

This is fully normalized: the subject name, teacher name, room code, and
color tag are all resolved via joins rather than duplicated text.

### piket_assignments
Cleaning-duty (piket) coordinator per day — one row per day.
- `id` (uuid, PK)
- `day` (day_of_week, NOT NULL)
- `coordinator_id` (uuid, FK → students.id, NOT NULL)
- `created_at`, `updated_at`

### piket_members
Members assigned to a piket day (many per day).
- `id` (uuid, PK)
- `piket_id` (uuid, FK → piket_assignments.id, ON DELETE CASCADE, NOT NULL)
- `student_id` (uuid, FK → students.id, NOT NULL)
- `sort_order` (int, default 0)
- `created_at`

### assignments
Homework / project tasks with due dates and status.
- `id` (uuid, PK)
- `title` (text, NOT NULL)
- `subject_id` (uuid, FK → subjects.id, nullable) — nullable because some
  assignments (e.g. "Pekan Kreatif") may not map to a specific subject
- `due_date` (date, NOT NULL)
- `status` (assignment_status, NOT NULL, default 'Belum Mulai')
- `sort_order` (int, default 0)
- `created_at`, `updated_at`

## 2. Foreign Keys
- schedule_slots.subject_id → subjects.id (RESTRICT)
- schedule_slots.teacher_id → teachers.id (RESTRICT)
- schedule_slots.room_id → rooms.id (RESTRICT)
- piket_assignments.coordinator_id → students.id (RESTRICT)
- piket_members.piket_id → piket_assignments.id (CASCADE)
- piket_members.student_id → students.id (RESTRICT)
- assignments.subject_id → subjects.id (SET NULL) — keeping the assignment
  if its subject is later removed

## 3. Indexes
- schedule_slots: composite (day, start_time) — the primary query pattern
- schedule_slots: subject_id, teacher_id, room_id — join lookups
- piket_assignments: day
- piket_members: piket_id
- assignments: due_date, status, subject_id

## 4. Security (RLS)
All tables: single-tenant, anon+authenticated full CRUD.
*/

-- ── schedule_slots ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS schedule_slots (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day         day_of_week NOT NULL,
  start_time  time NOT NULL,
  end_time    time NOT NULL,
  subject_id  uuid NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  teacher_id  uuid NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
  room_id     uuid NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS schedule_slots_day_start_idx
  ON schedule_slots (day, start_time);
CREATE INDEX IF NOT EXISTS schedule_slots_subject_id_idx
  ON schedule_slots (subject_id);
CREATE INDEX IF NOT EXISTS schedule_slots_teacher_id_idx
  ON schedule_slots (teacher_id);
CREATE INDEX IF NOT EXISTS schedule_slots_room_id_idx
  ON schedule_slots (room_id);

ALTER TABLE schedule_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_schedule_slots" ON schedule_slots;
CREATE POLICY "anon_select_schedule_slots" ON schedule_slots FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_schedule_slots" ON schedule_slots;
CREATE POLICY "anon_insert_schedule_slots" ON schedule_slots FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_schedule_slots" ON schedule_slots;
CREATE POLICY "anon_update_schedule_slots" ON schedule_slots FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_schedule_slots" ON schedule_slots;
CREATE POLICY "anon_delete_schedule_slots" ON schedule_slots FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON schedule_slots
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── piket_assignments ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS piket_assignments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day            day_of_week NOT NULL,
  coordinator_id uuid NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS piket_assignments_day_idx
  ON piket_assignments (day);

ALTER TABLE piket_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_piket_assignments" ON piket_assignments;
CREATE POLICY "anon_select_piket_assignments" ON piket_assignments FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_piket_assignments" ON piket_assignments;
CREATE POLICY "anon_insert_piket_assignments" ON piket_assignments FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_piket_assignments" ON piket_assignments;
CREATE POLICY "anon_update_piket_assignments" ON piket_assignments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_piket_assignments" ON piket_assignments;
CREATE POLICY "anon_delete_piket_assignments" ON piket_assignments FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON piket_assignments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── piket_members ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS piket_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  piket_id    uuid NOT NULL REFERENCES piket_assignments(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS piket_members_piket_id_idx
  ON piket_members (piket_id);

ALTER TABLE piket_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_piket_members" ON piket_members;
CREATE POLICY "anon_select_piket_members" ON piket_members FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_piket_members" ON piket_members;
CREATE POLICY "anon_insert_piket_members" ON piket_members FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_piket_members" ON piket_members;
CREATE POLICY "anon_update_piket_members" ON piket_members FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_piket_members" ON piket_members;
CREATE POLICY "anon_delete_piket_members" ON piket_members FOR DELETE
  TO anon, authenticated USING (true);

-- ── assignments ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assignments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  subject_id  uuid REFERENCES subjects(id) ON DELETE SET NULL,
  due_date    date NOT NULL,
  status      assignment_status NOT NULL DEFAULT 'Belum Mulai',
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assignments_due_date_idx
  ON assignments (due_date);
CREATE INDEX IF NOT EXISTS assignments_status_idx
  ON assignments (status);
CREATE INDEX IF NOT EXISTS assignments_subject_id_idx
  ON assignments (subject_id);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_assignments" ON assignments;
CREATE POLICY "anon_select_assignments" ON assignments FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_assignments" ON assignments;
CREATE POLICY "anon_insert_assignments" ON assignments FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_assignments" ON assignments;
CREATE POLICY "anon_update_assignments" ON assignments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_assignments" ON assignments;
CREATE POLICY "anon_delete_assignments" ON assignments FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
