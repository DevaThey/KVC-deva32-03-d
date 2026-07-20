// Centralized data layer for Kavitwo Connect.
// Types, UI config, and helpers only — all content lives in Supabase.
// Queries are in queries.ts; components fetch live data via useQuery.

// ---------- Public Experience ----------

export interface Highlight {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  displayOrder: number;
}

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  image: string;
  description: string;
  featured: boolean;
  displayOrder: number;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  position: string;
  phone: string;
  whatsappUrl: string;
  photo: string;
  displayOrder: number;
}

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  spotifyUrl: string;
  coverImage: string;
  displayOrder: number;
}

export interface NavItem {
  label: string;
  href: string;
}

// ---------- Student Portal ----------

export type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type SubjectColor = 'brand' | 'cream' | 'emerald' | 'sky' | 'rose' | 'violet';

export interface ScheduleSlot {
  id: string;
  day: DayKey;
  lessonOrder: number;
  subject: string;
  teacher: string;
  room: string;
  start: string;
  end: string;
  accentColor: SubjectColor;
  active: boolean;
}

export interface PiketSlot {
  id: string;
  day: DayKey;
  members: string[];
  notes: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  dueDate: string;
  status: string;
  attachmentUrl: string;
  sortOrder: number;
}

// ---------- Site-wide settings ----------

export interface ClassInformation {
  id: string;
  className: string;
  school: string;
  major: string;
  academicYear: string;
  location: string;
  studentCount: number;
  establishedYear: number;
  aboutText: string;
}

export interface WebsiteSettings {
  id: string;
  loadingLogo: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  spotifyPlaylist: string;
  heroImage: string;
  heroText: string;
  footerText: string;
}

// ---------- Collections ----------

export const publicNav: NavItem[] = [
  { label: 'Beranda', href: '#home' },
  { label: 'Tentang', href: '#about' },
  { label: 'Sorotan', href: '#highlights' },
  { label: 'Playlist', href: '#playlist' },
  { label: 'Galeri', href: '#gallery' },
  { label: 'Guru', href: '#teachers' },
];

// ---------- Portal day system ----------

export const dayFull: Record<DayKey, string> = {
  Monday: 'Senin',
  Tuesday: 'Selasa',
  Wednesday: 'Rabu',
  Thursday: 'Kamis',
  Friday: 'Jumat',
};

export const dayShort: Record<DayKey, string> = {
  Monday: 'Sen',
  Tuesday: 'Sel',
  Wednesday: 'Rab',
  Thursday: 'Kam',
  Friday: 'Jum',
};

export const days: DayKey[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// ---------- Maps ----------

export const subjectColorMap: Record<SubjectColor, { bg: string; dot: string; text: string; ring: string }> = {
  brand: { bg: 'bg-brand-500/15', dot: 'bg-brand-400', text: 'text-brand-200', ring: 'ring-brand-400/40' },
  cream: { bg: 'bg-cream-400/15', dot: 'bg-cream-400', text: 'text-cream-200', ring: 'ring-cream-400/40' },
  emerald: { bg: 'bg-emerald-500/15', dot: 'bg-emerald-400', text: 'text-emerald-200', ring: 'ring-emerald-400/40' },
  sky: { bg: 'bg-sky-500/15', dot: 'bg-sky-400', text: 'text-sky-200', ring: 'ring-sky-400/40' },
  rose: { bg: 'bg-rose-500/15', dot: 'bg-rose-400', text: 'text-rose-200', ring: 'ring-rose-400/40' },
  violet: { bg: 'bg-violet-500/15', dot: 'bg-violet-400', text: 'text-violet-200', ring: 'ring-violet-400/40' },
};

export const galleryCategories = [
  'Activity',
  'Competition',
  'Workshop',
  'Behind The Scenes',
  'Project',
  'Event',
] as const;

// ---------- Helpers ----------

export function currentDayKey(): DayKey | null {
  const d = new Date().getDay();
  const map: Record<number, DayKey | null> = {
    0: null, 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: null,
  };
  return map[d] ?? null;
}

export function nextDayKey(day: DayKey): DayKey {
  const idx = days.indexOf(day);
  return days[(idx + 1) % days.length] as DayKey;
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
