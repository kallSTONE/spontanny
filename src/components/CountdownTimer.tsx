import { useEffect, useRef, useState } from 'react';

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
  resetKey: string;
  paused?: boolean;
}

export function CountdownTimer({ seconds, onComplete, resetKey, paused = false }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setRemaining(seconds);
    setIsComplete(false);
  }, [resetKey, seconds]);

  useEffect(() => {
    if (paused || isComplete) return;
    if (remaining <= 0) {
      setIsComplete(true);
      onCompleteRef.current();
      return;
    }
    const timer = setTimeout(() => {
      setRemaining((r) => r - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [remaining, paused, isComplete]);

  const progress = ((seconds - remaining) / seconds) * 100;
  const isUrgent = remaining <= 1;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-stone-200"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className={`transition-colors duration-300 ${
              isUrgent ? 'text-red-500' : 'text-amber-500'
            }`}
            strokeDasharray={2 * Math.PI * 28}
            strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
        </svg>
        <span
          className={`text-2xl font-bold tabular-nums transition-colors duration-300 ${
            isUrgent ? 'text-red-500' : 'text-stone-700'
          }`}
        >
          {remaining}
        </span>
      </div>
      <p className="text-xs font-medium text-stone-400">seconds</p>
    </div>
  );
}
