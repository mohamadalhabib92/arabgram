import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { TvFocus, TvMuted, TvScreen, TvTitle } from '@/components/tv/ui';
import { GRAMMAR_LEVELS, nextGrammarLesson } from '@/data/grammar';
import { store } from '@/state';

export default function TvHome() {
  const theme = useTheme();
  const s = store.use();
  const next = nextGrammarLesson(s);
  return (
    <TvScreen>
      <TvTitle>ArabGram</TvTitle>
      <TvMuted>Le salon : une séance courte, en grand, avec la télécommande. Pas de clavier.</TvMuted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 22, marginTop: 28 }}>
        <View style={{ width: '48%', minWidth: 360 }}>
          <TvFocus
            preferred
            label={next ? `Séance de 5 minutes. ${next.title.fr}` : 'Séances terminées'}
            onPress={() => (next ? router.push({ pathname: '/tv/read/[id]', params: { id: next.id } }) : undefined)}
          >
            {(on) => (
              <>
                <TvMuted>5 minutes</TvMuted>
                <TvTitle>{next ? next.title.fr : 'Tout est fait'}</TvTitle>
              </>
            )}
          </TvFocus>
        </View>
        <View style={{ width: '48%', minWidth: 360 }}>
          <TvFocus label="Test de placement" onPress={() => router.push('/tv/place')}>
            <TvTitle>Placement</TvTitle>
            <TvMuted>Huit questions. Rien n’est effacé.</TvMuted>
          </TvFocus>
        </View>
        {GRAMMAR_LEVELS.map((level) => (
          <View key={level.id} style={{ width: '31%', minWidth: 280 }}>
            <TvFocus label={`${level.id}. ${level.fr}`} onPress={() => router.push({ pathname: '/tv/level/[id]', params: { id: level.id } })}>
              {(on) => <TvTitle>{on ? level.id : level.id}</TvTitle>}
            </TvFocus>
          </View>
        ))}
      </View>
      <TvMuted>Le PDF et le partage restent sur l’iPhone. Ici, on lit et on choisit.</TvMuted>
      <View style={{ height: 8, backgroundColor: theme.bg }} />
    </TvScreen>
  );
}
