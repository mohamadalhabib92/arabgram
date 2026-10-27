import * as Speech from 'expo-speech';

/**
 * Synthèse vocale de l’appareil (gratuite, sans API payante).
 * Prononciation indicative : dépend des voix arabes installées sur l’appareil.
 */
let cache = false;

export async function hasArabicVoice(): Promise<boolean> {
  if (cache) return true;
  try {
    const voices = await Promise.race([
      Speech.getAvailableVoicesAsync(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 1500)),
    ]);
    const ok = voices.some((v) => (v.language ?? "").toLowerCase().startsWith("ar"));
    if (ok) cache = true;
    return ok;
  } catch {
    return false;
  }
}

export function speakArabic(text: string, rate = 0.85) {
  try {
    Speech.stop();
    Speech.speak(text, { language: 'ar', rate });
  } catch {
    /* pas de synthèse disponible : silencieux */
  }
}
