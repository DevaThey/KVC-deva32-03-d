import { useMemo } from 'react';
import { BookOpen, Clock, CalendarDays } from 'lucide-react';
import { assignments, assignmentStatusMap } from '../../lib/data';
import { useReveal } from '../../hooks/useReveal';

export default function TugasMingguIni() {
  useReveal();

  const sorted = useMemo(
    () => [...assignments].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    []
  );

  const fmt = (iso: string) =>
    new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

  const daysLeft = (iso: string) => {
    const diff = new Date(iso + 'T00:00:00').getTime() - Date.now();
    return Math.ceil(diff / 86400000);
  };

  return (
    <section id="tugas" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/3 top-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="reveal flex flex-col items-start gap-3 mb-8">
          <span className="section-eyebrow">
            <BookOpen className="h-3.5 w-3.5" />
            Tugas Minggu Ini
          </span>
          <h2 className="section-title">Tugas yang sedang berjalan.</h2>
          <p className="section-sub">
            Semua tugas aktif untuk minggu ini, diurutkan berdasarkan tanggal
            pengumpulan terdekat.
          </p>
        </div>

        {sorted.length === 0 ? (
          <div className="reveal card-surface p-10 text-center text-ink-300">
            Tidak ada tugas aktif minggu ini. Waktu yang baik untuk menggambar.
          </div>
        ) : (
          <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((a, i) => {
              const s = assignmentStatusMap[a.status];
              const left = daysLeft(a.dueDate);
              return (
                <article
                  key={a.id}
                  data-reveal-delay={i * 60}
                  className="reveal group card-surface relative overflow-hidden p-5 transition-all duration-500 ease-smooth hover:-translate-y-1 hover:border-brand-400/30 hover:shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${s.chip}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {a.status}
                    </span>
                    <span className={`text-[11px] tabular-nums ${left < 2 ? 'text-rose-300' : 'text-ink-400'}`}>
                      {left > 0 ? `${left} hari lagi` : left === 0 ? 'Hari ini' : 'Terlewat'}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-semibold text-ink-50 leading-snug">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-sm text-brand-300">{a.subject}</p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-ink-300">
                    <CalendarDays className="h-3.5 w-3.5 text-ink-400" />
                    {fmt(a.dueDate)}
                    <span className="text-ink-500">·</span>
                    <Clock className="h-3.5 w-3.5 text-ink-400" />
                    Deadline
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
