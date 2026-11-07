import { deepEqual, equal } from 'node:assert/strict';
import { test } from 'node:test';
import { formatDigits } from '@/kit/format';
import { createPersistedStore, type KvStorage } from '@/kit/store';
import { inspectLearningSnapshot, isSchedulableCard } from '@/lib/learningSnapshot';
import { boxCounts, buildLearningExport, dueItems, nextSrsCard, restoreState, type State } from '@/state';

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

/**
 * Ces cas tournent sur un stockage en mémoire.
 * Ils ne simulent pas une sauvegarde iOS/Android ni une restauration d’appareil.
 * Le passage en service reste bloqué tant que cette restauration isolée n’a pas réussi.
 */
async function unchanged(raw: string, reason: string) {
  const disk = memory();
  let removes = 0;
  disk.mem.set('demo@v1', raw);
  const storage: KvStorage = {
    getItem: (key) => disk.storage.getItem(key),
    setItem: (key, value) => disk.storage.setItem(key, value),
    async removeItem(key) {
      removes += 1;
      await disk.storage.removeItem(key);
    },
  };
  const store = createPersistedStore('demo', base, 1, restoreState, storage);
  const pending = store.hydrate();
  store.set((s) => ({ ...s, xp: (typeof s.xp === 'number' ? s.xp : 0) + 5 }));
  await pending;
  await wait(300);
  equal(disk.mem.get('demo@v1'), raw);
  equal(disk.writes.length, 0);
  equal(removes, 0);
  equal(store.recovery().status, 'quarantine');
  equal(store.recovery().reason, reason);
  equal(store.recovery().raw, raw);
  equal(store.get().xp, 0);
  const exported = buildLearningExport({
    exportedAt: '2026-11-07T00:00:00.000Z',
    storageKey: store.key,
    recovery: store.recovery(),
    current: store.get(),
  });
  equal(exported.current, null);
  equal(exported.rawSnapshot, raw);
  equal(exported.kind, 'arabgram-learning-export');
}

test('un instantané futur, étranger, mal typé ou non objet n’est pas réécrit', async () => {
  const future = JSON.stringify({ schemaVersion: 2, ...oldProfile, profile: { xp: 1, note: 'نَصّ' } });
  await unchanged(future, 'future-schema');
  await unchanged(JSON.stringify({ original: { name: 'note.txt' }, derived: { text: 'نَص' } }), 'foreign-blob');
  await unchanged(JSON.stringify({ ...oldProfile, xp: '420' }), 'invalid-field');
  await unchanged('[]', 'not-object');
  await unchanged('null', 'not-object');
  await unchanged('"hello"', 'not-object');
});

test('l’inspection est isolée : elle ne touche pas au stockage', () => {
  const disk = memory();
  const raw = JSON.stringify({ schemaVersion: 2, xp: 999 });
  disk.mem.set('demo@v1', raw);
  const verdict = inspectLearningSnapshot(JSON.parse(raw), base());
  equal(verdict.ok, false);
  if (!verdict.ok) equal(verdict.reason, 'future-schema');
  equal(disk.writes.length, 0);
  equal(disk.mem.get('demo@v1'), raw);
});

test('un ancien profil et ses champs inconnus survivent à une édition', async () => {
  const disk = memory();
  const saved = {
    ...oldProfile,
    schemaVersion: 1,
    deviceNote: 'keep-me',
    settings: { ...oldProfile.settings, labFlag: 1 },
    srs: { 'u1l1.1': { ...oldProfile.srs['u1l1.1'], source: 'manual' } },
    pacer: {
      ...oldProfile.pacer,
      engine: 'local',
      sessions: [{ ...oldProfile.pacer.sessions[0], note: 'session-extra' }],
    },
  };
  disk.mem.set('demo@v1', JSON.stringify(saved));
  const store = createPersistedStore('demo', base, 1, restoreState, disk.storage);
  await store.hydrate();
  const live = store.get() as State & { deviceNote?: string; schemaVersion?: number };
  equal(live.xp, 420);
  equal(live.deviceNote, 'keep-me');
  equal(live.schemaVersion, 1);
  equal(live.settings.digits, 'latn');
  equal((live.settings as State['settings'] & { labFlag?: number }).labFlag, 1);
  equal((live.srs['u1l1.1'] as { source?: string }).source, 'manual');
  equal((live.pacer as State['pacer'] & { engine?: string }).engine, 'local');
  store.set((s) => ({
    ...s,
    xp: s.xp + 1,
    srs: { ...s.srs, 'u1l1.1': nextSrsCard(s.srs['u1l1.1'], true, '2026-04-02') },
  }));
  await wait(300);
  const onDisk = JSON.parse(disk.mem.get('demo@v1') as string) as {
    xp: number;
    deviceNote: string;
    schemaVersion: number;
    settings: { labFlag: number; digits: string; lang: string };
    srs: { 'u1l1.1': { source: string; box: number; ok: number } };
    pacer: { engine: string; sessions: { note: string; wpm: number }[] };
  };
  equal(onDisk.xp, 421);
  equal(onDisk.deviceNote, 'keep-me');
  equal(onDisk.schemaVersion, 1);
  equal(onDisk.settings.labFlag, 1);
  equal(onDisk.settings.lang, 'ar');
  equal(onDisk.settings.digits, 'latn');
  equal(onDisk.srs['u1l1.1'].source, 'manual');
  equal(onDisk.srs['u1l1.1'].box, 4);
  equal(onDisk.srs['u1l1.1'].ok, 5);
  equal(onDisk.pacer.engine, 'local');
  equal(onDisk.pacer.sessions[0].note, 'session-extra');
  equal(onDisk.pacer.sessions[0].wpm, 30);
});

