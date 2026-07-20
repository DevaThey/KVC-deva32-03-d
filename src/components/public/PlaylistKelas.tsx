import { memo, useState, useEffect, useMemo } from 'react';
import { Music2, ExternalLink, Play, Pause, SkipBack, SkipForward, Clock, ListMusic } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { fetchPlaylist, fetchWebsiteSettings } from '../../lib/queries';
import { useReveal } from '../../hooks/useReveal';
import { LoadingState, ErrorState } from '../QueryState';
import type { PlaylistTrack } from '../../lib/data';

const toSec = (d: string) => {
  const [m, s] = d.split(':').map(Number);
  return m * 60 + s;
};
const fmt = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

function PlaylistKelas() {
  useReveal();
  const { data: tracks, loading, error, refetch } = useQuery(fetchPlaylist);
  const { data: settings } = useQuery(fetchWebsiteSettings);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const list = tracks ?? [];
  const track = list[currentIdx] as PlaylistTrack | undefined;
  const total = track ? toSec(track.duration) : 0;

  useEffect(() => {
    if (!isPlaying || !track) return;
    const id = window.setInterval(() => {
      setProgress((p) => (p + 1 >= total ? total : p + 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isPlaying, total, track]);

  useEffect(() => setProgress(0), [currentIdx]);

  const next = () => list.length > 0 && setCurrentIdx((i) => (i + 1) % list.length);
  const prev = () => list.length > 0 && setCurrentIdx((i) => (i - 1 + list.length) % list.length);

  useEffect(() => {
    if (progress >= total && total > 0 && isPlaying) {
      next();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, total, isPlaying]);

  const pct = useMemo(() => (total > 0 ? Math.min(100, (progress / total) * 100) : 0), [progress, total]);

  const bars = useMemo(() => Array.from({ length: 36 }, (_, i) => i), []);
  const spotifyEmbedUrl = settings?.spotifyPlaylist ?? '';

  return (
    <section id="playlist" className="reveal cv-auto relative py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal flex flex-col items-start gap-3 mb-10">
          <span className="section-eyebrow">
            <Music2 className="h-3.5 w-3.5" />
            Playlist Kelas
          </span>
          <h2 className="section-title">Suara yang menemani studio.</h2>
          <p className="section-sub">
            Musik yang kami dengarkan saat mengerjakan tugas, brainstorm, dan
            mengejar deadline.
          </p>
        </div>

        {loading ? (
          <LoadingState label="Memuat playlist" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : list.length === 0 ? (
          <div className="reveal card-surface p-10 text-center text-ink-300">
            Belum ada lagu di playlist.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
            {/* Premium media player */}
            <div className="reveal lg:col-span-7">
              <div className="card-surface relative overflow-hidden p-5 sm:p-6">
                <div className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />

                <div className="relative flex flex-col sm:flex-row gap-6">
                  {/* Vinyl record */}
                  <div className="relative shrink-0 mx-auto sm:mx-0">
                    <div
                      className={`relative h-44 w-44 rounded-full bg-ink-950 ring-1 ring-inset ring-white/10 shadow-card overflow-hidden vinyl-spin ${
                        isPlaying ? '' : 'vinyl-paused'
                      }`}
                      style={{
                        backgroundImage:
                          'repeating-radial-gradient(circle at center, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)',
                      }}
                    >
                      <div className="absolute inset-[22%] overflow-hidden rounded-full ring-2 ring-ink-950/60">
                        <img
                          src={track?.coverImage || list[0]?.coverImage}
                          alt={track?.title || 'Playlist'}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-950 ring-1 ring-white/20" />
                    </div>
                  </div>

                  {/* Now playing meta + transport */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-brand-300">
                      <ListMusic className="h-3.5 w-3.5" />
                      {list.length} lagu
                    </div>
                    <h3 className="mt-1.5 font-display text-2xl font-bold text-ink-50 leading-tight line-clamp-1">
                      {track?.title ?? '—'}
                    </h3>
                    <p className="text-sm text-ink-300">{track?.artist ?? '—'}</p>

                    {/* Transport controls */}
                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={prev}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-ink-100 hover:bg-white/10 hover:text-ink-50 transition"
                        aria-label="Sebelumnya"
                      >
                        <SkipBack className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIsPlaying((p) => !p)}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-cream-50 shadow-glow hover:-translate-y-0.5 transition-all duration-300 ease-smooth"
                        aria-label={isPlaying ? 'Jeda' : 'Putar'}
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
                      </button>
                      <button
                        onClick={next}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-ink-100 hover:bg-white/10 hover:text-ink-50 transition"
                        aria-label="Berikutnya"
                      >
                        <SkipForward className="h-4 w-4" />
                      </button>

                      {spotifyEmbedUrl && (
                        <a
                          href={spotifyEmbedUrl.replace('/embed/', '/')}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-ink-100 hover:bg-white/10 hover:border-brand-400/30 transition-all duration-300 ease-smooth"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Spotify
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* OneUI-inspired soft waveform timeline */}
                <div className="relative mt-6">
                  <div className="flex items-end justify-between gap-[3px] h-12 px-1">
                    {bars.map((i) => {
                      const active = (i / bars.length) * 100 <= pct;
                      const baseHeight = 30 + Math.abs(Math.sin(i * 0.9)) * 70;
                      return (
                        <span
                          key={i}
                          className={`wave-soft flex-1 max-w-[6px] rounded-full ${
                            isPlaying ? '' : 'wave-soft-paused'
                          } ${active ? 'bg-brand-300' : 'bg-white/10'}`}
                          style={{
                            height: `${baseHeight}%`,
                            animationDelay: `${(i % 12) * 90}ms`,
                            animationDuration: `${1.8 + (i % 5) * 0.3}s`,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Progress track */}
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] tabular-nums text-ink-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3 opacity-60" />
                      {fmt(progress)}
                    </span>
                    <span>{track?.duration ?? '0:00'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Track list */}
            <div className="reveal lg:col-span-5" style={{ transitionDelay: '100ms' }}>
              <div className="card-surface flex h-full flex-col overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <h4 className="text-sm font-semibold text-ink-100">Daftar Lagu</h4>
                  <span className="text-[10px] uppercase tracking-wider text-ink-400">
                    {list.length} ditampilkan
                  </span>
                </div>

                <ul className="scroll-thin max-h-[24rem] overflow-y-auto divide-y divide-white/5">
                  {list.map((t: PlaylistTrack, i: number) => {
                    const isCurrent = i === currentIdx;
                    return (
                      <li key={t.id}>
                        <button
                          onClick={() => {
                            setCurrentIdx(i);
                            setIsPlaying(true);
                          }}
                          className={`group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-300 hover:bg-white/5 active:bg-white/10 ${
                            isCurrent ? 'bg-white/[0.03]' : ''
                          }`}
                        >
                          <span
                            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-colors ${
                              isCurrent
                                ? 'bg-brand-500/20 text-brand-200 ring-brand-400/40'
                                : 'bg-white/5 text-ink-200 ring-white/10 group-hover:bg-brand-500/20 group-hover:text-brand-200'
                            }`}
                          >
                            {isCurrent && isPlaying ? (
                              <span className="flex items-end gap-0.5">
                                <span className="h-2.5 w-0.5 rounded-full bg-brand-300 animate-eq" style={{ animationDelay: '0ms' }} />
                                <span className="h-3.5 w-0.5 rounded-full bg-brand-300 animate-eq" style={{ animationDelay: '150ms' }} />
                                <span className="h-2 w-0.5 rounded-full bg-brand-300 animate-eq" style={{ animationDelay: '300ms' }} />
                              </span>
                            ) : (
                              <Play className="h-3.5 w-3.5 translate-x-0.5" />
                            )}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className={`truncate text-sm font-medium ${isCurrent ? 'text-brand-200' : 'text-ink-100'}`}>
                              {t.title}
                            </div>
                            <div className="truncate text-xs text-ink-400">{t.artist}</div>
                          </div>

                          <span className="shrink-0 text-xs tabular-nums text-ink-400">{t.duration}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
export default memo(PlaylistKelas);
