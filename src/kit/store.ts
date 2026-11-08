import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

/**
 * Store persistant (AsyncStorage sur mobile, localStorage sur web).
 * Aucune écriture tant qu’une lecture n’a pas été adoptée, ou confirmée vide.
 * Un fichier illisible, futur, étranger ou au type incompatible reste en place.
 * `reset` est le seul chemin qui retire la clé : suppression explicite.
 */
export class PersistReject extends Error {
  readonly reason: string;
  readonly detail?: string;
  constructor(reason: string, detail?: string) {
    super(detail ? `${reason}:${detail}` : reason);
    this.name = 'PersistReject';
    this.reason = reason;
    this.detail = detail;
  }
}

export type PersistRecovery = {
  status: 'pending' | 'ready' | 'quarantine';
  reason?: string;
  detail?: string;
  /** Octets exacts de la dernière lecture. Null si la clé est absente ou illisible. */
  raw: string | null;
  writeFailed?: boolean;
};

export type PersistedStore<T> = {
  get: () => T;
  set: (updater: T | ((prev: T) => T)) => void;
  use: () => T;
  useSelect: <S>(sel: (s: T) => S) => S;
  useRecovery: () => PersistRecovery;
  recovery: () => PersistRecovery;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
  key: string;
};

export type KvStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

type Patch<T> = (prev: T) => T;
type Op<T> = { kind: 'patch'; fn: Patch<T> } | { kind: 'replace'; value: T };

const EMPTY_RECOVERY: PersistRecovery = { status: 'pending', raw: null };

export function createPersistedStore<T extends object>(
  key: string,
  initial: () => T,
  version = 1,
  restore?: (saved: unknown, base: T) => T,
  storage: KvStorage = AsyncStorage,
): PersistedStore<T> {
  let state: T = initial();
  let recovery: PersistRecovery = EMPTY_RECOVERY;
  const listeners = new Set<() => void>();
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  const storageKey = `${key}@v${version}`;
  let loadSettled = false;
  let dirtyWhileBlocked = false;
  let epoch = 0;
  let writeGen = 0;
  let chain: Promise<void> = Promise.resolve();
  let pendingFlush: string | null = null;
  const pending: Op<T>[] = [];

  const emit = () => listeners.forEach((l) => l());
  const enqueue = (task: () => Promise<void>) => {
    const run = chain.then(task, task);
    chain = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  };
  const failWrite = () => {
    if (recovery.writeFailed) return;
    recovery = { ...recovery, writeFailed: true };
    emit();
  };
  const rememberWrite = async (payload: string) => {
    try {
      await storage.setItem(storageKey, payload);
      if (recovery.writeFailed) {
        recovery = { ...recovery, writeFailed: false };
        emit();
      }
    } catch {
      failWrite();
    }
  };
  const writeSoon = () => {
    if (!loadSettled) return;
    if (saveTimer) clearTimeout(saveTimer);
    const gen = writeGen;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      if (gen !== writeGen || !loadSettled) return;
      const payload = JSON.stringify(state);
      void enqueue(async () => {
        if (gen !== writeGen || !loadSettled) return;
        await rememberWrite(payload);
      });
    }, 150);
  };
  const quarantine = (reason: string, raw: string | null, detail?: string) => {
    pending.splice(0, pending.length);
    dirtyWhileBlocked = false;
    state = initial();
    recovery = { status: 'quarantine', reason, detail, raw, writeFailed: false };
    emit();
  };
  const replay = (base: T, keepReplace: boolean) => {
    let next = base;
    for (const op of pending) {
      if (op.kind === 'patch') next = op.fn(next);
      else if (keepReplace) next = op.value;
    }
    pending.splice(0, pending.length);
    return next;
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  };

  const store: PersistedStore<T> = {
    key: storageKey,
    get: () => state,
    recovery: () => recovery,
    set: (updater) => {
      if (!loadSettled) {
        dirtyWhileBlocked = true;
        if (typeof updater === 'function') {
          const fn = updater as Patch<T>;
          pending.push({ kind: 'patch', fn });
          state = fn(state);
        } else {
          pending.push({ kind: 'replace', value: updater });
          state = updater;
        }
        emit();
        return;
      }
      state = typeof updater === 'function' ? (updater as Patch<T>)(state) : updater;
      emit();
      writeSoon();
    },
    use: () => useSyncExternalStore(subscribe, () => state, () => state),
    useSelect: <S,>(sel: (s: T) => S) => useSyncExternalStore(subscribe, () => sel(state), () => sel(state)),
    useRecovery: () => useSyncExternalStore(subscribe, () => recovery, () => recovery),
    hydrate: () => {
      const ticket = ++epoch;
      writeGen += 1;
      if (loadSettled) pendingFlush = JSON.stringify(state);
      loadSettled = false;
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = null;
      return enqueue(async () => {
        if (ticket !== epoch) return;
        const flush = pendingFlush;
        pendingFlush = null;
        if (flush != null) await rememberWrite(flush);
        const flushedBadly = recovery.writeFailed === true;
        if (ticket !== epoch) return;
        let raw: string | null;
        try {
          raw = await storage.getItem(storageKey);
        } catch {
          if (ticket !== epoch) return;
          quarantine('storage-error', null);
          return;
        }
        if (ticket !== epoch) return;
        if (raw == null) {
          const hadEdits = dirtyWhileBlocked;
          state = replay(initial(), true);
          dirtyWhileBlocked = false;
          recovery = { status: 'ready', raw: null, writeFailed: flushedBadly };
          emit();
          loadSettled = true;
          if (hadEdits) writeSoon();
          return;
        }
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          if (ticket !== epoch) return;
          quarantine('malformed-json', raw);
          return;
        }
        if (ticket !== epoch) return;
        let adopted: T;
        try {
          const base = initial();
          adopted = restore ? restore(parsed, base) : { ...base, ...(parsed as T) };
        } catch (error) {
          if (ticket !== epoch) return;
          if (error instanceof PersistReject) quarantine(error.reason, raw, error.detail);
          else quarantine('restore-failed', raw);
          return;
        }
        if (ticket !== epoch) return;
        const hadEdits = dirtyWhileBlocked;
        state = replay(adopted, false);
        dirtyWhileBlocked = false;
        recovery = { status: 'ready', raw, writeFailed: flushedBadly };
        emit();
        loadSettled = true;
        if (hadEdits) writeSoon();
      });
    },
    reset: () => {
      const ticket = ++epoch;
      writeGen += 1;
      pendingFlush = null;
      pending.splice(0, pending.length);
      dirtyWhileBlocked = false;
      loadSettled = false;
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = null;
      return enqueue(async () => {
        try {
          await storage.removeItem(storageKey);
        } catch {
          if (ticket !== epoch) return;
          // Une suppression refusée ne rend pas la mémoire vide autorisée à écraser
          // le fichier encore présent. On ne réautorise l’écriture que si un profil
          // a déjà été adopté (la mémoire n’est pas le état initial non lu).
          const alreadyAdopted = recovery.status === 'ready';
          recovery = { ...recovery, writeFailed: true };
          loadSettled = alreadyAdopted;
          emit();
          return;
        }
        if (ticket !== epoch) return;
        state = initial();
        recovery = { status: 'ready', raw: null, writeFailed: false };
        loadSettled = true;
        emit();
      });
    },
  };
  return store;
}

/** Résout une promesse ou échoue après `ms` (évite les "Loading" infinis). */
export function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

export function uid(prefix = ''): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
