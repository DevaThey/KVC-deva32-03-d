import { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { fetchHighlights } from '../../lib/queries';
import { useReveal } from '../../hooks/useReveal';
import { LoadingState, ErrorState } from '../QueryState';

function Highlights() {
  useReveal();
  const { data, loading, error, refetch } = useQuery(fetchHighlights);

  const items = data ?? [];

  return (
    <section id="highlights" className="reveal cv-auto relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal flex flex-col items-start gap-3 mb-10">
          <span className="section-eyebrow">
            <span className="h-px w-6 bg-brand-400/60" />
            Sorotan
          </span>
          <h2 className="section-title">Momen yang membentuk kelas.</h2>
          <p className="section-sub">
            Satu hingga tiga cerita unggulan — acara, proyek, dan pencapaian yang
            mendefinisikan tahun ajaran ini.
          </p>
        </div>

        {loading ? (
          <LoadingState label="Memuat sorotan" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : items.length === 0 ? (
          <div className="reveal card-surface p-10 text-center text-ink-300">
            Belum ada sorotan yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((h, i) => (
              <article
                key={h.id}
                data-reveal-delay={i * 80}
                className="reveal group card-surface relative overflow-hidden flex flex-col transition-all duration-500 ease-smooth hover:-translate-y-1 hover:border-brand-400/30 hover:shadow-card"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={h.image}
                    alt={h.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105 will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
                  {h.subtitle && (
                    <span className="absolute top-3 left-3 chip border-brand-400/30 bg-brand-500/15 text-brand-200 backdrop-blur-md">
                      {h.subtitle}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold text-ink-50 leading-snug">
                    {h.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-300 leading-relaxed flex-1">
                    {h.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-300">
                    Baca selengkapnya
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
export default memo(Highlights);
