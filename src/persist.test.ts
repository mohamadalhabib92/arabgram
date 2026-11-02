import { deepEqual, equal } from 'node:assert/strict';
import { test } from 'node:test';
import { formatDigits } from '@/kit/format';
import { createPersistedStore, type KvStorage } from '@/kit/store';
import { restoreState, type State } from '@/state';

/** Profil d’avant le champ `digits` : tout doit revenir, rien n’est vidé. */
const oldProfile = {
  onboarded: true,
  startUnit: 5,
  settings: {
    lang: 'ar',
    gloss: 'fr',
    theme: 'dark',
    contrast: true,
    textScale: 1.3,
    arScale: 1.2,
    showTranslit: false,
    audio: true,
    reduceMotion: true,
    untimedPacer: true,
    unlockAll: true,
    dailyGoal: 80,
  },
  srs: { 'u1l1.1': { box: 3, due: '2026-04-01', ok: 4, ko: 1, last: '2026-03-01' } },
  lessons: { u1l1: { best: 1, attempts: 2, last: '2026-03-02' } },
  xp: 420,
  days: { '2026-03-02': 40 },
  pacer: {
    target: 35,
    sessions: [{ at: '2026-03-02T12:00:00.000Z', passage: 'p1', wpm: 30, acc: 0.9, score: 27, target: 30, won: true, untimed: false }],
  },
  tashkilBest: 8,
};

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
  };
}

function memory() {
  const mem = new Map<string, string>();
  const writes: string[] = [];
  const storage: KvStorage = {
    async getItem(key) {
      return mem.has(key) ? (mem.get(key) as string) : null;
    },
    async setItem(key, value) {
      writes.push(value);
      mem.set(key, value);
    },
    async removeItem(key) {
      mem.delete(key);
    },
  };
  return { mem, writes, storage };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test('restoreState garde un ancien profil complet', () => {
  const restored = restoreState(oldProfile, base());
  equal(restored.onboarded, true);
  equal(restored.startUnit, 5);
  equal(restored.xp, 420);
  equal(restored.tashkilBest, 8);
  equal(restored.settings.lang, 'ar');
  equal(restored.settings.arScale, 1.2);
  equal(restored.settings.dailyGoal, 80);
  equal(restored.settings.digits, 'latn');
  deepEqual(restored.srs, oldProfile.srs);
  deepEqual(restored.lessons, oldProfile.lessons);
  deepEqual(restored.days, oldProfile.days);
  equal(restored.pacer.target, 35);
  equal(restored.pacer.sessions[0]?.score, 27);
  equal(restored.pacer.sessions[0]?.passage, 'p1');
});

test('aucune écriture tant que le chargement n’a pas abouti', async () => {
  const disk = memory();
  const saved = JSON.stringify(oldProfile);
  disk.mem.set('demo@v1', saved);
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const storage: KvStorage = {
    async getItem(key) {
      await gate;
      return disk.storage.getItem(key);
    },
    setItem: (key, value) => disk.storage.setItem(key, value),
    removeItem: (key) => disk.storage.removeItem(key),
  };
  const store = createPersistedStore('demo', base, 1, restoreState, storage);
  const pending = store.hydrate();
  store.set(base());
  await wait(220);
  equal(disk.writes.length, 0);
  equal(disk.mem.get('demo@v1'), saved);
  release();
  await pending;
  equal(store.get().xp, 420);
  equal(store.get().srs['u1l1.1']?.box, 3);
  equal(store.get().lessons.u1l1?.attempts, 2);
  await wait(220);
  const onDisk = JSON.parse(disk.mem.get('demo@v1') as string) as State;
  equal(onDisk.xp, 420);
  equal(onDisk.srs['u1l1.1']?.ok, 4);
  equal(onDisk.pacer.sessions[0]?.wpm, 30);
  equal(onDisk.tashkilBest, 8);
  equal(onDisk.settings.lang, 'ar');
});

test('l’écriture reprend seulement si le chargement confirme qu’il n’y a rien', async () => {
  const disk = memory();
  const store = createPersistedStore('demo', base, 1, restoreState, disk.storage);
  const pending = store.hydrate();
  store.set({ ...base(), xp: 7, onboarded: true });
  await wait(50);
  equal(disk.writes.length, 0);
  await pending;
  await wait(220);
  equal(JSON.parse(disk.mem.get('demo@v1') as string).xp, 7);
});

test('un fichier illisible n’est pas remplacé par l’état vide', async () => {
  const disk = memory();
  disk.mem.set('demo@v1', '{not json');
  const store = createPersistedStore('demo', base, 1, restoreState, disk.storage);
  await store.hydrate();
  store.set(base());
  await wait(220);
  equal(disk.mem.get('demo@v1'), '{not json');
  equal(disk.writes.length, 0);
});

test('formatDigits ne touche pas aux identifiants', () => {
  equal(formatDigits('u11l3, u1l2', 'arab'), 'u11l3, u1l2');
  equal(formatDigits('Leçons (2) : u11l3', 'arab'), 'Leçons (٢) : u11l3');
  equal(formatDigits('12 XP', 'arab'), '١٢ XP');
  equal(formatDigits('0/2', 'arab'), '٠/٢');
  equal(formatDigits('u11l3', 'latn'), 'u11l3');
});
