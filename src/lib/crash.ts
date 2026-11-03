/**
 * Journal de crash optionnel. Aucun envoi si EXPO_PUBLIC_SENTRY_DSN est absent
 * ou vaut un placeholder YOUR_*. Jamais bloquant, jamais de progression envoyée.
 */
const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function crashReportingEnabled(): boolean {
  return typeof DSN === 'string' && DSN.length > 0 && !DSN.startsWith('YOUR_') && DSN.includes('@');
}

function eventId(): string {
  const bytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function parseDsn(dsn: string): { store: string } | null {
  try {
    const u = new URL(dsn);
    const key = decodeURIComponent(u.username);
    const project = u.pathname.replace(/\//g, '');
    if (!key || !project) return null;
    return { store: `${u.protocol}//${u.host}/api/${project}/store/?sentry_key=${encodeURIComponent(key)}&sentry_version=7` };
  } catch {
    return null;
  }
}

export function reportCrash(error: unknown, extra?: string): void {
  if (!crashReportingEnabled() || !DSN) return;
  const target = parseDsn(DSN);
  if (!target) return;
  const err = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'erreur');
  const body = {
    event_id: eventId(),
    timestamp: new Date().toISOString(),
    platform: 'javascript',
    level: 'error',
    exception: { values: [{ type: err.name || 'Error', value: err.message || 'erreur' }] },
    extra: extra ? { componentStack: extra.slice(0, 2000) } : undefined,
  };
  try {
    const send = typeof fetch === 'function' ? fetch : null;
    if (!send) return;
    void send(target.store, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => undefined);
  } catch {
    /* le journal ne doit jamais casser l’app */
  }
}

let installed = false;

/** Branche les erreurs non rattrapées. Aucune requête si le DSN n’est pas réel. */
export function initCrashReporting(): void {
  if (installed) return;
  installed = true;
  const g = globalThis as {
    ErrorUtils?: { getGlobalHandler?: () => (e: unknown, fatal?: boolean) => void; setGlobalHandler?: (h: (e: unknown, fatal?: boolean) => void) => void };
    addEventListener?: (type: string, fn: (ev: { reason?: unknown; error?: unknown }) => void) => void;
  };
  const EU = g.ErrorUtils;
  if (EU?.setGlobalHandler) {
    const prev = EU.getGlobalHandler?.();
    EU.setGlobalHandler((err, fatal) => {
      reportCrash(err, fatal ? 'fatal' : undefined);
      prev?.(err, fatal);
    });
  }
  if (typeof g.addEventListener === 'function') {
    g.addEventListener('error', (ev) => reportCrash(ev.error ?? 'window.error'));
    g.addEventListener('unhandledrejection', (ev) => reportCrash(ev.reason ?? 'unhandledrejection'));
  }
}
