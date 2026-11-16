import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { TvArabic, TvFocus, TvMuted, TvScreen, TvTitle } from '@/components/tv/ui';
import { GRAMMAR_BY_ID } from '@/data/grammar';
import { tvArabicSize, tvChoices } from '@/lib/tv';
import { PASS, addXp, gradeItem, recordLesson } from '@/state';

/** Choix à la télécommande. Pas de clavier. Les réponses notent la même leçon que sur l’iPhone. */
export default function TvRead() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = GRAMMAR_BY_ID[String(id)];
  const theme = useTheme();
  const queue = useMemo(() => lesson?.items.slice(0, 6) ?? [], [lesson]);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [okCount, setOkCount] = useState(0);
  const item = queue[step];
  const pool = queue.map((entry) => entry.fr);
  const options = item ? tvChoices(item.fr, pool) : [];
  const done = step >= queue.length;

  if (!lesson) {
    return (
      <TvScreen>
        <TvTitle>Séance introuvable</TvTitle>
        <TvFocus preferred label="Retour" onPress={() => router.replace('/tv')}>
          <TvTitle>Retour</TvTitle>
        </TvFocus>
      </TvScreen>
    );
  }

  if (done) {
    const acc = queue.length ? okCount / queue.length : 0;
    return (
      <TvScreen>
        <TvTitle>{acc >= PASS ? 'Séance réussie' : 'On reprendra plus tard'}</TvTitle>
        <TvMuted>{Math.round(acc * 100)} %. Cinq minutes suffisent.</TvMuted>
        <View style={{ width: 420, marginTop: 24 }}>
          <TvFocus
            preferred
            label="Retour au salon"
            onPress={() => {
              recordLesson(lesson.id, acc);
              addXp(acc >= PASS ? 15 : 5);
              router.replace('/tv');
            }}
          >
            <TvTitle>Retour</TvTitle>
          </TvFocus>
        </View>
      </TvScreen>
    );
  }

  const size = tvArabicSize(item.ar);
  const correct = options.indexOf(item.fr);

  return (
    <TvScreen>
      <TvMuted>
        {lesson.level} · {step + 1}/{queue.length}
        {lesson.caution ? ' · à vérifier' : ''}
      </TvMuted>
      <TvTitle>{lesson.title.fr}</TvTitle>
      <View style={{ marginVertical: 18 }}>
        <TvArabic size={size.fontSize}>{item.ar}</TvArabic>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>
        {options.map((option, index) => {
          const show = picked != null;
          const good = index === correct;
          const bad = show && index === picked && !good;
          return (
            <View key={option} style={{ width: '31%', minWidth: 280 }}>
              <TvFocus
                preferred={index === 0 && picked == null}
                label={option}
                onPress={() => {
                  if (picked != null) return;
                  const hit = index === correct;
                  setPicked(index);
                  gradeItem(item.id, hit);
                  if (hit) setOkCount((n) => n + 1);
                }}
              >
                <TvTitle>{option}</TvTitle>
                {show && good ? <TvMuted>Juste</TvMuted> : null}
                {bad ? <TvMuted>Pas tout à fait</TvMuted> : null}
              </TvFocus>
            </View>
          );
        })}
      </View>
      {picked != null ? (
        <View style={{ width: 360, marginTop: 22 }}>
          <TvFocus
            preferred
            label="Continuer"
            onPress={() => {
              setPicked(null);
              setStep((n) => n + 1);
            }}
          >
            <TvTitle>Continuer</TvTitle>
          </TvFocus>
        </View>
      ) : (
        <TvMuted>Choisissez avec la télécommande. {item.tr}</TvMuted>
      )}
      <View style={{ height: 4, backgroundColor: theme.bg }} />
    </TvScreen>
  );
}
