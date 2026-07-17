import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Welcome from './components/Welcome';
import PublicExperience from './components/PublicExperience';
import PortalExperience from './components/PortalExperience';

type Screen = 'welcome' | 'public' | 'portal';

function LoadingScreen({ fading }: { fading: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink-900 transition-all duration-700 ease-smooth ${
        fading ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'
      }`}
    >
      <div
        className="flex flex-col items-center gap-5"
        style={{ animation: 'loader-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) both' }}
      >
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-400 to-brand-700 text-cream-50 shadow-glow">
          <Sparkles className="h-7 w-7" />
          <span className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-300 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-300 animate-bounce" style={{ animationDelay: '120ms' }} />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-300 animate-bounce" style={{ animationDelay: '240ms' }} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaderFading, setLoaderFading] = useState(false);

  useEffect(() => {
    const fadeId = window.setTimeout(() => setLoaderFading(true), 1300);
    const doneId = window.setTimeout(() => setLoading(false), 2000);
    return () => {
      window.clearTimeout(fadeId);
      window.clearTimeout(doneId);
    };
  }, []);

  const switchTo = (next: Screen) => {
    if (next === screen) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setScreen(next);
      setTransitioning(false);
    }, 220);
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      {/* Welcome mounts underneath the loader so it fades in as the loader fades out. */}
      {loading && <LoadingScreen fading={loaderFading} />}
      <div
        className={`transition-opacity duration-700 ease-smooth ${
          loading && !loaderFading ? 'opacity-0' : transitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {screen === 'welcome' && <Welcome onEnter={(e) => switchTo(e)} />}
        {screen === 'public' && (
          <PublicExperience
            onPortal={() => switchTo('portal')}
            onHome={() => switchTo('welcome')}
          />
        )}
        {screen === 'portal' && (
          <PortalExperience
            onExit={() => switchTo('welcome')}
            onPublic={() => switchTo('public')}
          />
        )}
      </div>
    </>
  );
}

export default App;
