import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { scrollTo } from '../hooks/useReveal';

type Experience = 'public' | 'portal';

export default function Welcome({ onEnter }: { onEnter: (e: Experience) => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 fade-in-soft">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-soft [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -top-24 -right-24 h-[34rem] w-[34rem] rounded-full bg-brand-600/25 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -left-32 h-[28rem] w-[28rem] rounded-full bg-cream-500/15 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 h-[22rem] w-[22rem] rounded-full bg-brand-400/15 blur-3xl animate-float-slow" />
        <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-soft-light" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Eyebrow */}
        <div className="flex justify-center mb-8">
          <span className="chip border-brand-400/30 bg-brand-500/10 text-brand-200">
            Kelas XI DKV 2 · SMK TI Bali Global Denpasar
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[0.92] tracking-tight">
          <span className="bg-gradient-to-br from-cream-50 via-cream-200 to-brand-300 bg-clip-text text-transparent">
            Kavitwo Connect
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-md text-lg sm:text-xl text-ink-200 leading-relaxed">
          Rumah digital Kelas XI DKV 2.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              onEnter('public');
              setTimeout(() => scrollTo('#home'), 80);
            }}
            className="btn-primary w-full sm:w-auto"
          >
            Jelajahi Kavitwo
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEnter('portal')}
            className="btn-ghost w-full sm:w-auto"
          >
            <LayoutDashboard className="h-4 w-4" />
            Portal Siswa
          </button>
        </div>

        {/* Footer hint */}
        <div className="mt-16 flex items-center justify-center gap-3 text-ink-400">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-400/60" />
          <span className="text-xs uppercase tracking-[0.2em]">Pilih pengalamanmu</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand-400/60" />
        </div>
      </div>
    </div>
  );
}
