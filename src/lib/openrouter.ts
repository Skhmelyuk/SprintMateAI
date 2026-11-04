import type { Phase, SprintFormat, SprintPlan } from '@/types';
import { generateMockPlan, formatDuration } from './mockGenerator';

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const SYSTEM_PROMPT = `Ти — досвідчений фасилітатор стартап-хакатонів і ментор з продуктового спринту. Твоя задача — декомпозувати навчальний хакатон-спринт на 3 чіткі фази:
1. "Фаза 1: Архітектура" — проєктування, планування, вибір стеку.
2. "Фаза 2: Спринт розробки" — кодування ядра продукту.
3. "Фаза 3: Краш-тест і реліз" — тестування, полірування, презентація.

Для кожної фази видай: назву, короткий підзаголовок, тривалість у хвилинах (сума має дорівнювати загальній тривалості спринту), список з 3-4 артефактів і 3-4 конкретні задачі-чекбокси.

Поверни СТРОГО валідний JSON без markdown-обгортки у такому форматі:
{
  "goal": "коротко сформульована мета",
  "phases": [
    {
      "name": "Фаза 1: Архітектура",
      "subtitle": "...",
      "durationMinutes": число,
      "artifacts": ["...", "..."],
      "tasks": ["...", "..."]
    }
  ]
}`;

interface AIResponse {
  goal: string;
  phases: Array<{
    name: string;
    subtitle: string;
    durationMinutes: number;
    artifacts: string[];
    tasks: string[];
  }>;
}

export async function generatePlan(
  title: string,
  goalHint: string,
  totalHours: number,
  format: SprintFormat,
  apiKey: string,
  model: string,
  useMock: boolean,
): Promise<SprintPlan> {
  if (useMock || !apiKey) {
    await fakeDelay();
    return generateMockPlan(title, goalHint, totalHours, format);
  }

  try {
    const userPrompt = `Назва спринту: ${title}
Мета: ${goalHint || title}
Тривалість: ${totalHours} годин
Формат: ${format === 'solo' ? 'Соло-розробка' : 'Командний спринт (2-3 людини)'}

Згенеруй план на ${totalHours * 60} хвилин, розподілений між 3 фазами. Усе українською мовою.`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Title': 'SprintMate AI',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenRouter ${res.status}`);
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';

    const parsed = parseAIResponse(content);

    const phases: Phase[] = parsed.phases.map((p) => ({
      id: uid('phase'),
      name: p.name,
      subtitle: p.subtitle,
      durationLabel: formatDuration(p.durationMinutes),
      durationMinutes: p.durationMinutes,
      artifacts: p.artifacts,
      tasks: p.tasks.map((t) => ({ id: uid('t'), title: t, done: false })),
    }));

    return {
      title,
      goal: parsed.goal || goalHint || title,
      totalHours,
      format,
      phases,
      source: 'openrouter',
      createdAt: Date.now(),
    };
  } catch (err) {
    // Graceful fallback to mock on any network/parse error
    console.warn('OpenRouter generation failed, falling back to mock:', err);
    await fakeDelay();
    return generateMockPlan(title, goalHint, totalHours, format);
  }
}

function parseAIResponse(content: string): AIResponse {
  // Try to extract JSON from the content (model may wrap in markdown despite instructions)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : content;
  const parsed = JSON.parse(jsonStr) as AIResponse;

  if (!parsed.phases || !Array.isArray(parsed.phases)) {
    throw new Error('Invalid AI response structure');
  }

  return parsed;
}

function fakeDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1400));
}
