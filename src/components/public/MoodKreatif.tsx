import { Quote, Palette, Type, Image as ImageIcon } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { fetchCreativeMood } from '../../lib/queries';
import { useReveal } from '../../hooks/useReveal';
import { LoadingState, ErrorState } from '../QueryState';

export default function MoodKreatif() {
  useReveal();
  const { data, loading, error, refetch } = useQuery(fetchCreativeMood);

  return (
    <section id="mood" className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal flex flex-col items-start gap-3 mb-10">
          <span className="section-eyebrow">
            <Quote className="h-3.5 w-3.5" />
            Mood Kreatif Hari Ini
          </span>
          <h2 className="section-title">Apa yang menginspirasi minggu ini.</h2>
          <p className="section-sub">
            Satu sudut kecil untuk menyalakan ide — kutipan, warna, font, dan
            karya pilihan minggu ini.
          </p>
        </div>

        {loading ? (
          <LoadingState label="Memuat mood kreatif" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !data ? (
          <div className="reveal card-surface p-10 text-center text-ink-300">
            Belum ada mood kreatif untuk minggu ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
            <div className="reveal lg:col-span-5">
              <div className="card-surface relative h-full overflow-hidden p-6 sm:p-8 flex flex-col justify-between">
                <div className="pointer-events-none absolute -top-12 -right-8 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl" />
                <Quote className="relative h-7 w-7 text-brand-300/70" />
                <p className="relative mt-4 font-display text-2xl sm:text-3xl font-bold leading-snug text-ink-50 text-balance">
                  {data.quote}
                </p>
                <p className="relative mt-4 text-sm text-ink-400">— {data.quoteAuthor}</p>
              </div>
            </div>

            <div className="reveal lg:col-span-4 grid grid-cols-1 gap-4" style={{ transitionDelay: '80ms' }}>
              <div className="card-surface p-5 flex items-center gap-4">
                <span
                  className="h-14 w-14 shrink-0 rounded-2xl ring-1 ring-inset ring-white/15 shadow-card"
                  style={{ backgroundColor: data.colorOfTheWeek.hex }}
                  aria-hidden
                />
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-brand-300">
                    <Palette className="h-3.5 w-3.5" />
                    Warna Minggu Ini
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold text-ink-50">
                    {data.colorOfTheWeek.name}
                  </div>
                  <div className="text-xs tabular-nums text-ink-400">{data.colorOfTheWeek.hex}</div>
                </div>
              </div>

              <div className="card-surface p-5 flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-inset ring-white/10 font-display text-2xl font-bold text-ink-100">
                  {data.fontOfTheWeek.specimen.slice(0, 2)}
                </span>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-brand-300">
                    <Type className="h-3.5 w-3.5" />
                    Font Minggu Ini
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold text-ink-50">
                    {data.fontOfTheWeek.name}
                  </div>
                  <div className="text-xs text-ink-400">{data.fontOfTheWeek.specimen}</div>
                </div>
              </div>
            </div>

            <div className="reveal lg:col-span-3" style={{ transitionDelay: '160ms' }}>
              <div className="card-surface relative h-full overflow-hidden">
                <div className="relative h-full min-h-[15rem] overflow-hidden">
                  <img
                    src={data.artwork.src}
                    alt={data.artwork.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-smooth hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-brand-200">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Artwork Minggu Ini
                    </div>
                    <div className="mt-1 text-sm font-semibold text-ink-50">{data.artwork.title}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
