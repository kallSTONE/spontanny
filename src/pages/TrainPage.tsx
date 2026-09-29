import { useState, useCallback } from 'react';
import {
  Zap, Shuffle, Shield, Sparkles, RefreshCw,
  ChevronRight, RotateCcw, X,
} from 'lucide-react';
import type { Prompt, TrainingMode } from '@/types/content';
import {
  getRandomPromptForMode,
  getRandomPromptExcluding,
  getModeMeta,
  getCategoryMeta,
  getSkillMeta,
  getRandomEncouragingPhrase,
} from '@/content/promptEngine';
import { useProgress, type SessionInput } from '@/hooks/useProgress';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ResponseInput } from '@/components/ResponseInput';
import { ExampleResponses } from '@/components/ExampleResponses';
import { ReflectionPanel } from '@/components/ReflectionPanel';
import { DifficultyBadge, CategoryBadge, SkillBadge } from '@/components/Badges';

const modeOrder: TrainingMode[] = [
  'instant_response',
  'three_ways',
  'boundary_practice',
  'play_mode',
  'social_recovery',
];

const modeIcons: Record<TrainingMode, typeof Zap> = {
  instant_response: Zap,
  three_ways: Shuffle,
  boundary_practice: Shield,
  play_mode: Sparkles,
  social_recovery: RefreshCw,
};

type Phase = 'select' | 'prompt' | 'result' | 'reflection';

export function TrainPage() {
  const [selectedMode, setSelectedMode] = useState<TrainingMode | null>(null);
  const [phase, setPhase] = useState<Phase>('select');
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [encouragingPhrase] = useState(() => getRandomEncouragingPhrase());

  const { recordSession } = useProgress();

  const startMode = (mode: TrainingMode) => {
    setSelectedMode(mode);
    const p = getRandomPromptForMode(mode);
    setPrompt(p);
    setUsedIds([p.id]);
    setStartTime(Date.now());
    setResponseTimeMs(null);
    setPhase('prompt');
  };

  const nextPrompt = useCallback(() => {
    if (!selectedMode) return;
    const p = getRandomPromptExcluding(selectedMode, usedIds);
    setPrompt(p);
    setUsedIds((prev) => [...prev, p.id]);
    setStartTime(Date.now());
    setResponseTimeMs(null);
    setPhase('prompt');
  }, [selectedMode, usedIds]);

  const exitToSelect = () => {
    setSelectedMode(null);
    setPrompt(null);
    setPhase('select');
    setUsedIds([]);
  };

  if (phase === 'select' || !selectedMode || !prompt) {
    return <ModeSelect onPick={startMode} />;
  }

  return (
    <TrainFlow
      key={prompt.id}
      mode={selectedMode}
      prompt={prompt}
      phase={phase}
      setPhase={setPhase}
      startTime={startTime}
      responseTimeMs={responseTimeMs}
      setResponseTimeMs={setResponseTimeMs}
      encouragingPhrase={encouragingPhrase}
      recordSession={recordSession}
      onNext={nextPrompt}
      onExit={exitToSelect}
    />
  );
}

