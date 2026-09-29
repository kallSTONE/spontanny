import { useState } from 'react';
import { Check } from 'lucide-react';
import type { ReflectionQuestion } from '@/types/content';

interface ReflectionPanelProps {
  questions: ReflectionQuestion[];
  onComplete: (answers: Record<string, string>) => void;
}

export function ReflectionPanel({ questions, onComplete }: ReflectionPanelProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const handleSkip = () => {
    onComplete({});
    setDone(true);
  };

  const handleSubmit = () => {
    onComplete(answers);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-stone-600">
          Reflection saved. You showed up — that's the training.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-bold text-stone-800">Reflect</h3>
        <p className="text-xs text-stone-400 mt-0.5">No right answers. Just notice.</p>
      </div>
      <div className="flex flex-col gap-4">
        {questions.map((q) => (
          <div key={q.id} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-stone-700">{q.text}</label>
            <textarea
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="Your thoughts..."
              rows={2}
              className="resize-none rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          className="flex-1 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          Save Reflection
        </button>
        <button
          onClick={handleSkip}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-stone-400 transition-colors hover:text-stone-600"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
