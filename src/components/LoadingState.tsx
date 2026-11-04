import { Loader2, Brain } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 spin-slow" />
        <div className="absolute h-2 w-2 rounded-full bg-cyan-400 orbit" style={{ boxShadow: '0 0 10px #06b6d4' }} />
        <Brain size={32} className="text-cyan-400" />
      </div>

      <h3 className="mb-2 text-lg font-bold text-white">AI розраховує фази спринту...</h3>
      <p className="flex items-center gap-2 text-sm text-slate-400">
        <Loader2 size={14} className="animate-spin text-cyan-400" />
        Декомпозуємо задачі та розподіляємо час
      </p>

      <div className="mt-8 w-full max-w-md space-y-2.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="shimmer h-20 rounded-xl"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </div>
    </div>
  );
}
