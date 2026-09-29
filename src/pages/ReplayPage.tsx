import { useState } from 'react';
import { Plus, Trash2, RotateCcw, X } from 'lucide-react';
import { getReplayEntries, addReplayEntry, deleteReplayEntry } from '@/lib/replayStorage';
import type { ReplayEntry } from '@/types/content';

export function ReplayPage() {
  const [entries, setEntries] = useState<ReplayEntry[]>(() => getReplayEntries());
  const [showForm, setShowForm] = useState(false);

  const refresh = () => setEntries(getReplayEntries());

  const handleAdd = (entry: Omit<ReplayEntry, 'id' | 'createdAt'>) => {
    addReplayEntry(entry);
    refresh();
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteReplayEntry(id);
    refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Replay</h1>
          <p className="text-sm text-stone-500 mt-1 leading-relaxed max-w-md">
            Enter a real interaction from your day. Rewrite it in different ways.
            Stored privately on your device.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 shrink-0"
          >
            <Plus className="h-4 w-4" />
            New Entry
          </button>
        )}
      </div>

      {showForm && <ReplayForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}

      {entries.length === 0 && !showForm ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
            <RotateCcw className="h-6 w-6" />
          </div>
          <p className="text-sm text-stone-400">No replay entries yet.</p>
          <p className="text-xs text-stone-400 max-w-xs">
            Had an interaction today you wish went differently? Add it here and rewrite it.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <ReplayCard key={entry.id} entry={entry} onDelete={() => handleDelete(entry.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReplayForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (e: Omit<ReplayEntry, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [whatHappened, setWhatHappened] = useState('');
  const [whatSaid, setWhatSaid] = useState('');
  const [whatWishedSaid, setWhatWishedSaid] = useState('');
  const [playful, setPlayful] = useState('');
  const [honest, setHonest] = useState('');
  const [assertive, setAssertive] = useState('');
  const [curious, setCurious] = useState('');

  const canSubmit = whatHappened.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ whatHappened, whatSaid, whatWishedSaid, playful, honest, assertive, curious });
  };

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-stone-900">New Replay Entry</h2>
        <button
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <Field label="What happened?" value={whatHappened} onChange={setWhatHappened} placeholder="Describe the situation..." required />
        <Field label="What did you actually say?" value={whatSaid} onChange={setWhatSaid} placeholder="Your actual response..." />
        <Field label="What did you wish you had said?" value={whatWishedSaid} onChange={setWhatWishedSaid} placeholder="The response you wanted..." />

        <div className="border-t border-stone-100 pt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-stone-400 mb-3">
            Rewrite it four ways
          </p>
          <div className="flex flex-col gap-3">
            <Field label="Playful version" value={playful} onChange={setPlayful} placeholder="Add some lightness..." variant="playful" />
            <Field label="Honest version" value={honest} onChange={setHonest} placeholder="Say what you actually felt..." variant="honest" />
            <Field label="Assertive version" value={assertive} onChange={setAssertive} placeholder="State your position clearly..." variant="assertive" />
            <Field label="Curious version" value={curious} onChange={setCurious} placeholder="Ask a genuine question..." variant="curious" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex-1 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save Entry
        </button>
        <button
          onClick={onCancel}
          className="rounded-2xl px-4 py-3 text-sm font-medium text-stone-400 hover:text-stone-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function ReplayCard({ entry, onDelete }: { entry: ReplayEntry; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const versions = [
    { label: 'Playful', value: entry.playful, color: 'text-amber-600' },
    { label: 'Honest', value: entry.honest, color: 'text-sky-600' },
    { label: 'Assertive', value: entry.assertive, color: 'text-rose-600' },
    { label: 'Curious', value: entry.curious, color: 'text-violet-600' },
  ].filter((v) => v.value.trim().length > 0);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-stone-800 leading-relaxed">{entry.whatHappened}</p>
          <p className="text-xs text-stone-400 mt-2">
            {new Date(entry.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {entry.whatSaid && (
        <div className="rounded-xl bg-stone-50 border border-stone-100 p-3">
          <p className="text-xs font-semibold uppercase text-stone-400 mb-1">You said</p>
          <p className="text-sm text-stone-700 italic">{entry.whatSaid}</p>
        </div>
      )}
      {entry.whatWishedSaid && (
        <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-3">
          <p className="text-xs font-semibold uppercase text-amber-500 mb-1">Wish you said</p>
          <p className="text-sm text-stone-700 italic">{entry.whatWishedSaid}</p>
        </div>
      )}

      {versions.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-stone-500 hover:text-stone-800"
        >
          {expanded ? 'Hide versions' : `Show ${versions.length} version${versions.length === 1 ? '' : 's'}`}
        </button>
      )}

      {expanded && versions.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-stone-100 pt-3">
          {versions.map((v) => (
            <div key={v.label} className="flex flex-col gap-0.5">
              <p className={`text-xs font-bold uppercase tracking-wide ${v.color}`}>{v.label}</p>
              <p className="text-sm text-stone-700">{v.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  variant,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  variant?: string;
}) {
  const variantColors: Record<string, string> = {
    playful: 'border-amber-200 bg-amber-50/30',
    honest: 'border-sky-200 bg-sky-50/30',
    assertive: 'border-rose-200 bg-rose-50/30',
    curious: 'border-violet-200 bg-violet-50/30',
  };
  return (
    <div className={`flex flex-col gap-1.5 rounded-xl border p-3 ${variant ? variantColors[variant] : 'border-stone-200'}`}>
      <label className="text-xs font-semibold text-stone-600">
        {label}
        {required && <span className="text-rose-400"> *</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="resize-none bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
      />
    </div>
  );
}
