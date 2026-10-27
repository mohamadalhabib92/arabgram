import { ALL_ITEMS, lessonOfItem, type Item } from '@/data/curriculum';
import type { Gloss } from '@/state';

export type QKind = 'ar2gloss' | 'gloss2ar' | 'ar2tr';
export type Question = { id: string; item: Item; kind: QKind; options: string[]; answer: string; retry?: boolean };

export function shuffle<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

const field = (it: Item, kind: QKind, gloss: Gloss) => (kind === 'ar2gloss' ? it[gloss] : kind === 'gloss2ar' ? it.ar : it.tr);

/** Distracteurs : d’abord la même leçon, puis le même type d’élément ailleurs. */
function distractors(it: Item, kind: QKind, gloss: Gloss, n: number): string[] {
  const answer = field(it, kind, gloss);
  const lesson = lessonOfItem(it.id);
  const pool = [...shuffle(lesson?.items ?? []), ...shuffle(ALL_ITEMS.filter((x) => x.kind === it.kind))];
  const out: string[] = [];
  for (const x of pool) {
    const v = field(x, kind, gloss);
    if (v !== answer && !out.includes(v)) out.push(v);
    if (out.length >= n) break;
  }
  return out;
}

export function makeQuestion(it: Item, gloss: Gloss, idx: number, kind?: QKind): Question {
  const kinds: QKind[] = ['ar2gloss', 'gloss2ar', 'ar2tr'];
  const k = kind ?? kinds[idx % kinds.length];
  const answer = field(it, k, gloss);
  return { id: `${it.id}#${idx}`, item: it, kind: k, answer, options: shuffle([answer, ...distractors(it, k, gloss, 3)]) };
}

export function buildDrill(items: Item[], gloss: Gloss, max = 12): Question[] {
  const picked = items.slice(0, max);
  // Ordre : on présente chaque élément, types alternés, en mélangeant légèrement.
  return shuffle(picked).map((it, i) => makeQuestion(it, gloss, i));
}
