/**
 * Données locales du test tashkīl (aucune API) : signes diacritiques, composeur
 * lettre + signe → translittération, et paires minimales de lecture.
 */
export type Mark = { id: string; char: string; name: string; fr: string; en: string; suffix: (c: string) => string };

/** Consonnes du composeur avec leur translittération de base. */
export const BASE_LETTERS: { ar: string; tr: string }[] = [
  { ar: 'ب', tr: 'b' }, { ar: 'ت', tr: 't' }, { ar: 'د', tr: 'd' }, { ar: 'ر', tr: 'r' },
  { ar: 'س', tr: 's' }, { ar: 'ش', tr: 'sh' }, { ar: 'ص', tr: 'ṣ' }, { ar: 'ع', tr: 'ʿ' },
  { ar: 'ق', tr: 'q' }, { ar: 'ك', tr: 'k' }, { ar: 'ل', tr: 'l' }, { ar: 'م', tr: 'm' },
  { ar: 'ن', tr: 'n' }, { ar: 'ح', tr: 'ḥ' }, { ar: 'خ', tr: 'kh' }, { ar: 'ط', tr: 'ṭ' },
];

export const MARKS: Mark[] = [
  { id: 'fatha', char: '\u064E', name: 'فَتْحَة', fr: 'fatḥa — « a » bref', en: 'fatḥa — short “a”', suffix: (c) => c + 'a' },
  { id: 'kasra', char: '\u0650', name: 'كَسْرَة', fr: 'kasra — « i » bref', en: 'kasra — short “i”', suffix: (c) => c + 'i' },
  { id: 'damma', char: '\u064F', name: 'ضَمَّة', fr: 'ḍamma — « u » bref', en: 'ḍamma — short “u”', suffix: (c) => c + 'u' },
  { id: 'sukun', char: '\u0652', name: 'سُكُون', fr: 'sukūn — pas de voyelle', en: 'sukūn — no vowel', suffix: (c) => c },
  { id: 'shadda', char: '\u0651\u064E', name: 'شَدَّة + فَتْحَة', fr: 'shadda — consonne doublée (+ a)', en: 'shadda — doubled consonant (+ a)', suffix: (c) => c + c + 'a' },
  { id: 'fathatan', char: '\u064B', name: 'تَنْوِين فَتْح', fr: 'tanwīn fatḥ — « an »', en: 'tanwīn fatḥ — “an”', suffix: (c) => c + 'an' },
  { id: 'kasratan', char: '\u064D', name: 'تَنْوِين كَسْر', fr: 'tanwīn kasr — « in »', en: 'tanwīn kasr — “in”', suffix: (c) => c + 'in' },
  { id: 'dammatan', char: '\u064C', name: 'تَنْوِين ضَمّ', fr: 'tanwīn ḍamm — « un »', en: 'tanwīn ḍamm — “un”', suffix: (c) => c + 'un' },
];

/** Paires minimales : même squelette consonantique, tashkīl différent. */
export type PhonQ = { ar: string; answer: string; options: string[]; fr: string; en: string };
export const PHONETIC_TEST: PhonQ[] = [
  { ar: 'كَتَبَ', answer: 'kataba', options: ['kataba', 'kutiba', 'kutub'], fr: 'il a écrit — trois fatḥa', en: 'he wrote — three fatḥas' },
  { ar: 'كُتِبَ', answer: 'kutiba', options: ['kataba', 'kutiba', 'kutub'], fr: 'il a été écrit — ḍamma, kasra, fatḥa', en: 'it was written — ḍamma, kasra, fatḥa' },
  { ar: 'كُتُب', answer: 'kutub', options: ['kitāb', 'kutub', 'kataba'], fr: 'des livres — deux ḍamma', en: 'books — two ḍammas' },
  { ar: 'عِلْم', answer: 'ʿilm', options: ['ʿilm', 'ʿalam', 'ʿalima'], fr: 'savoir — kasra puis sukūn', en: 'knowledge — kasra then sukūn' },
  { ar: 'عَلَم', answer: 'ʿalam', options: ['ʿilm', 'ʿalam', 'ʿulim'], fr: 'drapeau — deux fatḥa', en: 'flag — two fatḥas' },
  { ar: 'عَلِمَ', answer: 'ʿalima', options: ['ʿalama', 'ʿalima', 'ʿilm'], fr: 'il a su — fatḥa, kasra, fatḥa', en: 'he knew — fatḥa, kasra, fatḥa' },
  { ar: 'سُكَّر', answer: 'sukkar', options: ['sukar', 'sukkar', 'sakar'], fr: 'sucre — shadda sur kāf', en: 'sugar — shadda on kāf' },
  { ar: 'كِتَابٌ', answer: 'kitābun', options: ['kitāban', 'kitābin', 'kitābun'], fr: 'un livre — tanwīn ḍamm', en: 'a book — tanwīn ḍamm' },
  { ar: 'دَرَّسَ', answer: 'darrasa', options: ['darasa', 'darrasa', 'durisa'], fr: 'il a enseigné — shadda sur rāʾ', en: 'he taught — shadda on rāʾ' },
  { ar: 'نُور', answer: 'nūr', options: ['nūr', 'nawr', 'nar'], fr: 'lumière — ḍamma + wāw = ū long', en: 'light — ḍamma + wāw = long ū' },
];

/** Échantillon de rendu : chaque signe porté par ب, puis mots denses en diacritiques. */
export const RENDER_SAMPLES = ['بَ بِ بُ بْ بّ بً بٍ بٌ', 'كَتَبَ — كُتِبَ — كُتُبٌ', 'السَّلَامُ عَلَيْكُمْ', 'مُدَرِّسَةٌ جَدِيدَةٌ'];
