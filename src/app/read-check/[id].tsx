import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { Button, Card, EmptyState, Row, Screen, Stat, T } from '@/kit/ui';
import { announce } from '@/kit/a11y';
import { AR, BackHeader } from '@/components/common';
import { UNITS } from '@/data/curriculum';
import { shuffle } from '@/lib/drill';
import { choiceSet, FLUENCY_KEY, readingList, readingScore, saveFluencyCheck, type FluencyRecord, type ReadItem } from '@/lib/fluency';
import { useI18n } from '@/lib/i18n';
import { store } from '@/state';

type Phase = 'ready' | 'ask' | 'done';

export default function ReadCheck() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = useTheme();
  const { t, pick } = useI18n();
  const gloss = store.useSelect((s) => s.settings.gloss);
  const unit = UNITS.find((item) => String(item.id) === String(id));
  const list = useMemo<ReadItem[]>(() => {
    if (!unit) return [];
    return readingList(unit.lessons.flatMap((lesson) => lesson.items.map((item) => ({ id: item.id, ar: item.ar, gloss: item[gloss], kind: item.kind }))));
  }, [unit, gloss]);
  const [phase, setPhase] = useState<Phase>('ready');
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [started, setStarted] = useState(0);
  const [result, setResult] = useState<FluencyRecord | null>(null);
  const choices = useMemo(() => (phase === 'ask' ? shuffle(choiceSet(list, index)) : []), [phase, list, index]);

  if (!unit) {
    return (
      <Screen header={<BackHeader title={t('unit')} />}>
        <EmptyState icon="help-circle-outline" title={pick({ fr: 'Unité introuvable', ar: 'الوَحْدَةُ غَيْرُ مَوْجُودَةٍ', en: 'Unit not found' })} action={<Button title={t('learn')} onPress={() => router.replace('/learn')} />} />
      </Screen>
    );
  }

  const title = pick({ fr: 'Lecture chronométrée', ar: 'قِرَاءَةٌ مُوَقَّتَة', en: 'Timed reading' });
  const word = list[index];

  const finish = (nextCorrect: number, elapsedMs: number) => {
    const score = readingScore({ words: list.length, correct: nextCorrect, elapsedMs });
    const rec: FluencyRecord = { unitId: unit.id, at: new Date().toISOString(), words: list.length, correct: nextCorrect, elapsedMs, ...score };
    setResult(rec);
    setPhase('done');
    announce(`${rec.wpm}. ${Math.round(rec.accuracy * 100)} %`);
    void saveFluencyCheck(AsyncStorage, FLUENCY_KEY, rec).catch(() => undefined);
  };

  return (
    <Screen header={<BackHeader title={title} subtitle={`${t('unit')} ${unit.id}`} />}>
      {list.length < 4 ? (
        <EmptyState icon="book-outline" title={pick({ fr: 'Pas assez de mots dans cette unité', ar: 'كَلِمَاتٌ قَلِيلَةٌ هُنَا', en: 'Not enough words in this unit' })} />
      ) : phase === 'ready' ? (
        <Card>
          <T v="body">{pick({ fr: 'Huit mots de l’unité, au plus. On mesure le temps et les réponses justes. Rien n’est envoyé, et la progression des leçons ne change pas.', ar: 'ثَمَانِي كَلِمَاتٍ عَلَى الأَكْثَر. الوَقْتُ وَالإِجَابَاتُ يَبْقَيَانِ هُنَا. دُرُوسُكَ لَا تَتَغَيَّر.', en: 'Up to eight words from this unit. Time and correct answers stay on this device. Lesson progress does not change.' })}</T>
          <Button title={t('start')} icon="play" onPress={() => { setStarted(Date.now()); setIndex(0); setCorrect(0); setPicked(null); setPhase('ask'); }} />
        </Card>
      ) : phase === 'ask' && word ? (
        <View style={{ gap: 12 }}>
          <T v="caption" muted>{index + 1}/{list.length}</T>
          <Card>
            <AR size={36} center weight="700">{word.ar}</AR>
            <T v="label" center>{pick({ fr: 'Que signifie ce mot ?', ar: 'مَا مَعْنَى هٰذِهِ الكَلِمَةِ؟', en: 'What does this word mean?' })}</T>
          </Card>
          {choices.map((glossChoice) => (
            <Button
              key={glossChoice}
              full
              kind={picked == null ? 'secondary' : glossChoice === word.gloss ? 'success' : glossChoice === picked ? 'danger' : 'ghost'}
              title={glossChoice}
              disabled={picked != null && glossChoice !== word.gloss && glossChoice !== picked}
              onPress={() => {
                if (picked) return;
                setPicked(glossChoice);
              }}
            />
          ))}
          {picked ? (
            <Button
              title={index + 1 >= list.length ? t('check') : t('continue')}
              onPress={() => {
                const nextCorrect = correct + (picked === word.gloss ? 1 : 0);
                if (index + 1 >= list.length) finish(nextCorrect, Date.now() - started);
                else {
                  setCorrect(nextCorrect);
                  setIndex(index + 1);
                  setPicked(null);
                }
              }}
            />
          ) : null}
        </View>
      ) : result ? (
        <Card>
          <T v="h2" center>{pick({ fr: 'Mesure de lecture', ar: 'قِيَاسُ القِرَاءَة', en: 'Reading measure' })}</T>
          <Row>
            <Stat label={pick({ fr: 'Mots/min', ar: 'كَلِمَة/د', en: 'Words/min' })} value={String(result.wpm)} color={p.primary} />
            <Stat label={t('accuracy')} value={`${Math.round(result.accuracy * 100)} %`} color={result.accuracy >= 0.8 ? p.success : p.warning} />
          </Row>
          <T v="small" muted center>{pick({ fr: 'Enregistré sur cet appareil seulement.', ar: 'مَحْفُوظٌ عَلَى هٰذَا الجِهَازِ فَقَط.', en: 'Saved on this device only.' })}</T>
          <Button title={pick({ fr: 'Recommencer', ar: 'أَعِدْ', en: 'Again' })} kind="secondary" onPress={() => { setPhase('ready'); setResult(null); }} />
          <Button title={t('unit')} onPress={() => router.replace({ pathname: '/unit/[id]', params: { id: String(unit.id) } })} />
        </Card>
      ) : null}
    </Screen>
  );
}
