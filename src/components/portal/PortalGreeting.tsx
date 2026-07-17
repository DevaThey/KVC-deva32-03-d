import { useEffect, useState } from 'react';
import { Sun, Moon, Coffee, Sunset } from 'lucide-react';

function greetingFor(h: number): { text: string; Icon: React.ComponentType<{ className?: string }> } {
  if (h >= 5 && h < 11) return { text: 'Selamat Pagi', Icon: Sun };
  if (h >= 11 && h < 15) return { text: 'Selamat Siang', Icon: Coffee };
  if (h >= 15 && h < 18) return { text: 'Selamat Sore', Icon: Sunset };
  return { text: 'Selamat Malam', Icon: Moon };
}

export default function PortalGreeting() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const h = now.getHours();
  const { text, Icon } = greetingFor(h);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const date = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="relative pt-24 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal is-visible flex flex-col items-center text-center">
          {/* Premium capsule clock */}
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-ink-800/70 backdrop-blur-xl px-6 py-3 shadow-card">
            <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-ink-50 tabular-nums leading-none">
              {hh}
            </span>
            <span className="font-display text-4xl sm:text-5xl font-extrabold leading-none text-brand-300/85">
              :
            </span>
            <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-ink-50 tabular-nums leading-none">
              {mm}
            </span>
            <span className="ml-1 text-xs uppercase tracking-wider text-ink-400">WITA</span>
          </div>

          {/* Date below clock */}
          <p className="mt-3 text-sm text-ink-300">{date}</p>

          {/* Greeting below date */}
          <div className="mt-2 flex items-center gap-2 text-ink-200">
            <Icon className="h-4 w-4 text-brand-300" />
            <span className="text-sm font-medium">
              {text}, warga Kavitwo.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
