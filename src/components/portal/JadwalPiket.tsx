import { useMemo, useState } from 'react';
import { ClipboardList, User, Users } from 'lucide-react';
import { piket, days, dayFull, dayShort, currentDayKey, type DayKey } from '../../lib/data';
import { useReveal } from '../../hooks/useReveal';

export default function JadwalPiket() {
  const today = currentDayKey();
  const [active, setActive] = useState<DayKey>(today ?? 'Mon');
  useReveal();

  const slot = useMemo(() => piket.find((p) => p.day === active), [active]);
  const isToday = today === active;

  return (
    <section id="piket" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="reveal flex flex-col items-start gap-3 mb-8">
          <span className="section-eyebrow">
            <ClipboardList className="h-3.5 w-3.5" />
            Jadwal Piket
          </span>
          <h2 className="section-title">Hari Ini</h2>
          <p className="section-sub">
            Koordinator dan anggota piket untuk setiap hari. Hari ini disorot
            otomatis.
          </p>
        </div>

        {/* Day selector */}
        <div className="reveal flex flex-wrap gap-2 mb-6">
          {days.map((d) => {
            const isActive = active === d;
            const isTodayBtn = today === d;
            return (
              <button
                key={d}
                onClick={() => setActive(d)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-smooth ${
                  isActive
                    ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-cream-50 shadow-glow'
                    : 'bg-white/5 border border-white/10 text-ink-200 hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="hidden sm:inline">{dayFull[d]}</span>
                  <span className="sm:hidden">{dayShort[d]}</span>
                  {isTodayBtn && (
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-cream-100' : 'bg-brand-400'} animate-pulse-soft`} />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured coordinator card */}
        {slot ? (
          <div className="reveal card-surface relative overflow-hidden p-6 sm:p-8 mb-6">
            <div className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-300">
                  {isToday ? 'Hari Ini' : dayFull[active]}
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-ink-400">Koordinator</span>
                    <h3 className="font-display text-2xl font-bold text-ink-50">{slot.coordinator}</h3>
                  </div>
                </div>
              </div>
              <div className="shrink-0 rounded-3xl bg-white/5 border border-white/10 px-5 py-4 text-center">
                <div className="font-display text-3xl font-bold text-ink-50">{slot.members.length}</div>
                <div className="text-xs uppercase tracking-wider text-ink-400">Anggota</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="reveal card-surface p-10 text-center text-ink-300 mb-6">
            Tidak ada jadwal piket untuk hari ini.
          </div>
        )}

        {/* Members list */}
        {slot && slot.members.length > 0 && (
          <div className="reveal">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-ink-400" />
              <h3 className="text-sm font-semibold text-ink-200 uppercase tracking-wider">Anggota Piket</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {slot.members.map((m, i) => (
                <div
                  key={m}
                  data-reveal-delay={i * 50}
                  className="reveal card-surface flex items-center gap-3 p-4 transition-all duration-500 ease-smooth hover:-translate-y-1 hover:border-brand-400/30"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300 ring-1 ring-inset ring-brand-400/30">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-ink-50">{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
