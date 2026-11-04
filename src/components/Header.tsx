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
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/20">
            <Rocket size={20} className="text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
              SprintMate<span className="text-cyan-400"> AI</span>
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Планувальник навчального хакатону
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5 sm:flex">
            <span
              className={`h-2 w-2 rounded-full ${
                ready
                  ? 'bg-green-400 pulse-glow'
                  : 'bg-slate-600'
              }`}
            />
            <span className="text-xs font-medium text-slate-300">
              {ready ? (usingMock ? 'Mock-режим' : 'Готовий до генерації') : 'API ключ відсутній'}
            </span>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            <SettingsIcon size={16} className="text-slate-400" />
            <span className="hidden sm:inline">Налаштування API</span>
          </button>
        </div>
      </div>
    </header>
  );
}
