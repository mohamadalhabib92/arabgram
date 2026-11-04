import React, { useCallback, useMemo, useState } from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { useTheme } from '@/kit/theme';
import { Button, Card, Chip, Ionicons, Row, Screen, Section, T } from '@/kit/ui';
import { BackHeader } from '@/components/common';
import { LESSON_BY_ID, playable } from '@/data/curriculum';
import { dueItems, nextLesson, store, unitUnlocked } from '@/state';
import { formatDigits } from '@/kit/format';
import { haptic } from '@/kit/haptics';
import { FOCUS_DURATIONS, focusTotals, formatClock, progressOf, remainingMinutes, remainingMs, type FocusRecord, type FocusTarget } from '@/kit/focus';
import { FocusEmergency, FocusGuide, FocusRing } from '@/kit/FocusUI';
import { focus, openFocusTarget, startFocusSession, useFocus, useFocusText, useFocusTheme } from '@/kit/focusApp';
import { useFocusNow } from '@/kit/focusRuntime';

/** Date courte sans Intl (Hermes) : jj/mm · hh:mm, chiffres selon le réglage. */
function shortDate(ts: number, num: (n: number) => string) {
  const d = new Date(ts);
  const two = (v: number) => (v < 10 ? num(0) + num(v) : num(v));
  return `${two(d.getDate())}/${two(d.getMonth() + 1)} · ${two(d.getHours())}:${two(d.getMinutes())}`;
}