test('une édition pendant le chargement se rejoue sur l’instantané', async () => {
  const disk = memory();
  const saved = JSON.stringify({ ...oldProfile, deviceNote: 'keep-me' });
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
  store.set((s) => ({ ...s, xp: (typeof s.xp === 'number' ? s.xp : 0) + 5 }));
  await wait(220);
  equal(disk.writes.length, 0);
  equal(disk.mem.get('demo@v1'), saved);
  release();
  await pending;
  const live = store.get() as State & { deviceNote?: string };
  equal(live.xp, 425);
  equal(live.deviceNote, 'keep-me');
  equal(live.srs['u1l1.1']?.ok, 4);
  await wait(300);
  const onDisk = JSON.parse(disk.mem.get('demo@v1') as string) as State & { deviceNote: string };
  equal(onDisk.xp, 425);
  equal(onDisk.deviceNote, 'keep-me');
  equal(onDisk.srs['u1l1.1']?.ok, 4);
});

test('une hydratation plus lente ne recouvre pas la plus récente', async () => {
  let reads = 0;
  let releaseSlow: () => void = () => {};
  const slow = new Promise<void>((resolve) => {
    releaseSlow = resolve;
  });
  let markStarted: () => void = () => {};
  const started = new Promise<void>((resolve) => {
    markStarted = resolve;
  });
  const written: string[] = [];
  const storage: KvStorage = {
    async getItem() {
      reads += 1;
      if (reads === 1) {
        markStarted();
        await slow;
        return JSON.stringify({ ...oldProfile, xp: 1 });
      }
      return JSON.stringify({ ...oldProfile, xp: 2 });
    },
    async setItem(_key, value) {
      written.push(value);
    },
    async removeItem() {},
  };
  const store = createPersistedStore('demo', base, 1, restoreState, storage);
  const first = store.hydrate();
  await started;
  const second = store.hydrate();
  releaseSlow();
  await Promise.all([first, second]);
  equal(store.get().xp, 2);
  await wait(300);
  for (const value of written) equal(JSON.parse(value).xp, 2);
});

test('l’hydratation suivante relit l’écriture déjà engagée', async () => {
  const mem = new Map<string, string>();
  mem.set('demo@v1', JSON.stringify(oldProfile));
  let releaseWrite: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    releaseWrite = resolve;
  });
  let setCalls = 0;
  const storage: KvStorage = {
    async getItem(key) {
      return mem.has(key) ? (mem.get(key) as string) : null;
    },
    async setItem(key, value) {
      setCalls += 1;
      if (setCalls === 1) await gate;
      mem.set(key, value);
    },
    async removeItem(key) {
      mem.delete(key);
    },
  };
  const store = createPersistedStore('demo', base, 1, restoreState, storage);
  await store.hydrate();
  store.set((s) => ({ ...s, xp: s.xp + 5 }));
  await wait(250);
  const second = store.hydrate();
  releaseWrite();
  await second;
  equal(store.get().xp, 425);
  await wait(300);
  equal(JSON.parse(mem.get('demo@v1') as string).xp, 425);
});

