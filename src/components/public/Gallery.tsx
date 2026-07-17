import { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { gallery, type GalleryItem } from '../../lib/data';
import { useReveal } from '../../hooks/useReveal';

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  useReveal();

  const categories = useMemo(() => {
    const set = new Set<string>();
    gallery.forEach((g) => set.add(g.category));
    return ['Semua', ...Array.from(set)];
  }, []);

  const [filter, setFilter] = useState<string>('Semua');

  const list = useMemo(() => {
    if (filter === 'Semua') return gallery;
    return gallery.filter((g) => g.category === filter);
  }, [filter]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') setActive((i) => (i === null ? i : (i + 1) % list.length));
      if (e.key === 'ArrowLeft') setActive((i) => (i === null ? i : (i - 1 + list.length) % list.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, list.length]);

  const spanClass = (s: GalleryItem['span']) =>
    s === 'tall' ? 'row-span-2' : s === 'wide' ? 'sm:col-span-2' : '';

  return (
    <section id="gallery" className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal flex flex-col items-start gap-3 mb-10">
          <span className="section-eyebrow">
            <span className="h-px w-6 bg-brand-400/60" />
            Galeri
          </span>
          <h2 className="section-title">Momen, dibingkai dengan niat.</h2>
          <p className="section-sub">
            Koleksi dokumentasi dan kenangan kelas. Ketuk gambar apa pun untuk
            membuka lightbox.
          </p>
        </div>

        {/* Filters */}
        <div className="reveal flex flex-wrap gap-2 mb-8">
          {categories.map((c) => {
            const isActive = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ease-smooth ${
                  isActive
                    ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-cream-50 shadow-glow'
                    : 'bg-white/5 border border-white/10 text-ink-200 hover:bg-white/10'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px] gap-3">
          {list.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActive(i)}
              data-reveal-delay={(i % 4) * 60}
              className={`reveal group relative overflow-hidden rounded-3xl border border-white/5 bg-ink-800/60 ${spanClass(item.span)}`}
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="absolute inset-0 flex flex-col justify-end p-4 text-left">
                <span className="text-[10px] uppercase tracking-wider text-brand-200">{item.category}</span>
                <h3 className="mt-1 text-sm font-semibold text-ink-50 line-clamp-2">{item.title}</h3>
              </div>

              <span className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-ink-50 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-90">
                <ZoomIn className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>

        {list.length === 0 && (
          <div className="reveal card-surface p-10 text-center text-ink-300">
            Tidak ada foto dalam kategori ini.
          </div>
        )}
      </div>

      {/* Lightbox */}
      {active !== null && list[active] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="Tutup"
            className="absolute inset-0 bg-ink-950/85 backdrop-blur-xl"
            onClick={() => setActive(null)}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActive((i) => (i === null ? i : (i - 1 + list.length) % list.length));
            }}
            className="absolute left-3 sm:left-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-ink-50 hover:bg-white/20 transition"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActive((i) => (i === null ? i : (i + 1) % list.length));
            }}
            className="absolute right-3 sm:right-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-ink-50 hover:bg-white/20 transition"
            aria-label="Berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <figure className="relative max-w-4xl w-full animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <img
              src={list[active].src}
              alt={list[active].title}
              className="w-full max-h-[78vh] object-contain rounded-3xl shadow-card"
            />
            <figcaption className="mt-4 flex items-center justify-between text-sm text-ink-200">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-brand-300">{list[active].category}</div>
                <div className="font-medium text-ink-50">{list[active].title}</div>
              </div>
              <span className="text-xs text-ink-400 tabular-nums">
                {active + 1} / {list.length}
              </span>
            </figcaption>
          </figure>

          <button
            onClick={() => setActive(null)}
            className="absolute top-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-ink-50 hover:bg-white/20 transition"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
