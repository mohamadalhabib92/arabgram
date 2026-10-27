import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { alpha, useTheme } from '@/kit/theme';
import { Card, Header, Progress, Row, Screen, Section, Stat, T, Button } from '@/kit/ui';
import { AR } from '@/components/common';
import { UNITS } from '@/data/curriculum';
import { PASSAGES } from '@/data/passages';
import { PHONETIC_TEST } from '@/data/tashkil';
import { UNIT_COLORS } from '@/theme';
import { useI18n } from '@/lib/i18n';
import { addDaysIso, boxCounts, store, streak, today, unitProgress } from '@/state';

export default function ProgressTab() {
  const p = useTheme();
  const { t, pick, lang } = useI18n();
  const s = store.use();
  const cards = Object.values(s.srs);
  const ok = cards.reduce((n, c) => n + c.ok, 0);
  const ko = cards.reduce((n, c) => n + c.ko, 0);
  const acc = ok + ko ? ok / (ok + ko) : 0;
  const counts = boxCounts(s);
  const mastered = counts[4] + counts[5];
  const timed = s.pacer.sessions.filter((x) => !x.untimed);
  const bestWpm = s.pacer.sessions.reduce((m, x) => Math.max(m, x.acc >= 0.8 ? x.wpm : 0), 0);
  const bestScore = s.pacer.sessions.reduce((m, x) => Math.max(m, x.score), 0);
  const wins = timed.filter((x) => x.won).length;
  const week = Array.from({ length: 7 }, (_, i) => addDaysIso(today(), i - 6));
  const maxDay = Math.max(s.settings.dailyGoal, ...week.map((d) => s.days[d] ?? 0));

  return (
    <Screen header={<Header title={t('progress')} subtitle={pick({ fr: 'Tout est calculé et stocké sur cet appareil.', ar: 'كُلُّ شَيْءٍ مَحْفُوظٌ عَلَى جِهَازِكَ', en: 'Everything is computed and stored on this device.' })} />}>
      <Row wrap>
        <Stat label="XP" value={String(s.xp)} color={p.primary} />
        <Stat label={t('streak')} value={`${streak(s)} ${pick({ fr: 'j', ar: 'ي', en: 'd' })}`} color={p.accent} />
        <Stat label={t('accuracy')} value={ok + ko ? `${Math.round(acc * 100)} %` : '—'} sub={`${ok}/${ok + ko}`} />
        <Stat label={pick({ fr: 'Maîtrisés (boîtes 4–5)', ar: 'مُتْقَن', en: 'Mastered (boxes 4–5)' })} value={String(mastered)} color={p.success} />
      </Row>

      <Section title={pick({ fr: '7 derniers jours (XP)', ar: 'آخِرُ ٧ أَيَّام', en: 'Last 7 days (XP)' })}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 8 }}>
            {week.map((d) => {
              const v = s.days[d] ?? 0;
              const reached = v >= s.settings.dailyGoal;
              return (
                <View key={d} style={{ flex: 1, alignItems: 'center', gap: 4 }} accessible accessibilityLabel={`${d}: ${v} XP`}>
                  <View style={{ width: '70%', height: Math.max(4, (v / maxDay) * 84), borderRadius: 6, backgroundColor: reached ? p.success : v ? alpha(p.primary, 0.6) : p.surface2 }} />
                  <T v="caption" muted>{d.slice(8)}</T>
                </View>
              );
            })}
          </View>
          <T v="caption" muted>{pick({ fr: `Objectif quotidien : ${s.settings.dailyGoal} XP (vert = atteint)`, ar: `الهَدَفُ اليَوْمِيّ: ${s.settings.dailyGoal}`, en: `Daily goal: ${s.settings.dailyGoal} XP (green = reached)` })}</T>
        </Card>
      </Section>

      <Section title={pick({ fr: 'Unités', ar: 'الوَحَدَات', en: 'Units' })}>
        <Card>
          {UNITS.map((u) => {
            const v = unitProgress(s, u.id);
            return (
              <View key={u.id} style={{ gap: 4, paddingVertical: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <T v="small">{u.id}. {lang === 'ar' ? u.ar : u[s.settings.gloss]}</T>
                  <T v="caption" muted>{Math.round(v * 100)} %</T>
                </Row>
                <Progress value={v} color={UNIT_COLORS[(u.id - 1) % UNIT_COLORS.length]} height={6} />
              </View>
            );
          })}
        </Card>
      </Section>

      <Section title={pick({ fr: 'Course du guide', ar: 'سِبَاقُ المُرْشِد', en: 'Guide race' })}>
        <Row wrap>
          <Stat label={pick({ fr: 'Allure actuelle du guide', ar: 'سُرْعَةُ المُرْشِد', en: 'Current guide pace' })} value={`${s.pacer.target}`} sub={pick({ fr: 'mots/min', ar: 'كَلِمَة/د', en: 'wpm' })} />
          <Stat label={pick({ fr: 'Meilleure vitesse (≥ 80 %)', ar: 'أَفْضَلُ سُرْعَة', en: 'Best speed (≥ 80%)' })} value={bestWpm ? String(bestWpm) : '—'} />
          <Stat label={pick({ fr: 'Meilleur score', ar: 'أَفْضَلُ نَتِيجَة', en: 'Best score' })} value={bestScore ? String(bestScore) : '—'} />
          <Stat label={pick({ fr: 'Victoires', ar: 'اِنْتِصَارَات', en: 'Wins' })} value={`${wins}/${timed.length}`} />
        </Row>
        {s.pacer.sessions.slice(0, 6).map((x) => (
          <Row key={x.at} style={{ justifyContent: 'space-between', minHeight: 30 }}>
            <T v="small">{PASSAGES.find((q) => q.id === x.passage)?.title[s.settings.gloss] ?? x.passage}</T>
            <T v="small" muted>{x.untimed ? pick({ fr: 'libre', ar: 'حُرّ', en: 'free' }) : `${x.target}→`} {x.wpm} wpm · {Math.round(x.acc * 100)} %</T>
          </Row>
        ))}
      </Section>

      <Section title={pick({ fr: 'Test de tashkīl', ar: 'اِخْتِبَارُ التَّشْكِيل', en: 'Tashkīl test' })}>
        <Card onPress={() => router.push('/tashkil-test')} a11y={pick({ fr: 'Ouvrir le test de tashkīl', ar: 'اِفْتَحِ الاِخْتِبَار', en: 'Open tashkīl test' })}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T v="body">{pick({ fr: 'Meilleur résultat', ar: 'أَفْضَلُ نَتِيجَة', en: 'Best result' })} : {s.tashkilBest ?? '—'}/{PHONETIC_TEST.length}</T>
            <AR size={22}>بَ بِ بُ</AR>
          </Row>
        </Card>
      </Section>
      <Button title={t('review')} kind="secondary" icon="albums-outline" onPress={() => router.push('/review')} />
    </Screen>
  );
}
