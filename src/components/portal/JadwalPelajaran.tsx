import { useMemo, useState, useEffect } from 'react';
import { Clock, MapPin, User, CircleDot, CalendarDays } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { fetchSchedule } from '../../lib/queries';
import {
  subjectColorMap,
  days,
  dayFull,
  dayShort,
  currentDayKey,
  nextDayKey,
  isNow,
  type DayKey,
} from '../../lib/data';
import { useReveal } from '../../hooks/useReveal';
import { LoadingState, ErrorState } from '../QueryState';

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export default function JadwalPelajaran() {
  const today = currentDayKey();
  const [active, setActive] = useState<DayKey>(today ?? 'Mon');
  const [now, setNow] = useState(() => new Date());
  useReveal();
  const { data, loading, error, refetch } = useQuery(fetchSchedule);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const allSlots = data ?? [];

  const slots = useMemo(
    () => allSlots.filter((s) => s.day === active).sort((a, b) => a.start.localeCompare(b.start)),
    [allSlots, active]
  );

  const isToday = today === active;
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const dayBounds = useMemo(() => {
    if (!isToday || slots.length === 0) return null;
    const start = Math.min(...slots.map((s) => toMin(s.start)));
    const end = Math.max(...slots.map((s) => toMin(s.end)));
    return { start, end };
  }, [isToday, slots]);

  const dayProgress = useMemo(() => {
    if (!dayBounds) return 0;
    if (nowMin <= dayBounds.start) return 0;
    if (nowMin >= dayBounds.end) return 100;
    return Math.round(((nowMin - dayBounds.start) / (dayBounds.end - dayBounds.start)) * 100);
  }, [dayBounds, nowMin]);

  const dayEnded = isToday && dayBounds ? nowMin > dayBounds.end : false;
  const nextDay = today ? nextDayKey(today) : null;
  const currentSlots = slots.filter(isNow);

  return (
    <section id="schedule" className="relative pt-12 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="reveal flex flex-col items-start gap-3 mb-8">
          <span className="section-eyebrow">
            <CalendarDays className="h-3.5 w-3.5" />
            Jadwal Pelajaran
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink-50">
            {isToday ? 'Hari Ini' : dayFull[active]}
          </h1>
          <p className="section-sub">
            {isToday
              ? 'Pelajaran yang berlangsung hari ini disorot otomatis.'
              : `Pratinjau jadwal untuk ${dayFull[active]}.`}
          </p>
        </div>

        {loading ? (
          <LoadingState label="Memuat jadwal" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <>
            {/* Featured today card */}
            {isToday && slots.length > 0 && (
              <div className="reveal card-surface relative overflow-hidden p-6 sm:p-8 mb-6">
                <div className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-brand-300">
                      {dayEnded ? 'Hari Telah Selesai' : 'Sedang Berlangsung'}
                    </span>
                    {currentSlots.length > 0 ? (
                      currentSlots.map((slot) => {
                        const c = subjectColorMap[slot.color];
                        return (
                          <div key={slot.id} className="mt-2">
                            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-50">{slot.subject}</h2>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-300">
                              <span className={`inline-flex items-center gap-1.5 ${c.text}`}>
                                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                                {slot.start}–{slot.end}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />
                                {slot.teacher}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                Ruang {slot.room}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="mt-2">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-50">
                          {dayEnded ? 'Pelajaran hari ini selesai' : 'Istirahat'}
                        </h2>
                        <p className="mt-1 text-sm text-ink-300">
                          {dayEnded
                            ? 'Sampai jumpa besok. Nikmati waktu istirahatmu.'
                            : 'Tidak ada pelajaran aktif sekarang.'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 rounded-3xl bg-white/5 border border-white/10 px-5 py-4 text-center">
                    <div className="font-display text-3xl font-bold text-ink-50">{slots.length}</div>
                    <div className="text-xs uppercase tracking-wider text-ink-400">Pelajaran</div>
                  </div>
                </div>

                {/* Day progress bar */}
                {isToday && dayBounds && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-ink-400">
                      <span>Progress hari ini</span>
                      <span className="tabular-nums text-ink-300">{dayProgress}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-inset ring-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-[width] duration-700 ease-smooth"
                        style={{ width: `${dayProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Day selector */}
            <div className="reveal flex flex-wrap gap-2 mb-6">
              {days.map((d) => {
                const isActive = active === d;
                const isTodayBtn = today === d;
                const isNextHint = dayEnded && nextDay === d && !isActive;
                return (
                  <button
                    key={d}
                    onClick={() => setActive(d)}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-smooth ${
                      isActive
                        ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-cream-50 shadow-glow'
                        : isNextHint
                          ? 'bg-white/5 border border-brand-400/40 text-ink-100 tab-hint'
                          : 'bg-white/5 border border-white/10 text-ink-200 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="hidden sm:inline">{dayFull[d]}</span>
                      <span className="sm:hidden">{dayShort[d]}</span>
                      {isTodayBtn && (
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-cream-100' : 'bg-brand-400'} animate-pulse-soft`} />
                      )}
                      {isNextHint && (
                        <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-brand-300/80">besok</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Slots */}
            {slots.length === 0 ? (
              <div className="reveal card-surface p-10 text-center text-ink-300">
                Tidak ada pelajaran pada hari ini.
              </div>
            ) : (
              <div className="reveal grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {slots.map((slot, i) => {
                  const c = subjectColorMap[slot.color];
                  const slotNow = isNow(slot);
                  return (
                    <div
                      key={slot.id}
                      data-reveal-delay={i * 50}
                      className={`reveal group relative overflow-hidden rounded-3xl border p-4 transition-all duration-500 ease-smooth hover:-translate-y-1 ${
                        slotNow
                          ? `border-brand-400/40 ${c.bg} ring-2 ${c.ring} shadow-glow`
                          : 'border-white/5 bg-ink-800/50 hover:border-white/10'
                      }`}
                    >
                      {slotNow && (
                        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-200 ring-1 ring-inset ring-brand-400/40">
                          <CircleDot className="h-3 w-3 animate-pulse-soft" />
                          Now
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                        <span className={`text-[11px] uppercase tracking-wider ${c.text}`}>
                          {slot.start}–{slot.end}
                        </span>
                      </div>

                      <h3 className="mt-2 font-display text-lg font-semibold text-ink-50">{slot.subject}</h3>

                      <div className="mt-3 space-y-1.5 text-xs text-ink-300">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-ink-400" />
                          {slot.teacher}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-ink-400" />
                          Ruang {slot.room}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-ink-400" />
                          {slot.start} – {slot.end}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
