import { useState } from 'react';
import { Music2, ExternalLink, Play, Clock, RefreshCw, Disc3 } from 'lucide-react';
import { playlist, type PlaylistTrack } from '../../lib/data';
import { useReveal } from '../../hooks/useReveal';

export default function PlaylistKelas() {
  useReveal();
  const [playing, setPlaying] = useState<string | null>(null);

  const fmtDate = (iso: string) =>
    new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const toggle = (id: string) => setPlaying((p) => (p === id ? null : id));

  return (
    <section id="playlist" className="relative py-14 sm:py-20">
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
            mengejar deadline. Diperbarui setiap minggu oleh kelas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Player + meta */}
          <div className="reveal lg:col-span-7">
            <div className="card-surface relative overflow-hidden p-5 sm:p-6">
              <div className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />

              <div className="relative flex flex-col sm:flex-row gap-5">
                {/* Cover */}
                <div className="relative shrink-0">
                  <div className="h-44 w-44 overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10 shadow-card">
                    <img
                      src={playlist.cover}
                      alt={playlist.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-cream-50 shadow-glow ring-2 ring-ink-800">
                    <Disc3 className="h-4 w-4" />
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-1 flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-brand-300">Playlist</span>
                  <h3 className="mt-1 font-display text-2xl font-bold text-ink-50">{playlist.title}</h3>
                  <p className="mt-2 text-sm text-ink-300 leading-relaxed line-clamp-3">
                    {playlist.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Music2 className="h-3.5 w-3.5" />
                      {playlist.totalSongs} lagu
                    </span>
                    <span className="text-ink-600">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Diperbarui {fmtDate(playlist.lastUpdated)}
                    </span>
                  </div>

                  <a
                    href={playlist.openUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-glow hover:-translate-y-0.5 transition-all duration-300 ease-smooth"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Buka di Spotify
                  </a>
                </div>
              </div>

              {/* Embed */}
              <div className="relative mt-5 overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10 bg-ink-950/40">
                <iframe
                  src={playlist.embedUrl}
                  title={playlist.title}
                  width="100%"
                  height="152"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="block w-full"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </div>

          {/* Track list — scrollable */}
          <div className="reveal lg:col-span-5" style={{ transitionDelay: '100ms' }}>
            <div className="card-surface flex h-full flex-col overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <h4 className="text-sm font-semibold text-ink-100">Daftar Lagu</h4>
                <span className="text-[10px] uppercase tracking-wider text-ink-400">
                  {playlist.tracks.length} ditampilkan
                </span>
              </div>

              <ul className="scroll-thin max-h-[22rem] overflow-y-auto divide-y divide-white/5">
                {playlist.tracks.map((t: PlaylistTrack) => {
                  const isPlaying = playing === t.id;
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => toggle(t.id)}
                        className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-300 hover:bg-white/5 active:bg-white/10"
                      >
                        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-inset ring-white/10 text-ink-200 transition-colors group-hover:bg-brand-500/20 group-hover:text-brand-200">
                          {isPlaying ? (
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
                          <div className={`truncate text-sm font-medium ${isPlaying ? 'text-brand-200' : 'text-ink-100'}`}>
                            {t.title}
                          </div>
                          <div className="truncate text-xs text-ink-400">{t.artist}</div>
                        </div>

                        <span className="shrink-0 text-xs tabular-nums text-ink-400 inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 opacity-60" />
                          {t.duration}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
