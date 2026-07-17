import { useEffect } from 'react';
import PortalHeader from './portal/PortalHeader';
import JadwalPelajaran from './portal/JadwalPelajaran';
import JadwalPiket from './portal/JadwalPiket';
import TugasMingguIni from './portal/TugasMingguIni';
import PortalGreeting from './portal/PortalGreeting';
import ScrollProgress from './ScrollProgress';
import { useReveal } from '../hooks/useReveal';

export default function PortalExperience({
  onExit,
  onPublic,
}: {
  onExit: () => void;
  onPublic: () => void;
}) {
  useReveal();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen screen-enter">
      <ScrollProgress />
      <PortalHeader onExit={onExit} onPublic={onPublic} />

      <main>
        <PortalGreeting />
        <JadwalPelajaran />
        <JadwalPiket />
        <TugasMingguIni />
      </main>
    </div>
  );
}
