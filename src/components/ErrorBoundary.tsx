import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { reportCrash } from '@/lib/crash';
import { store } from '@/state';

type Props = { children: React.ReactNode };
type S = { error: Error | null };

const COPY = {
  fr: {
    title: 'Quelque chose s’est mal passé',
    text: 'L’écran a planté. Vos leçons restent sur cet appareil. Réessayez : le cours, la course et les révisions ne dépendent pas du réseau.',
    retry: 'Réessayer',
  },
  ar: {
    title: 'حَدَثَ خَطَأ',
    text: 'تَوَقَّفَتْ هٰذِهِ الشَّاشَة. دُرُوسُكَ مَا زَالَتْ عَلَى الجِهَاز. أَعِدِ المُحَاوَلَة.',
    retry: 'أَعِدِ المُحَاوَلَة',
  },
  en: {
    title: 'Something went wrong',
    text: 'This screen crashed. Your lessons stay on this device. Try again — lessons, the race and reviews do not need a network.',
    retry: 'Try again',
  },
} as const;

/**
 * Repli sans thème : il doit rester lisible même si le ThemeProvider a planté.
 * Couleurs de la palette claire (#FBF7EF, #1E2622, #0E6B5C).
 */
export class ErrorBoundary extends React.Component<Props, S> {
  state: S = { error: null };

  static getDerivedStateFromError(error: Error): S {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    reportCrash(error, info.componentStack ?? undefined);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const lang = store.get().settings.lang;
    const copy = COPY[lang] ?? COPY.fr;
    return (
      <View style={{ flex: 1, backgroundColor: '#FBF7EF', padding: 24, justifyContent: 'center', gap: 14 }}>
        <View style={{ maxWidth: 520, width: '100%', alignSelf: 'center', gap: 14 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#1E2622' }}>{copy.title}</Text>
          <Text style={{ fontSize: 16, lineHeight: 22, color: '#1E2622' }}>{copy.text}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.retry}
            onPress={() => this.setState({ error: null })}
            style={{ minHeight: 48, borderRadius: 14, backgroundColor: '#0E6B5C', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>{copy.retry}</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}
