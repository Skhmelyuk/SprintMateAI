import { useState } from 'react';
import {
  Copy,
  Check,
  Clock,
  Package,
  ListChecks,
  DraftingCompass,
  Code2,
  Rocket as RocketIcon,
  Cpu,
  FlaskConical,
  Timer,
  Download,
  Link,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import type { SprintPlan, Task } from '@/types';
import { formatDuration } from '@/lib/mockGenerator';

interface Props {
  plan: SprintPlan;
  onTaskToggle: (phaseId: string, taskId: string) => void;
}

export function SuccessState({ plan, onTaskToggle }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = planToText(plan);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  // Generate PDF
  const generatePdf = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175);
    doc.addPage();
    doc.text('SprintMate AI - Спринт-план', 10, 10);

    // Plan details
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Назва: ${plan.title}`, 10, 25);
    doc.text(`Мета: ${plan.goal}`, 10, 35);
    doc.text(`Тривалість: ${plan.totalHours} годин`, 10, 45);
    doc.text(`Формат: ${plan.format === 'solo' ? 'Соло' : 'Команда (2-3)'}`, 10, 55);

    // Phases
    let y = 72;
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    plan.phases.forEach((phase, pIdx) => {
      doc.text(`${pIdx + 1}. ${phase.name}`, 10, y);
      y += 8;
      doc.setFontSize(11);
      doc.text(`   ${phase.subtitle}`, 10, y);
      y += 7;
      doc.text(`   Тривалість: ${phase.durationLabel}`, 10, y);
      y += 7;
      doc.text(`   Артефакти: ${phase.artifacts.join(', ')}`, 10, y);
      y += 7;
      doc.text(`   Задачі: ${phase.tasks.length} задач`, 10, y);
      y += 10;
    });

    return doc;
  };

  // Generate share link using localStorage (Supabase fallback later)
  const generateShareLink = () => {
    const plans = JSON.parse(localStorage.getItem('sprintmate.plans') || '[]');
    const planId = `plan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    
    plans.push({
      id: planId,
      title: plan.title,
      goal: plan.goal,
      hours: plan.totalHours,
      format: plan.format,
      phases: plan.phases.map(p => ({
        name: p.name,
        subtitle: p.subtitle,
        durationMinutes: p.durationMinutes,
        artifacts: p.artifacts,
        tasks: p.tasks.map(t => ({ title: t.title, done: t.done })),
      })),
      createdAt: Date.now(),
    });
    localStorage.setItem('sprintmate.plans', JSON.stringify(plans));
    
    const link = `${window.location.origin}?plan=${planId}`;
    setLinkGenerated(link);
    setLinkVisible(true);
  };

  const completedTasks = plan.phases.reduce(
    (acc, p) => acc + p.tasks.filter((t) => t.done).length,
    0,
  );
  const totalTasks = plan.phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const phaseIcons = [DraftingCompass, Code2, RocketIcon];

  return (
    <div className="fade-in-up">
      {/* Plan summary header */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-600">
                План спринту
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                {plan.source === 'mock' ? (
                  <>
                    <FlaskConical size={12} /> Mock-генерація
                  </>
                ) : (
                  <>
                    <Cpu size={12} /> AI-генерація
                  </>
                )}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{plan.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{plan.goal}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-slate-700">
                <Clock size={13} className="text-red-500" /> {plan.totalHours} год
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-slate-700">
                {plan.format === 'solo' ? 'Соло' : 'Команда'}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-slate-700">
                <ListChecks size={13} className="text-red-500" /> {completedTasks}/{totalTasks} задач
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-500/50 hover:text-red-600"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" /> Скопійовано!
                </>
              ) : (
                <>
                  <Copy size={16} /> Скопіювати план
                </>
              )}
            </button>

            {/* PDF Export Button */}
            <button
              onClick={() => {
                const pdf = generatePdf();
                pdf.save(`SprintMate-${plan.title}.pdf`);
              }}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-500/50 hover:text-red-600"
              title="Експорт PDF"
            >
              <Download size={16} className="text-red-500" /> PDF
            </button>

            {/* Share Link Button */}
            <button
              onClick={generateShareLink}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-500/50 hover:text-red-600"
              title="Поділтися посиланням"
            >
              <Link size={16} className="text-red-500" /> Посилання
            </button>
          </div>
        </div>

        {/* Share link modal (if generated) */}
        {linkGenerated && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={() => setLinkVisible ? setLinkVisible(false) : null}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">Поділтися план</h3>
              <p className="mb-4 text-slate-600 small">
                Посилання створене та збережено у локальному сховищі.
              </p>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={linkGenerated}
                  readOnly
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  aria-label="Посилання для піділу"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(linkGenerated!).then(() => setLinkVisible(false));
                  }}
                  className="flex-1 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/20"
                >
                  Скопіювати
                </button>
                <button
                  onClick={() => setLinkVisible(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  Закрити
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
            <span>Прогрес виконання</span>
            <span className="font-semibold text-red-600">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {plan.phases.map((phase, idx) => {
          const Icon = phaseIcons[idx] ?? DraftingCompass;
          const phaseDone = phase.tasks.filter((t) => t.done).length;
          return (
            <div
              key={phase.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition:hover:border-red-300 sm:p-6"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500 ring-1 ring-red-500/20">
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">{phase.name}</h3>
                  <p className="text-sm text-slate-600">{phase.subtitle}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600">
                  <Timer size={13} />
                  {phase.durationLabel}
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {/* Artifacts */}
                <div>
                  <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <Package size={14} /> Артефакти
                  </h4>
                  <ul className="space-y-1.5">
                    {phase.artifacts.map((art, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        {art}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tasks */}
                <div>
                  <h4 className="mb-2.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <ListChecks size={14} /> Задачі
                    </span>
                    <span className="text-red-600">{phaseDone}/{phase.tasks.length}</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {phase.tasks.map((task) => (
                      <li key={task.id}>
                        <TaskItem
                          task={task}
                          onToggle={() => onTaskToggle(phase.id, task.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskItem({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition:hover:bg-slate-100"
    >
      <span
        className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition ${
          task.done
            ? 'border-red-500 bg-red-500/20'
            : 'border-slate-300 bg-transparent'
        }`}
        style={{ width: 18, height: 18 }}
      >
        {task.done && <Check size={12} className="text-red-600" />}
      </span>
      <span
        className={`transition ${
          task.done ? 'text-slate-500 line-through' : 'text-slate-700'
        }`}
      >
        {task.title}
      </span>
    </button>
  );
}

function planToText(plan: SprintPlan): string {
  const lines: string[] = [];
  lines.push(`🚀 SprintMate AI — План спринту`);
  lines.push(`Назва: ${plan.title}`);
  lines.push(`Мета: ${plan.goal}`);
  lines.push(`Тривалість: ${plan.totalHours} год | Формат: ${plan.format === 'solo' ? 'Соло' : 'Команда (2-3)'}`);
  lines.push('');
  plan.phases.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.name} — ${p.subtitle} [${p.durationLabel}]`);
    lines.push(`   Артефакти:`);
    p.artifacts.forEach((a) => lines.push(`     • ${a}`));
    lines.push(`   Задачі:`);
    p.tasks.forEach((t) => lines.push(`     ${t.done ? '[x]' : '[ ]'} ${t.title}`));
    lines.push('');
  });
  return lines.join('\n');
}