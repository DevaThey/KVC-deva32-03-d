import { ArrowRight, Sparkles } from 'lucide-react';
import { scrollTo } from '../../hooks/useReveal';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-28 pb-16">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-soft [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -top-24 -right-24 h-[34rem] w-[34rem] rounded-full bg-brand-600/25 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -left-32 h-[28rem] w-[28rem] rounded-full bg-cream-500/15 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 h-[22rem] w-[22rem] rounded-full bg-brand-400/15 blur-3xl animate-float-slow" />
        <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-soft-light" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start gap-8">
          <div className="reveal is-visible flex flex-wrap items-center gap-3">
            <span className="chip border-brand-400/30 bg-brand-500/10 text-brand-200">
              <Sparkles className="h-3.5 w-3.5" />
              Kelas XI DKV 2
            </span>
            <span className="chip">SMK TI Bali Global Denpasar</span>
            <span className="chip">Tahun Ajaran 2026/2027</span>
          </div>

          <div className="reveal is-visible" style={{ transitionDelay: '80ms' }}>
            <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] font-extrabold leading-[0.92] tracking-tight text-balance">
              <span className="bg-gradient-to-br from-cream-50 via-cream-200 to-brand-300 bg-clip-text text-transparent">
                Kavitwo Connect
              </span>
            </h1>
          </div>

          <p
            className="reveal is-visible max-w-md text-lg sm:text-xl text-ink-200 leading-relaxed"
            style={{ transitionDelay: '160ms' }}
          >
            Selamat datang di ruang kreatif kami — tempat karya, cerita, dan
            keseharian Kelas XI DKV 2 berkumpul.
          </p>

          <div
            className="reveal is-visible flex flex-wrap items-center gap-3"
            style={{ transitionDelay: '240ms' }}
          >
            <button onClick={() => scrollTo('#about')} className="btn-primary">
              Tentang Kavitwo
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => scrollTo('#highlights')} className="btn-ghost">
              Lihat Sorotan
            </button>
          </div>

          <div
            className="reveal is-visible mt-6 grid w-full max-w-md grid-cols-3 gap-3"
            style={{ transitionDelay: '320ms' }}
          >
            {[
              { k: '30', v: 'Siswa' },
              { k: '10', v: 'Mapel' },
              { k: '4', v: 'Guru' },
            ].map((s) => (
              <div
                key={s.v}
                className="card-surface px-4 py-4 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-brand-400/30"
              >
                <div className="font-display text-2xl font-bold text-ink-50">{s.k}</div>
                <div className="text-xs uppercase tracking-wider text-ink-400">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex items-center gap-3 text-ink-400">
          <div className="h-px w-12 bg-gradient-to-r from-brand-400/60 to-transparent" />
          <span className="text-xs uppercase tracking-[0.2em]">Scroll untuk menjelajah</span>
        </div>
      </div>
    </section>
  );
}
