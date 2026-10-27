import React, { useCallback, useEffect } from 'react';
import { Platform, View, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/kit/theme';
import { BootGate, OfflineBadge, ToastProvider } from '@/kit/ui';
import { makePalette } from '@/theme';
import { store } from '@/state';
import { loadArabicFont } from '@/lib/fonts';

export default function RootLayout() {
  const settings = store.useSelect((s) => s.settings);
  const scheme = useColorScheme();
  const dark = settings.theme === 'dark' || (settings.theme === 'system' && scheme === 'dark');
  const palette = makePalette({ dark, contrast: settings.contrast, scale: settings.textScale });
  const rtl = settings.lang === 'ar';
  // Le chargement ne bloque jamais : stockage local + police, chacun avec repli.
  const hydrate = useCallback(() => Promise.all([store.hydrate(), loadArabicFont()]).then(() => undefined), []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.lang = settings.lang;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  }, [settings.lang, rtl]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={palette}>
        <ToastProvider>
          <StatusBar style={dark ? 'light' : 'dark'} />
          <View style={{ flex: 1, direction: rtl ? 'rtl' : 'ltr', backgroundColor: palette.bg }}>
            <BootGate hydrate={hydrate} appName="ArabGram · عَرَبْغْرَام">
              <OfflineBadge text={rtl ? 'غَيْرُ مُتَّصِل — المُحْتَوَى مُتَاحٌ مَحَلِّيًّا' : settings.lang === 'en' ? 'Offline — lessons available locally' : 'Hors ligne — leçons disponibles localement'} />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.bg } }} />
            </BootGate>
          </View>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
