import { useSyncExternalStore } from 'react';

/**
 * Service optionnel (tuteur). Jamais appelé au démarrage.
 * Un échec, y compris HTTP 402, ne bloque pas le cours.
 */
type Status = 'idle' | 'down';
let status: Status = 'idle';
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function reportOptionalFailure(): void {
  if (status === 'down') return;
  status = 'down';
  emit();
}

export function optionalServiceDown(): boolean {
  return status === 'down';
}

export function useOptionalServiceDown(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    optionalServiceDown,
    () => false,
  );
}

/** Sonde explicite, uniquement sur action de l’utilisateur. */
export async function probeOptionalService(url: string | undefined): Promise<'unconfigured' | 'ok' | 'down'> {
  if (!url || url.startsWith('YOUR_')) return 'unconfigured';
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(url, { method: 'GET', signal: ctrl.signal });
    if (res.status === 402 || !res.ok) {
      reportOptionalFailure();
      return 'down';
    }
    return 'ok';
  } catch {
    reportOptionalFailure();
    return 'down';
  } finally {
    clearTimeout(timer);
  }
}
