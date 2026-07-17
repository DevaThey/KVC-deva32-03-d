import { Mail, ArrowUpRight } from 'lucide-react';
import { teachers } from '../../lib/data';
import { useReveal } from '../../hooks/useReveal';

export default function Teachers() {
  useReveal();
  return (
    <section id="teachers" className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal flex flex-col items-start gap-3 mb-10">
          <span className="section-eyebrow">
            <span className="h-px w-6 bg-brand-400/60" />
            Guru
          </span>
          <h2 className="section-title">Mentor yang mendorong karya.</h2>
          <p className="section-sub">
            Pengajar yang membimbing Kelas XI DKV 2 — hubungi kapan saja melalui
            email sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teachers.map((t, i) => (
            <article
              key={t.id}
              data-reveal-delay={i * 70}
              className="reveal group card-surface relative overflow-hidden p-5 transition-all duration-500 ease-smooth hover:-translate-y-1 hover:border-brand-400/30 hover:shadow-card"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10">
                <img
                  src={t.photo}
                  alt={t.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
              </div>

              <h3 className="mt-4 font-display text-lg font-semibold text-ink-50">{t.name}</h3>
              <p className="text-sm text-brand-300">{t.subject}</p>

              <a
                href={`mailto:${t.email}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-medium text-ink-100 hover:bg-white/10 hover:border-brand-400/30 transition-all duration-300 ease-smooth"
              >
                <Mail className="h-3.5 w-3.5" />
                Kontak
                <ArrowUpRight className="h-3.5 w-3.5 ml-auto text-ink-400 group-hover:text-brand-300 transition" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
