import { memo, useEffect, useRef } from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { fetchTeachers } from '../../lib/queries';
import { useReveal } from '../../hooks/useReveal';
import { LoadingState, ErrorState } from '../QueryState';

function Teachers() {
  useReveal();
  const { data, loading, error, refetch } = useQuery(fetchTeachers);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ active: boolean; startX: number; startScroll: number; moved: boolean }>({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [data]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const el = trackRef.current;
    drag.current.active = false;
    el?.releasePointerCapture?.(e.pointerId);
  };

  const teachers = data ?? [];

  return (
    <section id="teachers" className="reveal cv-auto relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal flex flex-col items-start gap-3 mb-10">
          <span className="section-eyebrow">
            <span className="h-px w-6 bg-brand-400/60" />
            Guru
          </span>
          <h2 className="section-title">Mentor yang mendorong karya.</h2>
          <p className="section-sub">
            Pengajar yang membimbing Kelas XI DKV 2 — geser untuk melihat semua,
            hubungi melalui WhatsApp.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <LoadingState label="Memuat daftar guru" />
        </div>
      ) : error ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : teachers.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal card-surface p-10 text-center text-ink-300">
            Belum ada data guru yang tersedia.
          </div>
        </div>
      ) : (
        <div className="group/carousel relative">
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className="grab no-scrollbar snap-x-mandatory flex gap-4 overflow-x-auto px-4 sm:px-6 pb-4 pt-1 scroll-smooth"
          >
            <div className="hidden lg:block shrink-0" style={{ width: 'max(0px, calc((100vw - 80rem) / 2))' }} aria-hidden />
            {teachers.map((t, i) => (
              <article
                key={t.id}
                data-reveal-delay={i * 70}
                className="reveal snap-start group shrink-0 w-[78%] sm:w-[42%] lg:w-[15.5rem] xl:w-[16rem] card-surface relative overflow-hidden p-5 transition-all duration-500 ease-smooth hover:-translate-y-1 hover:border-brand-400/30 hover:shadow-card"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10">
                  <img
                    src={t.photo}
                    alt={t.name}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    sizes="256px"
                    className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105 will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
                </div>

                <h3 className="mt-4 font-display text-lg font-semibold text-ink-50">{t.name}</h3>
                <p className="text-sm text-brand-300">{t.subject}</p>
                {t.position && (
                  <p className="text-xs text-ink-400">{t.position}</p>
                )}

                {t.whatsappUrl && (
                  <a
                    href={t.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => drag.current.moved && e.preventDefault()}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-medium text-ink-100 hover:bg-white/10 hover:border-brand-400/30 transition-all duration-300 ease-smooth"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                    <ArrowUpRight className="h-3.5 w-3.5 ml-auto text-ink-400 group-hover:text-brand-300 transition" />
                  </a>
                )}
              </article>
            ))}
            <div className="shrink-0 w-1" aria-hidden />
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10 bg-gradient-to-r from-[#0c0a09] to-transparent opacity-70" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-10 bg-gradient-to-l from-[#0c0a09] to-transparent opacity-70" />
        </div>
      )}
    </section>
  );
}
export default memo(Teachers);
