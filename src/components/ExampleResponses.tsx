import type { ExampleResponse, ResponseMode } from '@/types/content';

const modeStyles: Record<ResponseMode, { label: string; classes: string; dot: string }> = {
  playful: { label: 'Playful', classes: 'bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
  honest: { label: 'Honest', classes: 'bg-sky-50 border-sky-200', dot: 'bg-sky-400' },
  assertive: { label: 'Assertive', classes: 'bg-rose-50 border-rose-200', dot: 'bg-rose-400' },
  curious: { label: 'Curious', classes: 'bg-violet-50 border-violet-200', dot: 'bg-violet-400' },
  calm: { label: 'Calm', classes: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-400' },
  warm: { label: 'Warm', classes: 'bg-orange-50 border-orange-200', dot: 'bg-orange-400' },
};

interface ExampleResponsesProps {
  examples: ExampleResponse[];
  userResponse?: string;
}

export function ExampleResponses({ examples, userResponse }: ExampleResponsesProps) {
  return (
    <div className="flex flex-col gap-4">
      {userResponse !== undefined && (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
            Your Response
          </p>
          <p className="text-base text-stone-800 italic">
            {userResponse.trim() || '...'}
          </p>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
          Possible Approaches
        </p>
        <div className="flex flex-col gap-2.5">
          {examples.map((ex, i) => {
            const style = modeStyles[ex.mode];
            return (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-xl border p-3.5 ${style.classes}`}
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-1">
                    {style.label}
                  </p>
                  <p className="text-sm text-stone-800 leading-relaxed">{ex.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
