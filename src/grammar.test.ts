import { deepEqual, equal } from 'node:assert/strict';
import { test } from 'node:test';
import { ALL_ITEMS } from '@/data/curriculum';
import {
  GRAMMAR_LESSONS,
  LEVEL_ORDER,
  arabicIsVocalized,
  coverageReport,
  lessonByAnyId,
  nextGrammarLesson,
  placementFromAnswers,
} from '@/data/grammar';
import { restoreState, type State } from '@/state';

function ok(value: unknown, message?: string): asserts value {
  if (!value) throw new Error(message ?? 'assertion');
}

function base(): State {
  return {
    onboarded: true,
    startUnit: 1,
    settings: {
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
    },
    srs: { 'u1l1.1': { box: 2, due: '2026-04-01', ok: 3, ko: 0, last: '2026-03-01' } },
    lessons: { u1l1: { best: 1, attempts: 2, last: '2026-03-02' } },
    xp: 80,
    days: {},
    pacer: { target: 20, sessions: [] },
    tashkilBest: null,
    book: { positions: {} },
    placement: null,
  };
}

const NEED: Record<string, string[]> = {
  A1: ['alphabet', 'ism-fil-harf', 'mubtada-khabar'],
  A2: ['irab', 'kana', 'inna', 'forme-I', 'idafa', 'nat', 'nombres'],
  B1: ['formes-II-V', 'maful', 'hal', 'relatif', 'jussif-subjonctif'],
  B2: ['formes-VI-X', 'verbes-faibles', 'cinq-noms', 'tamyiz', 'istithna', 'conditionnel', 'passif'],
  C1: ['ajurrumiyya', 'qatr-alfiyya', 'balagha'],
};

test('chaque niveau A1–C1 couvre les sujets demandés', () => {
  const rows = coverageReport();
  equal(rows.map((row) => row.level).join(','), LEVEL_ORDER.join(','));
  equal(rows[0].readingUnits, 11);
  for (const row of rows) {
    ok(row.lessons >= 1, row.level);
    ok(row.items >= row.lessons * 4, row.level);
    for (const topic of NEED[row.level]) ok(row.topics.includes(topic), `${row.level} ${topic}`);
  }
  ok(rows.some((row) => row.caution > 0));
});

test('les leçons nouvelles sont vocalisées, originales, et ne réutilisent pas un id de lecture', () => {
  const reading = new Set(ALL_ITEMS.map((item) => item.id));
  const seen = new Set<string>();
  for (const lesson of GRAMMAR_LESSONS) {
    ok(!reading.has(lesson.id));
    ok(!seen.has(lesson.id));
    seen.add(lesson.id);
    ok(lesson.items.length >= 4, lesson.id);
    ok(lesson.minutes <= 5, lesson.id);
    ok(lesson.license === 'ag-original');
    if (lesson.caution) ok(lesson.tip?.fr.includes('à vérifier'), lesson.id);
    for (const item of lesson.items) {
      ok(arabicIsVocalized(item.ar), item.ar);
      ok(!reading.has(item.id));
    }
    equal(lessonByAnyId(lesson.id)?.id, lesson.id);
  }
  equal(lessonByAnyId('u1l1')?.id, 'u1l1');
});

test('le placement ne touche pas la progression déjà enregistrée', () => {
  const restored = restoreState({ xp: 80, lessons: { u1l1: { best: 1, attempts: 2, last: '2026-03-02' } } }, base());
  equal(restored.xp, 80);
  equal(restored.placement, null);
  equal(restored.lessons.u1l1?.best, 1);
  const kept = restoreState({ xp: 80, placement: 'B1', lessons: { u1l1: { best: 1, attempts: 1, last: '2026-01-01' } } }, base());
  equal(kept.placement, 'B1');
  equal(kept.lessons.u1l1?.best, 1);
  const state = base();
  const first = nextGrammarLesson(state);
  ok(first);
  equal(first?.level, 'A1');
  const later = nextGrammarLesson({ ...state, placement: 'B2', lessons: {} });
  equal(later?.level, 'B2');
});

test('huit réponses justes proposent C1, une seule erreur ramène plus bas', () => {
  const all: Record<string, number> = {};
  for (const q of ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8']) all[q] = 0;
  equal(placementFromAnswers(all), 'C1');
  equal(placementFromAnswers({ ...all, p8: 1 }), 'B2');
  equal(placementFromAnswers({}), 'A1');
  deepEqual(placementFromAnswers({ p1: 0, p2: 0 }), 'A1');
});
