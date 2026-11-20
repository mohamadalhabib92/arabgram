import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { Button, Card, Screen, T } from '@/kit/ui';
import { AR, BackHeader } from '@/components/common';
import { QuizChoices } from '@/components/QuizChoices';
import { PLACEMENT_QUESTIONS, placementFromAnswers } from '@/data/grammar';
import { useI18n } from '@/lib/i18n';
import { setPlacement } from '@/state';

/** Le test propose un niveau. Il n’efface aucune leçon ni aucune boîte. */
export default function Placement() {
  const p = useTheme();
  const { pick } = useI18n();
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const q = PLACEMENT_QUESTIONS[step];
  const done = step >= PLACEMENT_QUESTIONS.length;
  const level = done ? placementFromAnswers(picks) : null;

  return (
    <Screen header={<BackHeader title={pick({ fr: 'Placement', ar: 'المُسْتَوَى', en: 'Placement' })} subtitle={done ? level ?? '' : `${step + 1}/${PLACEMENT_QUESTIONS.length}`} />}>
      {done && level ? (
        <Card accent={p.primary}>
          <T v="h2">{pick({ fr: 'Niveau proposé', ar: 'المُسْتَوَى', en: 'Suggested level' })} : {level}</T>
          <T v="body">{pick({ fr: 'Vos leçons déjà réussies restent. Ce choix ouvre seulement la suite.', ar: 'مَا أَنْجَزْتَهُ يَبْقَى', en: 'Lessons you already passed stay. This only opens what comes next.' })}</T>
          <Button
            title={pick({ fr: 'Garder ce niveau', ar: 'اِحْفَظْ', en: 'Keep this level' })}
            onPress={() => {
              setPlacement(level);
              router.replace('/grammar');
            }}
          />
          <Button kind="secondary" title={pick({ fr: 'Ne rien changer', ar: 'بِلَا تَغْيِير', en: 'Change nothing' })} onPress={() => router.back()} />
        </Card>
      ) : q ? (
        <View style={{ gap: 12 }}>
          <T v="h3">{q.prompt}</T>
          <Card>
            <AR size={36} center>{q.ar}</AR>
          </Card>
          <QuizChoices
            count={q.options.length}
            pickedIndex={picks[q.id] ?? null}
            answerIndex={-1}
            revealed={false}
            onPick={(index) => {
              const next = { ...picks, [q.id]: index };
              setPicks(next);
              setStep((n) => n + 1);
            }}
            labelFor={(index) => q.options[index]}
            renderOption={(index) => <T v="h3" center>{q.options[index]}</T>}
          />
          <T v="caption" muted>{pick({ fr: 'Pas de note dans les boîtes. Une touche, et on continue.', ar: 'بِلَا دَرَجَة', en: 'No box is graded. One tap, then continue.' })}</T>
        </View>
      ) : null}
    </Screen>
  );
}
