import { deepEqual, equal } from 'node:assert/strict';
import { test } from 'node:test';
import { arabicRunStyle, isolateArabic } from '@/lib/arabicRun';
import { distinctLetter, buildFormDrill } from '@/lib/formsDrill';
import { appendCheck, choiceSet, latestForUnit, parseFluency, readingList, readingScore, saveFluencyCheck, FLUENCY_KEY, type FluencyRecord } from '@/lib/fluency';

test('lecture : seulement les mots, vitesse et précision, plafond d’historique', () => {
  const items = [
    { id: 'a', ar: 'ب', gloss: 'b', kind: 'letter' },
    { id: 'b', ar: 'بَيْت', gloss: 'maison', kind: 'word' },
    { id: 'c', ar: 'كِتَاب', gloss: 'livre', kind: 'word' },
    { id: 'd', ar: 'قَلَم', gloss: 'crayon', kind: 'word' },
    { id: 'e', ar: 'هٰذَا بَيْتٌ', gloss: 'voici une maison', kind: 'phrase' },
  ];
  const list = readingList(items, 3);
  deepEqual(list.map((item) => item.id), ['b', 'c', 'd']);
  deepEqual(choiceSet(list, 0), ['maison', 'livre', 'crayon']);
  equal(readingScore({ words: 8, correct: 6, elapsedMs: 30000 }).wpm, 16);
  equal(readingScore({ words: 8, correct: 6, elapsedMs: 30000 }).accuracy, 0.75);
  equal(readingScore({ words: 8, correct: 9, elapsedMs: 100 }).wpm, 480);
  equal(readingScore({ words: 0, correct: 0, elapsedMs: 5000 }).wpm, 0);
});

test('fluidité : clé dédiée, profil intact, fichier illisible ignoré', async () => {
  const mem = new Map<string, string>([['arabgram@v1', '{"xp":4}']]);
  const writes: string[] = [];
  const storage = {
    getItem: async (key: string) => mem.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      writes.push(key);
      mem.set(key, value);
    },
  };
  const rec: FluencyRecord = { unitId: 2, at: '2026-11-23T00:00:00.000Z', words: 4, correct: 3, elapsedMs: 20000, wpm: 12, accuracy: 0.75 };
  const saved = await saveFluencyCheck(storage, FLUENCY_KEY, rec);
  equal(saved.checks.length, 1);
  equal(mem.get('arabgram@v1'), '{"xp":4}');
  equal(writes.every((key) => key === FLUENCY_KEY), true);
  equal(latestForUnit(parseFluency(mem.get(FLUENCY_KEY)), 2)?.wpm, 12);
  equal(parseFluency('non json').checks.length, 0);
  equal(parseFluency('{"xp":1}').checks.length, 0);
  const capped = appendCheck({ checks: Array.from({ length: 40 }, (_, i) => ({ ...rec, unitId: i })) }, { ...rec, unitId: 99 }, 40);
  equal(capped.checks.length, 40);
  equal(capped.checks[0].unitId, 1);
  equal(capped.checks[39].unitId, 99);
});

test('formes : les non liantes sont écartées, les quatre places restent distinctes', () => {
  equal(distinctLetter('ا'), false);
  equal(distinctLetter('ب'), true);
  const drill = buildFormDrill(['ا', 'ب', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د']);
  equal(drill.length, 6);
  equal(drill[0].letter, 'ب');
  equal(drill.some((q) => q.letter === 'ا' || q.letter === 'د'), false);
  equal(new Set(drill.map((q) => q.glyph)).size, drill.length);
  equal(drill.every((q) => q.glyph.length > 0 && ['isolated', 'initial', 'medial', 'final'].includes(q.answer)), true);
});

test('arabe : isolat RTL et alignement qui ne cède pas à la gauche', () => {
  equal(isolateArabic('بَيْت'), '\u2067بَيْت\u2069');
  equal(isolateArabic('\u2067بَيْت\u2069'), '\u2067بَيْت\u2069');
  equal(arabicRunStyle(false).textAlign, 'right');
  equal(arabicRunStyle(false).writingDirection, 'rtl');
  equal(arabicRunStyle(true).textAlign, 'center');
});
