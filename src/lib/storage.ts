import { DEFAULT_MODEL, type Settings } from '@/types';

const SETTINGS_KEY = 'sprintmate.settings';

export const defaultSettings: Settings = {
  apiKey: '',
  model: DEFAULT_MODEL,
  mockMode: true,
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      apiKey: parsed.apiKey ?? '',
      model: parsed.model ?? DEFAULT_MODEL,
      mockMode: parsed.mockMode ?? true,
    };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore quota errors */
  }
}

export function isReady(settings: Settings): boolean {
  return Boolean(settings.apiKey && !settings.mockMode) || settings.mockMode;
}