test('une panne de lecture n’écrit pas et ne supprime pas', async () => {
  let writes = 0;
  let removes = 0;
  let tries = 0;
  let savedDisk: string | null = null;
  const saved = JSON.stringify({ ...oldProfile, deviceNote: 'keep-me' });
  const storage: KvStorage = {
    async getItem() {
      tries += 1;
      if (tries === 1) throw new Error('disk');
      return saved;
    },
    async setItem(_key, value) {
      writes += 1;
      savedDisk = value;
    },
    async removeItem() {
      removes += 1;
    },
  };
  const store = createPersistedStore('demo', base, 1, restoreState, storage);
  await store.hydrate();
  equal(writes, 0);
  equal(store.recovery().status, 'quarantine');
  equal(store.recovery().reason, 'storage-error');
  equal(store.recovery().raw, null);
  store.set((s) => ({ ...s, xp: (typeof s.xp === 'number' ? s.xp : 0) + 1 }));
  await wait(300);
  equal(writes, 0);
  equal(removes, 0);
  equal(store.get().xp, 1);
  await store.hydrate();
  await wait(300);
  const live = store.get() as State & { deviceNote?: string };
  equal(live.xp, 421);
  equal(live.deviceNote, 'keep-me');
  equal(removes, 0);
  if (savedDisk == null) throw new Error('écriture absente');
  const onDisk = JSON.parse(savedDisk) as State & { deviceNote: string };
  equal(onDisk.xp, 421);
  equal(onDisk.deviceNote, 'keep-me');
  equal(onDisk.srs['u1l1.1']?.box, 3);
});

test('un échec d’écriture garde la mémoire et ne vide pas la clé', async () => {
  const disk = memory();
  const storage: KvStorage = {
    getItem: (key) => disk.storage.getItem(key),
    async setItem() {
      throw new Error('full');
    },
    removeItem: (key) => disk.storage.removeItem(key),
  };
  const store = createPersistedStore('demo', base, 1, restoreState, storage);
  await store.hydrate();
  store.set((s) => ({ ...s, xp: 3, onboarded: true }));
  await wait(300);
  equal(store.get().xp, 3);
  equal(store.recovery().status, 'ready');
  equal(store.recovery().writeFailed, true);
  equal(disk.mem.has('demo@v1'), false);
});

test('la suppression est un geste à part, pas une suite d’un refus', async () => {
  const disk = memory();
  const raw = JSON.stringify(oldProfile);
  disk.mem.set('demo@v1', raw);
  const kept = createPersistedStore('demo', base, 1, restoreState, disk.storage);
  await kept.hydrate();
  equal(disk.mem.get('demo@v1'), raw);
  const future = '{"schemaVersion":2,"xp":9}';
  disk.mem.set('other@v1', future);
  const blocked = createPersistedStore('other', base, 1, restoreState, disk.storage);
  await blocked.hydrate();
  equal(disk.mem.get('other@v1'), future);
  await blocked.reset();
  equal(disk.mem.has('other@v1'), false);
  equal(disk.mem.get('demo@v1'), raw);
});

test('la carte Leitner garde ses clés inconnues et une carte illisible n’est pas notée', () => {
  const next = nextSrsCard({ box: 3, due: '2026-04-01', ok: 4, ko: 1, last: '2026-03-01', source: 'manual' }, true, '2026-04-02');
  equal(next.box, 4);
  equal(next.ok, 5);
  equal(next.source, 'manual');
  const opaque = { box: '3', due: '2026-04-01', ok: 1, ko: 0, last: '2026-03-01' };
  equal(isSchedulableCard(opaque), false);
  const state = base();
  state.srs = {
    bad: opaque as unknown as State['srs'][string],
    'u1l1.1': { box: 2, due: '2020-01-01', ok: 1, ko: 0, last: '2020-01-01' },
  };
  const counts = boxCounts(state);
  equal(counts[2], 1);
  equal(counts[3], 0);
  equal(Number.isFinite(counts[0]), true);
  const due = dueItems(state, '2026-11-07');
  equal(due.length, 1);
  equal(due[0]?.id, 'u1l1.1');
});

test('formatDigits ne touche pas aux identifiants', () => {
  equal(formatDigits('u11l3, u1l2', 'arab'), 'u11l3, u1l2');
  equal(formatDigits('Leçons (2) : u11l3', 'arab'), 'Leçons (٢) : u11l3');
  equal(formatDigits('12 XP', 'arab'), '١٢ XP');
  equal(formatDigits('0/2', 'arab'), '٠/٢');
  equal(formatDigits('u11l3', 'latn'), 'u11l3');
});
