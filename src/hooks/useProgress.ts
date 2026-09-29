import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { TrainingSessionRecord, TrainingMode } from '@/types/content';

export interface ProgressStats {
  sessionsCompleted: number;
  promptsAnswered: number;
  averageResponseTimeMs: number | null;
  daysPracticed: number;
  currentStreak: number;
  playfulResponses: number;
  assertiveResponses: number;
  boundaryExercises: number;
  replayExercises: number;
  recoveryExercises: number;
}

export interface SessionInput {
  trainingMode: TrainingMode;
  category?: string | null;
  skill?: string | null;
  difficulty?: string | null;
  responseText?: string | null;
  responseTimeMs?: number | null;
  responseModes?: Record<string, string> | null;
  reflection?: Record<string, string> | null;
}

export function useProgress() {
  const [sessions, setSessions] = useState<TrainingSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('training_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setSessions((data as TrainingSessionRecord[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const recordSession = useCallback(
    async (input: SessionInput): Promise<void> => {
      const { error: err } = await supabase.from('training_sessions').insert({
        training_mode: input.trainingMode,
        category: input.category ?? null,
        skill: input.skill ?? null,
        difficulty: input.difficulty ?? null,
        response_text: input.responseText ?? null,
        response_time_ms: input.responseTimeMs ?? null,
        response_modes: input.responseModes ?? null,
        reflection: input.reflection ?? null,
      });
      if (err) {
        setError(err.message);
        return;
      }
      await fetchSessions();
    },
    [fetchSessions]
  );

  const stats: ProgressStats = computeStats(sessions);

  return { sessions, stats, loading, error, recordSession, refresh: fetchSessions };
}

function computeStats(records: TrainingSessionRecord[]): ProgressStats {
  const sessionsCompleted = records.length;
  const promptsAnswered = records.length;

  const responseTimes = records
    .map((r) => r.response_time_ms)
    .filter((t): t is number => t != null && t > 0);
  const averageResponseTimeMs =
    responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : null;

  const uniqueDates = new Set(
    records.map((r) => r.created_at.slice(0, 10))
  );
  const daysPracticed = uniqueDates.size;

  const currentStreak = computeStreak(records);

  const playfulResponses = records.filter(
    (r) => r.response_modes && 'playful' in r.response_modes
  ).length;
  const assertiveResponses = records.filter(
    (r) =>
      r.response_modes && 'assertive' in r.response_modes
  ).length;

  const boundaryExercises = records.filter(
    (r) => r.training_mode === 'boundary_practice'
  ).length;
  const replayExercises = records.filter(
    (r) => r.training_mode === 'three_ways'
  ).length;
  const recoveryExercises = records.filter(
    (r) => r.training_mode === 'social_recovery'
  ).length;

  return {
    sessionsCompleted,
    promptsAnswered,
    averageResponseTimeMs,
    daysPracticed,
    currentStreak,
    playfulResponses,
    assertiveResponses,
    boundaryExercises,
    replayExercises,
    recoveryExercises,
  };
}

function computeStreak(records: TrainingSessionRecord[]): number {
  if (records.length === 0) return 0;
  const dates = new Set(records.map((r) => r.created_at.slice(0, 10)));
  let streak = 0;
  const today = new Date();
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    if (dates.has(dateStr)) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}
