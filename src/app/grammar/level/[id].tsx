import React from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { Banner, Button, Card, EmptyState, Screen, T } from '@/kit/ui';
import { AR, BackHeader } from '@/components/common';
import { UNITS } from '@/data/curriculum';
import { levelById, levelStats } from '@/data/grammar';
import { useI18n } from '@/lib/i18n';
import { lessonDone, store } from '@/state';

export default function GrammarLevel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const level = levelById(String(id));
  const p = useTheme();
  const { pick, t } = useI18n();
  const s = store.use();
  if (!level) {
    return (
      <Screen header={<BackHeader title={pick({ fr: 'Niveau', ar: 'مُسْتَوًى', en: 'Level' })} />}>
        <EmptyState icon="help-circle-outline" title={pick({ fr: 'Niveau introuvable', ar: 'غَيْرُ مَوْجُود', en: 'Level not found' })} action={<Button title={pick({ fr: 'Grammaire', ar: 'القَوَاعِد', en: 'Grammar' })} onPress={() => router.replace('/grammar')} />} />
      </Screen>
    );
  }
  const stats = levelStats(s, level.id);
  return (
    <Screen header={<BackHeader title={level.fr} subtitle={`${stats.done}/${stats.total}`} />}>
      <Card>
        <AR size={28} center>{level.ar}</AR>
        <T v="body" center>{level.blurb.fr}</T>
        <T v="small" muted center>{pick({ fr: 'Une séance = une leçon. Vous pouvez vous arrêter après.', ar: 'جَلْسَةٌ وَاحِدَةٌ ثُمَّ تَتَوَقَّف', en: 'One session is one lesson. You can stop after it.' })}</T>
      </Card>
      {level.id === 'A1' ? (
        <Card onPress={() => router.push('/learn')} a11y={pick({ fr: 'Ouvrir le parcours de lecture', ar: 'القِرَاءَة', en: 'Open the reading path' })}>
          <T v="h3">{pick({ fr: 'Lecture déjà dans l’app', ar: 'القِرَاءَةُ مَوْجُودَة', en: 'Reading already in the app' })}</T>
          <T v="small" muted>{pick({ fr: `${UNITS.length} unités, de l’alphabet aux proverbes. Rien n’est recommencé.`, ar: '١١ وَحْدَة', en: `${UNITS.length} units, from the alphabet to proverbs. Nothing starts over.` })}</T>
        </Card>
      ) : null}
      {level.units.map((u) => (
        <View key={u.id} style={{ gap: 8 }}>
          <T v="label" color={p.primary}>{u.fr}</T>
          {u.lessons.map((lesson) => {
            const ok = lessonDone(s, lesson);
            return (
              <Card key={lesson.id} accent={ok ? p.success : undefined} onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } })} a11y={lesson.title.fr}>
                <T v="caption" muted>{lesson.minutes} min{lesson.caution ? ` · ${pick({ fr: 'à vérifier', ar: 'لِلمُرَاجَعَة', en: 'to check' })}` : ''}</T>
                <T v="h3">{lesson.title.fr}</T>
                <AR size={20}>{lesson.title.ar}</AR>
                {ok ? <T v="small" color={p.success}>{t('done')}</T> : null}
              </Card>
            );
          })}
        </View>
      ))}
      {level.units.some((u) => u.lessons.some((l) => l.caution)) ? (
        <Banner kind="warning" icon="alert-circle" text={pick({ fr: 'Les séances « à vérifier » sont des brouillons pédagogiques. Elles ne citent pas un manuel.', ar: 'لِلمُرَاجَعَة', en: 'Sessions marked to be checked are teaching drafts. They do not quote a manual.' })} />
      ) : null}
    </Screen>
  );
}
