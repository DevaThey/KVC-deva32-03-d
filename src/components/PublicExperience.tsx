import { useEffect } from 'react';
import PublicNavbar from './public/PublicNavbar';
import Hero from './public/Hero';
import About from './public/About';
import Highlights from './public/Highlights';
import Gallery from './public/Gallery';
import Teachers from './public/Teachers';
import Footer from './public/Footer';
import PlaylistKelas from './public/PlaylistKelas';
import ScrollProgress from './ScrollProgress';
import { useReveal } from '../hooks/useReveal';

export default function PublicExperience({ onPortal, onHome }: { onPortal: () => void; onHome: () => void }) {
  useReveal();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen screen-enter">
      <ScrollProgress />
      <PublicNavbar onPortal={onPortal} />

      <main>
        <Hero />
        <About />
        <Highlights />
        <PlaylistKelas />
        <Gallery />
        <Teachers />
      </main>

      <Footer onHome={onHome} />
    </div>
  );
}
