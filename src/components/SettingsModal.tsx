import { useEffect } from 'react';
import { X, KeyRound, Cpu, FlaskConical } from 'lucide-react';
import { MODEL_OPTIONS } from '@/types';
import type { Settings } from '@/types';

interface Props {
  open: boolean;
  settings: Settings;
  onChange: (settings: Settings) => void;
  onClose: () => void;
}

export function SettingsModal({ open, settings, onChange, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Налаштування API</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Закрити"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* API Key */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
              <KeyRound size={16} className="text-red-500" />
              OpenRouter API Key
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => onChange({ ...settings, apiKey: e.target.value })}
              placeholder="sk-or-v1-..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Зберігається лише у вашому браузері. Отримати ключ — openrouter.ai/keys
            </p>
          </div>

          {/* Model */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Cpu size={16} className="text-red-500" />
              Модель
            </label>
            <select
              value={settings.model}
              onChange={(e) => onChange({ ...settings, model: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m} value={m} className="bg-white">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Mock mode */}
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-300 bg-white/50 p-3.5 transition hover:border-slate-400">
            <input
              type="checkbox"
              checked={settings.mockMode}
              onChange={() => onChange({ ...settings, mockMode: !settings.mockMode })}
              className="sr-only peer"
            />
            <div
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                settings.mockMode ? 'bg-red-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.mockMode ? 'translate-x-5' : 'translate-x-0.5'
                } peer-checked:translate-x-5`}
              />
            </div>
            <span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <FlaskConical size={15} className="text-red-500" />
                Тестовий режим без ключа (Mock-генерація)
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Генерує якісний зразок плану локально, без запитів до AI.
              </span>
            </span>
          </label>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-red-500 to-orange-500 py-2.5 text-sm font-semibold text-white transition hover:from-red-400 hover:to-orange-400"
        >
          Готово
        </button>
      </div>
    </div>
  );
}
