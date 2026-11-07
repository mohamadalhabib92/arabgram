import type { LessonRecord, PacerSession, Settings, SrsCard, State } from '@/state';

/**
 * Lecture isolée d’un instantané `arabgram@v1`.
 * Aucune écriture : l’appelant ne bascule le document vivant que si `ok`.
 * Un champ inconnu est conservé. Un type incompatible, un schéma futur ou un
 * document étranger refuse l’adoption — le fichier ne doit pas être réécrit.
 */

export type SnapshotReason = 'not-object' | 'future-schema' | 'foreign-blob' | 'invalid-field';

export type SnapshotVerdict =
  | { ok: true; state: State }
  | { ok: false; reason: SnapshotReason; detail?: string };

const KNOWN_TOP = new Set(['onboarded', 'startUnit', 'settings', 'srs', 'lessons', 'xp', 'days', 'pacer', 'tashkilBest']);

const VERSION_KEYS = ['schemaVersion', 'formatVersion', 'envelopeVersion', 'snapshotVersion', 'version', 'schema'] as const;

const SETTING_CHECKS: Record<keyof Settings, (v: unknown) => boolean> = {
  lang: (v) => v === 'fr' || v === 'ar' || v === 'en',
  gloss: (v) => v === 'fr' || v === 'en',
  theme: (v) => v === 'system' || v === 'light' || v === 'dark',
  contrast: (v) => typeof v === 'boolean',
  textScale: finite,
  arScale: finite,
  digits: (v) => v === 'latn' || v === 'arab',
  showTranslit: (v) => typeof v === 'boolean',
  audio: (v) => typeof v === 'boolean',
  reduceMotion: (v) => typeof v === 'boolean',
  untimedPacer: (v) => typeof v === 'boolean',
  unlockAll: (v) => typeof v === 'boolean',
  dailyGoal: finite,
};

const SESSION_CHECKS: Record<keyof PacerSession, (v: unknown) => boolean> = {
  at: (v) => typeof v === 'string',
  passage: (v) => typeof v === 'string',
  wpm: finite,
  acc: finite,
  score: finite,
  target: finite,
  won: (v) => typeof v === 'boolean',
  untimed: (v) => typeof v === 'boolean',
};

