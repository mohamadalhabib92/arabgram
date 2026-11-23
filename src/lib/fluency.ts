/**
 * Lecture courte d’une unité : mots déjà présents, vitesse et précision.
 * Historique sous une clé neuve. `arabgram@v1` n’est ni lu ni écrit.
 */
export const FLUENCY_KEY = 'arabgram:fluency@v1';
export const READ_LENGTH = 8;
export const FLUENCY_CAP = 40;

export type ReadItem = { id: string; ar: string; gloss: string; kind: string };

export type FluencyRecord = {
  unitId: number;
  at: string;
  words: number;
  correct: number;
  elapsedMs: number;
  wpm: number;
  accuracy: number;
};

export type FluencyLog = { checks: FluencyRecord[] };

const EMPTY: FluencyLog = { checks: [] };

export function readingList(items: ReadItem[], max = READ_LENGTH): ReadItem[] {
  return items.filter((item) => item.kind === 'word' || item.kind === 'phrase').slice(0, max);
}

/** Trois choix au plus : la glose juste, puis les suivantes de la liste, sans doublon. */
export function choiceSet(list: ReadItem[], index: number): string[] {
  const answer = list[index]?.gloss ?? '';
  const rest: string[] = [];
  for (const item of list) {
    if (item.gloss === answer || rest.includes(item.gloss)) continue;
    rest.push(item.gloss);
    if (rest.length >= 2) break;
  }
  return answer ? [answer, ...rest] : rest;
}

/** Mots par minute et part de réponses justes. Moins d’une seconde compte comme une seconde. */
export function readingScore(input: { words: number; correct: number; elapsedMs: number }): { wpm: number; accuracy: number } {
  if (input.words <= 0) return { wpm: 0, accuracy: 0 };
  const ms = Math.max(0, input.elapsedMs);
  const minutes = Math.max(ms, 1000) / 60000;
  const correct = Math.max(0, Math.min(input.words, input.correct));
  return { wpm: Math.round(input.words / minutes), accuracy: correct / input.words };
}

function isRecord(v: unknown): v is FluencyRecord {
  if (!v || typeof v !== 'object') return false;
  const r = v as FluencyRecord;
  return Number.isFinite(r.unitId) && typeof r.at === 'string' && Number.isFinite(r.words) && Number.isFinite(r.correct) && Number.isFinite(r.elapsedMs) && Number.isFinite(r.wpm) && typeof r.accuracy === 'number' && r.accuracy >= 0 && r.accuracy <= 1;
}

export function parseFluency(raw: string | null | undefined): FluencyLog {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as { checks?: unknown };
    if (!data || typeof data !== 'object' || !Array.isArray(data.checks)) return EMPTY;
    return { checks: data.checks.filter(isRecord) };
  } catch {
    return EMPTY;
  }
}

export function appendCheck(log: FluencyLog, rec: FluencyRecord, cap = FLUENCY_CAP): FluencyLog {
  return { checks: [...log.checks, rec].slice(-cap) };
}

export function latestForUnit(log: FluencyLog, unitId: number): FluencyRecord | null {
  for (let i = log.checks.length - 1; i >= 0; i--) {
    if (log.checks[i].unitId === unitId) return log.checks[i];
  }
  return null;
}

export async function saveFluencyCheck(
  storage: { getItem: (key: string) => Promise<string | null>; setItem: (key: string, value: string) => Promise<void> },
  key: string,
  rec: FluencyRecord,
): Promise<FluencyLog> {
  const next = appendCheck(parseFluency(await storage.getItem(key)), rec);
  await storage.setItem(key, JSON.stringify(next));
  return next;
}
