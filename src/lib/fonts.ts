import * as Font from 'expo-font';
import { Platform } from 'react-native';

/** Police arabe embarquée : Noto Naskh Arabic (SIL Open Font License 1.1). */
export const AR_FONT = 'NotoNaskhArabic';
let loaded = false;

export async function loadArabicFont(): Promise<void> {
  try {
    await Promise.race([
      Font.loadAsync({ [AR_FONT]: require('../../assets/fonts/NotoNaskhArabic.ttf') }),
      new Promise<void>((_, rej) => setTimeout(() => rej(new Error('timeout')), 2500)),
    ]);
    loaded = true;
  } catch {
    loaded = false; // repli sur la police système : jamais bloquant
  }
}

export function arabicFamily(system = false): string | undefined {
  if (Platform.OS === 'web') {
    const stack = '"Noto Naskh Arabic", "Noto Sans Arabic", "Geeza Pro", "Traditional Arabic", "Arial", serif';
    return system ? stack : `${AR_FONT}, ${stack}`;
  }
  return !system && loaded ? AR_FONT : undefined;
}
