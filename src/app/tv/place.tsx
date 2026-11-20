import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { TvArabic, TvFocus, TvMuted, TvScreen, TvTitle } from '@/components/tv/ui';
import { PLACEMENT_QUESTIONS, placementFromAnswers } from '@/data/grammar';
import { setPlacement } from '@/state';

export default function TvPlace() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const done = step >= PLACEMENT_QUESTIONS.length;
  const q = PLACEMENT_QUESTIONS[step];
  const level = done ? placementFromAnswers(picks) : null;

  if (done && level) {
    return (
      <TvScreen>
        <TvTitle>Niveau proposé : {level}</TvTitle>
        <TvMuted>Les leçons déjà faites restent. Rien n’est effacé.</TvMuted>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 28 }}>
          <View style={{ width: 420 }}>
            <TvFocus
              preferred
              label={`Garder ${level}`}
              onPress={() => {
                setPlacement(level);
                router.replace('/tv');
              }}
            >
              <TvTitle>Garder {level}</TvTitle>
            </TvFocus>
          </View>
          <View style={{ width: 320 }}>
            <TvFocus label="Ne rien changer" onPress={() => router.replace('/tv')}>
              <TvTitle>Retour</TvTitle>
            </TvFocus>
          </View>
        </View>
      </TvScreen>
    );
  }

  if (!q) return null;
  return (
    <TvScreen>
      <TvMuted>
        {step + 1}/{PLACEMENT_QUESTIONS.length}
      </TvMuted>
      <TvTitle>{q.prompt}</TvTitle>
      <TvArabic>{q.ar}</TvArabic>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 20 }}>
        {q.options.map((option, index) => (
          <View key={option} style={{ width: '31%', minWidth: 280 }}>
            <TvFocus
              preferred={index === 0}
              label={option}
              onPress={() => {
                setPicks((prev) => ({ ...prev, [q.id]: index }));
                setStep((n) => n + 1);
              }}
            >
              <TvTitle>{option}</TvTitle>
            </TvFocus>
          </View>
        ))}
      </View>
    </TvScreen>
  );
}