function finite(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function isPlain(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function cloneMap(src: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(src)) out[key] = isPlain(value) ? { ...value } : value;
  return out;
}

/** Carte utilisable pour l’échéance et le calcul Leitner, sans réécrire les autres. */
export function isSchedulableCard(v: unknown): v is SrsCard {
  if (!isPlain(v)) return false;
  return finite(v.box) && typeof v.due === 'string' && finite(v.ok) && finite(v.ko) && typeof v.last === 'string';
}

export function inspectLearningSnapshot(saved: unknown, base: State): SnapshotVerdict {
  if (!isPlain(saved)) return { ok: false, reason: 'not-object' };
  for (const key of VERSION_KEYS) {
    if (key in saved && saved[key] !== 1) return { ok: false, reason: 'future-schema', detail: key };
  }
  const keys = Object.keys(saved);
  if (keys.length > 0 && !keys.some((key) => KNOWN_TOP.has(key))) return { ok: false, reason: 'foreign-blob' };
  const invalid = invalidPath(saved);
  if (invalid) return { ok: false, reason: 'invalid-field', detail: invalid };
  return { ok: true, state: adopt(saved, base) };
}

function invalidPath(saved: Record<string, unknown>): string | null {
  if ('onboarded' in saved && typeof saved.onboarded !== 'boolean') return 'onboarded';
  if ('startUnit' in saved && !finite(saved.startUnit)) return 'startUnit';
  if ('xp' in saved && !finite(saved.xp)) return 'xp';
  if ('tashkilBest' in saved && saved.tashkilBest !== null && !finite(saved.tashkilBest)) return 'tashkilBest';
  if ('settings' in saved) {
    if (!isPlain(saved.settings)) return 'settings';
    for (const [key, value] of Object.entries(saved.settings)) {
      const check = SETTING_CHECKS[key as keyof Settings];
      if (check && !check(value)) return `settings.${key}`;
    }
  }
  if ('srs' in saved) {
    if (!isPlain(saved.srs)) return 'srs';
    for (const [id, card] of Object.entries(saved.srs)) {
      if (!isPlain(card)) return `srs.${id}`;
      if ('box' in card && !finite(card.box)) return `srs.${id}.box`;
      if ('due' in card && typeof card.due !== 'string') return `srs.${id}.due`;
      if ('ok' in card && !finite(card.ok)) return `srs.${id}.ok`;
      if ('ko' in card && !finite(card.ko)) return `srs.${id}.ko`;
      if ('last' in card && typeof card.last !== 'string') return `srs.${id}.last`;
    }
  }
  if ('lessons' in saved) {
    if (!isPlain(saved.lessons)) return 'lessons';
    for (const [id, lesson] of Object.entries(saved.lessons)) {
      if (!isPlain(lesson)) return `lessons.${id}`;
      if ('best' in lesson && !finite(lesson.best)) return `lessons.${id}.best`;
      if ('attempts' in lesson && !finite(lesson.attempts)) return `lessons.${id}.attempts`;
      if ('last' in lesson && typeof lesson.last !== 'string') return `lessons.${id}.last`;
    }
  }
  if ('days' in saved) {
    if (!isPlain(saved.days)) return 'days';
    for (const [day, xp] of Object.entries(saved.days)) {
      if (!finite(xp)) return `days.${day}`;
    }
  }
  if ('pacer' in saved) {
    if (!isPlain(saved.pacer)) return 'pacer';
    if ('target' in saved.pacer && !finite(saved.pacer.target)) return 'pacer.target';
    if ('sessions' in saved.pacer) {
      if (!Array.isArray(saved.pacer.sessions)) return 'pacer.sessions';
      for (let i = 0; i < saved.pacer.sessions.length; i += 1) {
        const session = saved.pacer.sessions[i];
        if (!isPlain(session)) return `pacer.sessions.${i}`;
        for (const [key, value] of Object.entries(session)) {
          const check = SESSION_CHECKS[key as keyof PacerSession];
          if (check && !check(value)) return `pacer.sessions.${i}.${key}`;
        }
      }
    }
  }
  return null;
}

function adopt(saved: Record<string, unknown>, base: State): State {
  const settingsRaw = isPlain(saved.settings) ? saved.settings : {};
  const settings = { ...base.settings, ...settingsRaw } as Settings;
  const pacerRaw = isPlain(saved.pacer) ? saved.pacer : null;
  const sessions = pacerRaw && Array.isArray(pacerRaw.sessions) ? pacerRaw.sessions.map((session) => (isPlain(session) ? { ...session } : session)) : [];
  const pacer = {
    ...(pacerRaw ?? {}),
    target: pacerRaw && 'target' in pacerRaw ? (pacerRaw.target as number) : base.pacer.target,
    sessions,
  } as State['pacer'];
  const state: State = {
    onboarded: 'onboarded' in saved ? (saved.onboarded as boolean) : base.onboarded,
    startUnit: 'startUnit' in saved ? (saved.startUnit as number) : base.startUnit,
    settings,
    srs: (isPlain(saved.srs) ? cloneMap(saved.srs) : {}) as State['srs'],
    lessons: (isPlain(saved.lessons) ? cloneMap(saved.lessons) : {}) as State['lessons'],
    xp: 'xp' in saved ? (saved.xp as number) : base.xp,
    days: (isPlain(saved.days) ? { ...saved.days } : {}) as State['days'],
    pacer,
    tashkilBest: 'tashkilBest' in saved ? (saved.tashkilBest as number | null) : base.tashkilBest,
  };
  const carried = state as State & Record<string, unknown>;
  for (const key of Object.keys(saved)) {
    if (!KNOWN_TOP.has(key)) carried[key] = saved[key];
  }
  return state;
}

export function isLessonRecord(v: unknown): v is LessonRecord {
  if (!isPlain(v)) return false;
  return finite(v.best) && finite(v.attempts) && typeof v.last === 'string';
}
