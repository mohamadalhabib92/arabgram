import type { LicenseId } from './licenses';

/** Passages de la course « سباق المرشد » : un mot = une étape, avec sa translittération. */
export type Passage = {
  id: string;
  title: { ar: string; fr: string; en: string };
  level: 1 | 2 | 3;
  license: LicenseId;
  gloss: { fr: string; en: string };
  words: { ar: string; tr: string }[];
};

const w = (s: string) =>
  s.split('|').map((pair) => {
    const [ar, tr] = pair.split('=');
    return { ar: ar.trim(), tr: tr.trim() };
  });

export const PASSAGES: Passage[] = [
  {
    id: 'p1',
    title: { ar: 'كِتَابِي', fr: 'Mon livre', en: 'My book' },
    level: 1,
    license: 'ag-original',
    gloss: { fr: 'Je suis étudiant et voici mon livre. Le livre est neuf et le stylo est vieux.', en: 'I am a student and this is my book. The book is new and the pen is old.' },
    words: w('أَنَا=anā|طَالِبٌ=ṭālibun|وَهٰذَا=wa-hādhā|كِتَابِي=kitābī|الكِتَابُ=al-kitābu|جَدِيدٌ=jadīdun|وَالقَلَمُ=wa-l-qalamu|قَدِيمٌ=qadīmun'),
  },
  {
    id: 'p2',
    title: { ar: 'فِي البَيْتِ', fr: 'À la maison', en: 'At home' },
    level: 1,
    license: 'ag-original',
    gloss: { fr: 'La maison est grande et la chambre est petite. Ma mère est dans la cuisine et mon père dans le jardin.', en: 'The house is big and the room is small. My mother is in the kitchen and my father in the garden.' },
    words: w('البَيْتُ=al-baytu|كَبِيرٌ=kabīrun|وَالغُرْفَةُ=wa-l-ghurfatu|صَغِيرَةٌ=ṣaghīratun|أُمِّي=ummī|فِي=fī|المَطْبَخِ=al-maṭbakhi|وَأَبِي=wa-abī|فِي=fī|الحَدِيقَةِ=al-ḥadīqati'),
  },
  {
    id: 'p3',
    title: { ar: 'أَمْثَال', fr: 'Proverbes', en: 'Proverbs' },
    level: 2,
    license: 'pd-proverbs',
    gloss: { fr: 'Le savoir est lumière. Le temps, c’est de l’or. Qui persévère trouve.', en: 'Knowledge is light. Time is gold. Whoever strives, finds.' },
    words: w('العِلْمُ=al-ʿilmu|نُورٌ=nūrun|الوَقْتُ=al-waqtu|مِنْ=min|ذَهَبٍ=dhahabin|مَنْ=man|جَدَّ=jadda|وَجَدَ=wajada'),
  },
  {
    id: 'p4',
    title: { ar: 'بَيْتُ المُتَنَبِّي', fr: 'Le vers d’al-Mutanabbī', en: 'Al-Mutanabbī’s verse' },
    level: 3,
    license: 'pd-classical',
    gloss: { fr: 'Les chevaux, la nuit et le désert me connaissent, et l’épée, la lance, le papier et le calame.', en: 'The horses, the night and the desert know me, and the sword, the spear, the paper and the pen.' },
    words: w('الخَيْلُ=al-khaylu|وَاللَّيْلُ=wa-l-laylu|وَالبَيْدَاءُ=wa-l-baydāʾu|تَعْرِفُنِي=taʿrifunī|وَالسَّيْفُ=wa-s-sayfu|وَالرُّمْحُ=wa-r-rumḥu|وَالقِرْطَاسُ=wa-l-qirṭāsu|وَالقَلَمُ=wa-l-qalamu'),
  },
];
