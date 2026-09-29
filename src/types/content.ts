export type TrainingMode =
  | 'instant_response'
  | 'three_ways'
  | 'boundary_practice'
  | 'play_mode'
  | 'social_recovery';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ResponseMode = 'playful' | 'honest' | 'assertive' | 'curious' | 'calm' | 'warm';

export interface ReflectionQuestion {
  id: string;
  text: string;
}

export interface ExampleResponse {
  mode: ResponseMode;
  text: string;
}

export interface Prompt {
  id: string;
  category: string;
  skill: string;
  difficulty: Difficulty;
  trainingModes: TrainingMode[];
  situation: string;
  otherPerson?: string;
  instruction: string;
  examples: ExampleResponse[];
  reflectionQuestions: ReflectionQuestion[];
  timeLimitSeconds?: number;
}

export interface ModeMeta {
  id: TrainingMode;
  label: string;
  description: string;
  tagline: string;
  icon: string;
}

export interface CategoryMeta {
  id: string;
  label: string;
  description: string;
}

export interface SkillMeta {
  id: string;
  label: string;
  description: string;
}

export interface DifficultyMeta {
  id: Difficulty;
  label: string;
  description: string;
}

export interface ContentStructure {
  meta: {
    appName: string;
    philosophy: string[];
    encouragingPhrases: string[];
  };
  modes: ModeMeta[];
  categories: CategoryMeta[];
  skills: SkillMeta[];
  difficulties: DifficultyMeta[];
  prompts: Prompt[];
}

export interface TrainingSessionRecord {
  id: string;
  training_mode: TrainingMode;
  category: string | null;
  skill: string | null;
  difficulty: string | null;
  response_text: string | null;
  response_time_ms: number | null;
  response_modes: Record<string, string> | null;
  reflection: Record<string, string> | null;
  created_at: string;
}

export interface ReplayEntry {
  id: string;
  whatHappened: string;
  whatSaid: string;
  whatWishedSaid: string;
  playful: string;
  honest: string;
  assertive: string;
  curious: string;
  createdAt: string;
}
