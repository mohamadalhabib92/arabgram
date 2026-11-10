import { deepEqual, equal } from 'node:assert/strict';

function ok(value: unknown, message?: string): asserts value {
  if (!value) throw new Error(message ?? 'assertion');
}

function throws(fn: () => unknown, ctor: new (...args: never[]) => Error) {
  try {
    fn();
  } catch (error) {
    if (error instanceof ctor) return;
    throw error;
  }
  throw new Error('expected throw');
}
import { test } from 'node:test';
import { ITEM_BY_ID, UNITS, letterForms } from '@/data/curriculum';
import { PASSAGES } from '@/data/passages';
import { MARKS } from '@/data/tashkil';
import {
  CREDITS_SOURCES,
  EMPTY_SLOT_NOTE,
  FORMS_NOTE,
  MOON_MNEMONIC,
  SUN_LETTERS,
  UNICODE_BIDI,
  UNICODE_SHAPING,
  bookPart,
  bookParts,
  chapterForUnit,
  collectText,
  nextBook,
  referencedItemIds,
  resolveSection,
  runs,
  runsToText,
  type Block,
} from '@/data/book';
import { LEITNER_DAYS, restoreState, type State } from '@/state';
import { PersistReject } from '@/kit/store';

function base(): State {
  return {
    onboarded: false,
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
    srs: {},
    lessons: {},
    xp: 0,
    days: {},
    pacer: { target: 20, sessions: [] },
    tashkilBest: null,
    book: { positions: {} },
  };
}

function blocks(partId: string): Block[] {
  return bookPart(partId)?.sections.flatMap((section) => section.blocks) ?? [];
}

test('le livre a la méthode, six chapitres et les pages de fin', () => {
  const parts = bookParts();
  equal(parts.map((part) => part.id).join(','), 'method,ch1,ch2,ch3,ch4,ch5,ch6,recap,glossary,answers,app,credits');
  const ids = parts.flatMap((part) => part.sections.map((section) => `${part.id}:${section.id}`));
  equal(new Set(ids).size, ids.length);
});

test('chaque chapitre pointe vers les unités de l’app, et l’inverse', () => {
  deepEqual(bookPart('ch1')?.unitIds, [1, 2]);
  deepEqual(bookPart('ch2')?.unitIds, [3, 4]);
  deepEqual(bookPart('ch3')?.unitIds, [5, 6]);
  deepEqual(bookPart('ch4')?.unitIds, [7, 8]);
  deepEqual(bookPart('ch5')?.unitIds, [9, 10]);
  deepEqual(bookPart('ch6')?.unitIds, [11]);
  for (const unit of UNITS) equal(chapterForUnit(unit.id)?.id, `ch${unit.id <= 2 ? 1 : unit.id <= 4 ? 2 : unit.id <= 6 ? 3 : unit.id <= 8 ? 4 : unit.id <= 10 ? 5 : 6}`);
});

test('les mots du chapitre viennent du curriculum, pas d’une copie', () => {
  for (const part of bookParts().filter((entry) => entry.group === 'chapitre')) {
    const ids = new Set(referencedItemIds(part));
    for (const unitId of part.unitIds) {
      const unit = UNITS.find((entry) => entry.id === unitId)!;
      for (const lesson of unit.lessons) {
        if (lesson.id === 'u11l3') {
          equal(lesson.items.length, 0);
          ok(!ids.has('u11l3'));
          continue;
        }
        for (const item of lesson.items) {
          if (item.kind === 'letter') continue;
          ok(ids.has(item.id), `${item.id} absent de ${part.id}`);
          equal(ITEM_BY_ID[item.id].ar, item.ar);
        }
      }
    }
  }
  ok(collectText(bookPart('ch6')!).includes(EMPTY_SLOT_NOTE));
});

test('les quatre formes suivent letterForms, y compris les non liantes', () => {
  const letters = blocks('ch1').concat(blocks('ch2')).flatMap((block) => (block.kind === 'forms' ? block.letters : []));
  equal(letters.length, 28);
  equal(new Set(letters).size, 28);
  for (const letter of letters) {
    const forms = letterForms(letter);
    const inBook = forms.initial === forms.isolated ? 'non liante' : 'se lie des deux côtés';
    ok(inBook === 'non liante' || inBook === 'se lie des deux côtés');
  }
  for (const letter of ['ا', 'د', 'ذ', 'ر', 'ز', 'و']) {
    const forms = letterForms(letter);
    equal(forms.initial, forms.isolated);
    ok(forms.final.startsWith('ـ'));
  }
  ok(collectText(bookPart('ch1')!).includes(FORMS_NOTE));
  ok(collectText(bookPart('ch1')!).includes(UNICODE_SHAPING));
});

