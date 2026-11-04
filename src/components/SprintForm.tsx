import { Target, Clock, Rocket, AlertCircle } from 'lucide-react';
import type { SprintFormat } from '@/types';
import { FormatSelector } from './FormatSelector';

interface Props {
  title: string;
  onTitleChange: (v: string) => void;
  hours: number;
  onHoursChange: (v: number) => void;
  format: SprintFormat;
  onFormatChange: (v: SprintFormat) => void;
  onSubmit: () => void;
  loading: boolean;
  error: boolean;
}

export function SprintForm({
  title,
  onTitleChange,
  hours,
  onHoursChange,
  format,
  onFormatChange,
  onSubmit,
  loading,
  error,
}: Props) {
  const rangeProgress = ((hours - 1) / 7) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Title input */}
      <div className="mb-5">
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
          <Target size={16} className="text-red-500" />
          Назва та мета спринту
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) onSubmit();
          }}
          placeholder="Наприклад: Створити Telegram-бота для трекінгу звичок"
          className={`w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:ring-1 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-red-500 focus:ring-red-500'
          }`}
        />
        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle size={14} />
            Вкажіть тему вашого спринту перед генерацією
          </p>
        )}
      </div>

      {/* Hours slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Clock size={16} className="text-red-500" />
            Тривалість спринту
          </label>
          <span className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-bold text-red-600">
            {hours} {hours === 1 ? 'година' : hours < 5 ? 'години' : 'годин'}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={8}
          step={1}
          value={hours}
          onChange={(e) => onHoursChange(Number(e.target.value))}
          style={{ ['--range-progress' as string]: `${rangeProgress}%` }}
          className="w-full"
        />
        <div className="mt-1.5 flex justify-between text-xs text-slate-500">
          <span>1 год</span>
          <span>4 год</span>
          <span>8 год</span>
        </div>
      </div>

      {/* Format */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">Формат спринту</label>
        <FormatSelector value={format} onChange={onFormatChange} />
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-red-500 to-orange-500 py-3.5 text-base font-bold text-white shadow-lg shadow-red-500/25 transition hover:from-red-400 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Rocket size={20} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        {loading ? 'Генеруємо...' : 'Сформувати спринт-план через AI'}
      </button>
    </div>
  );
}
