import type {
  ContentStructure,
  Prompt,
  TrainingMode,
  Difficulty,
} from '@/types/content';
import contentData from './structure.json';

const content = contentData as ContentStructure;

export function getContent(): ContentStructure {
  return content;
}

export function getAllPrompts(): Prompt[] {
  return content.prompts;
}

export function getPromptsByCategory(category: string): Prompt[] {
  return content.prompts.filter((p) => p.category === category);
}

export function getPromptsBySkill(skill: string): Prompt[] {
  return content.prompts.filter((p) => p.skill === skill);
}

export function getPromptsByDifficulty(difficulty: Difficulty): Prompt[] {
  return content.prompts.filter((p) => p.difficulty === difficulty);
}

export function getPromptsForTrainingMode(mode: TrainingMode): Prompt[] {
  return content.prompts.filter((p) => p.trainingModes.includes(mode));
}

export function getRandomPrompt(): Prompt {
  const prompts = content.prompts;
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function getRandomPromptForMode(mode: TrainingMode): Prompt {
  const prompts = getPromptsForTrainingMode(mode);
  if (prompts.length === 0) return getRandomPrompt();
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function getRandomPromptExcluding(mode: TrainingMode, excludeIds: string[]): Prompt {
  const available = getPromptsForTrainingMode(mode).filter((p) => !excludeIds.includes(p.id));
  if (available.length === 0) {
    return getRandomPromptForMode(mode);
  }
  return available[Math.floor(Math.random() * available.length)];
}

export function getPromptById(id: string): Prompt | undefined {
  return content.prompts.find((p) => p.id === id);
}

export function getModeMeta(mode: TrainingMode) {
  return content.modes.find((m) => m.id === mode);
}

export function getCategoryMeta(categoryId: string) {
  return content.categories.find((c) => c.id === categoryId);
}

export function getSkillMeta(skillId: string) {
  return content.skills.find((s) => s.id === skillId);
}

export function getDifficultyMeta(difficulty: Difficulty) {
  return content.difficulties.find((d) => d.id === difficulty);
}

export function getPhilosophy(): string[] {
  return content.meta.philosophy;
}

export function getRandomEncouragingPhrase(): string {
  const phrases = content.meta.encouragingPhrases;
  return phrases[Math.floor(Math.random() * phrases.length)];
}
