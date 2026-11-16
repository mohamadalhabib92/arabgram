import React from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TvArabic, TvFocus, TvMuted, TvScreen, TvTitle } from '@/components/tv/ui';
import { levelById } from '@/data/grammar';
import { lessonDone, store } from '@/state';

export default function TvLevel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const level = levelById(String(id));
  const s = store.use();
  if (!level) {
    return (
      <TvScreen>
        <TvTitle>Niveau introuvable</TvTitle>
        <TvFocus preferred label="Retour" onPress={() => router.replace('/tv')}>
          <TvTitle>Retour</TvTitle>
        </TvFocus>
      </TvScreen>
    );
  }
  const lessons = level.units.flatMap((unit) => unit.lessons);
  return (
    <TvScreen>
      <TvTitle>{level.fr}</TvTitle>
      <TvMuted>{level.blurb.fr}</TvMuted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 24 }}>
        <View style={{ width: '31%', minWidth: 280 }}>
          <TvFocus preferred label="Retour au salon" onPress={() => router.replace('/tv')}>
            <TvTitle>Retour</TvTitle>
          </TvFocus>
        </View>
        {lessons.map((lesson) => (
          <View key={lesson.id} style={{ width: '31%', minWidth: 280 }}>
            <TvFocus label={lesson.title.fr} onPress={() => router.push({ pathname: '/tv/read/[id]', params: { id: lesson.id } })}>
              <TvArabic size={36}>{lesson.title.ar}</TvArabic>
              <TvMuted>{lessonDone(s, lesson) ? 'Faite' : `${lesson.minutes} min`}</TvMuted>
            </TvFocus>
          </View>
        ))}
      </View>
    </TvScreen>
  );
}
