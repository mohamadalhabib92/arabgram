import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useTheme } from './theme';
import { mix } from './contrast';
import { formatDigits } from './format';
import { useLargeText, useReduceMotion } from './ui';
import { announce } from './a11y';
import { FOCUS_PATH, focusNav, formatClock, remainingMs, type FocusTarget } from './focus';
import { makeFocus, useFocusEngine, useFocusNow } from './focusRuntime';
import { FocusNotice, FocusPill, FocusStrip, FocusSuccess, type FocusTheme } from './FocusUI';
import { focusText } from '@/lib/focusStrings';
import { store } from '@/state';

/** Mode Focus d’ArabGram : historique sous la NOUVELLE clé `arabgram:focus@v1`. */
export const FOCUS_KEY = 'arabgram:focus@v1';
export const { controller: focus, useFocus } = makeFocus(FOCUS_KEY);

export function useFocusTheme(): FocusTheme {
  const p = useTheme();
  const reduce = useReduceMotion();
  const large = useLargeText();
  return {
    bg: p.bg,
    surface: p.surface,
    text: p.text,
    muted: p.textMuted,
    accent: p.primary,
    onAccent: p.primaryText,
    track: mix(p.textMuted, p.surface, 0.28),
    danger: p.danger,
    onDanger: p.onDanger,
    border: p.border,
    fontScale: p.fontScale,
    rtl: p.rtl,
    reduceMotion: reduce,
    largeText: large,
  };
}

export function useFocusText() {
  const lang = store.useSelect((s) => s.settings.lang);
  const digits = store.useSelect((s) => s.settings.digits);
  return useMemo(() => focusText(lang, (n) => formatDigits(n, digits)), [lang, digits]);
}

/** Contenu accessible pendant une session (leçon, exercices, unité, sources ; Apprendre si le parcours est fini). */
export const FOCUS_CONTENT = ['/lesson', '/drill', '/unit', '/sources', '/learn'] as const;

/** Ouvre le contenu de la session (leçon, révision) PAR-DESSUS l’écran Focus, qui reste dessous. */
export function openFocusTarget(target: FocusTarget | undefined) {
  if (target?.kind === 'lesson' && target.id) router.push({ pathname: '/lesson/[id]', params: { id: target.id } });
  else if (target?.kind === 'review') router.push({ pathname: '/drill', params: { mode: 'review' } });
  else router.push('/learn');
}

/** Retour au minuteur (pastille, écran hors contenu) : on dépile jusqu’à l’écran Focus. */
export function backToFocusTimer() {
  router.dismissTo(FOCUS_PATH);
}

/** Depuis l’écran /focus : la session démarre et le contenu s’ouvre par-dessus. */
export function startFocusSession(minutes: number, target: FocusTarget | undefined, startedText: string) {
  focus.start(minutes, target);
  announce(startedText);
  openFocusTarget(target);
}

/**
 * Couche racine : moteur (horloge, AppState = pause, écran allumé, toasts en sourdine,
 * Retour Android) + pastille mm:ss dans le contenu + message de pause au retour
 * + garde de navigation (hors contenu ⇒ écran Focus) + moment de réussite.
 */
export function FocusLayer({ children }: { children: React.ReactNode }) {
  const snap = useFocusEngine(focus, () => router.canGoBack());
  const theme = useFocusTheme();
  const { ui } = useFocusText();
  const pathname = usePathname();
  const a = snap.data.active;
  const now = useFocusNow(!!a);
  const nav = focusNav(pathname, !!a, FOCUS_CONTENT);
  const notice = a ? snap.notice : null;
  const noticeText = notice ? ui.notice(notice.awayMs, notice.interruptions) : '';

  useEffect(() => {
    if (snap.hydrated && nav.redirect) backToFocusTimer();
  }, [snap.hydrated, nav.redirect, pathname]);

  useEffect(() => {
    if (!noticeText) return;
    announce(noticeText);
    const id = setTimeout(() => focus.dismissNotice(), 10000);
    return () => clearTimeout(id);
  }, [noticeText, notice?.at]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
      {a && (nav.showPill || notice) ? (
        <FocusStrip theme={theme}>
          {notice ? <FocusNotice theme={theme} s={ui} text={noticeText} onClose={() => focus.dismissNotice()} /> : null}
          {nav.showPill ? <FocusPill theme={theme} s={ui} clock={formatClock(remainingMs(a, now), ui.num)} onPress={backToFocusTimer} /> : null}
        </FocusStrip>
      ) : null}
      <FocusSuccess record={snap.finished} theme={theme} s={ui} onClose={() => focus.dismissFinished()} />
    </View>
  );
}
