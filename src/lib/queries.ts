import { supabase } from './supabase';
import type {
  Highlight,
  GalleryItem,
  Teacher,
  PlaylistTrack,
  ScheduleSlot,
  PiketSlot,
  Assignment,
  ClassInformation,
  WebsiteSettings,
  DayKey,
  SubjectColor,
} from './data';

const fmtTime = (t: string) => t.slice(0, 5);

export async function fetchHighlights(): Promise<Highlight[]> {
  const { data, error } = await supabase
    .from('highlights')
    .select('id, title, subtitle, image, description, display_order')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle ?? '',
    image: r.image,
    description: r.description,
    displayOrder: r.display_order,
  }));
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('id, category, title, image, description, featured, display_order')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    category: r.category,
    title: r.title,
    image: r.image,
    description: r.description ?? '',
    featured: r.featured,
    displayOrder: r.display_order,
  }));
}

export async function fetchTeachers(): Promise<Teacher[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select('id, name, subject, position, phone, whatsapp_url, photo, display_order')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    subject: r.subject,
    position: r.position ?? '',
    phone: r.phone ?? '',
    whatsappUrl: r.whatsapp_url ?? '',
    photo: r.photo,
    displayOrder: r.display_order,
  }));
}

export async function fetchPlaylist(): Promise<PlaylistTrack[]> {
  const { data, error } = await supabase
    .from('playlist')
    .select('id, title, artist, duration, spotify_url, cover_image, display_order')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    artist: r.artist,
    duration: r.duration,
    spotifyUrl: r.spotify_url ?? '',
    coverImage: r.cover_image ?? '',
    displayOrder: r.display_order,
  }));
}

export async function fetchSchedule(): Promise<ScheduleSlot[]> {
  const { data, error } = await supabase
    .from('schedule')
    .select('id, day, lesson_order, subject, teacher, room, start_time, end_time, accent_color, active')
    .order('lesson_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    day: r.day as DayKey,
    lessonOrder: r.lesson_order,
    subject: r.subject,
    teacher: r.teacher,
    room: r.room,
    start: fmtTime(r.start_time),
    end: fmtTime(r.end_time),
    accentColor: r.accent_color as SubjectColor,
    active: r.active,
  }));
}

export async function fetchPiket(): Promise<PiketSlot[]> {
  const { data, error } = await supabase
    .from('piket_schedule')
    .select('id, day, member_1, member_2, member_3, member_4, notes')
    .order('day', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    day: r.day as DayKey,
    members: [r.member_1, r.member_2, r.member_3, r.member_4].filter((m): m is string => Boolean(m?.trim())),
    notes: r.notes ?? '',
  }));
}

export async function fetchAssignments(): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from('assignments')
    .select('id, title, subject, teacher, description, due_date, status, attachment_url, sort_order')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    subject: r.subject,
    teacher: r.teacher ?? '',
    description: r.description ?? '',
    dueDate: r.due_date,
    status: r.status,
    attachmentUrl: r.attachment_url ?? '',
    sortOrder: r.sort_order,
  }));
}

export async function fetchClassInformation(): Promise<ClassInformation | null> {
  const { data, error } = await supabase
    .from('class_information')
    .select('id, class_name, school, major, academic_year, location, student_count, established_year, about_text')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    className: data.class_name,
    school: data.school,
    major: data.major,
    academicYear: data.academic_year,
    location: data.location,
    studentCount: data.student_count,
    establishedYear: data.established_year,
    aboutText: data.about_text,
  };
}

export async function fetchWebsiteSettings(): Promise<WebsiteSettings | null> {
  const { data, error } = await supabase
    .from('website_settings')
    .select('id, loading_logo, welcome_title, welcome_subtitle, spotify_playlist, hero_image, hero_text, footer_text')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    loadingLogo: data.loading_logo ?? '',
    welcomeTitle: data.welcome_title,
    welcomeSubtitle: data.welcome_subtitle,
    spotifyPlaylist: data.spotify_playlist ?? '',
    heroImage: data.hero_image ?? '',
    heroText: data.hero_text ?? '',
    footerText: data.footer_text ?? '',
  };
}
