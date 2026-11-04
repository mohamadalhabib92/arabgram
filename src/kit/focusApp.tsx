import React, { useMemo } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from './theme';
import { mix } from './contrast';
import { formatDigits } from './format';
import { useLargeText, useReduceMotion } from './ui';
import { announce } from './a11y';
import { progressOf, remainingMinutes, type FocusTarget } from './focus';
import { makeFocus, useFocusEngine, useFocusNow } from './focusRuntime';
import { FocusDock, FocusSuccess, type FocusTheme } from './FocusUI';
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

/** Ouvre le contenu de la session (leçon, révision) — à l’intérieur du Mode Focus. */
export function openFocusTarget(target: FocusTarget | undefined, replace = false) {
  const go = (href: Parameters<typeof router.push>[0]) => (replace ? router.replace(href) : router.push(href));
  if (target?.kind === 'lesson' && target.id) go({ pathname: '/lesson/[id]', params: { id: target.id } });
  else if (target?.kind === 'review') go({ pathname: '/drill', params: { mode: 'review' } });
  else go('/learn');
}

/** Depuis l’écran /focus : la session démarre et remplace l’écran de réglage par le contenu. */
export function startFocusSession(minutes: number, target: FocusTarget | undefined, startedText: string) {
  focus.start(minutes, target);
  announce(startedText);
  openFocusTarget(target, true);
}

/**
 * Couche racine : moteur (horloge, AppState, écran allumé, toasts en sourdine,
 * Retour Android) + barre de session à la place des onglets + moment de réussite.
 */
export function FocusLayer({ children }: { children: React.ReactNode }) {
  const snap = useFocusEngine(focus, () => router.canGoBack());
  const theme = useFocusTheme();
  const { ui } = useFocusText();
  const a = snap.data.active;
  const now = useFocusNow(!!a);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
      {a ? (
        <FocusDock
          theme={theme}
          s={ui}
          progress={progressOf(a, now)}
          remainingMin={remainingMinutes(a, now)}
          plannedMin={Math.round(a.durationMs / 60000)}
          onEmergency={(ms) => focus.emergency(ms, true)}
        />
      ) : null}
      <FocusSuccess record={snap.finished} theme={theme} s={ui} onClose={() => focus.dismissFinished()} />
    </View>
  );
}
