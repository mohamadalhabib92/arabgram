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
  detail: { fr: string; en: string };
  holder: string;
};

export const LICENSES: Record<LicenseId, LicenseInfo> = {
  'ag-original': {
    id: 'ag-original',
    kind: 'owned',
    short: { fr: 'Contenu original ArabGram', ar: 'مُحْتَوًى أَصْلِيّ', en: 'ArabGram original content' },
    detail: {
      fr: 'Vocabulaire, phrases d’exemple, translittérations, traductions et exercices rédigés spécialement pour ArabGram (2026). Propriété du titulaire de l’app ; licence de diffusion à confirmer par le propriétaire (proposition : CC BY-SA 4.0). Les lettres et règles de l’alphabet arabe sont des faits non protégés.',
      en: 'Vocabulary, example sentences, transliterations, translations and exercises written specifically for ArabGram (2026). Owned by the app owner; distribution licence to be confirmed by the owner (suggested: CC BY-SA 4.0). Letters and rules of the Arabic script are uncopyrightable facts.',
    },
    holder: 'Titulaire de l’app ArabGram',
  },
  'pd-proverbs': {
    id: 'pd-proverbs',
    kind: 'public-domain',
    short: { fr: 'Domaine public — proverbes traditionnels', ar: 'مِلْكٌ عَامّ — أَمْثَال', en: 'Public domain — traditional proverbs' },
    detail: {
      fr: 'Proverbes et dictons arabes de tradition orale, sans auteur identifiable : domaine public. Vocalisation, translittération et traduction : contenu original ArabGram.',
      en: 'Traditional Arabic proverbs and sayings with no identifiable author: public domain. Vocalisation, transliteration and translation: ArabGram original content.',
    },
    holder: 'Domaine public',
  },
  'pd-classical': {
    id: 'pd-classical',
    kind: 'public-domain',
    short: { fr: 'Domaine public — poésie classique', ar: 'مِلْكٌ عَامّ — شِعْر قَدِيم', en: 'Public domain — classical poetry' },
    detail: {
      fr: 'Vers d’al-Mutanabbī (mort en 965) et d’Imruʾ al-Qays (VIe siècle) : œuvres du domaine public. Vocalisation usuelle ; translittération et traduction : contenu original ArabGram (aucune traduction publiée n’est reprise).',
      en: 'Verses by al-Mutanabbī (d. 965) and Imruʾ al-Qays (6th c.): public-domain works. Standard vocalisation; transliteration and translation: ArabGram original content (no published translation reused).',
    },
    holder: 'Domaine public',
  },
  placeholder: {
    id: 'placeholder',
    kind: 'placeholder',
    short: { fr: 'Placeholder / non licencié — à remplacer', ar: 'مُحْتَوًى مُؤَقَّت', en: 'Placeholder / unlicensed — to replace' },
    detail: {
      fr: 'Emplacement réservé au corpus de lecture longue (manuel, textes du propriétaire ou corpus open-licence). Aucun contenu protégé n’est inclus. À remplacer avant publication.',
      en: 'Slot reserved for the long-reading corpus (textbook, owner texts or open-licensed corpus). No copyrighted content included. Replace before publishing.',
    },
    holder: '—',
  },
};