test('le quiz du chapitre 1 est celui du PDF', () => {
  const quiz = blocks('ch1').find((block) => block.kind === 'quiz');
  ok(quiz && quiz.kind === 'quiz');
  if (quiz?.kind !== 'quiz') return;
  equal(quiz.questions.length, 4);
  const first = quiz.questions[0];
  equal(runsToText(first.prompt), 'Que signifie تُوت ?');
  deepEqual(first.options.map((option) => runsToText(option.runs)), ['lait', 'mûres', 'demeure']);
  equal(first.answer, 1);
  equal(runsToText(first.explain), 'تُوت se lit tūt et signifie « mûres ».');
  for (const part of ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6']) {
    const block = blocks(part).find((entry) => entry.kind === 'quiz');
    ok(block && block.kind === 'quiz');
    if (block?.kind !== 'quiz') continue;
    for (const question of block.questions) {
      ok(question.answer >= 0 && question.answer < question.options.length);
      ok(question.options.length === 3);
    }
  }
});

test('les exercices révèlent une réponse reliée au curriculum', () => {
  const reveals = blocks('ch4').filter((block) => block.kind === 'reveal');
  equal(reveals.length, 2);
  for (const block of reveals) {
    if (block.kind !== 'reveal') continue;
    ok(block.lines.length >= 4);
    for (const line of block.lines) {
      const answer = runsToText(line.answer);
      ok(answer.includes('—') || answer.includes('='));
    }
  }
});

test('signes, paires, passages et Leitner restent ceux de l’app', () => {
  ok(blocks('ch3').some((block) => block.kind === 'marks'));
  ok(blocks('ch3').some((block) => block.kind === 'pairs'));
  equal(MARKS.length, 8);
  const passageIds = blocks('ch6').flatMap((block) => (block.kind === 'passages' ? block.ids : []));
  deepEqual(passageIds, ['p1', 'p2', 'p3', 'p4']);
  for (const id of passageIds) ok(PASSAGES.some((passage) => passage.id === id));
  const method = collectText(bookPart('method')!);
  ok(method.includes('0, 1, 3, 7 et 16'));
  equal(LEITNER_DAYS.slice(1).join(', '), '0, 1, 3, 7, 16');
  ok(method.includes('Boîte 1'));
  ok(method.includes('16 jours'));
});

test('les crédits et les sources de l’ebook sont repris tels quels', () => {
  const text = collectText(bookPart('credits')!);
  ok(text.includes('Mohamed El Habib Ba (Vaud, Suisse)'));
  ok(text.includes('main (commit b699d3f)'));
  ok(text.includes('l’app propose aussi l’audio et un tuteur IA (phase 2, non actif)'));
  ok(text.includes('© 2026 Mohamed El Habib Ba'));
  for (const source of CREDITS_SOURCES) ok(text.includes(source), source.slice(0, 40));
  const sun = collectText(bookPart('ch6')!);
  ok(sun.includes(SUN_LETTERS));
  ok(sun.includes(MOON_MNEMONIC));
  ok(sun.includes(UNICODE_BIDI) || collectText(bookPart('ch5')!).includes(UNICODE_BIDI));
});

test('les pages papier ont un renvoi vers le PDF', () => {
  const paper = bookParts().flatMap((part) => part.sections.filter((section) => section.paper));
  ok(paper.length >= 8);
  for (const section of paper) {
    ok(section.blocks.some((block) => block.kind === 'pdf'), section.id);
  }
  const ids = paper.map((section) => section.id);
  ok(ids.includes('leitner'));
  ok(ids.includes('ch1-trace'));
  ok(ids.includes('ch2-mmblank'));
});

test('la position de lecture est additive et ne remplace pas le profil', () => {
  const saved = {
    xp: 12,
    deviceNote: 'keep-me',
    srs: { 'u1l1.1': { box: 2, due: '2026-01-01', ok: 1, ko: 0, last: '2026-01-01', source: 'manual' } },
    book: { positions: { ch1: 'ch1-letters' }, margin: true },
  };
  const state = restoreState(saved, base());
  equal(state.xp, 12);
  equal((state as State & { deviceNote?: string }).deviceNote, 'keep-me');
  equal(state.book.positions.ch1, 'ch1-letters');
  equal((state.book as { margin?: boolean }).margin, true);
  equal(state.srs['u1l1.1']?.box, 2);

  const fresh = restoreState({ xp: 4, onboarded: true }, base());
  deepEqual(fresh.book.positions, {});
  equal(fresh.xp, 4);
  equal(fresh.onboarded, true);

  throws(() => restoreState({ xp: 1, book: [] }, base()), PersistReject);
  throws(() => restoreState({ xp: 1, book: { positions: { ch1: 2 } } }, base()), PersistReject);

  const moved = nextBook({ ...state.book, positions: { ...state.book.positions } }, 'ch1', 'ch1-quiz');
  ok(moved);
  equal(moved?.recent, 'ch1');
  equal(moved?.positions.ch1, 'ch1-quiz');
  equal(moved?.positions['ch1'] && (state.book as { margin?: boolean }).margin, true);
  equal(nextBook(state.book, 'ch1', 'nope'), null);
  equal(resolveSection(bookPart('ch2')!, 'missing'), 'ch2');
  equal(resolveSection(bookPart('ch2')!, 'ch2-forms'), 'ch2-forms');
});

test('les segments arabes sont isolés pour le rendu RTL', () => {
  const list = runs('Le mot بَيْت veut dire maison.');
  deepEqual(list.map((run) => run.ar === true), [false, true, false]);
  equal(runsToText(list), 'Le mot بَيْت veut dire maison.');
});
