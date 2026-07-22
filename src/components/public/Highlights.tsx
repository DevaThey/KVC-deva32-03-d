import { memo, useState, useEffect } from 'react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { fetchHighlights } from '../../lib/queries';
import { useReveal } from '../../hooks/useReveal';
import { LoadingState, ErrorState } from '../QueryState';

function Highlights() {
  useReveal();
  const { data, loading, error, refetch } = useQuery(fetchHighlights);
  const [active, setActive] = useState<number | null>(null);

  const items = data ?? [];

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') setActive((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === 'ArrowLeft') setActive((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, items.length]);

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
                onClick={() => setActive(i)}
                className="reveal group card-surface relative overflow-hidden flex flex-col cursor-pointer transition-transform duration-500 ease-smooth hover:-translate-y-1 hover:border-brand-400/30 hover:shadow-card"
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

      {/* Image preview modal */}
      {active !== null && items[active] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-xl" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActive((i) => (i === null ? i : (i - 1 + items.length) % items.length));
            }}
            className="absolute left-3 sm:left-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-ink-50 hover:bg-white/20 transition"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActive((i) => (i === null ? i : (i + 1) % items.length));
            }}
            className="absolute right-3 sm:right-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-ink-50 hover:bg-white/20 transition"
            aria-label="Berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <figure
            className="relative max-w-3xl w-full animate-fade-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[active].image}
              alt={items[active].title}
              loading="eager"
              decoding="async"
              className="w-full max-h-[72vh] object-contain rounded-3xl shadow-card"
            />
            <figcaption className="mt-4 text-center">
              {items[active].subtitle && (
                <div className="text-[10px] uppercase tracking-wider text-brand-300">{items[active].subtitle}</div>
              )}
              <div className="font-display text-lg font-semibold text-ink-50">{items[active].title}</div>
              <p className="mt-1 text-sm text-ink-300 max-w-lg mx-auto">{items[active].description}</p>
            </figcaption>
          </figure>

          <button
            onClick={() => setActive(null)}
            className="absolute top-5 right-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-ink-50 hover:bg-white/20 transition"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
export default memo(Highlights);