function ModeSelect({ onPick }: { onPick: (m: TrainingMode) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Choose a training mode</h1>
        <p className="text-sm text-stone-500 mt-1">Each mode trains a different muscle.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {modeOrder.map((modeId) => {
          const meta = getModeMeta(modeId)!;
          const Icon = modeIcons[modeId];
          return (
            <button
              key={modeId}
              onClick={() => onPick(modeId)}
              className="group flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left transition-all duration-200 hover:border-stone-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700 transition-colors group-hover:bg-stone-900 group-hover:text-amber-400">
                <Icon className="h-5.5 w-5.5" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-stone-900">{meta.label}</p>
                <p className="text-sm text-stone-500 leading-relaxed mt-0.5">{meta.description}</p>
                <p className="text-xs font-medium text-stone-400 mt-2 italic">{meta.tagline}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-stone-300 group-hover:text-stone-600 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TrainFlowProps {
  mode: TrainingMode;
  prompt: Prompt;
  phase: Phase;
  setPhase: (p: Phase) => void;
  startTime: number;
  responseTimeMs: number | null;
  setResponseTimeMs: (ms: number | null) => void;
  encouragingPhrase: string;
  recordSession: (input: SessionInput) => Promise<void>;
  onNext: () => void;
  onExit: () => void;
}

function TrainFlow({
  mode,
  prompt,
  phase,
  setPhase,
  startTime,
  responseTimeMs,
  setResponseTimeMs,
  encouragingPhrase,
  recordSession,
  onNext,
  onExit,
}: TrainFlowProps) {
  const meta = getModeMeta(mode)!;
  const catMeta = getCategoryMeta(prompt.category);
  const skillMeta = getSkillMeta(prompt.skill);
  const Icon = modeIcons[mode];

  // Single response state (instant_response, boundary_practice, play_mode, social_recovery)
  const [singleResponse, setSingleResponse] = useState('');
  const [timerPaused, setTimerPaused] = useState(false);

  // Three ways state
  const [threeWayResponses, setThreeWayResponses] = useState<Record<string, string>>({
    playful: '',
    honest: '',
    assertive: '',
  });

  // Reflection state
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string> | null>(null);

  const handleSubmitSingle = () => {
    if (singleResponse.trim().length === 0) return;
    const elapsed = Date.now() - startTime;
    setResponseTimeMs(elapsed);
    setTimerPaused(true);
    setPhase('result');
  };

  const handleSubmitThreeWays = () => {
    const allFilled = Object.values(threeWayResponses).every((v) => v.trim().length > 0);
    if (!allFilled) return;
    setResponseTimeMs(Date.now() - startTime);
    setPhase('result');
  };

  const handleReflectionComplete = (answers: Record<string, string>) => {
    setReflectionAnswers(answers);
    const baseInput: SessionInput = {
      trainingMode: mode,
      category: prompt.category,
      skill: prompt.skill,
      difficulty: prompt.difficulty,
      responseTimeMs,
    };
    if (mode === 'three_ways') {
      baseInput.responseModes = threeWayResponses;
    } else {
      baseInput.responseText = singleResponse;
    }
    if (Object.keys(answers).length > 0) {
      baseInput.reflection = answers;
    }
    recordSession(baseInput);
  };

  const handleNext = () => {
    onNext();
    setSingleResponse('');
    setThreeWayResponses({ playful: '', honest: '', assertive: '' });
    setReflectionAnswers(null);
    setTimerPaused(false);
    setPhase('prompt');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-amber-400">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-900">{meta.label}</p>
            <p className="text-xs text-stone-400">{meta.tagline}</p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Prompt card */}
      {phase === 'prompt' && (
        <div className="flex flex-col gap-5 rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {catMeta && <CategoryBadge label={catMeta.label} />}
            {skillMeta && <SkillBadge label={skillMeta.label} />}
            <DifficultyBadge difficulty={prompt.difficulty} />
          </div>

          {/* Timer */}
          {prompt.timeLimitSeconds && mode === 'instant_response' && (
            <div className="flex justify-center py-2">
              <CountdownTimer
                seconds={prompt.timeLimitSeconds}
                onComplete={() => {
                  setTimerPaused(true);
                }}
                resetKey={prompt.id}
                paused={timerPaused}
              />
            </div>
          )}

          {/* Situation */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1.5">
                Situation
              </p>
              <p className="text-lg text-stone-800 leading-relaxed">{prompt.situation}</p>
            </div>
            {prompt.otherPerson && (
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1">
                  They say
                </p>
                <p className="text-lg text-stone-800 leading-relaxed font-medium">
                  "{prompt.otherPerson}"
                </p>
              </div>
            )}
          </div>

          {/* Instruction */}
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-sm font-medium text-amber-800">{prompt.instruction}</p>
          </div>

          {/* Encouraging phrase */}
          <p className="text-center text-sm text-stone-400 italic">{encouragingPhrase}</p>

          {/* Input */}
          {mode === 'three_ways' ? (
            <div className="flex flex-col gap-4">
              {(['playful', 'honest', 'assertive'] as const).map((m) => (
                <ThreeWayField
                  key={m}
                  mode={m}
                  value={threeWayResponses[m]}
                  onChange={(v) => setThreeWayResponses((prev) => ({ ...prev, [m]: v }))}
                />
              ))}
              <button
                onClick={handleSubmitThreeWays}
                disabled={!Object.values(threeWayResponses).every((v) => v.trim().length > 0)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit All Three
              </button>
            </div>
          ) : (
            <ResponseInput
              value={singleResponse}
              onChange={setSingleResponse}
              onSubmit={handleSubmitSingle}
              placeholder="Say something. It doesn't have to be perfect."
              multiline={mode !== 'instant_response'}
              autoFocus
            />
          )}
        </div>
      )}

      {/* Result */}
      {phase === 'result' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
            {responseTimeMs != null && (
              <div className="flex items-center justify-center gap-2 text-sm text-stone-400">
                <ClockIcon />
                Response time: {(responseTimeMs / 1000).toFixed(1)}s
              </div>
            )}
            {mode === 'three_ways' ? (
              <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Your Responses
                </p>
                {(['playful', 'honest', 'assertive'] as const).map((m) => (
                  <div key={m} className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
                    <p className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-1">
                      {m}
                    </p>
                    <p className="text-sm text-stone-800 italic">
                      {threeWayResponses[m] || '...'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <ExampleResponses
                examples={prompt.examples}
                userResponse={singleResponse}
              />
            )}

            {/* For three_ways, also show examples */}
            {mode === 'three_ways' && (
              <ExampleResponses examples={prompt.examples} />
            )}
          </div>

          {/* Reflection */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
            {reflectionAnswers === null ? (
              <ReflectionPanel
                questions={prompt.reflectionQuestions}
                onComplete={handleReflectionComplete}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <p className="text-sm font-medium text-stone-600">
                  Reflection saved. You showed up — that's the training.
                </p>
              </div>
            )}
          </div>

          {/* Next actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-stone-800"
            >
              <RotateCcw className="h-4 w-4" />
              Next Prompt
            </button>
            <button
              onClick={onExit}
              className="rounded-2xl px-6 py-3.5 text-sm font-medium text-stone-400 transition-colors hover:text-stone-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ThreeWayField({
  mode,
  value,
  onChange,
}: {
  mode: 'playful' | 'honest' | 'assertive';
  value: string;
  onChange: (v: string) => void;
}) {
  const labels: Record<string, string> = {
    playful: 'Playful',
    honest: 'Honest',
    assertive: 'Assertive',
  };
  const colors: Record<string, string> = {
    playful: 'border-amber-200 bg-amber-50/50',
    honest: 'border-sky-200 bg-sky-50/50',
    assertive: 'border-rose-200 bg-rose-50/50',
  };
  return (
    <div className={`flex flex-col gap-1.5 rounded-xl border ${colors[mode]} p-3`}>
      <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
        {labels[mode]}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Your ${mode} response...`}
        rows={2}
        autoFocus={mode === 'playful'}
        className="resize-none rounded-lg bg-white/80 px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300"
      />
    </div>
  );
}

function ClockIcon() {
  return <span className="h-1 w-1 rounded-full bg-stone-300" />;
}
