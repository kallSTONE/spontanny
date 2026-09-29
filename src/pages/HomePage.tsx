import { Flame, Clock, CheckCircle2, Zap, RotateCcw, ArrowRight } from 'lucide-react';
import type { PageId } from '@/App';
import { useProgress } from '@/hooks/useProgress';
import { getReplayEntries } from '@/lib/replayStorage';
import { getRandomEncouragingPhrase, getPhilosophy } from '@/content/promptEngine';
import { useMemo } from 'react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { stats, loading } = useProgress();
  const replayEntries = useMemo(() => getReplayEntries().slice(0, 3), []);
  const phrase = useMemo(() => getRandomEncouragingPhrase(), []);
  const philosophy = useMemo(() => getPhilosophy(), []);

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            <Zap className="h-3.5 w-3.5" />
            Private practice gym
          </span>
          <h1 className="text-3xl font-bold text-stone-900 leading-tight md:text-4xl">
            Train your ability to respond<br />
            <span className="text-stone-400">in the moment.</span>
          </h1>
          <p className="text-base text-stone-500 leading-relaxed max-w-lg">
            {phrase}
          </p>
        </div>
        <button
          onClick={() => onNavigate('train')}
          className="group flex w-fit items-center gap-2 rounded-2xl bg-stone-900 px-7 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-stone-800 hover:gap-3"
        >
          Start Today's Training
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Current Streak"
          value={loading ? '—' : `${stats.currentStreak} day${stats.currentStreak === 1 ? '' : 's'}`}
          accent="text-amber-600"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Sessions"
          value={loading ? '—' : String(stats.sessionsCompleted)}
          accent="text-emerald-600"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Avg Response"
          value={
            loading
              ? '—'
              : stats.averageResponseTimeMs != null
                ? `${(stats.averageResponseTimeMs / 1000).toFixed(1)}s`
                : '—'
          }
          accent="text-sky-600"
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          label="Exercises"
          value={loading ? '—' : String(stats.promptsAnswered)}
          accent="text-stone-700"
        />
      </div>

      {/* Today's training modes */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-stone-400">
          Today's Training
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TrainingModeCard
            title="Instant Response"
            desc="Respond fast. Speed over perfection."
            onClick={() => onNavigate('train')}
          />
          <TrainingModeCard
            title="Three Ways"
            desc="One situation, three different responses."
            onClick={() => onNavigate('train')}
          />
          <TrainingModeCard
            title="Boundary Practice"
            desc="Clear, calm responses to pressure."
            onClick={() => onNavigate('train')}
          />
          <TrainingModeCard
            title="Social Recovery"
            desc="Bounce back from awkward moments."
            onClick={() => onNavigate('train')}
          />
        </div>
      </div>

      {/* Recent replay entries */}
      {replayEntries.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-400">
              Recent Replay Entries
            </h2>
            <button
              onClick={() => onNavigate('replay')}
              className="text-xs font-medium text-stone-500 hover:text-stone-800"
            >
              View all
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {replayEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4"
              >
                <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                <div className="min-w-0">
                  <p className="text-sm text-stone-800 truncate">{entry.whatHappened}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Philosophy */}
      <div className="rounded-2xl bg-stone-100 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-stone-400 mb-3">
          Core Philosophy
        </p>
        <ul className="flex flex-col gap-2">
          {philosophy.map((p, i) => (
            <li key={i} className="text-sm text-stone-600 leading-relaxed">
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-4">
      <div className={`flex items-center gap-1.5 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-stone-900 tabular-nums">{value}</p>
        <p className="text-xs font-medium text-stone-400">{label}</p>
      </div>
    </div>
  );
}

function TrainingModeCard({
  title,
  desc,
  onClick,
}: {
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-4 text-left transition-all duration-200 hover:border-stone-300 hover:shadow-sm"
    >
      <p className="text-sm font-bold text-stone-900">{title}</p>
      <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
      <span className="mt-1 text-xs font-medium text-stone-400 group-hover:text-stone-700 transition-colors">
        Start →
      </span>
    </button>
  );
}
