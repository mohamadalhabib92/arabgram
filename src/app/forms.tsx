import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/kit/theme';
import { Button, Card, EmptyState, Screen, T } from '@/kit/ui';
import { AR, BackHeader } from '@/components/common';
import { UNITS } from '@/data/curriculum';
import { buildFormDrill, FORM_POSITIONS, type FormPosition } from '@/lib/formsDrill';
import { useI18n } from '@/lib/i18n';

const LABELS: Record<FormPosition, { fr: string; ar: string; en: string }> = {
  isolated: { fr: 'Isolée', ar: 'مُنْفَصِلَة', en: 'Isolated' },
  initial: { fr: 'Début', ar: 'أَوَّل', en: 'Initial' },
  medial: { fr: 'Milieu', ar: 'وَسَط', en: 'Medial' },
  final: { fr: 'Fin', ar: 'آخِر', en: 'Final' },
};

export default function FormsDrill() {
  const p = useTheme();
  const { pick } = useI18n();
  const questions = useMemo(() => buildFormDrill(UNITS.flatMap((unit) => unit.lessons.flatMap((lesson) => lesson.items.filter((item) => item.kind === 'letter').map((item) => item.ar)))), []);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<FormPosition | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const question = questions[index];

  if (!question && !done) {
    return (
      <Screen header={<BackHeader title={pick({ fr: 'Formes des lettres', ar: 'أَشْكَالُ الحُرُوف', en: 'Letter shapes' })} />}>
        <EmptyState icon="text-outline" title={pick({ fr: 'Aucune lettre liante', ar: 'لَا حَرْفَ هُنَا', en: 'No joining letter' })} />
      </Screen>
    );
  }

  return (
    <Screen header={<BackHeader title={pick({ fr: 'Formes des lettres', ar: 'أَشْكَالُ الحُرُوف', en: 'Letter shapes' })} subtitle={done ? undefined : `${index + 1}/${questions.length}`} />}>
      {done ? (
        <Card>
          <T v="h2" center>{pick({ fr: 'Formes reconnues', ar: 'أَشْكَالٌ مَعْرُوفَة', en: 'Shapes recognized' })}</T>
          <T v="h1" center color={p.primary}>{correct}/{questions.length}</T>
          <Button title={pick({ fr: 'Recommencer', ar: 'أَعِدْ', en: 'Again' })} onPress={() => { setIndex(0); setPicked(null); setCorrect(0); setDone(false); }} />
        </Card>
      ) : question ? (
        <View style={{ gap: 12 }}>
          <Card>
            <T v="label" center>{pick({ fr: 'Où se place cette forme ?', ar: 'أَيْنَ هٰذَا الشَّكْلُ؟', en: 'Where does this shape sit?' })}</T>
            <AR size={56} center weight="700">{question.glyph}</AR>
          </Card>
          {FORM_POSITIONS.map((pos) => (
            <Button
              key={pos}
              full
              kind={picked == null ? 'secondary' : pos === question.answer ? 'success' : pos === picked ? 'danger' : 'ghost'}
              title={pick(LABELS[pos])}
              disabled={picked != null && pos !== question.answer && pos !== picked}
              onPress={() => {
                if (!picked) setPicked(pos);
              }}
            />
          ))}
          {picked ? (
            <Button
              title={index + 1 >= questions.length ? pick({ fr: 'Voir le résultat', ar: 'النَّتِيجَة', en: 'See the result' }) : pick({ fr: 'Suivant', ar: 'التَّالِي', en: 'Next' })}
              onPress={() => {
                const nextCorrect = correct + (picked === question.answer ? 1 : 0);
                if (index + 1 >= questions.length) {
                  setCorrect(nextCorrect);
                  setDone(true);
                } else {
                  setCorrect(nextCorrect);
                  setIndex(index + 1);
                  setPicked(null);
                }
              }}
            />
          ) : null}
        </View>
      ) : null}
    </Screen>
  );
}
