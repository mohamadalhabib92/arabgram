import { store, type UiLang } from '@/state';

/** Chaînes d’interface FR / AR / EN. Les libellés d’accessibilité suivent la langue choisie. */
const S = {
  learn: { fr: 'Apprendre', ar: 'تَعَلَّمْ', en: 'Learn' },
  review: { fr: 'Révisions', ar: 'مُرَاجَعَة', en: 'Review' },
  pacer: { fr: 'Course', ar: 'السِّبَاق', en: 'Race' },
  progress: { fr: 'Progrès', ar: 'التَّقَدُّم', en: 'Progress' },
  settings: { fr: 'Réglages', ar: 'الإِعْدَادَات', en: 'Settings' },
  unit: { fr: 'Unité', ar: 'الوَحْدَة', en: 'Unit' },
  lesson: { fr: 'Leçon', ar: 'الدَّرْس', en: 'Lesson' },
  lessons: { fr: 'leçons', ar: 'دُرُوس', en: 'lessons' },
  start: { fr: 'Commencer', ar: 'اِبْدَأْ', en: 'Start' },
  continue: { fr: 'Continuer', ar: 'تَابِعْ', en: 'Continue' },
  check: { fr: 'Vérifier', ar: 'تَحَقَّقْ', en: 'Check' },
  back: { fr: 'Retour', ar: 'رُجُوع', en: 'Back' },
  close: { fr: 'Fermer', ar: 'إِغْلَاق', en: 'Close' },
  listen: { fr: 'Écouter', ar: 'اِسْتَمِعْ', en: 'Listen' },
  correct: { fr: 'Correct !', ar: 'أَحْسَنْتَ!', en: 'Correct!' },
  wrong: { fr: 'Pas tout à fait', ar: 'لَيْسَ تَمَامًا', en: 'Not quite' },
  answer: { fr: 'Réponse', ar: 'الجَوَاب', en: 'Answer' },
  locked: { fr: 'Verrouillée', ar: 'مُقْفَلَة', en: 'Locked' },
  done: { fr: 'Terminée', ar: 'مُكْتَمِلَة', en: 'Done' },
  dueNow: { fr: 'À réviser maintenant', ar: 'لِلْمُرَاجَعَةِ الآنَ', en: 'Due now' },
  streak: { fr: 'Série', ar: 'أَيَّام مُتَتَالِيَة', en: 'Streak' },
  today: { fr: 'Aujourd’hui', ar: 'اليَوْم', en: 'Today' },
  accuracy: { fr: 'Précision', ar: 'الدِّقَّة', en: 'Accuracy' },
  speed: { fr: 'Vitesse', ar: 'السُّرْعَة', en: 'Speed' },
  score: { fr: 'Score', ar: 'النَّتِيجَة', en: 'Score' },
  sources: { fr: 'Sources & licences', ar: 'المَصَادِر وَالتَّرَاخِيص', en: 'Sources & licences' },
  tashkil: { fr: 'Test tashkīl', ar: 'اِخْتِبَار التَّشْكِيل', en: 'Tashkīl test' },
  tutor: { fr: 'Tuteur IA (Phase 2)', ar: 'المُعَلِّم الذَّكِيّ', en: 'AI tutor (Phase 2)' },
  quit: { fr: 'Quitter l’exercice', ar: 'خُرُوج', en: 'Quit exercise' },
} as const;

export type SKey = keyof typeof S;

export function tr(key: SKey, lang: UiLang): string {
  return S[key][lang];
}

/** Hook : renvoie un traducteur lié à la langue d’interface courante. */
export function useI18n() {
  const lang = store.useSelect((s) => s.settings.lang);
  return { lang, t: (k: SKey) => S[k][lang], pick: (o: { fr: string; ar?: string; en: string }) => (lang === 'ar' ? o.ar ?? o.fr : o[lang]) };
}
