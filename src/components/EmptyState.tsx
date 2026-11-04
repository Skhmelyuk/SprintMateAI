import { Rocket, Sparkles, Clock, Layers } from 'lucide-react';

interface Props {
  onTrySample: () => void;
}

export function EmptyState({ onTrySample }: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <div className="float-soft mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 ring-1 ring-cyan-500/30">
        <Rocket size={40} className="text-cyan-400" />
      </div>

      <h2 className="mb-3 max-w-md text-2xl font-bold text-white sm:text-3xl">
        Спробуйте своій ідею за <span className="text-cyan-400">хвилини</span>
      </h2>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
        Опишіть тему спринту, оберіть тривалість і формат — SprintMate AI декомпозує
        його на 3 фази з таймінгом, артефактами та чекбоксами для виконання.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FeatureBadge icon={Layers} title="3 фази" desc="Архітектура → Код → Реліз" />
        <FeatureBadge icon={Clock} title="Таймінг" desc="1-8 годин розбивки" />
        <FeatureBadge icon={Sparkles} title="AI-генерація" desc="OpenRouter + Mock" />
      </div>

      <button
        onClick={onTrySample}
        className="group flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20 hover:ring-1 hover:ring-cyan-500/50"
      >
        <Sparkles size={18} />
        Спробувати зразок: Розробка 2D-гри
        <span className="transition group-hover:translate-x-0.5">→</span>
      </button>
    </div>
  );
}

function FeatureBadge({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Layers;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-left">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-200">{title}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
    </div>
  );
}
