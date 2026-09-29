import type { Difficulty } from '@/types/content';

const config: Record<Difficulty, { label: string; classes: string }> = {
  easy: { label: 'Easy', classes: 'bg-emerald-100 text-emerald-700' },
  medium: { label: 'Medium', classes: 'bg-amber-100 text-amber-700' },
  hard: { label: 'Hard', classes: 'bg-rose-100 text-rose-700' },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const c = config[difficulty];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.classes}`}>
      {c.label}
    </span>
  );
}

export function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
      {label}
    </span>
  );
}

export function SkillBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-600">
      {label}
    </span>
  );
}