export default function FocusScreen() {
  const p = useTheme();
  const params = useLocalSearchParams<{ lesson?: string }>();
  const s = store.use();
  const lang = s.settings.lang;
  const digits = s.settings.digits;
  const num = (n: number) => formatDigits(n, digits);
  const { screen: tx, guide, ui: fui } = useFocusText();
  const ft = useFocusTheme();
  const snap = useFocus();
  const active = snap.data.active;
  const now = useFocusNow(!!active);
  const [minutes, setMinutes] = useState<number>(15);

  // Retour bloqué sur cet écran PENDANT une session seulement : geste iOS (gestureEnabled),
  // toute fermeture de l’écran (usePreventRemove = écouteur beforeRemove) et bouton Retour Android.
  usePreventRemove(!!active, () => undefined);
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return undefined;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => !!focus.get().data.active);
      return () => sub.remove();
    }, []),
  );
  const [showGuide, setShowGuide] = useState(false);

  const titleOf = (id: string) => {
    const l = LESSON_BY_ID[id];
    return l ? (lang === 'ar' ? l.title.ar : l.title[s.settings.gloss]) : '';
  };

  const targets = useMemo(() => {
    const out: { target: FocusTarget; label: string }[] = [];
    const pl = params.lesson ? LESSON_BY_ID[String(params.lesson)] : undefined;
    if (pl && playable(pl) && unitUnlocked(s, pl.unitId)) out.push({ target: { kind: 'lesson', id: pl.id }, label: tx.thisLesson(titleOf(pl.id)) });
    const nx = nextLesson(s);
    if (nx && nx.id !== pl?.id) out.push({ target: { kind: 'lesson', id: nx.id }, label: tx.nextLesson(titleOf(nx.id)) });
    const due = dueItems(s).length;
    if (due > 0) out.push({ target: { kind: 'review' }, label: tx.reviewDue(due) });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, params.lesson, tx]);
  const [pick, setPick] = useState(0);
  const chosen = targets[Math.min(pick, Math.max(0, targets.length - 1))];

  const history = snap.data.history;
  const totals = focusTotals(history);
  const guideVisible = snap.hydrated && (!snap.data.guideSeen || showGuide);

  const describe = (r: FocusRecord) => {
    const what = r.target?.kind === 'lesson' && r.target.id ? titleOf(r.target.id) : r.target?.kind === 'review' ? tx.review : '';
    return [what, `${num(Math.round(r.elapsedMs / 60000))}/${num(r.plannedMinutes)} ${fui.minShort}`, r.outcome === 'completed' ? tx.completed : tx.emergencyOutcome, tx.interruptions(r.interruptions)]
      .filter(Boolean)
      .join(' · ');
  };

  return (
    <Screen header={<BackHeader title={tx.screenTitle} subtitle={tx.screenSub} hideBack={!!active} />}>
      <Stack.Screen options={{ gestureEnabled: !active }} />
      {active ? (
        <Card accent={p.primary}>
          <T v="h2">{tx.activeTitle}</T>
          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={`${fui.title} — ${fui.ringLabel}`}
            accessibilityValue={{ min: 0, max: Math.round(active.durationMs / 60000), now: Math.round(active.durationMs / 60000) - remainingMinutes(active, now), text: fui.remaining(remainingMinutes(active, now)) }}
            style={{ alignItems: 'center', paddingVertical: 8 }}
          >
            <FocusRing progress={progressOf(active, now)} size={190} theme={ft}>
              <T v="h1" style={{ fontVariant: ['tabular-nums'] }}>{formatClock(remainingMs(active, now), num)}</T>
              <T v="small" muted>{fui.remaining(remainingMinutes(active, now))}</T>
            </FocusRing>
          </View>
          <T muted>{fui.calm}</T>
          <T v="small" muted>{tx.locked}</T>
          <Button title={tx.resume} icon="play" full onPress={() => openFocusTarget(active.target)} />
          <FocusEmergency theme={ft} s={fui} remainingMin={remainingMinutes(active, now)} onEmergency={(ms) => focus.emergency(ms, true)} />
        </Card>
      ) : (
        <>
          <Section title={tx.duration}>
            <Row wrap gap={8}>
              {FOCUS_DURATIONS.map((m) => (
                <Chip key={m} label={`${num(m)} ${fui.minShort}`} selected={minutes === m} icon="timer-outline" onPress={() => setMinutes(m)} />
              ))}
            </Row>
          </Section>

          <Section title={tx.during}>
            {targets.length ? (
              <Row wrap gap={8}>
                {targets.map((o, i) => (
                  <Chip key={`${o.target.kind}-${o.target.id ?? ''}`} label={o.label} selected={chosen === o} icon={o.target.kind === 'review' ? 'refresh' : 'book-outline'} onPress={() => setPick(i)} />
                ))}
              </Row>
            ) : (
              <T muted>{tx.nothingToStudy}</T>
            )}
          </Section>

          <Card>
            {tx.promise.map((line) => (
              <Row key={line} gap={10} style={{ alignItems: 'flex-start' }}>
                <Ionicons name="checkmark-circle" size={18} color={p.success} style={{ marginTop: 2 }} />
                <T style={{ flex: 1 }}>{line}</T>
              </Row>
            ))}
          </Card>

          <Button
            title={tx.start(minutes)}
            icon="play"
            full
            disabled={!snap.hydrated}
            onPress={() => {
              haptic.select();
              startFocusSession(minutes, chosen?.target, tx.started(minutes));
            }}
          />
        </>
      )}

      {guideVisible ? (
        <Card>
          <FocusGuide
            g={guide}
            theme={ft}
            onOk={() => {
              focus.markGuideSeen();
              setShowGuide(false);
            }}
          />
        </Card>
      ) : snap.hydrated ? (
        <Button title={tx.guideAgain} kind="ghost" icon="phone-portrait-outline" onPress={() => setShowGuide(true)} />
      ) : null}

      <Section title={tx.history}>
        {history.length ? (
          <>
            <T v="small" muted>{tx.totals(totals.completed, totals.minutes)}</T>
            {[...history].reverse().slice(0, 20).map((r) => (
              <Card key={r.id}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <T v="label">{shortDate(r.startedAt, num)}</T>
                  <Ionicons name={r.outcome === 'completed' ? 'checkmark-circle' : 'exit-outline'} size={18} color={r.outcome === 'completed' ? p.success : p.textMuted} />
                </Row>
                <T v="small" muted>{describe(r)}</T>
              </Card>
            ))}
          </>
        ) : (
          <T muted>{tx.historyEmpty}</T>
        )}
      </Section>
    </Screen>
  );
}
