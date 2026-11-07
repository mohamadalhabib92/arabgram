import { createPersistedStore, PersistReject, type PersistRecovery } from '@/kit/store';
import { isoDay } from '@/kit/format';
import { ALL_ITEMS, ITEM_BY_ID, LESSON_BY_ID, UNITS, playable, type Item, type Lesson } from '@/data/curriculum';
import { inspectLearningSnapshot, isLessonRecord, isSchedulableCard } from '@/lib/learningSnapshot';

export type UiLang = 'fr' | 'ar' | 'en';
export type Gloss = 'fr' | 'en';

export type Settings = {
  lang: UiLang;
  gloss: Gloss;
  theme: 'system' | 'light' | 'dark';
  contrast: boolean;
  textScale: number; // 0.9 → 1.5 (interface)
  arScale: number; // 0.9 → 1.8 (texte arabe), défaut 1,4× le latin
  /** Chiffres d’interface : latins ou indo-arabes. N’altère pas les clés stockées. */
  digits: 'latn' | 'arab';
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
  arScale: 1.4,
  digits: 'latn',
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

/**
 * Adoption isolée de `arabgram@v1`.
 * Profil ancien : champs manquants (ex. `digits`) prennent le défaut, le reste reste.
 * Champ inconnu : conservé sur l’objet, donc réécrit tel quel au prochain enregistrement.
 * Schéma futur, document étranger, JSON d’un autre type ou champ au mauvais type :
 * refus, pour que l’appelant ne réécrive pas le fichier.
 */
export function restoreState(saved: unknown, base: State): State {
  const found = inspectLearningSnapshot(saved, base);
  if (!found.ok) throw new PersistReject(found.reason, found.detail);
  return found.state;
}

export type LearningExport = {
  kind: 'arabgram-learning-export';
  exportedAt: string;
  storageKey: string;
  notice: string;
  recovery: { status: PersistRecovery['status']; reason?: string; detail?: string; writeFailed: boolean };
  /** Octets exacts lus au dernier chargement. Null si la clé était absente ou illisible. */
  rawSnapshot: string | null;
  /** Document vivant. Null tant que l’instantané n’est pas adopté : un profil vide n’est pas une sauvegarde. */
  current: State | null;
};

const EXPORT_NOTICE =
  'rawSnapshot = octets exacts du dernier chargement. current = document vivant seulement si ce chargement a été adopté. Si current est null, le fichier local n’a pas été remplacé : ne pas écraser la clé avec un profil vide.';

export function buildLearningExport(input: {
  exportedAt: string;
  storageKey: string;
  recovery: PersistRecovery;
  current: State | null;
}): LearningExport {
  return {
    kind: 'arabgram-learning-export',
    exportedAt: input.exportedAt,
    storageKey: input.storageKey,
    notice: EXPORT_NOTICE,
    recovery: {
      status: input.recovery.status,
      reason: input.recovery.reason,
      detail: input.recovery.detail,
      writeFailed: input.recovery.writeFailed === true,
    },
    rawSnapshot: input.recovery.raw,
    current: input.recovery.status === 'ready' ? input.current : null,
  };
}

/** Export local : instantané brut + état adopté. Aucun envoi réseau. */
export function exportLearningRecord(exportedAt = new Date().toISOString()): LearningExport {
  const recovery = store.recovery();
  return buildLearningExport({
    exportedAt,
    storageKey: store.key,
    recovery,
    current: store.get(),
  });
}

export const store = createPersistedStore<State>('arabgram', initial, 1, restoreState);

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

/** Prochaine carte. Les clés inconnues de la carte précédente sont recopiées. */
export function nextSrsCard(prev: (SrsCard & Record<string, unknown>) | undefined, ok: boolean, day: string): SrsCard & Record<string, unknown> {
  const box0 = prev && typeof prev.box === 'number' && Number.isFinite(prev.box) ? Math.trunc(prev.box) : 0;
  const ok0 = prev && typeof prev.ok === 'number' && Number.isFinite(prev.ok) ? prev.ok : 0;
  const ko0 = prev && typeof prev.ko === 'number' && Number.isFinite(prev.ko) ? prev.ko : 0;
  const box = ok ? Math.min(MAX_BOX, Math.max(1, box0 + 1)) : 1;
  const due = addDaysIso(day, LEITNER_DAYS[box] ?? 0);
  return { ...(prev ?? {}), box, due, ok: ok0 + (ok ? 1 : 0), ko: ko0 + (ok ? 0 : 1), last: day };
}

export function gradeItem(itemId: string, ok: boolean) {
  const day = today();
  store.set((s) => {
    const prev = s.srs[itemId];
    if (prev && !isSchedulableCard(prev)) return s;
    return { ...s, srs: { ...s.srs, [itemId]: nextSrsCard(prev, ok, day) } };
  });
}

export function dueItems(s: State, day = today()): Item[] {
  return Object.entries(s.srs)
    .filter(([id, c]) => isSchedulableCard(c) && c.due <= day && ITEM_BY_ID[id])
    .sort((a, b) => a[1].box - b[1].box || a[1].due.localeCompare(b[1].due))
    .map(([id]) => ITEM_BY_ID[id]);
}

export function boxCounts(s: State): number[] {
  const counts = [0, 0, 0, 0, 0, 0];
  for (const c of Object.values(s.srs)) {
    if (!isSchedulableCard(c)) continue;
    const box = Math.trunc(c.box);
    if (box >= 1 && box <= MAX_BOX) counts[box] += 1;
  }
  counts[0] = Math.max(0, ALL_ITEMS.length - Object.keys(s.srs).length);
  return counts;
}

/* ---------- XP / série ---------- */
export function addXp(n: number) {
  if (!Number.isFinite(n) || n <= 0) return;
  const day = today();
  store.set((s) => {
    if (typeof s.xp !== 'number' || !Number.isFinite(s.xp)) return s;
    const prev = s.days[day];
    if (prev !== undefined && (typeof prev !== 'number' || !Number.isFinite(prev))) return s;
    return { ...s, xp: s.xp + n, days: { ...s.days, [day]: (prev ?? 0) + n } };
  });
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
  if (!Number.isFinite(acc)) return;
  store.set((s) => {
    const prev = s.lessons[lessonId];
    if (prev && !isLessonRecord(prev)) return s;
    return {
      ...s,
      lessons: {
        ...s.lessons,
        [lessonId]: {
          ...(prev ?? {}),
          best: Math.max(prev?.best ?? 0, acc),
          attempts: (prev?.attempts ?? 0) + 1,
          last: today(),
        },
      },
    };
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
    const prev = s.pacer;
    let target = typeof prev?.target === 'number' && Number.isFinite(prev.target) ? prev.target : 20;
    if (!sess.untimed) {
      if (sess.won && sess.acc >= 0.8) target = Math.min(60, target + 5);
      else if (sess.acc < 0.6) target = Math.max(10, target - 5);
    }
    const sessions = Array.isArray(prev?.sessions) ? prev.sessions : [];
    return { ...s, pacer: { ...prev, target, sessions: [sess, ...sessions].slice(0, 50) } };
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
