import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { alpha, useTheme } from '@/kit/theme';
import { Button, Card, EmptyState, Header, Row, Screen, Section, T } from '@/kit/ui';
import { AR, Translit } from '@/components/common';
import { ALL_ITEMS } from '@/data/curriculum';
import { fmtDate } from '@/kit/format';
import { useI18n } from '@/lib/i18n';
import { LEITNER_DAYS, boxCounts, dueItems, store, today } from '@/state';

export default function Review() {
  const p = useTheme();
  const { t, pick } = useI18n();
  const s = store.use();
  const gloss = s.settings.gloss;
  const due = dueItems(s);
  const counts = boxCounts(s);
  const upcoming = Object.values(s.srs)
    .map((c) => c.due)
    .filter((d) => d > today())
    .sort()[0];
  const started = Object.keys(s.srs).length;

  return (
    <Screen header={<Header title={t('review')} subtitle={pick({ fr: 'Répétition espacée — système de Leitner (5 boîtes)', ar: 'التَّكْرَارُ المُتَبَاعِدُ — خَمْسَةُ صَنَادِيق', en: 'Spaced repetition — Leitner system (5 boxes)' })} />}>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <T v="display" color={due.length ? p.primary : p.success}>{due.length}</T>
            <T v="small" muted>{t('dueNow')}</T>
          </View>
          <Button title={pick({ fr: 'Réviser maintenant', ar: 'رَاجِعِ الآنَ', en: 'Review now' })} icon="play" disabled={!due.length} onPress={() => router.push({ pathname: '/drill', params: { mode: 'review' } })} />
        </Row>
        {!due.length && upcoming ? (
          <T v="small" muted>{pick({ fr: 'Prochaine révision : ', ar: 'المُرَاجَعَةُ القَادِمَةُ: ', en: 'Next review: ' })}{fmtDate(upcoming + 'T12:00:00', false)}</T>
        ) : null}
      </Card>

      <Section title={pick({ fr: 'Boîtes Leitner', ar: 'صَنَادِيقُ لَايْتْنَر', en: 'Leitner boxes' })}>
        <Row gap={6}>
          {[1, 2, 3, 4, 5].map((b) => (
            <View
              key={b}
              accessible
              accessibilityLabel={`${pick({ fr: 'Boîte', ar: 'صُنْدُوق', en: 'Box' })} ${b}: ${counts[b]}`}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: alpha(p.primary, 0.05 + b * 0.05) }}
            >
              <T v="h2">{counts[b]}</T>
              <T v="caption" muted>#{b}</T>
              <T v="caption" muted>{LEITNER_DAYS[b] === 0 ? pick({ fr: 'auj.', ar: 'اليَوْم', en: 'today' }) : `+${LEITNER_DAYS[b]} ${pick({ fr: 'j', ar: 'ي', en: 'd' })}`}</T>
            </View>
          ))}
        </Row>
        <T v="small" muted>
          {pick({
            fr: `Bonne réponse → boîte suivante (intervalle plus long). Erreur → retour en boîte 1. ${started}/${ALL_ITEMS.length} éléments commencés.`,
            ar: `الجَوَابُ الصَّحِيحُ ← الصُّنْدُوقُ التَّالِي. الخَطَأُ ← الصُّنْدُوقُ ١. ${started}/${ALL_ITEMS.length}`,
            en: `Correct → next box (longer interval). Wrong → back to box 1. ${started}/${ALL_ITEMS.length} items started.`,
          })}
        </T>
      </Section>

      {due.length ? (
        <Section title={pick({ fr: 'Au programme', ar: 'المُقَرَّر', en: 'Up next' })}>
          {due.slice(0, 8).map((it) => (
            <Card key={it.id}>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <T v="body">{it[gloss]}</T>
                  <Translit>{it.tr}</Translit>
                </View>
                <AR size={24}>{it.ar}</AR>
              </Row>
            </Card>
          ))}
        </Section>
      ) : started === 0 ? (
        <EmptyState icon="albums-outline" title={pick({ fr: 'Pas encore de cartes', ar: 'لَا بِطَاقَاتَ بَعْدُ', en: 'No cards yet' })} text={pick({ fr: 'Faites une première leçon : chaque élément rejoint vos boîtes de révision.', ar: 'اِبْدَأْ دَرْسًا أَوَّلًا', en: 'Do a first lesson: each item joins your review boxes.' })} action={<Button title={t('learn')} onPress={() => router.push('/learn')} />} />
      ) : null}
    </Screen>
  );
}
