import { supabase } from './supabase';
import type {
  Highlight,
  GalleryItem,
  Teacher,
  ScheduleSlot,
  PiketSlot,
  Assignment,
  Playlist,
  PlaylistTrack,
  CreativeMood,
  DayKey,
  SubjectColor,
  AssignmentStatus,
} from './data';

const fmtTime = (t: string) => t.slice(0, 5);

// Minimal relation shapes for the raw Supabase response (untyped client
// returns nested rows as arrays; we cast to scalars where the relation is
// many-to-one). Keep these local to avoid leaking Supabase naming into the
// public type interfaces in data.ts.

interface RawGalleryRow {
  id: string;
  title: string;
  image_url: string;
  span: string | null;
  gallery_categories: { name: string } | { name: string }[] | null;
}
interface RawScheduleRow {
  id: string;
  day: DayKey;
  start_time: string;
  end_time: string;
  subjects: { name: string; color_key: SubjectColor } | { name: string; color_key: SubjectColor }[] | null;
  teachers: { name: string } | { name: string }[] | null;
  rooms: { code: string } | { code: string }[] | null;
}
interface RawPiketRow {
  id: string;
  day: DayKey;
  students: { name: string } | { name: string }[] | null;
  piket_members: {
    sort_order: number | null;
    students: { name: string } | { name: string }[] | null;
  }[] | null;
}
interface RawAssignmentRow {
  id: string;
  title: string;
  due_date: string;
  status: AssignmentStatus;
  subjects: { name: string } | { name: string }[] | null;
}
interface RawPlaylistRow {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  embed_url: string | null;
  open_url: string | null;
  total_songs: number;
  last_updated: string | null;
  playlist_tracks: {
    id: string;
    title: string;
    artist: string;
    duration: string;
    sort_order: number | null;
  }[] | null;
}
interface RawMoodRow {
  id: string;
  quote: string;
  quote_author: string;
  color_name: string | null;
  color_hex: string | null;
  font_name: string | null;
  font_specimen: string | null;
  artwork_title: string | null;
  artwork_url: string | null;
  week_start: string | null;
}

// Supabase returns many-to-one relations as a single object, but the untyped
// client types them as arrays. This helper safely extracts the scalar value.
function one<T>(rel: T | T[] | null): T | null {
  if (rel == null) return null;
  return Array.isArray(rel) ? (rel[0] as T) : (rel as T);
}

export async function fetchHighlights(): Promise<Highlight[]> {
  const { data, error } = await supabase
    .from('highlights')
    .select('id, title, description, image_url, tag')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    image: r.image_url,
    title: r.title,
    description: r.description,
    tag: r.tag ?? '',
  }));
}

export async function fetchGallery(): Promise<{ items: GalleryItem[]; categories: string[] }> {
  const [itemsRes, catsRes] = await Promise.all([
    supabase
      .from('gallery_items')
      .select('id, title, image_url, span, gallery_categories(name)')
      .eq('published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('gallery_categories')
      .select('name')
      .order('sort_order', { ascending: true }),
  ]);

  if (itemsRes.error) throw itemsRes.error;
  if (catsRes.error) throw catsRes.error;

  const items: GalleryItem[] = (itemsRes.data as RawGalleryRow[] ?? []).map((r) => ({
    id: r.id,
    src: r.image_url,
    title: r.title,
    category: one(r.gallery_categories)?.name ?? 'Lainnya',
    span: (r.span as GalleryItem['span']) ?? undefined,
  }));

  const categories = (catsRes.data ?? []).map((r) => r.name);

  return { items, categories };
}

export async function fetchTeachers(): Promise<Teacher[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select('id, name, email, whatsapp, photo_url, role')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    subject: r.role ?? 'Pengajar',
    photo: r.photo_url ?? '',
    email: r.email,
    whatsapp: r.whatsapp ?? undefined,
  }));
}

export async function fetchSchedule(): Promise<ScheduleSlot[]> {
  const { data, error } = await supabase
    .from('schedule_slots')
    .select(
      'id, day, start_time, end_time, subjects(name, color_key), teachers(name), rooms(code)'
    )
    .order('start_time', { ascending: true });
  if (error) throw error;
  return (data as RawScheduleRow[] ?? []).map((r) => ({
    id: r.id,
    day: r.day,
    start: fmtTime(r.start_time),
    end: fmtTime(r.end_time),
    subject: one(r.subjects)?.name ?? '—',
    teacher: one(r.teachers)?.name ?? '—',
    room: one(r.rooms)?.code ?? '—',
    color: one(r.subjects)?.color_key ?? 'brand',
  }));
}

export async function fetchPiket(): Promise<PiketSlot[]> {
  const { data, error } = await supabase
    .from('piket_assignments')
    .select('id, day, students(name), piket_members(sort_order, students(name))')
    .order('day', { ascending: true });
  if (error) throw error;
  return (data as RawPiketRow[] ?? []).map((r) => ({
    id: r.id,
    day: r.day,
    coordinator: one(r.students)?.name ?? '—',
    members: (r.piket_members ?? [])
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((m) => one(m.students)?.name ?? '')
      .filter(Boolean),
  }));
}

export async function fetchAssignments(): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from('assignments')
    .select('id, title, due_date, status, subjects(name)')
    .order('due_date', { ascending: true });
  if (error) throw error;
  return (data as RawAssignmentRow[] ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    subject: one(r.subjects)?.name ?? 'Umum',
    dueDate: r.due_date,
    status: r.status,
  }));
}

export async function fetchPlaylist(): Promise<Playlist | null> {
  const { data, error } = await supabase
    .from('playlists')
    .select(
      'id, title, description, cover_url, embed_url, open_url, total_songs, last_updated, playlist_tracks(id, title, artist, duration, sort_order)'
    )
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as RawPlaylistRow;

  const tracks: PlaylistTrack[] = (row.playlist_tracks ?? [])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      duration: t.duration,
    }));

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    cover: row.cover_url ?? '',
    embedUrl: row.embed_url ?? '',
    openUrl: row.open_url ?? '',
    totalSongs: row.total_songs ?? tracks.length,
    lastUpdated: row.last_updated ?? '',
    tracks,
  };
}

export async function fetchCreativeMood(): Promise<CreativeMood | null> {
  const { data, error } = await supabase
    .from('creative_mood')
    .select('*')
    .order('week_start', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as RawMoodRow;

  return {
    id: row.id,
    quote: row.quote,
    quoteAuthor: row.quote_author,
    colorOfTheWeek: {
      name: row.color_name ?? '',
      hex: row.color_hex ?? '#000000',
    },
    fontOfTheWeek: {
      name: row.font_name ?? '',
      specimen: row.font_specimen ?? '',
    },
    artwork: {
      title: row.artwork_title ?? '',
      src: row.artwork_url ?? '',
    },
  };
}
