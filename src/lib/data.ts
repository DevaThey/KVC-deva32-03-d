// Centralized data layer for Kavitwo Connect.
// All content is placeholder and structured for future CMS / Supabase swap.

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
  whatsapp?: string; // international format, e.g. "6281234567890"; placeholder for now
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

export const highlights: Highlight[] = [
  {
    id: 'h1',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Pekan Kreatif DKV 2026',
    description:
      'Tiga kategori kompetisi — Visual Identity, Motion Graphics, dan Digital Illustration. Finalis dipamerkan di galeri sekolah dan dinilai alumni yang berkarier di industri.',
    tag: 'Acara Tahunan',
  },
  {
    id: 'h2',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Sesi Review Portfolio',
    description:
      'Setiap siswa mempresentasikan tiga karya terkuat untuk masukan terstruktur dari teman dan mentor. Ruang yang aman untuk tumbuh sebagai desainer.',
    tag: 'Kelas',
  },
  {
    id: 'h3',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Branding "Roots & Wings"',
    description:
      'Proyek branding antar kelas dengan tema koneksi akar dan sayonara. Poster, packaging, dan kampanye media sosial dalam satu sistem yang konsisten.',
    tag: 'Proyek',
  },
];

export const gallery: GalleryItem[] = [
  { id: 'g1', src: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=900', title: 'Sesi kritik di studio', category: 'Aktivitas', span: 'tall' },
  { id: 'g2', src: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900', title: 'Pembukaan Pekan Kreatif', category: 'Acara', span: 'wide' },
  { id: 'g3', src: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=900', title: 'Workshop teori warna', category: 'Kelas' },
  { id: 'g4', src: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=900', title: 'Di balik lensa', category: 'Behind The Scenes' },
  { id: 'g5', src: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=900', title: 'Draf editorial spread', category: 'Proyek', span: 'tall' },
  { id: 'g6', src: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900', title: 'Kompetisi antar kelas', category: 'Kompetisi' },
  { id: 'g7', src: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=900', title: 'Motion lab', category: 'Behind The Scenes' },
  { id: 'g8', src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900', title: 'Final branding', category: 'Proyek', span: 'wide' },
  { id: 'g9', src: 'https://images.pexels.com/photos/3184427/pexels-photo-3184427.jpeg?auto=compress&cs=tinysrgb&w=900', title: 'Galeri malam', category: 'Acara' },
  { id: 'g10', src: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=900', title: 'Spesimen type', category: 'Proyek' },
];

export const teachers: Teacher[] = [
  { id: 't1', name: 'Ibu Ayu Pratiwi', subject: 'Fotografi & Wali Kelas', photo: 'https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg?auto=compress&cs=tinysrgb&w=600', email: 'ayu.pratiwi@baliglobal.sch.id', whatsapp: '6281234567890' },
  { id: 't2', name: 'Bapak Made Wirawan', subject: 'Tipografi & Motion', photo: 'https://images.pexels.com/photos/8617715/pexels-photo-8617715.jpeg?auto=compress&cs=tinysrgb&w=600', email: 'made.wirawan@baliglobal.sch.id', whatsapp: '6281234567890' },
  { id: 't3', name: 'Bapak Putu Danu', subject: 'Ilustrasi & Branding', photo: 'https://images.pexels.com/photos/8550865/pexels-photo-8550865.jpeg?auto=compress&cs=tinysrgb&w=600', email: 'putu.danu@baliglobal.sch.id', whatsapp: '6281234567890' },
  { id: 't4', name: 'Bapak Ketut Adi', subject: 'Teori Warna', photo: 'https://images.pexels.com/photos/8550863/pexels-photo-8550863.jpeg?auto=compress&cs=tinysrgb&w=600', email: 'ketut.adi@baliglobal.sch.id', whatsapp: '6281234567890' },
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

export const schedule: ScheduleSlot[] = [
  { id: 's1', day: 'Mon', start: '07:30', end: '09:00', subject: 'Tipografi II', teacher: 'Bapak Made Wirawan', room: 'C-2', color: 'brand' },
  { id: 's2', day: 'Mon', start: '09:15', end: '10:45', subject: 'Teori Warna', teacher: 'Bapak Ketut Adi', room: 'C-2', color: 'sky' },
  { id: 's3', day: 'Mon', start: '11:00', end: '12:30', subject: 'Fotografi', teacher: 'Ibu Ayu Pratiwi', room: 'Studio A', color: 'cream' },
  { id: 's4', day: 'Mon', start: '13:30', end: '15:00', subject: 'Bahasa Inggris', teacher: 'Ibu Ni Luh Sari', room: 'B-5', color: 'emerald' },

  { id: 's5', day: 'Tue', start: '07:30', end: '09:00', subject: 'Ilustrasi', teacher: 'Bapak Putu Danu', room: 'C-3', color: 'rose' },
  { id: 's6', day: 'Tue', start: '09:15', end: '10:45', subject: 'Motion Graphics', teacher: 'Bapak Made Wirawan', room: 'Lab 1', color: 'violet' },
  { id: 's7', day: 'Tue', start: '11:00', end: '12:30', subject: 'PPKn', teacher: 'Bapak Wayan Jaya', room: 'B-3', color: 'emerald' },
  { id: 's8', day: 'Tue', start: '13:30', end: '15:00', subject: 'Fotografi', teacher: 'Ibu Ayu Pratiwi', room: 'Studio A', color: 'cream' },

  { id: 's9', day: 'Wed', start: '07:30', end: '09:00', subject: 'Branding', teacher: 'Bapak Putu Danu', room: 'C-3', color: 'brand' },
  { id: 's10', day: 'Wed', start: '09:15', end: '10:45', subject: 'Tipografi II', teacher: 'Bapak Made Wirawan', room: 'C-2', color: 'sky' },
  { id: 's11', day: 'Wed', start: '11:00', end: '12:30', subject: 'Matematika', teacher: 'Bapak Gede Harta', room: 'B-1', color: 'emerald' },
  { id: 's12', day: 'Wed', start: '13:30', end: '15:00', subject: 'Ilustrasi', teacher: 'Bapak Putu Danu', room: 'C-3', color: 'rose' },

  { id: 's13', day: 'Thu', start: '07:30', end: '09:00', subject: 'Motion Graphics', teacher: 'Bapak Made Wirawan', room: 'Lab 1', color: 'violet' },
  { id: 's14', day: 'Thu', start: '09:15', end: '10:45', subject: 'Teori Warna', teacher: 'Bapak Ketut Adi', room: 'C-2', color: 'sky' },
  { id: 's15', day: 'Thu', start: '11:00', end: '12:30', subject: 'Bahasa Inggris', teacher: 'Ibu Ni Luh Sari', room: 'B-5', color: 'emerald' },
  { id: 's16', day: 'Thu', start: '13:30', end: '15:00', subject: 'Branding', teacher: 'Bapak Putu Danu', room: 'C-3', color: 'brand' },

  { id: 's17', day: 'Fri', start: '07:30', end: '09:00', subject: 'Fotografi', teacher: 'Ibu Ayu Pratiwi', room: 'Studio A', color: 'cream' },
  { id: 's18', day: 'Fri', start: '09:15', end: '10:45', subject: 'Ilustrasi', teacher: 'Bapak Putu Danu', room: 'C-3', color: 'rose' },
  { id: 's19', day: 'Fri', start: '11:00', end: '12:30', subject: 'Agama', teacher: 'Bapak Wayan Jaya', room: 'B-3', color: 'emerald' },
  { id: 's20', day: 'Fri', start: '13:30', end: '15:00', subject: 'Project Lab', teacher: 'Bapak Made Wirawan', room: 'Lab 1', color: 'violet' },
];

export const piket: PiketSlot[] = [
  { id: 'p1', day: 'Mon', coordinator: 'Arya Pratama', members: ['Kadek Sari Dewi', 'Putra Mahendra'] },
  { id: 'p2', day: 'Tue', coordinator: 'Luh Ayu Saraswati', members: ['Bima Saputra', 'Citra Lestari'] },
  { id: 'p3', day: 'Wed', coordinator: 'Dewa Anjasmara', members: ['Eka Wulandari', 'Fajar Nugroho'] },
  { id: 'p4', day: 'Thu', coordinator: 'Gita Maheswari', members: ['Hendra Wijaya', 'Intan Permata'] },
  { id: 'p5', day: 'Fri', coordinator: 'Arya Pratama', members: ['Kadek Sari Dewi', 'Putra Mahendra'] },
];

export const assignments: Assignment[] = [
  { id: 'a1', title: 'Editorial Spread 12 Halaman', subject: 'Tipografi II', dueDate: '2026-07-23', status: 'Berjalan' },
  { id: 'a2', title: 'Worksheet 04 — Color Harmony', subject: 'Teori Warna', dueDate: '2026-07-19', status: 'Berjalan' },
  { id: 'a3', title: 'Pengumpulan Karya Pekan Kreatif', subject: 'Pekan Kreatif', dueDate: '2026-07-25', status: 'Belum Mulai' },
  { id: 'a4', title: 'Storyboard Motion 30 Detik', subject: 'Motion Graphics', dueDate: '2026-07-28', status: 'Belum Mulai' },
  { id: 'a5', title: 'Review Portfolio — 3 Karya', subject: 'Kelas', dueDate: '2026-07-24', status: 'Berjalan' },
  { id: 'a6', title: 'Logo "Roots & Wings"', subject: 'Branding', dueDate: '2026-07-30', status: 'Belum Mulai' },
];

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

export const playlist: Playlist = {
  id: 'pl1',
  title: 'Studio Focus — Kavitwo',
  description:
    'Playlist untuk menemani sesi desain, brainstorm, dan deadline malam. Diputar beramai-ramai di studio.',
  cover: 'https://images.pexels.com/photos/1370548/pexels-photo-1370548.jpeg?auto=compress&cs=tinysrgb&w=900',
  embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0s5kDXhT11X',
  openUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0s5kDXhT11X',
  totalSongs: 12,
  lastUpdated: '2026-07-14',
  tracks: [
    { id: 't1', title: 'Lofi Study', artist: 'Chillhop Studio', duration: '3:12' },
    { id: 't2', title: 'Morning Coffee', artist: 'Aura Wave', duration: '2:48' },
    { id: 't3', title: 'Paper & Ink', artist: 'Mellow Drafts', duration: '3:34' },
    { id: 't4', title: 'Color Theory', artist: 'Hue Lab', duration: '4:01' },
    { id: 't5', title: 'Late Night Grid', artist: 'Studio 2', duration: '3:22' },
    { id: 't6', title: 'Soft Type', artist: 'Kerning', duration: '2:59' },
  ],
};

// ---------- Mood Kreatif Hari Ini ----------

export interface CreativeMood {
  id: string;
  quote: string;
  quoteAuthor: string;
  colorOfTheWeek: { name: string; hex: string };
  fontOfTheWeek: { name: string; specimen: string };
  artwork: { title: string; src: string };
}

export const creativeMood: CreativeMood = {
  id: 'm1',
  quote: 'Desain yang baik tidak selalu rumit.',
  quoteAuthor: 'Prinsip kelas',
  colorOfTheWeek: { name: 'Terracotta', hex: '#C97B4A' },
  fontOfTheWeek: { name: 'General Sans', specimen: 'Aa Bb Kk' },
  artwork: {
    title: 'Komposisi Hangat',
    src: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
};

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

/** Next school day in the Mon–Fri cycle (wraps Fri -> Mon). */
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
