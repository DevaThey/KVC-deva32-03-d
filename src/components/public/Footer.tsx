import { Sparkles, Instagram, ArrowLeft, MessageSquare, Music2 } from 'lucide-react';
import { publicNav } from '../../lib/data';

export default function Footer({ onHome }: { onHome: () => void }) {
  return (
    <footer className="relative mt-10 border-t border-white/5">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[60rem] rounded-full bg-brand-700/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-cream-50 shadow-glow">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="font-display text-lg font-bold text-ink-50">Kavitwo</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-ink-300 leading-relaxed">
              Rumah digital Kelas XI DKV 2, SMK TI Bali Global Denpasar.
              Dirancang dan dirawat oleh kelas sebagai portfolio hidup cara
              kami bekerja.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-ink-200 hover:bg-white/10 hover:text-brand-200 hover:-translate-y-0.5 transition-all duration-300 ease-smooth"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-ink-200 hover:bg-white/10 hover:text-brand-200 hover:-translate-y-0.5 transition-all duration-300 ease-smooth"
              >
                <Music2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-wider text-ink-400">Navigasi</h4>
            <ul className="mt-4 grid grid-cols-2 gap-y-2 gap-x-3">
              {publicNav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm text-ink-200 hover:text-brand-200 transition">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Feedback */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-wider text-ink-400">Feedback</h4>
            <p className="mt-4 text-sm text-ink-300 leading-relaxed">
              Ada saran atau menemukan bug? Bantu kami membuat Kavitwo lebih baik.
            </p>
            <a
              href="https://kavitwo.id/feedback"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-glow hover:-translate-y-0.5 transition-all duration-300 ease-smooth"
            >
              <MessageSquare className="h-4 w-4" />
              Kirim Feedback
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} Kavitwo · Kelas XI DKV 2. Hak cipta dilindungi.
          </p>
          <button
            onClick={onHome}
            className="inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-brand-200 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </footer>
  );
}
