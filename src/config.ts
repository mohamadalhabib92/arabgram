import Constants from 'expo-constants';
import { isConfigured, type ConfigEntry } from '@/kit/config';

/**
 * Le cœur d’ArabGram n’a besoin d’AUCUNE configuration.
 * Phase 2 : tuteur et compte restent éteints. La clé OpenAI n’est jamais lue ici.
 * EXPO_PUBLIC_EXAMPLE_ENV_VAR a été retirée et ne doit pas revenir.
 */
function extraFlag(name: string): boolean {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
  return extra[name] === true;
}

export const FLAGS = {
  get tutor() {
    return extraFlag('featureTutor');
  },
  get account() {
    return extraFlag('featureAccount');
  },
};

export const ENV = {
  tutorApiUrl: process.env.EXPO_PUBLIC_TUTOR_API_URL ?? 'YOUR_TUTOR_API_URL',
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? 'YOUR_SENTRY_DSN',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'YOUR_SUPABASE_URL',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'YOUR_SUPABASE_ANON_KEY',
};

export const CONFIG: ConfigEntry[] = [
  { name: 'EXPO_PUBLIC_TUTOR_API_URL', value: ENV.tutorApiUrl, phase: 'Phase 2', note: 'URL publique de votre serveur tuteur (aucun secret)' },
  { name: 'OPENAI_API_KEY (serveur)', value: 'YOUR_OPENAI_API_KEY', secret: true, phase: 'Phase 2', note: 'Secret serveur uniquement — jamais dans l’app ni en EXPO_PUBLIC_' },
  { name: 'PORT (serveur)', value: 'YOUR_PORT', phase: 'Phase 2', note: 'Port du serveur tuteur uniquement — pas utilisé par l’app' },
  { name: 'FEATURE_TUTOR', value: FLAGS.tutor ? 'true' : 'false', phase: 'Phase 2', note: 'false par défaut. L’écran inachevé reste masqué hors __DEV__' },
  { name: 'FEATURE_ACCOUNT', value: FLAGS.account ? 'true' : 'false', phase: 'Phase 2', note: 'false : pas de compte en phase 1' },
  { name: 'EXPO_PUBLIC_SUPABASE_URL', value: ENV.supabaseUrl, phase: 'Phase 2', note: 'Placeholder. Aucune migration n’est appliquée.' },
  { name: 'EXPO_PUBLIC_SUPABASE_ANON_KEY', value: ENV.supabaseAnonKey, phase: 'Phase 2', note: 'Placeholder. Jamais une clé secrète.' },
  { name: 'EXPO_PUBLIC_SENTRY_DSN', value: ENV.sentryDsn, phase: 'Optionnel', note: 'Journal de crash désactivé tant que la valeur commence par YOUR_' },
];

export const tutorReady = () => isConfigured(ENV.tutorApiUrl);

/** Écran « Tuteur IA — phase 2 / Non activé » : visible seulement en développement. */
export function showTutorScreen(): boolean {
  return typeof __DEV__ !== 'undefined' && __DEV__;
}
