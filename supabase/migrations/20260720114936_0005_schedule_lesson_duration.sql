/*
# Add lesson_duration to schedule

## Purpose
The schedule table previously had no column for lesson duration in "JP"
(Jam Pelajaran / lesson periods). This adds an editable text field so admins
can record how many JP each lesson counts for (e.g. "1 JP", "2 JP", "3 JP").

## 1. Modified Tables

### schedule
- Added column `lesson_duration` (text, nullable) — stores human-readable
  lesson duration like "1 JP", "2 JP", etc. Nullable so existing rows and
  inserts that omit it still work. Defaults to '1 JP' for convenience.

## 2. Data
Existing 20 schedule rows are updated with realistic JP values based on
their time span (90-minute lessons = "2 JP", others = "1 JP").

## 3. Security
No RLS changes — schedule already has full anon/authenticated CRUD policies.
*/

ALTER TABLE schedule
  ADD COLUMN IF NOT EXISTS lesson_duration text DEFAULT '1 JP';

-- Backfill existing rows with realistic JP values
UPDATE schedule SET lesson_duration = '2 JP'
  WHERE end_time::interval - start_time::interval >= interval '80 minutes'
  AND lesson_duration IS NULL;

UPDATE schedule SET lesson_duration = '1 JP'
  WHERE lesson_duration IS NULL;
