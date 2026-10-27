import { isConfigured, type ConfigEntry } from '@/kit/config';

/**
 * Le cœur d’ArabGram n’a besoin d’AUCUNE configuration.
 * Phase 2 : tuteur IA via un serveur à vous (la clé OpenAI reste côté serveur).
 */
export const ENV = {
  tutorApiUrl: process.env.EXPO_PUBLIC_TUTOR_API_URL ?? 'YOUR_TUTOR_API_URL',
};

export const CONFIG: ConfigEntry[] = [
  { name: 'EXPO_PUBLIC_TUTOR_API_URL', value: ENV.tutorApiUrl, phase: 'Phase 2', note: 'URL publique de votre serveur tuteur (aucun secret)' },
  { name: 'OPENAI_API_KEY (serveur)', value: 'YOUR_OPENAI_API_KEY', secret: true, phase: 'Phase 2', note: 'Secret serveur uniquement — jamais dans l’app ni en EXPO_PUBLIC_' },
];

export const tutorReady = () => isConfigured(ENV.tutorApiUrl);
