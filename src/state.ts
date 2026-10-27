import { createPersistedStore } from '@/kit/store';
import { isoDay } from '@/kit/format';
import { ALL_ITEMS, ITEM_BY_ID, LESSON_BY_ID, UNITS, playable, type Item, type Lesson } from '@/data/curriculum';

export type UiLang = 'fr' | 'ar' | 'en';
export type Gloss = 'fr' | 'en';

export type Settings = {
  lang: UiLang;
  gloss: Gloss;
  theme: 'system' | 'light' | 'dark';
  contrast: boolean;
  textScale: number; // 0.9 → 1.5 (interface)
  arScale: number; // 0.9 → 1.8 (texte arabe)
  showTranslit: boolean;
  audio: boolean;
  reduceMotion: boolean;
  untimedPacer: boolean;
  unlockAll: boolean;
  dailyGoal: number; // XP / jour
};

export type SrsCard = { box: number; due: string; ok: number; ko: number; last: string };
export type LessonRecord = { best: number; attempts: number; last: string };
export type PacerSession = { at: string; passage: string; wpm: number; acc: number; score: number; target: number; won: boolean; untimed: boolean };

export type State = {
  onboarded: boolean;
  startUnit: number;
  settings: Settings;
  srs: Record<string, SrsCard>;
  lessons: Record<string, LessonRecord>;
  xp: number;
  days: Record<string, number>; // isoDay → XP gagnés ce jour
  pacer: { target: number; sessions: PacerSession[] };
  tashkilBest: number | null;
};

export const DEFAULT_SETTINGS: Settings = {
  lang: 'fr',
  gloss: 'fr',
  theme: 'system',
  contrast: false,
  textScale: 1,
  arScale: 1.2,
  showTranslit: true,
  audio: true,
  reduceMotion: false,
  untimedPacer: false,
  unlockAll: false,
  dailyGoal: 50,
};

const initial = (): State => ({
  onboarded: false,
  startUnit: 1,
  settings: { ...DEFAULT_SETTINGS },
  srs: {},
  lessons: {},
  xp: 0,
  days: {},
  pacer: { target: 20, sessions: [] },
  tashkilBest: null,
});

export const store = createPersistedStore<State>('arabgram', initial, 1);

/* ---------- Réglages ---------- */
export function setSettings(patch: Partial<Settings>) {
  store.set((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

/* ---------- Dates ---------- */
export const today = () => isoDay(new Date());
export function addDaysIso(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return isoDay(dt);
}

/* ---------- Leitner (5 boîtes) ---------- */
/** Intervalle (jours) avant la prochaine révision selon la boîte atteinte. */
export const LEITNER_DAYS = [0, 0, 1, 3, 7, 16];
export const MAX_BOX = 5;

export function gradeItem(itemId: string, ok: boolean) {
  const day = today();
  store.set((s) => {
    const prev = s.srs[itemId] ?? { box: 0, due: day, ok: 0, ko: 0, last: day };
    const box = ok ? Math.min(MAX_BOX, Math.max(1, prev.box + 1)) : 1;
    const due = addDaysIso(day, LEITNER_DAYS[box]);
    return { ...s, srs: { ...s.srs, [itemId]: { box, due, ok: prev.ok + (ok ? 1 : 0), ko: prev.ko + (ok ? 0 : 1), last: day } } };
  });
}

export function dueItems(s: State, day = today()): Item[] {
  return Object.entries(s.srs)
    .filter(([id, c]) => c.due <= day && ITEM_BY_ID[id])
    .sort((a, b) => a[1].box - b[1].box || a[1].due.localeCompare(b[1].due))
    .map(([id]) => ITEM_BY_ID[id]);
}

export function boxCounts(s: State): number[] {
  const counts = [0, 0, 0, 0, 0, 0];
  for (const c of Object.values(s.srs)) counts[c.box] += 1;
  counts[0] = ALL_ITEMS.length - Object.keys(s.srs).length;
  return counts;
}

/* ---------- XP / série ---------- */
export function addXp(n: number) {
  if (n <= 0) return;
  const day = today();
  store.set((s) => ({ ...s, xp: s.xp + n, days: { ...s.days, [day]: (s.days[day] ?? 0) + n } }));
}

export function streak(s: State): number {
  let n = 0;
  let day = today();
  if (!s.days[day]) day = addDaysIso(day, -1); // la série n’est pas perdue avant la fin de la journée
  while (s.days[day]) {
    n += 1;
    day = addDaysIso(day, -1);
  }
  return n;
}

/* ---------- Leçons et unités ---------- */
export const PASS = 0.6;

export function recordLesson(lessonId: string, acc: number) {
  store.set((s) => {
    const prev = s.lessons[lessonId];
    return { ...s, lessons: { ...s.lessons, [lessonId]: { best: Math.max(prev?.best ?? 0, acc), attempts: (prev?.attempts ?? 0) + 1, last: today() } } };
  });
}

export const lessonDone = (s: State, l: Lesson) => (s.lessons[l.id]?.best ?? 0) >= PASS;

export function unitProgress(s: State, unitId: number): number {
  const u = UNITS.find((x) => x.id === unitId);
  if (!u) return 0;
  const ls = u.lessons.filter(playable);
  if (!ls.length) return 0;
  return ls.filter((l) => lessonDone(s, l)).length / ls.length;
}

export function unitUnlocked(s: State, unitId: number): boolean {
  if (unitId <= 1 || s.settings.unlockAll || unitId <= s.startUnit) return true;
  return unitProgress(s, unitId - 1) >= 1;
}

/** Prochaine leçon recommandée (première non terminée d’une unité ouverte). */
export function nextLesson(s: State): Lesson | null {
  for (const u of UNITS) {
    if (!unitUnlocked(s, u.id)) break;
    for (const l of u.lessons) if (playable(l) && !lessonDone(s, l)) return l;
  }
  return null;
}

/* ---------- Course « سباق المرشد » ---------- */
export function recordPacer(sess: PacerSession) {
  store.set((s) => {
    let target = s.pacer.target;
    if (!sess.untimed) {
      if (sess.won && sess.acc >= 0.8) target = Math.min(60, target + 5);
      else if (sess.acc < 0.6) target = Math.max(10, target - 5);
    }
    return { ...s, pacer: { target, sessions: [sess, ...s.pacer.sessions].slice(0, 50) } };
  });
}

export function finishOnboarding(opts: { lang: UiLang; startUnit: number; dailyGoal: number }) {
  store.set((s) => ({
    ...s,
    onboarded: true,
    startUnit: opts.startUnit,
    settings: { ...s.settings, lang: opts.lang, gloss: opts.lang === 'en' ? 'en' : 'fr', dailyGoal: opts.dailyGoal },
  }));
}

export const lessonById = (id: string) => LESSON_BY_ID[id];
