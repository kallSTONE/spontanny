import { Flame, Clock, CheckCircle2, Zap, Shield, Shuffle, RefreshCw, Sparkles, Calendar } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

export function ProgressPage() {
  const { stats, loading } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-stone-400">Loading your progress...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Progress</h1>
        <p className="text-sm text-stone-500 mt-1">
          Behavioral metrics, not personality scores. You're training, not performing.
        </p>
      </div>

      {/* Streak hero */}
      <div className="flex items-center gap-5 rounded-3xl bg-stone-900 p-6 text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-stone-900">
          <Flame className="h-8 w-8" />
        </div>
        <div>
          <p className="text-4xl font-bold tabular-nums">{stats.currentStreak}</p>
          <p className="text-sm text-stone-300">
            day{stats.currentStreak === 1 ? '' : 's'} streak
          </p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-sm text-stone-300">
            <Calendar className="h-4 w-4" />
            {stats.daysPracticed} total day{stats.daysPracticed === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Core metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <MetricCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Sessions Completed"
          value={String(stats.sessionsCompleted)}
          accent="text-emerald-600"
        />
        <MetricCard
          icon={<Zap className="h-5 w-5" />}
          label="Prompts Answered"
          value={String(stats.promptsAnswered)}
          accent="text-stone-700"
        />
        <MetricCard
          icon={<Clock className="h-5 w-5" />}
          label="Average Response Time"
          value={
            stats.averageResponseTimeMs != null
              ? `${(stats.averageResponseTimeMs / 1000).toFixed(1)}s`
              : '—'
          }
          accent="text-sky-600"
        />
      </div>

      {/* Skill breakdown */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-stone-400 mb-3">
          Skills Practiced
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <SkillMetric
            icon={<Sparkles className="h-4.5 w-4.5" />}
            label="Playful responses practiced"
            value={stats.playfulResponses}
            color="text-amber-600 bg-amber-50"
          />
          <SkillMetric
            icon={<Shield className="h-4.5 w-4.5" />}
            label="Assertive responses practiced"
            value={stats.assertiveResponses}
            color="text-rose-600 bg-rose-50"
          />
          <SkillMetric
            icon={<Shield className="h-4.5 w-4.5" />}
            label="Boundary exercises completed"
            value={stats.boundaryExercises}
            color="text-emerald-600 bg-emerald-50"
          />
          <SkillMetric
            icon={<Shuffle className="h-4.5 w-4.5" />}
            label="Three Ways exercises completed"
            value={stats.replayExercises}
            color="text-sky-600 bg-sky-50"
          />
          <SkillMetric
            icon={<RefreshCw className="h-4.5 w-4.5" />}
            label="Recovery exercises completed"
            value={stats.recoveryExercises}
            color="text-violet-600 bg-violet-50"
          />
        </div>
      </div>

      {/* Philosophy reminder */}
      <div className="rounded-2xl bg-stone-100 p-5">
        <p className="text-sm text-stone-500 leading-relaxed">
          These numbers track <span className="font-semibold text-stone-700">practice</span>, not personality.
          The goal isn't to be impressive — it's to stay present.
        </p>
      </div>
    </div>
  );
}

function MetricCard({
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
    <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5">
      <div className={`flex items-center gap-1.5 ${accent}`}>{icon}</div>
      <div>
        <p className="text-3xl font-bold text-stone-900 tabular-nums">{value}</p>
        <p className="text-xs font-medium text-stone-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function SkillMetric({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-stone-600">{label}</p>
      </div>
      <p className="text-2xl font-bold text-stone-900 tabular-nums">{value}</p>
    </div>
  );
}
