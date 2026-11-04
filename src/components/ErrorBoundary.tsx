import React from 'react';
import { Appearance, Pressable, Text, View } from 'react-native';
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
 * Palette claire ou sombre selon le système (valeurs de theme.ts).
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
    // Palettes claire et sombre de theme.ts, en dur : ce repli ne dépend pas du ThemeProvider.
    const dark = Appearance.getColorScheme?.() === 'dark';
    const c = dark ? { bg: '#0F1715', text: '#EEF3EF', btn: '#3FB59E', btnText: '#06231D' } : { bg: '#FBF7EF', text: '#1E2622', btn: '#0E6B5C', btnText: '#FFFFFF' };
    return (
      <View accessibilityRole="alert" style={{ flex: 1, backgroundColor: c.bg, padding: 24, justifyContent: 'center', gap: 14 }}>
        <View style={{ maxWidth: 520, width: '100%', alignSelf: 'center', gap: 14 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: c.text }}>{copy.title}</Text>
          <Text style={{ fontSize: 16, lineHeight: 22, color: c.text }}>{copy.text}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.retry}
            onPress={() => this.setState({ error: null })}
            style={{ minHeight: 48, borderRadius: 14, backgroundColor: c.btn, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 }}
          >
            <Text style={{ color: c.btnText, fontWeight: '700', fontSize: 16 }}>{copy.retry}</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}
