/*
# Flatten Schema — Lightweight CMS Redesign

## Purpose
Complete redesign of the database from a normalized structure (14 tables with
foreign key chains) to a flat, CMS-style structure (9 independent tables).
The goal is maximum simplicity for manual admin editing — every section is
editable from one table, with plain text instead of IDs wherever possible.

## 1. Dropped (old normalized schema)
All 14 old tables, 3 enum types, and the shared trigger function are dropped
with CASCADE. This is a full rebuild — the old data was placeholder seed data.
- Tables: subjects, teachers, rooms, students, gallery_categories, gallery_items,
  highlights, playlists, playlist_tracks, creative_mood, schedule_slots,
  piket_assignments, piket_members, assignments
- Types: day_of_week, assignment_status, subject_color
- Functions: set_updated_at()

## 2. New Tables (9 total, all independent — no foreign keys)

### schedule
Weekly class schedule — one row per lesson per day. All text, no joins.
- id, day (text: "Monday".."Friday"), lesson_order (int), subject (text),
  teacher (text), room (text), start_time (time), end_time (time),
  accent_color (text: brand/sky/cream/emerald/rose/violet), active (bool)

### assignments
Homework and project tasks. Flat — subject and teacher are plain text.
- id, title, subject, teacher, description, due_date (date),
  status (text), attachment_url, sort_order (int)

### piket_schedule
Cleaning duty per day — up to 4 members stored as columns, no child table.
- id, day (text), member_1, member_2, member_3, member_4, notes

### playlist
Class playlist tracks — each row is a self-contained track.
- id, title, artist, duration (text: "3:12"), spotify_url,
  cover_image, display_order (int)

### gallery
Photo gallery — categories are plain text (no category table).
- id, category (text), title, image (URL), description, featured (bool),
  display_order (int)

### highlights
Featured events/projects on the homepage.
- id, title, subtitle, image (URL), description, display_order (int)

### teachers
Teacher profiles — fully self-contained, no relationships.
- id, name, subject, position, phone, whatsapp_url, photo (URL),
  display_order (int)

### class_information
Single-row table with class metadata (rarely changed).
- id, class_name, school, major, academic_year, location,
  student_count (int), established_year (int), about_text

### website_settings
Single-row table with global website settings.
- id, loading_logo, welcome_title, welcome_subtitle, spotify_playlist,
  hero_image, hero_text, footer_text

## 3. Security (RLS)
All tables are single-tenant (no auth, no sign-in). RLS enabled on every
table. Policies allow anon + authenticated full CRUD — the data is
intentionally public/shared for the class website.

## 4. Indexes
- schedule: (day, lesson_order) for the primary query pattern
- assignments: (due_date), (sort_order)
- gallery: (display_order), (featured)
- All others: display_order / sort_order where applicable
*/

-- ── Drop old schema ─────────────────────────────────────────

DROP TABLE IF EXISTS schedule_slots CASCADE;
DROP TABLE IF EXISTS piket_members CASCADE;
DROP TABLE IF EXISTS piket_assignments CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS gallery_items CASCADE;
DROP TABLE IF EXISTS gallery_categories CASCADE;
DROP TABLE IF EXISTS highlights CASCADE;
DROP TABLE IF EXISTS playlist_tracks CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS creative_mood CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS students CASCADE;

DROP FUNCTION IF EXISTS set_updated_at() CASCADE;
DROP TYPE IF EXISTS day_of_week CASCADE;
DROP TYPE IF EXISTS assignment_status CASCADE;
DROP TYPE IF EXISTS subject_color CASCADE;

