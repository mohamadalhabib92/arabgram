import React, { useCallback, useEffect } from 'react';
import { Platform, View, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/kit/theme';
import { BootGate, OfflineBadge, ToastProvider } from '@/kit/ui';
import { DelightProvider } from '@/kit/premium';
import { hydrateHaptics } from '@/kit/haptics';
import { FocusLayer, useFocus } from '@/kit/focusApp';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OptionalServiceBanner } from '@/components/OptionalServiceBanner';
import { makePalette } from '@/theme';
import { store } from '@/state';
import { initCrashReporting } from '@/lib/crash';
import { loadArabicFont } from '@/lib/fonts';

export default function RootLayout() {
  const settings = store.useSelect((s) => s.settings);
  const scheme = useColorScheme();
  const dark = settings.theme === 'dark' || (settings.theme === 'system' && scheme === 'dark');
  const rtl = settings.lang === 'ar';
  // Mode Focus : plein écran (barre d’état masquée) tant qu’une session est active.
  const focusActive = !!useFocus().data.active;
  const palette = makePalette({
    dark,
    contrast: settings.contrast,
    scale: settings.textScale,
    digits: settings.digits,
    reduceMotion: settings.reduceMotion,
    rtl,
  });
  // Démarrage : stockage local + police embarquée. Aucun appel réseau (ni OpenAI, ni Sentry, ni tuteur).
  const hydrate = useCallback(() => Promise.all([store.hydrate(), loadArabicFont()]).then(() => undefined), []);

  useEffect(() => {
    initCrashReporting();
    // Préférence « Vibrations » (clé dédiée, activée par défaut).
    void hydrateHaptics();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.lang = settings.lang;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  }, [settings.lang, rtl]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider value={palette}>
          <ToastProvider>
            <DelightProvider>
            <StatusBar style={dark ? 'light' : 'dark'} hidden={focusActive} />
            <View style={{ flex: 1, direction: rtl ? 'rtl' : 'ltr', backgroundColor: palette.bg }}>
              <BootGate hydrate={hydrate} appName="ArabGram · عَرَبْغْرَام" timeoutMs={8000} lang={settings.lang}>
                <OfflineBadge text={rtl ? 'غَيْرُ مُتَّصِل — المُحْتَوَى مُتَاحٌ مَحَلِّيًّا' : settings.lang === 'en' ? 'Offline — lessons available locally' : 'Hors ligne — leçons disponibles localement'} />
                <OptionalServiceBanner />
                <FocusLayer>
                  <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.bg } }} />
                </FocusLayer>
              </BootGate>
            </View>
            </DelightProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
