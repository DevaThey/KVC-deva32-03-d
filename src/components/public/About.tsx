import { MapPin, Palette, Layers, Sparkles } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { useQuery } from '../../hooks/useQuery';
import { fetchClassInformation } from '../../lib/queries';

const pillars = [
  {
    icon: Palette,
    title: 'Visual yang bicara',
    body: 'Tipografi, warna, dan komposisi — kami percaya desain yang baik tidak perlu berteriak.',
  },
  {
    icon: Layers,
    title: 'Proses, bukan hasil saja',
    body: 'Setiap karya melewati kritik, revisi, dan review. Kami bangga pada prosesnya.',
  },
  {
    icon: Sparkles,
    title: 'Kelas yang merawat',
    body: 'Ruang ini dirancang dan dirawat oleh siswa — sebagai cara kami belajar bertanggung jawab.',
  },
];

export default function About() {
  useReveal();
  const { data: info } = useQuery(fetchClassInformation);

  const className = info?.className ?? 'Kavitwo';
  const school = info?.school ?? 'SMK TI Bali Global Denpasar';
  const major = info?.major ?? 'Desain Komunikasi Visual';
  const academicYear = info?.academicYear ?? '2026/2027';
  const location = info?.location ?? 'Denpasar, Bali';
  const studentCount = info?.studentCount ?? 30;
  const establishedYear = info?.establishedYear ?? 2024;
  const aboutText = info?.aboutText ?? 'Kami adalah kelas vokasi Design Communication Visual yang percaya pada kerja tangan, kritik yang jujur, dan karya yang sederhana namun dipikirkan dengan matang.';

  return (
    <section id="about" className="relative py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left: copy + pillars */}
          <div className="reveal flex flex-col justify-between">
            <div>
              <div className="flex flex-col items-start gap-3">
                <span className="section-eyebrow">
                  <span className="h-px w-6 bg-brand-400/60" />
                  Tentang
                </span>
                <h2 className="section-title">Bukan kelas biasa.</h2>
                <p className="section-sub">
                  {aboutText}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="chip border-brand-400/30 bg-brand-500/10 text-brand-200">
                  <MapPin className="h-3.5 w-3.5" />
                  {location}
                </span>
                <span className="chip">Sejak {establishedYear}</span>
                <span className="chip">{studentCount} siswa</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pillars.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="card-surface p-4 transition-all duration-500 ease-smooth hover:-translate-y-1 hover:border-brand-400/30"
                  >
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-inset ring-brand-400/30">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-ink-50">{f.title}</h3>
                    <p className="mt-1 text-xs text-ink-300 leading-relaxed">{f.body}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: info card — matches left column height via items-stretch */}
          <div className="reveal flex" style={{ transitionDelay: '120ms' }}>
            <div className="card-surface relative w-full overflow-hidden p-6 sm:p-8 flex flex-col">
              <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-brand-500/15 blur-3xl" />
              <div className="relative flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                    <span className="h-3 w-3 rounded-full bg-cream-300/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-ink-400">kavitwo.id</span>
                </div>

                <div className="mt-6">
                  <div className="font-display text-3xl font-bold text-ink-50">Kavitwo</div>
                  <div className="text-sm text-ink-300">{className} · DKV</div>
                </div>

                <div className="mt-6 space-y-2 flex-1">
                  {[
                    { k: 'Sekolah', v: school },
                    { k: 'Jurusan', v: major },
                    { k: 'Kelas', v: 'XI (Sebelas)' },
                    { k: 'Tahun Ajaran', v: academicYear },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
                    >
                      <span className="text-xs uppercase tracking-wider text-ink-400">{row.k}</span>
                      <span className="text-sm font-medium text-ink-50 text-right">{row.v}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-br from-brand-500/15 to-brand-700/10 border border-brand-400/20 px-4 py-3">
                  <span className="text-xs text-brand-200">Dirancang &amp; dibuat oleh {className}</span>
                  <span className="text-[10px] uppercase tracking-wider text-brand-300">v1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
