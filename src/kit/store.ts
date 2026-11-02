import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

/**
 * Petit store persistant (AsyncStorage sur mobile, localStorage sur web).
 * Aucune dépendance réseau : tout le chemin "core" fonctionne hors ligne.
 */
export type PersistedStore<T> = {
  get: () => T;
  set: (updater: T | ((prev: T) => T)) => void;
  use: () => T;
  useSelect: <S>(sel: (s: T) => S) => S;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
  key: string;
};

export type KvStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export function createPersistedStore<T extends object>(
  key: string,
  initial: () => T,
  version = 1,
  restore?: (saved: unknown, base: T) => T,
  storage: KvStorage = AsyncStorage,
): PersistedStore<T> {
  let state: T = initial();
  const listeners = new Set<() => void>();
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  const storageKey = `${key}@v${version}`;
  /**
   * Tant qu’un chargement n’a pas réussi, ou confirmé l’absence de donnée,
   * aucune écriture. « Continuer hors ligne » ne doit pas remplacer
   * arabgram@v1 par l’état vide encore en mémoire.
   */
  let loadSettled = false;
  let dirtyWhileBlocked = false;
  let epoch = 0;

  const emit = () => listeners.forEach((l) => l());
  const writeSoon = () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      storage.setItem(storageKey, JSON.stringify(state)).catch(() => {
        /* stockage indisponible : on garde l'état en mémoire */
      });
    }, 150);
  };
  const persist = () => {
    if (!loadSettled) {
      dirtyWhileBlocked = true;
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = null;
      return;
    }
    writeSoon();
  };
  const settleLoad = () => {
    loadSettled = true;
    if (!dirtyWhileBlocked) return;
    dirtyWhileBlocked = false;
    writeSoon();
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
    set: (updater) => {
      state = typeof updater === 'function' ? (updater as (p: T) => T)(state) : updater;
      emit();
      persist();
    },
    use: () => useSyncExternalStore(subscribe, () => state, () => state),
    useSelect: <S,>(sel: (s: T) => S) => useSyncExternalStore(subscribe, () => sel(state), () => sel(state)),
    hydrate: async () => {
      const ticket = ++epoch;
      let raw: string | null;
      try {
        raw = await storage.getItem(storageKey);
      } catch {
        return;
      }
      if (ticket !== epoch) return;
      if (raw) {
        try {
          const parsed: unknown = JSON.parse(raw);
          const base = initial();
          state = restore ? restore(parsed, base) : { ...base, ...(parsed as T) };
          emit();
        } catch {
          /* fichier présent mais illisible : ne pas l’écraser par l’état vide */
          return;
        }
      }
      if (ticket !== epoch) return;
      settleLoad();
    },
    reset: async () => {
      epoch += 1;
      state = initial();
      emit();
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = null;
      dirtyWhileBlocked = false;
      await storage.removeItem(storageKey);
      loadSettled = true;
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
