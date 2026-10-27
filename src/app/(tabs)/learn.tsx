import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { alpha, useTheme } from '@/kit/theme';
import { Banner, Button, Card, Header, Ionicons, Progress, Row, Screen, Section, T, useToast } from '@/kit/ui';
import { AR, Pill } from '@/components/common';
import { UNITS, playable } from '@/data/curriculum';
import { UNIT_COLORS } from '@/theme';
import { useI18n } from '@/lib/i18n';
import { dueItems, nextLesson, store, streak, today, unitProgress, unitUnlocked } from '@/state';

export default function Learn() {
  const p = useTheme();
  const toast = useToast();
  const { lang, t, pick } = useI18n();
  const s = store.use();
  const gloss = s.settings.gloss;
  const next = nextLesson(s);
  const due = dueItems(s).length;
  const todayXp = s.days[today()] ?? 0;
  const goal = s.settings.dailyGoal;
  const st = streak(s);
  const nextUnit = next ? UNITS.find((u) => u.id === next.unitId) : null;

  return (
    <Screen
      header={
        <Header
          title="ArabGram"
          subtitle={pick({ fr: '11 unités · lecture et tashkīl', ar: '١١ وَحْدَة · القِرَاءَة وَالتَّشْكِيل', en: '11 units · reading & tashkīl' })}
          right={
            <Row gap={6}>
              <Pill color={p.warning}>🔥 {st}</Pill>
              <Pill color={p.primary}>{s.xp} XP</Pill>
            </Row>
          }
        />
      }
    >
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <T v="label" muted>{pick({ fr: 'Objectif du jour', ar: 'هَدَفُ اليَوْمِ', en: 'Today’s goal' })}</T>
          <T v="label" color={todayXp >= goal ? p.success : p.textMuted}>
            {Math.min(todayXp, goal)} / {goal} XP
          </T>
        </Row>
        <Progress value={todayXp / goal} color={todayXp >= goal ? p.success : p.primary} />
      </Card>

      {next && nextUnit ? (
        <Card accent={p.primary} onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: next.id } })} a11y={pick({ fr: 'Continuer la leçon', ar: 'تَابِعِ الدَّرْسَ', en: 'Continue lesson' })}>
          <T v="caption" muted>{t('continue')} · {t('unit')} {nextUnit.id}</T>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <T v="h2">{lang === 'ar' ? next.title.ar : next.title[gloss]}</T>
              <T v="small" muted>{lang === 'ar' ? nextUnit.ar : nextUnit[gloss]}</T>
            </View>
            <AR size={26}>{next.title.ar}</AR>
          </Row>
          <Button title={t('start')} icon="play" onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: next.id } })} />
        </Card>
      ) : (
        <Banner kind="success" title={pick({ fr: 'Parcours terminé', ar: 'أَحْسَنْتَ!', en: 'Path complete' })} text={pick({ fr: 'Toutes les unités ouvertes sont terminées. Révisez ou lancez la course.', ar: 'رَاجِعْ أَوِ ابْدَأِ السِّبَاقَ', en: 'All open units are done. Review or try the race.' })} />
      )}

      {due > 0 ? (
        <Banner
          kind="info"
          icon="albums-outline"
          title={`${due} · ${t('dueNow')}`}
          text={pick({ fr: 'Révision espacée (Leitner) : quelques minutes suffisent.', ar: 'مُرَاجَعَةٌ مُتَبَاعِدَةٌ قَصِيرَةٌ', en: 'Spaced review (Leitner): a few minutes is enough.' })}
          action={<Button small title={t('review')} onPress={() => router.push('/review')} />}
        />
      ) : null}

      <Section title={pick({ fr: 'Parcours', ar: 'المَسَار', en: 'Path' })}>
        {UNITS.map((u, i) => {
          const open = unitUnlocked(s, u.id);
          const prog = unitProgress(s, u.id);
          const color = UNIT_COLORS[i % UNIT_COLORS.length];
          const nPlay = u.lessons.filter(playable).length;
          const label = `${t('unit')} ${u.id} — ${lang === 'ar' ? u.ar : u[gloss]}${open ? '' : ' — ' + t('locked')}`;
          return (
            <Card
              key={u.id}
              a11y={label}
              onPress={() =>
                open
                  ? router.push({ pathname: '/unit/[id]', params: { id: String(u.id) } })
                  : toast(pick({ fr: 'Terminez l’unité précédente, ou débloquez tout dans Réglages.', ar: 'أَكْمِلِ الوَحْدَةَ السَّابِقَةَ أَوَّلًا', en: 'Finish the previous unit, or unlock all in Settings.' }), 'info')
              }
              style={{ opacity: open ? 1 : 0.6 }}
            >
              <Row gap={12}>
                <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: alpha(color, 0.14), alignItems: 'center', justifyContent: 'center' }}>
                  {open ? <AR size={u.icon.length > 2 ? 15 : 24} center color={color} weight="700">{u.icon}</AR> : <Ionicons name="lock-closed" size={22} color={p.textMuted} />}
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <T v="caption" color={color}>{t('unit')} {u.id}</T>
                    {prog >= 1 ? <Ionicons name="checkmark-circle" size={18} color={p.success} /> : null}
                  </Row>
                  <AR size={20} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{u.ar}</AR>
                  {lang !== 'ar' ? <T v="small" muted numberOfLines={1}>{u[gloss]}</T> : null}
                  <Progress value={prog} color={color} height={6} />
                  <T v="caption" muted>{Math.round(prog * nPlay)}/{nPlay} {t('lessons')}</T>
                </View>
              </Row>
            </Card>
          );
        })}
      </Section>

      <Section title={pick({ fr: 'Outils', ar: 'أَدَوَات', en: 'Tools' })}>
        <Row wrap>
          <Button small kind="secondary" icon="text" title={t('tashkil')} onPress={() => router.push('/tashkil-test')} />
          <Button small kind="secondary" icon="document-text-outline" title={t('sources')} onPress={() => router.push('/sources')} />
          <Button small kind="secondary" icon="sparkles-outline" title={t('tutor')} onPress={() => router.push('/tutor')} />
        </Row>
      </Section>
    </Screen>
  );
}
