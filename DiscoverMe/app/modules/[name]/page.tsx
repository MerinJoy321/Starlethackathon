import { notFound } from 'next/navigation';
import ArtPad from '@/components/modules/ArtPad';
import PuzzlePlay from '@/components/modules/PuzzlePlay';
import MusicMaker from '@/components/modules/MusicMaker';
import MathExplorer from '@/components/modules/MathExplorer';
import BuilderZone from '@/components/modules/BuilderZone';

const modules = {
  'art-pad': ArtPad,
  'puzzle-play': PuzzlePlay,
  'music-maker': MusicMaker,
  'math-explorer': MathExplorer,
  'builder-zone': BuilderZone,
};

export default function ModulePage({ params }: { params: { name: string } }) {
  const ModuleComponent = modules[params.name as keyof typeof modules];
  
  if (!ModuleComponent) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-white">
      <ModuleComponent />
    </div>
  );
} 