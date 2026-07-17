/*
# Content Tables — Public Website Sections

## Purpose
Tables backing the public-facing website content: highlighted events,
photo gallery, class playlist, and weekly creative mood. All are
single-tenant (no auth) with anon+authenticated CRUD policies.

## 1. New Tables

### gallery_categories
Lookup table for gallery photo categories (Aktivitas, Acara, Kelas, etc.).
Normalizing the category into its own table means new categories can be
added without touching the gallery_items schema.
- `id` (uuid, PK)
- `name` (text, unique, not null)
- `sort_order` (int, default 0) — controls filter display order
- `created_at`, `updated_at`

### gallery_items
Photo entries shown in the gallery section.
- `id` (uuid, PK)
- `title` (text, not null)
- `image_url` (text, not null)
- `category_id` (uuid, FK → gallery_categories.id, NOT NULL)
- `span` (text, nullable) — 'tall' | 'wide' | 'normal' — masonry layout hint
- `sort_order` (int, default 0)
- `published` (boolean, default true) — draft/unpublish support
- `created_at`, `updated_at`

### highlights
Featured events / projects shown on the home page.
- `id` (uuid, PK)
- `title` (text, not null)
- `description` (text, not null)
- `image_url` (text, not null)
- `tag` (text, nullable) — e.g. "Acara Tahunan", "Proyek"
- `sort_order` (int, default 0)
- `published` (boolean, default true)
- `created_at`, `updated_at`

### playlists
A class playlist collection (Spotify-backed).
- `id` (uuid, PK)
- `title` (text, not null)
- `description` (text, nullable)
- `cover_url` (text, nullable)
- `embed_url` (text, nullable) — Spotify embed URL
- `open_url` (text, nullable) — Spotify open URL
- `total_songs` (int, default 0) — denormalized count for display
- `last_updated` (date, nullable) — ISO date shown in UI
- `published` (boolean, default true)
- `created_at`, `updated_at`

### playlist_tracks
Tracks belonging to a playlist.
- `id` (uuid, PK)
- `playlist_id` (uuid, FK → playlists.id, ON DELETE CASCADE, NOT NULL)
- `title` (text, not null)
- `artist` (text, not null)
- `duration` (text, not null) — mm:ss display format
- `sort_order` (int, default 0)
- `created_at`, `updated_at`

### creative_mood
Single-row-ish weekly creative inspiration (quote, color, font, artwork).
Multiple rows allowed so weekly history is preserved; the UI picks the latest.
- `id` (uuid, PK)
- `quote` (text, not null)
- `quote_author` (text, not null)
- `color_name` (text, nullable)
- `color_hex` (text, nullable)
- `font_name` (text, nullable)
- `font_specimen` (text, nullable)
- `artwork_title` (text, nullable)
- `artwork_url` (text, nullable)
- `week_start` (date, nullable) — which week this mood belongs to
- `created_at`, `updated_at`

## 2. Foreign Keys
- gallery_items.category_id → gallery_categories.id (RESTRICT)
- playlist_tracks.playlist_id → playlists.id (CASCADE)

## 3. Indexes
- gallery_items: category_id, published, sort_order
- playlist_tracks: playlist_id, sort_order
- creative_mood: week_start (latest-week lookup)
- highlights: published, sort_order

## 4. Security (RLS)
All tables: single-tenant, anon+authenticated full CRUD.
*/

-- ── gallery_categories ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS gallery_categories_name_key
  ON gallery_categories (name);

ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery_categories" ON gallery_categories;
CREATE POLICY "anon_select_gallery_categories" ON gallery_categories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_gallery_categories" ON gallery_categories;
CREATE POLICY "anon_insert_gallery_categories" ON gallery_categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_gallery_categories" ON gallery_categories;
CREATE POLICY "anon_update_gallery_categories" ON gallery_categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_gallery_categories" ON gallery_categories;
CREATE POLICY "anon_delete_gallery_categories" ON gallery_categories FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON gallery_categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── gallery_items ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  image_url    text NOT NULL,
  category_id  uuid NOT NULL REFERENCES gallery_categories(id) ON DELETE RESTRICT,
  span         text,
  sort_order   int NOT NULL DEFAULT 0,
  published    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gallery_items_category_id_idx
  ON gallery_items (category_id);
CREATE INDEX IF NOT EXISTS gallery_items_published_sort_idx
  ON gallery_items (published, sort_order);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery_items" ON gallery_items;
CREATE POLICY "anon_select_gallery_items" ON gallery_items FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_gallery_items" ON gallery_items;
CREATE POLICY "anon_insert_gallery_items" ON gallery_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_gallery_items" ON gallery_items;
CREATE POLICY "anon_update_gallery_items" ON gallery_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_gallery_items" ON gallery_items;
CREATE POLICY "anon_delete_gallery_items" ON gallery_items FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── highlights ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS highlights (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  description  text NOT NULL,
  image_url    text NOT NULL,
  tag          text,
  sort_order   int NOT NULL DEFAULT 0,
  published    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS highlights_published_sort_idx
  ON highlights (published, sort_order);

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

CREATE TRIGGER set_updated_at BEFORE UPDATE ON highlights
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── playlists ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS playlists (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  cover_url     text,
  embed_url     text,
  open_url      text,
  total_songs   int NOT NULL DEFAULT 0,
  last_updated  date,
  published     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS playlists_published_idx
  ON playlists (published);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_playlists" ON playlists;
CREATE POLICY "anon_select_playlists" ON playlists FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_playlists" ON playlists;
CREATE POLICY "anon_insert_playlists" ON playlists FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_playlists" ON playlists;
CREATE POLICY "anon_update_playlists" ON playlists FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_playlists" ON playlists;
CREATE POLICY "anon_delete_playlists" ON playlists FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON playlists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── playlist_tracks ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS playlist_tracks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  title       text NOT NULL,
  artist      text NOT NULL,
  duration    text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS playlist_tracks_playlist_id_sort_idx
  ON playlist_tracks (playlist_id, sort_order);

ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_playlist_tracks" ON playlist_tracks;
CREATE POLICY "anon_select_playlist_tracks" ON playlist_tracks FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_playlist_tracks" ON playlist_tracks;
CREATE POLICY "anon_insert_playlist_tracks" ON playlist_tracks FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_playlist_tracks" ON playlist_tracks;
CREATE POLICY "anon_update_playlist_tracks" ON playlist_tracks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_playlist_tracks" ON playlist_tracks;
CREATE POLICY "anon_delete_playlist_tracks" ON playlist_tracks FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON playlist_tracks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── creative_mood ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS creative_mood (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote          text NOT NULL,
  quote_author   text NOT NULL,
  color_name     text,
  color_hex      text,
  font_name      text,
  font_specimen  text,
  artwork_title  text,
  artwork_url    text,
  week_start     date,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS creative_mood_week_start_idx
  ON creative_mood (week_start DESC);

ALTER TABLE creative_mood ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_creative_mood" ON creative_mood;
CREATE POLICY "anon_select_creative_mood" ON creative_mood FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_creative_mood" ON creative_mood;
CREATE POLICY "anon_insert_creative_mood" ON creative_mood FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_creative_mood" ON creative_mood;
CREATE POLICY "anon_update_creative_mood" ON creative_mood FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_creative_mood" ON creative_mood;
CREATE POLICY "anon_delete_creative_mood" ON creative_mood FOR DELETE
  TO anon, authenticated USING (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON creative_mood
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