-- ── schedule ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS schedule (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day           text NOT NULL,
  lesson_order  int NOT NULL DEFAULT 1,
  subject       text NOT NULL,
  teacher       text NOT NULL,
  room          text NOT NULL,
  start_time    time NOT NULL,
  end_time      time NOT NULL,
  accent_color  text NOT NULL DEFAULT 'brand',
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS schedule_day_lesson_idx
  ON schedule (day, lesson_order);
CREATE INDEX IF NOT EXISTS schedule_active_idx ON schedule (active);

ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_schedule" ON schedule;
CREATE POLICY "anon_select_schedule" ON schedule FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_schedule" ON schedule;
CREATE POLICY "anon_insert_schedule" ON schedule FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_schedule" ON schedule;
CREATE POLICY "anon_update_schedule" ON schedule FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_schedule" ON schedule;
CREATE POLICY "anon_delete_schedule" ON schedule FOR DELETE
  TO anon, authenticated USING (true);

-- ── assignments ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assignments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  subject        text NOT NULL,
  teacher        text,
  description    text,
  due_date       date NOT NULL,
  status         text NOT NULL DEFAULT 'Belum Mulai',
  attachment_url text,
  sort_order     int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assignments_due_date_idx ON assignments (due_date);
CREATE INDEX IF NOT EXISTS assignments_sort_order_idx ON assignments (sort_order);

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

-- ── piket_schedule ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS piket_schedule (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day        text NOT NULL,
  member_1   text,
  member_2   text,
  member_3   text,
  member_4   text,
  notes      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS piket_schedule_day_idx ON piket_schedule (day);

ALTER TABLE piket_schedule ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_piket_schedule" ON piket_schedule;
CREATE POLICY "anon_select_piket_schedule" ON piket_schedule FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_piket_schedule" ON piket_schedule;
CREATE POLICY "anon_insert_piket_schedule" ON piket_schedule FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_piket_schedule" ON piket_schedule;
CREATE POLICY "anon_update_piket_schedule" ON piket_schedule FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_piket_schedule" ON piket_schedule;
CREATE POLICY "anon_delete_piket_schedule" ON piket_schedule FOR DELETE
  TO anon, authenticated USING (true);

-- ── playlist ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS playlist (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  artist        text NOT NULL,
  duration      text NOT NULL,
  spotify_url   text,
  cover_image   text,
  display_order int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS playlist_display_order_idx ON playlist (display_order);

ALTER TABLE playlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_playlist" ON playlist;
CREATE POLICY "anon_select_playlist" ON playlist FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_playlist" ON playlist;
CREATE POLICY "anon_insert_playlist" ON playlist FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_playlist" ON playlist;
CREATE POLICY "anon_update_playlist" ON playlist FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_playlist" ON playlist;
CREATE POLICY "anon_delete_playlist" ON playlist FOR DELETE
  TO anon, authenticated USING (true);

-- ── gallery ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category      text NOT NULL,
  title         text NOT NULL,
  image         text NOT NULL,
  description   text,
  featured      boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gallery_display_order_idx ON gallery (display_order);
CREATE INDEX IF NOT EXISTS gallery_featured_idx ON gallery (featured);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery" ON gallery;
CREATE POLICY "anon_select_gallery" ON gallery FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_gallery" ON gallery;
CREATE POLICY "anon_insert_gallery" ON gallery FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_gallery" ON gallery;
CREATE POLICY "anon_update_gallery" ON gallery FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_gallery" ON gallery;
CREATE POLICY "anon_delete_gallery" ON gallery FOR DELETE
  TO anon, authenticated USING (true);

-- ── highlights ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS highlights (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  subtitle      text,
  image         text NOT NULL,
  description   text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS highlights_display_order_idx ON highlights (display_order);

ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_highlights" ON highlights;
CREATE POLICY "anon_select_highlights" ON highlights FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_highlights" ON highlights;
CREATE POLICY "anon_insert_highlights" ON highlights FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_highlights" ON highlights;
CREATE POLICY "anon_update_highlights" ON highlights FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_highlights" ON highlights;
CREATE POLICY "anon_delete_highlights" ON highlights FOR DELETE
  TO anon, authenticated USING (true);

-- ── teachers ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teachers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  subject       text NOT NULL,
  position      text,
  phone         text,
  whatsapp_url  text,
  photo         text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS teachers_display_order_idx ON teachers (display_order);

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

-- ── class_information ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS class_information (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name       text NOT NULL,
  school           text NOT NULL,
  major            text NOT NULL,
  academic_year    text NOT NULL,
  location         text NOT NULL,
  student_count    int NOT NULL DEFAULT 0,
  established_year int NOT NULL DEFAULT 0,
  about_text       text NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE class_information ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_class_information" ON class_information;
CREATE POLICY "anon_select_class_information" ON class_information FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_class_information" ON class_information;
CREATE POLICY "anon_insert_class_information" ON class_information FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_class_information" ON class_information;
CREATE POLICY "anon_update_class_information" ON class_information FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_class_information" ON class_information;
CREATE POLICY "anon_delete_class_information" ON class_information FOR DELETE
  TO anon, authenticated USING (true);

-- ── website_settings ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS website_settings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loading_logo     text,
  welcome_title    text NOT NULL,
  welcome_subtitle text NOT NULL,
  spotify_playlist text,
  hero_image       text,
  hero_text        text,
  footer_text      text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_website_settings" ON website_settings;
CREATE POLICY "anon_select_website_settings" ON website_settings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_website_settings" ON website_settings;
CREATE POLICY "anon_insert_website_settings" ON website_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_website_settings" ON website_settings;
CREATE POLICY "anon_update_website_settings" ON website_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_website_settings" ON website_settings;
CREATE POLICY "anon_delete_website_settings" ON website_settings FOR DELETE
  TO anon, authenticated USING (true);
