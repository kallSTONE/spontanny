import { Home, Dumbbell, Layers, RotateCcw, BarChart3, Sparkles } from 'lucide-react';
import type { PageId } from '@/App';

interface NavBarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
}

const items: { id: PageId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'train', label: 'Train', icon: Dumbbell },
  { id: 'scenarios', label: 'Scenarios', icon: Layers },
  { id: 'replay', label: 'Replay', icon: RotateCcw },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
];

export function NavBar({ current, onNavigate }: NavBarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-stone-200/80 bg-stone-50/50 backdrop-blur-sm z-40">
        <div className="flex items-center gap-2.5 px-6 py-7">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-stone-900 leading-tight">Spontaneity</h1>
            <p className="text-xs text-stone-400 leading-tight">Trainer</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-3 mt-2">
          {items.map(({ id, label, icon: Icon }) => {
            const active = current === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-500 hover:bg-stone-200/60 hover:text-stone-900'
                }`}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </div>
        <div className="mt-auto px-6 py-6">
          <p className="text-xs text-stone-400 leading-relaxed">
            Respond before perfecting.
          </p>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-around px-2 py-1.5">
          {items.map(({ id, label, icon: Icon }) => {
            const active = current === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors duration-200 ${
                  active ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
