import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { TrainingMode, Difficulty } from '@/types/content';
import {
  getAllPrompts,
  getModeMeta,
  getCategoryMeta,
  getSkillMeta,
  getContent,
} from '@/content/promptEngine';
import { DifficultyBadge, CategoryBadge, SkillBadge } from '@/components/Badges';

type FilterMode = TrainingMode | 'all';

export function ScenariosPage() {
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<FilterMode>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const content = useMemo(() => getContent(), []);

  const filtered = useMemo(() => {
    return getAllPrompts().filter((p) => {
      if (modeFilter !== 'all' && !p.trainingModes.includes(modeFilter)) return false;
      if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const inSituation = p.situation.toLowerCase().includes(q);
        const inOther = p.otherPerson?.toLowerCase().includes(q) ?? false;
        const inCategory = p.category.toLowerCase().includes(q);
        if (!inSituation && !inOther && !inCategory) return false;
      }
      return true;
    });
  }, [search, modeFilter, difficultyFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Scenarios</h1>
        <p className="text-sm text-stone-500 mt-1">
          Browse all training scenarios. Add new ones by editing the content file.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search situations..."
          className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All Modes"
            active={modeFilter === 'all'}
            onClick={() => setModeFilter('all')}
          />
          {content.modes.map((m) => (
            <FilterChip
              key={m.id}
              label={m.label}
              active={modeFilter === m.id}
              onClick={() => setModeFilter(m.id)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All Levels"
            active={difficultyFilter === 'all'}
            onClick={() => setDifficultyFilter('all')}
          />
          {content.difficulties.map((d) => (
            <FilterChip
              key={d.id}
              label={d.label}
              active={difficultyFilter === d.id}
              onClick={() => setDifficultyFilter(d.id)}
            />
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs font-medium text-stone-400">
        {filtered.length} scenario{filtered.length === 1 ? '' : 's'}
      </p>

      {/* Scenario cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((p) => {
          const catMeta = getCategoryMeta(p.category);
          const skillMeta = getSkillMeta(p.skill);
          const modes = p.trainingModes.map((m) => getModeMeta(m)!);
          return (
            <div
              key={p.id}
              className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                {catMeta && <CategoryBadge label={catMeta.label} />}
                {skillMeta && <SkillBadge label={skillMeta.label} />}
                <DifficultyBadge difficulty={p.difficulty} />
              </div>
              <p className="text-base text-stone-800 leading-relaxed">{p.situation}</p>
              {p.otherPerson && (
                <p className="text-sm text-stone-500 italic">"{p.otherPerson}"</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                {modes.map((m) => (
                  <span
                    key={m.id}
                    className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500"
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-sm text-stone-400">No scenarios match your filters.</p>
            <button
              onClick={() => {
                setSearch('');
                setModeFilter('all');
                setDifficultyFilter('all');
              }}
              className="text-sm font-medium text-stone-600 hover:text-stone-900"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
        active
          ? 'bg-stone-900 text-white'
          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
      }`}
    >
      {label}
    </button>
  );
}
