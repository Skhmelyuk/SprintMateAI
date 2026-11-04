import { User, Users } from 'lucide-react';
import type { SprintFormat } from '@/types';

interface Props {
  value: SprintFormat;
  onChange: (value: SprintFormat) => void;
}

export function FormatSelector({ value, onChange }: Props) {
  const options: { id: SprintFormat; label: string; sub: string; icon: typeof User }[] = [
    { id: 'solo', label: 'Соло-розробка', sub: '1 людина', icon: User },
    { id: 'team', label: 'Командний спринт', sub: '2-3 людини', icon: Users },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const active = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
              active
                ? 'border-red-500 bg-red-500/10 ring-1 ring-red-500/40'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
                active ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <div className={`text-sm font-semibold ${active ? 'text-red-700' : 'text-slate-800'}`}>
                {opt.label}
              </div>
              <div className="text-xs text-slate-500">{opt.sub}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
