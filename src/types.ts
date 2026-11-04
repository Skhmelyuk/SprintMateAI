export type SprintFormat = 'solo' | 'team';

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export interface Phase {
  id: string;
  name: string;
  subtitle: string;
  durationLabel: string;
  durationMinutes: number;
  artifacts: string[];
  tasks: Task[];
}

export interface SprintPlan {
  title: string;
  goal: string;
  totalHours: number;
  format: SprintFormat;
  phases: Phase[];
  source: 'openrouter' | 'mock';
  createdAt: number;
}

export interface Settings {
  apiKey: string;
  model: string;
  mockMode: boolean;
}

export const DEFAULT_MODEL = 'google/gemini-2.0-flash-exp:free';

export const MODEL_OPTIONS = [
  'google/gemini-2.5-flash',
  'openai/gpt-4o-mini',
  'openai/gpt-4o',
  'mistralai/mistral-large',
  'nvidia/nemotron-3.5-super-vl:free',
  'nvidia/nemotron-3.5-lightning:free',
  'xingchen-agi/xing4.0-29b-a4b:free',
  'dots-studio/dots-3-note-preview:free',
];
