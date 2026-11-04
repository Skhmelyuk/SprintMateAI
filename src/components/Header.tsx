import { Rocket, Settings as SettingsIcon } from 'lucide-react';
import type { Settings } from '@/types';
import { isReady } from '@/lib/storage';

interface Props {
  settings: Settings;
  onOpenSettings: () => void;
}

export function Header({ settings, onOpenSettings }: Props) {
  const ready = isReady(settings);
  const usingMock = settings.mockMode || !settings.apiKey;

  return (
    <header className="sticky top-0 z-30 border-b border-red-300 bg-red-500 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-500/30">
            <Rocket size={20} className="text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
              SprintMate<span className="text-red-100"> AI</span>
            </h1>
            <p className="hidden text-xs text-red-100/80 sm:block">
              Планувальник навчального хакатону
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-red-200 bg-white/80 px-3 py-1.5 sm:flex">
            <span
              className={`h-2 w-2 rounded-full ${ready ? 'bg-red-500 pulse-glow' : 'bg-slate-400'}`}
            />
            <span className="text-xs font-medium text-slate-700">
              {ready ? (usingMock ? 'Mock-режим' : 'Готовий до генерації') : 'API ключ відсутній'}
            </span>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-400 hover:bg-red-50"
          >
            <SettingsIcon size={16} className="text-slate-500" />
            <span className="hidden sm:inline">Налаштування API</span>
          </button>
        </div>
      </div>
    </header>
  );
}
