import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { Button, Card, Grid, Header, Progress, Row, Screen, T } from '@/kit/ui';
import { DesktopSearch } from '@/components/DesktopSearch';
import { AR } from '@/components/common';
import { GRAMMAR_LEVELS, coverageReport, levelStats, levelUnlocked, nextGrammarLesson } from '@/data/grammar';
import { useI18n } from '@/lib/i18n';
import { store } from '@/state';

export default function GrammarHome() {
  const p = useTheme();
  const { pick } = useI18n();
  const s = store.use();
  const next = nextGrammarLesson(s);
  const report = coverageReport();
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const levels = GRAMMAR_LEVELS.filter((level) => !needle || `${level.id} ${level.fr} ${level.en} ${level.ar}`.toLowerCase().includes(needle));

  return (
    <Screen header={<Header title={pick({ fr: 'Grammaire', ar: 'القَوَاعِد', en: 'Grammar' })} subtitle={pick({ fr: 'A1 → C1 · séances de 5 minutes', ar: 'خَمْسُ دَقَائِق', en: 'A1 → C1 · 5-minute sessions' })} />}>
      <Card accent={p.primary}>
        <T v="caption" color={p.primary}>{pick({ fr: 'Prochaine séance', ar: 'الجَلْسَةُ التَّالِيَة', en: 'Next session' })}</T>
        {next ? (
          <>
            <T v="h2">{next.title.fr}</T>
            <AR size={22}>{next.title.ar}</AR>
            <T v="small" muted>{next.level} · {next.minutes} min · {next.items.length} {pick({ fr: 'cartes', ar: 'بِطَاقَات', en: 'cards' })}</T>
            <Button title={pick({ fr: 'Commencer ces 5 minutes', ar: 'اِبْدَأْ', en: 'Start these 5 minutes' })} icon="play" onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: next.id } })} />
          </>
        ) : (
          <T v="body">{pick({ fr: 'Toutes les séances ouvertes sont faites. Beau travail.', ar: 'أَحْسَنْتَ', en: 'Every open session is done. Well done.' })}</T>
        )}
      </Card>

      <Row wrap>
        <Button small kind="secondary" title={pick({ fr: 'Test de placement', ar: 'اِخْتِبَار', en: 'Placement test' })} onPress={() => router.push('/grammar/place')} />
        <Button small kind="secondary" title={pick({ fr: 'Retour au parcours', ar: 'المَسَار', en: 'Back to the path' })} onPress={() => router.push('/learn')} />
      </Row>
      {s.placement ? <T v="small" muted>{pick({ fr: 'Placement enregistré', ar: 'المُسْتَوَى', en: 'Placement saved' })} : {s.placement}</T> : null}

      <DesktopSearch value={query} onChange={setQuery} placeholder={pick({ fr: 'Rechercher un niveau', ar: 'اِبْحَثْ', en: 'Search a level' })} />
      <Grid>
      {levels.map((level) => {
        const stats = levelStats(s, level.id);
        const open = levelUnlocked(s, level.id);
        const row = report.find((entry) => entry.level === level.id);
        return (
          <Card key={level.id} accent={open ? p.primary : undefined} style={{ opacity: open ? 1 : 0.55 }} onPress={open ? () => router.push({ pathname: '/grammar/level/[id]', params: { id: level.id } }) : undefined} a11y={`${level.id} ${level.fr}`}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View style={{ flex: 1, gap: 4 }}>
                <T v="caption" color={p.primary}>{level.id}</T>
                <T v="h3">{level.fr}</T>
                <T v="small" muted>{level.blurb.fr}</T>
              </View>
              <T v="label">{stats.done}/{stats.total}</T>
            </Row>
            <Progress value={stats.ratio} />
            <T v="caption" muted>
              {row?.topics.join(' · ')}
              {row && row.caution > 0 ? ` · ${row.caution} ${pick({ fr: 'à vérifier', ar: 'لِلمُرَاجَعَة', en: 'to check' })}` : ''}
              {level.id === 'A1' ? ` · ${pick({ fr: 'lecture : 11 unités déjà là', ar: '١١ وَحْدَة', en: 'reading: 11 units already here' })}` : ''}
            </T>
          </Card>
        );
      })}
      </Grid>
    </Screen>
  );
}
