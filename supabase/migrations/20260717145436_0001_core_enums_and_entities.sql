/*
# Core Enums and Entity Tables

## Purpose
Establishes the foundational lookup/entity tables for the class website.
These are the anchor tables that all content and portal tables will reference
via foreign keys. Designed for future expansion without schema redesign.

## 1. Custom Enum Types

- `day_of_week` — Mon, Tue, Wed, Thu, Fri, Sat, Sun. Includes weekend days
  now so Saturday/sunday classes can be added later without a type change.
  Extensible via `ALTER TYPE day_of_week ADD VALUE`.
- `assignment_status` — Belum Mulai, Berjalan, Selesai, Terlambat.
  Extensible via `ALTER TYPE ... ADD VALUE`.
- `subject_color` — brand, cream, emerald, sky, rose, violet. Maps to the
  UI color system used in the schedule view. Extensible.

## 2. Shared Trigger Function

- `set_updated_at()` — automatically sets `updated_at = now()` on any row
  update. Reused across all tables that have an `updated_at` column.

## 3. New Tables

### subjects
Subject / course catalog. Referenced by schedule_slots and assignments.
- `id` (uuid, PK)
- `name` (text, unique, not null) — e.g. "Tipografi II"
- `color_key` (subject_color, default 'brand') — UI color tag
- `created_at`, `updated_at` (timestamptz)

### teachers
Teacher / mentor profiles. Referenced by schedule_slots.
- `id` (uuid, PK)
- `name` (text, not null)
- `email` (text, unique, not null)
- `whatsapp` (text, nullable) — international format, no plus sign
- `photo_url` (text, nullable)
- `role` (text, nullable) — e.g. "Wali Kelas", free-text for flexibility
- `created_at`, `updated_at` (timestamptz)

### rooms
Classroom / studio / lab lookup. Referenced by schedule_slots.
- `id` (uuid, PK)
- `code` (text, unique, not null) — e.g. "C-2", "Studio A", "Lab 1"
- `label` (text, nullable) — human-friendly display name
- `created_at`, `updated_at` (timestamptz)

### students
Student roster. Referenced by piket_assignments (coordinator) and
piket_members. Exists now so cleaning-duty and future features
(attendance, grades) have a real FK target.
- `id` (uuid, PK)
- `name` (text, not null)
- `created_at`, `updated_at` (timestamptz)

## 4. Indexes
- Unique indexes on `subjects.name`, `teachers.email`, `rooms.code`.

## 5. Security (RLS)
All tables are single-tenant (no sign-in). RLS enabled on every table.
Policies allow `anon, authenticated` full CRUD — the data is intentionally
public/shared for the class website.
*/

-- ── Enum types ──────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE day_of_week AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE assignment_status AS ENUM ('Belum Mulai', 'Berjalan', 'Selesai', 'Terlambat');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE subject_color AS ENUM ('brand', 'cream', 'emerald', 'sky', 'rose', 'violet');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Shared updated_at trigger function ──────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── subjects ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subjects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  color_key   subject_color NOT NULL DEFAULT 'brand',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS subjects_name_key ON subjects (name);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_subjects" ON subjects;
CREATE POLICY "anon_select_subjects" ON subjects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_subjects" ON subjects;
CREATE POLICY "anon_insert_subjects" ON subjects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_subjects" ON subjects;
CREATE POLICY "anon_update_subjects" ON subjects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_subjects" ON subjects;
CREATE POLICY "anon_delete_subjects" ON subjects FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── teachers ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teachers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  whatsapp    text,
  photo_url   text,
  role        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS teachers_email_key ON teachers (email);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_teachers" ON teachers;
CREATE POLICY "anon_select_teachers" ON teachers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_teachers" ON teachers;
CREATE POLICY "anon_insert_teachers" ON teachers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_teachers" ON teachers;
CREATE POLICY "anon_update_teachers" ON teachers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_teachers" ON teachers;
CREATE POLICY "anon_delete_teachers" ON teachers FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── rooms ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS rooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL,
  label       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS rooms_code_key ON rooms (code);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_rooms" ON rooms;
CREATE POLICY "anon_select_rooms" ON rooms FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_rooms" ON rooms;
CREATE POLICY "anon_insert_rooms" ON rooms FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_rooms" ON rooms;
CREATE POLICY "anon_update_rooms" ON rooms FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_rooms" ON rooms;
CREATE POLICY "anon_delete_rooms" ON rooms FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── students ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS students (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS students_name_idx ON students (name);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_students" ON students;
CREATE POLICY "anon_select_students" ON students FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_students" ON students;
CREATE POLICY "anon_insert_students" ON students FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_students" ON students;
CREATE POLICY "anon_update_students" ON students FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_students" ON students;
CREATE POLICY "anon_delete_students" ON students FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
