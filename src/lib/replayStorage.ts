import type { ReplayEntry } from '@/types/content';

const STORAGE_KEY = 'spontaneity_replay_entries';

function readEntries(): ReplayEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReplayEntry[];
  } catch {
    return [];
  }
}

function writeEntries(entries: ReplayEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getReplayEntries(): ReplayEntry[] {
  return readEntries().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addReplayEntry(entry: Omit<ReplayEntry, 'id' | 'createdAt'>): ReplayEntry {
  const entries = readEntries();
  const newEntry: ReplayEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  entries.push(newEntry);
  writeEntries(entries);
  return newEntry;
}

export function deleteReplayEntry(id: string): void {
  const entries = readEntries().filter((e) => e.id !== id);
  writeEntries(entries);
}
