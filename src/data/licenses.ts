/**
 * Métadonnées de licence affichées sur chaque leçon, passage et source.
 * Règle : contenu possédé, domaine public ou sous licence ouverte uniquement ;
 * sinon placeholder explicitement labellisé « Placeholder / non licencié — à remplacer ».
 */
export type LicenseId = 'ag-original' | 'pd-proverbs' | 'pd-classical' | 'placeholder';

export type LicenseInfo = {
  id: LicenseId;
  short: { fr: string; ar: string; en: string };
  kind: 'owned' | 'public-domain' | 'placeholder';
  /** Rien n’est présenté comme juridiquement ou linguistiquement confirmé. */
  review: 'à valider';
  detail: { fr: string; en: string };
  holder: string;
};

export const LICENSES: Record<LicenseId, LicenseInfo> = {
  'ag-original': {
    id: 'ag-original',
    kind: 'owned',
    review: 'à valider',
    short: { fr: 'Contenu original ArabGram', ar: 'مُحْتَوًى أَصْلِيّ', en: 'ArabGram original content' },
    detail: {
      fr: 'Vocabulaire, phrases d’exemple, translittérations, traductions et exercices rédigés pour ArabGram (2026). Licence de diffusion : à valider par Mohamed (proposition, non confirmée : CC BY-SA 4.0). Les descriptions de sons et les règles sont des approximations pédagogiques — à valider, pas un avis linguistique.',
      en: 'Vocabulary, example sentences, transliterations, translations and exercises written for ArabGram (2026). Distribution licence: to be confirmed by Mohamed (unconfirmed suggestion: CC BY-SA 4.0). Sound descriptions and rules are teaching approximations — not a validated linguistic opinion.',
    },
    holder: 'Titulaire de l’app ArabGram',
  },
  'pd-proverbs': {
    id: 'pd-proverbs',
    kind: 'public-domain',
    review: 'à valider',
    short: { fr: 'Proverbes — statut à valider', ar: 'أَمْثَال — بِحَاجَةٍ إِلَى تَأْكِيد', en: 'Proverbs — status to confirm' },
    detail: {
      fr: 'Proverbes de tradition orale, sans auteur identifié dans l’app. Statut de domaine public : à valider. Vocalisation, translittération et traduction : contenu original ArabGram — à valider. Aucun manuel n’est repris.',
      en: 'Oral-tradition proverbs, no author identified in the app. Public-domain status: to be confirmed. Vocalisation, transliteration and translation: ArabGram original content — to be confirmed. No textbook is reused.',
    },
    holder: 'à valider',
  },
  'pd-classical': {
    id: 'pd-classical',
    kind: 'public-domain',
    review: 'à valider',
    short: { fr: 'Poésie classique — attribution à valider', ar: 'شِعْر قَدِيم — النِّسْبَةُ غَيْرُ مُؤَكَّدَة', en: 'Classical verse — attribution to confirm' },
    detail: {
      fr: 'Vers présentés comme ceux d’al-Mutanabbī (m. 965) et d’Imruʾ al-Qays (VIe s.). Attribution, vocalisation et statut de domaine public : à valider. Traductions : originales ArabGram — à valider. Aucune traduction publiée n’est reprise.',
      en: 'Verses presented as al-Mutanabbī (d. 965) and Imruʾ al-Qays (6th c.). Attribution, vocalisation and public-domain status: to be confirmed. Translations: original ArabGram — to be confirmed. No published translation is reused.',
    },
    holder: 'à valider',
  },
  placeholder: {
    id: 'placeholder',
    kind: 'placeholder',
    review: 'à valider',
    short: { fr: 'Contenu à fournir', ar: 'مُحْتَوًى مَطْلُوب', en: 'Content to be provided' },
    detail: {
      fr: 'Contenu à fournir. Emplacement u11l3 vide : aucun texte protégé n’est inclus. À remplir par Mohamed avec un texte possédé, du domaine public confirmé, ou sous licence ouverte.',
      en: 'Content to be provided. Lesson u11l3 is empty: no copyrighted text is included. Mohamed still has to supply a text he owns, a confirmed public-domain text, or an open-licensed text.',
    },
    holder: '—',
  },
};
