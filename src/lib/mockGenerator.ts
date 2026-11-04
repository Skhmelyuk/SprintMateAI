import type { Phase, SprintFormat, SprintPlan } from '@/types';

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generateMockPlan(
  title: string,
  goal: string,
  totalHours: number,
  format: SprintFormat,
): SprintPlan {
  const teamNote =
    format === 'team'
      ? 'Розподіліть задачі між 2-3 учасниками: Backend, Frontend, QA/Дизайн.'
      : 'Працюйте соло — фокусуйтеся на MVP і не розпорошуйтесь на другорядне.';

  const minutes = totalHours * 60;
  // 25% / 50% / 25% split
  const p1 = Math.round(minutes * 0.25);
  const p2 = Math.round(minutes * 0.5);
  const p3 = minutes - p1 - p2;

  const phases: Phase[] = [
    {
      id: uid('phase'),
      name: 'Фаза 1: Архітектура',
      subtitle: 'Проєктування та планування',
      durationLabel: formatDuration(p1),
      durationMinutes: p1,
      artifacts: [
        'Схема архітектури (блок-діаграма)',
        'Список ключових фіч MVP',
        'Вибір стеку технологій',
        'Макет інтерфейсу (ескіз на папері / Figma)',
      ],
      tasks: [
        { id: uid('t'), title: 'Сформулювати головну проблему і мету спринту', done: false },
        { id: uid('t'), title: 'Накидати архітектуру та потоки даних', done: false },
        { id: uid('t'), title: 'Обрати стек і підготувати робоче середовище', done: false },
        { id: uid('t'), title: 'Створити репозиторій та initial commit', done: false },
      ],
    },
    {
      id: uid('phase'),
      name: 'Фаза 2: Спринт розробки',
      subtitle: 'Кодування ядра продукту',
      durationLabel: formatDuration(p2),
      durationMinutes: p2,
      artifacts: [
        'Робочий прототип основної функції',
        'API-ендпоінти / основні модулі',
        'UI головного екрана',
        teamNote,
      ],
      tasks: [
        { id: uid('t'), title: 'Реалізувати базову структуру проєкту', done: false },
        { id: uid('t'), title: 'Побудувати основну логіку / бізнес-функцію', done: false },
        { id: uid('t'), title: 'Інтегрувати UI з логікою', done: false },
        { id: uid('t'), title: 'Прогнати демо-сценарій вручну', done: false },
      ],
    },
    {
      id: uid('phase'),
      name: 'Фаза 3: Краш-тест і реліз',
      subtitle: 'Тестування, полірування, презентація',
      durationLabel: formatDuration(p3),
      durationMinutes: p3,
      artifacts: [
        'Виправлені критичні баги',
        'Демо-сценарій для презентації',
        'README з інструкцією запуску',
        'Готовий pitch (30 секунд)',
      ],
      tasks: [
        { id: uid('t'), title: 'Протестувати ключові сценарії та зафіксувати баги', done: false },
        { id: uid('t'), title: 'Виправити критичні помилки', done: false },
        { id: uid('t'), title: 'Підготувати README та інструкцію запуску', done: false },
        { id: uid('t'), title: 'Репетувати 30-секундний pitch', done: false },
      ],
    },
  ];

  return {
    title,
    goal,
    totalHours,
    format,
    phases,
    source: 'mock',
    createdAt: Date.now(),
  };
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0 хв';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} хв`;
  if (m === 0) return `${h} год`;
  return `${h} год ${m} хв`;
}
