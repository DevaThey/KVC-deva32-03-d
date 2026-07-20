// Centralized data layer for Kavitwo Connect.
// Types, UI config, and helpers only — all content lives in Supabase.
// Queries are in queries.ts; components fetch live data via useQuery.

// ---------- Public Experience ----------

export interface Highlight {
  id: string;
  image: string;
  title: string;
  description: string;
  tag: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: string;
  span?: 'tall' | 'wide' | 'normal';
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  photo: string;
  email: string;
  whatsapp?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

// ---------- Student Portal ----------

export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface ScheduleSlot {
  id: string;
  day: DayKey;
  start: string;
  end: string;
  subject: string;
  teacher: string;
  room: string;
  color: SubjectColor;
}

export type SubjectColor = 'brand' | 'cream' | 'emerald' | 'sky' | 'rose' | 'violet';

export interface PiketSlot {
  id: string;
  day: DayKey;
  coordinator: string;
  members: string[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO date
  status: AssignmentStatus;
}

export type AssignmentStatus = 'Belum Mulai' | 'Berjalan' | 'Selesai' | 'Terlambat';

// ---------- Collections ----------

export const publicNav: NavItem[] = [
  { label: 'Beranda', href: '#home' },
  { label: 'Tentang', href: '#about' },
  { label: 'Sorotan', href: '#highlights' },
  { label: 'Playlist', href: '#playlist' },
  { label: 'Galeri', href: '#gallery' },
  { label: 'Guru', href: '#teachers' },
];

// ---------- Portal Data ----------

export const dayFull: Record<DayKey, string> = {
  Mon: 'Senin',
  Tue: 'Selasa',
  Wed: 'Rabu',
  Thu: 'Kamis',
  Fri: 'Jumat',
};

export const dayShort: Record<DayKey, string> = {
  Mon: 'Sen',
  Tue: 'Sel',
  Wed: 'Rab',
  Thu: 'Kam',
  Fri: 'Jum',
};

export const days: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// ---------- Playlist Kelas ----------

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  duration: string; // mm:ss
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  embedUrl: string; // Spotify embed URL
  openUrl: string; // Spotify open URL
  totalSongs: number;
  lastUpdated: string; // ISO date
  tracks: PlaylistTrack[];
}

// ---------- Mood Kreatif Hari Ini ----------

export interface CreativeMood {
  id: string;
  quote: string;
  quoteAuthor: string;
  colorOfTheWeek: { name: string; hex: string };
  fontOfTheWeek: { name: string; specimen: string };
  artwork: { title: string; src: string };
}

// ---------- Maps ----------

export const subjectColorMap: Record<SubjectColor, { bg: string; dot: string; text: string; ring: string }> = {
  brand: { bg: 'bg-brand-500/15', dot: 'bg-brand-400', text: 'text-brand-200', ring: 'ring-brand-400/40' },
  cream: { bg: 'bg-cream-400/15', dot: 'bg-cream-400', text: 'text-cream-200', ring: 'ring-cream-400/40' },
  emerald: { bg: 'bg-emerald-500/15', dot: 'bg-emerald-400', text: 'text-emerald-200', ring: 'ring-emerald-400/40' },
  sky: { bg: 'bg-sky-500/15', dot: 'bg-sky-400', text: 'text-sky-200', ring: 'ring-sky-400/40' },
  rose: { bg: 'bg-rose-500/15', dot: 'bg-rose-400', text: 'text-rose-200', ring: 'ring-rose-400/40' },
  violet: { bg: 'bg-violet-500/15', dot: 'bg-violet-400', text: 'text-violet-200', ring: 'ring-violet-400/40' },
};

export const assignmentStatusMap: Record<AssignmentStatus, { chip: string; dot: string }> = {
  'Belum Mulai': { chip: 'bg-ink-500/20 text-ink-200 border-ink-400/30', dot: 'bg-ink-400' },
  Berjalan: { chip: 'bg-sky-500/15 text-sky-200 border-sky-400/30', dot: 'bg-sky-400' },
  Selesai: { chip: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30', dot: 'bg-emerald-400' },
  Terlambat: { chip: 'bg-rose-500/15 text-rose-200 border-rose-400/30', dot: 'bg-rose-400' },
};

// ---------- Helpers ----------

export function currentDayKey(): DayKey | null {
  const d = new Date().getDay();
  const map: Record<number, DayKey | null> = {
    0: null, 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: null,
  };
  return map[d] ?? null;
}

export function nextDayKey(day: DayKey): DayKey {
  const idx = days.indexOf(day);
  return days[(idx + 1) % days.length] as DayKey;
}

export function whatsappLink(number: string): string {
  const clean = number.replace(/\D/g, '');
  return `https://wa.me/${clean}`;
}

export function isNow(slot: ScheduleSlot): boolean {
  const now = new Date();
  const day = currentDayKey();
  if (day !== slot.day) return false;
  const [sh, sm] = slot.start.split(':').map(Number);
  const [eh, em] = slot.end.split(':').map(Number);
  const s = sh * 60 + sm;
  const e = eh * 60 + em;
  const n = now.getHours() * 60 + now.getMinutes();
  return n >= s && n <= e;
}
