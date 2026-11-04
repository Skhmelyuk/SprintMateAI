import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { SettingsModal } from '@/components/SettingsModal';
import { SprintForm } from '@/components/SprintForm';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { SuccessState } from '@/components/SuccessState';
import { loadSettings, saveSettings } from '@/lib/storage';
import { generatePlan } from '@/lib/openrouter';
import { generateMockPlan } from '@/lib/mockGenerator';
import type { GenerationStatus, Settings, SprintFormat, SprintPlan } from '@/types';

function App() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [hours, setHours] = useState(3);
  const [format, setFormat] = useState<SprintFormat>('solo');

  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [plan, setPlan] = useState<SprintPlan | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleGenerate = useCallback(async () => {
    if (!title.trim()) {
      setError(true);
      setStatus('error');
      return;
    }
    setError(false);
    setStatus('loading');

    const result = await generatePlan(
      title.trim(),
      '',
      hours,
      format,
      settings.apiKey,
      settings.model,
      settings.mockMode,
    );

    setPlan(result);
    setStatus('success');
  }, [title, hours, format, settings]);

  const handleTrySample = useCallback(() => {
    setTitle('Розробка 2D-гри');
    setHours(4);
    setFormat('team');
    setError(false);
    setStatus('loading');
    generatePlan(
      'Розробка 2D-гри',
      '',
      4,
      'team',
      settings.apiKey,
      settings.model,
      settings.mockMode,
    ).then((result) => {
      setPlan(result);
      setStatus('success');
    });
  }, [settings]);

  const toggleTask = useCallback(
    (phaseId: string, taskId: string) => {
      setPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          phases: prev.phases.map((p) =>
            p.id !== phaseId
              ? p
              : {
                  ...p,
                  tasks: p.tasks.map((t) =>
                    t.id === taskId ? { ...t, done: !t.done } : t,
                  ),
                },
          ),
        };
      });
    },
    [],
  );

  const showEmpty = status === 'idle' || (status === 'error' && !plan);
  const showLoading = status === 'loading';
  const showSuccess = status === 'success' && plan;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Ambient gradient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-red-200/30 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-red-100/20 blur-3xl" />
      </div>

      <div className="relative">
        <Header settings={settings} onOpenSettings={() => setSettingsOpen(true)} />

        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
          {/* Form is always visible at top */}
          <SprintForm
            title={title}
            onTitleChange={(v) => {
              setTitle(v);
              if (error) {
                setError(false);
                setStatus('idle');
              }
            }}
            hours={hours}
            onHoursChange={setHours}
            format={format}
            onFormatChange={setFormat}
            onSubmit={handleGenerate}
            loading={showLoading}
            error={error}
          />

          {/* States */}
          <div className="mt-6">
            {showEmpty && <EmptyState onTrySample={handleTrySample} />}
            {showLoading && <LoadingState />}
            {showSuccess && plan && (
              <SuccessState plan={plan} onTaskToggle={toggleTask} />
            )}
          </div>
        </main>

        <footer className="mx-auto max-w-4xl px-4 pb-8 text-center sm:px-6">
          <p className="text-xs text-slate-400">
            SprintMate AI · Планувальник навчального хакатону · Powered by OpenRouter
          </p>
        </footer>
      </div>

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
