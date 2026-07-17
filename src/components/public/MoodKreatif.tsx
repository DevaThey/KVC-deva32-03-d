import { Quote, Palette, Type, Image as ImageIcon } from 'lucide-react';
import { creativeMood } from '../../lib/data';
import { useReveal } from '../../hooks/useReveal';

export default function MoodKreatif() {
  useReveal();

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Quote — signature feature */}
          <div className="reveal lg:col-span-5">
            <div className="card-surface relative h-full overflow-hidden p-6 sm:p-8 flex flex-col justify-between">
              <div className="pointer-events-none absolute -top-12 -right-8 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl" />
              <Quote className="relative h-7 w-7 text-brand-300/70" />
              <p className="relative mt-4 font-display text-2xl sm:text-3xl font-bold leading-snug text-ink-50 text-balance">
                {creativeMood.quote}
              </p>
              <p className="relative mt-4 text-sm text-ink-400">— {creativeMood.quoteAuthor}</p>
            </div>
          </div>

          {/* Color + Font */}
          <div className="reveal lg:col-span-4 grid grid-cols-1 gap-4" style={{ transitionDelay: '80ms' }}>
            <div className="card-surface p-5 flex items-center gap-4">
              <span
                className="h-14 w-14 shrink-0 rounded-2xl ring-1 ring-inset ring-white/15 shadow-card"
                style={{ backgroundColor: creativeMood.colorOfTheWeek.hex }}
                aria-hidden
              />
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-brand-300">
                  <Palette className="h-3.5 w-3.5" />
                  Warna Minggu Ini
                </div>
                <div className="mt-1 font-display text-lg font-semibold text-ink-50">
                  {creativeMood.colorOfTheWeek.name}
                </div>
                <div className="text-xs tabular-nums text-ink-400">{creativeMood.colorOfTheWeek.hex}</div>
              </div>
            </div>

            <div className="card-surface p-5 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-inset ring-white/10 font-display text-2xl font-bold text-ink-100">
                {creativeMood.fontOfTheWeek.specimen.slice(0, 2)}
              </span>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-brand-300">
                  <Type className="h-3.5 w-3.5" />
                  Font Minggu Ini
                </div>
                <div className="mt-1 font-display text-lg font-semibold text-ink-50">
                  {creativeMood.fontOfTheWeek.name}
                </div>
                <div className="text-xs text-ink-400">{creativeMood.fontOfTheWeek.specimen}</div>
              </div>
            </div>
          </div>

          {/* Artwork */}
          <div className="reveal lg:col-span-3" style={{ transitionDelay: '160ms' }}>
            <div className="card-surface relative h-full overflow-hidden">
              <div className="relative h-full min-h-[15rem] overflow-hidden">
                <img
                  src={creativeMood.artwork.src}
                  alt={creativeMood.artwork.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-smooth hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-brand-200">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Artwork Minggu Ini
                  </div>
                  <div className="mt-1 text-sm font-semibold text-ink-50">{creativeMood.artwork.title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
