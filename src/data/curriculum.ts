import type { LicenseId } from './licenses';

/**
 * Curriculum ArabGram — 11 unités, Arabic-first.
 * Contenu original (voir licenses.ts) sauf unité 11 : proverbes et poésie du domaine public,
 * plus un emplacement « Placeholder / non licencié — à remplacer ».
 */
export type Item = {
  id: string;
  ar: string; // arabe vocalisé (tashkīl)
  tr: string; // translittération (style DIN simplifié)
  fr: string;
  en: string;
  kind: 'letter' | 'syllable' | 'word' | 'phrase';
};

export type Lesson = {
  id: string;
  unitId: number;
  title: { ar: string; fr: string; en: string };
  tip?: { fr: string; en: string };
  license: LicenseId;
  items: Item[];
};

export type Unit = {
  id: number;
  ar: string;
  fr: string;
  en: string;
  icon: string;
  goal: { fr: string; en: string };
  lessons: Lesson[];
};

type Raw = [ar: string, tr: string, fr: string, en: string];

const mk = (lessonId: string, kind: Item['kind'], rows: Raw[]): Item[] =>
  rows.map(([ar, tr, fr, en], i) => ({ id: `${lessonId}.${i + 1}`, ar, tr, fr, en, kind }));

function lesson(unitId: number, n: number, title: Lesson['title'], kind: Item['kind'], rows: Raw[], tip?: Lesson['tip'], license: LicenseId = 'ag-original'): Lesson {
  const id = `u${unitId}l${n}`;
  return { id, unitId, title, tip, license, items: mk(id, kind, rows) };
}

/** Lettres qui ne se lient pas à la lettre suivante (pas de forme initiale/médiane propre). */
const NON_CONNECTING = new Set(['ا', 'د', 'ذ', 'ر', 'ز', 'و']);
/** Formes contextuelles affichées avec le tatweel (ـ). */
export function letterForms(letter: string): { isolated: string; initial: string; medial: string; final: string } {
  if (NON_CONNECTING.has(letter)) return { isolated: letter, initial: letter, medial: 'ـ' + letter, final: 'ـ' + letter };
  return { isolated: letter, initial: letter + 'ـ', medial: 'ـ' + letter + 'ـ', final: 'ـ' + letter };
}

export const UNITS: Unit[] = [
  {
    id: 1,
    ar: 'الحُرُوف (١)',
    fr: 'Lettres 1 : ا ب ت ث',
    en: 'Letters 1: ا ب ت ث',
    icon: 'ا',
    goal: { fr: 'Reconnaître alif et la famille de bāʾ.', en: 'Recognise alif and the bāʾ family.' },
    lessons: [
      lesson(1, 1, { ar: 'أ ب ت ث', fr: 'Les quatre premières lettres', en: 'The first four letters' }, 'letter', [
        ['ا', 'ā / alif', 'alif — support de voyelle longue « ā »', 'alif — carrier of long “ā”'],
        ['ب', 'b / bāʾ', 'bāʾ — son « b », un point dessous', 'bāʾ — “b” sound, one dot below'],
        ['ت', 't / tāʾ', 'tāʾ — son « t », deux points dessus', 'tāʾ — “t” sound, two dots above'],
        ['ث', 'th / thāʾ', 'thāʾ — « th » de l’anglais think', 'thāʾ — “th” as in think'],
      ], { fr: 'Même squelette, points différents : comptez les points pour distinguer ب ت ث.', en: 'Same shape, different dots: count the dots to tell ب ت ث apart.' }),
      lesson(1, 2, { ar: 'كَلِمَات أُولَى', fr: 'Premiers mots', en: 'First words' }, 'word', [
        ['أَب', 'ab', 'père', 'father'],
        ['بَاب', 'bāb', 'porte', 'door'],
        ['بَيْت', 'bayt', 'maison', 'house'],
        ['تُوت', 'tūt', 'mûres', 'mulberries'],
        ['ثَوْب', 'thawb', 'vêtement (robe longue)', 'garment (long robe)'],
      ]),
    ],
  },
  {
    id: 2,
    ar: 'الحُرُوف (٢)',
    fr: 'Lettres 2 : ج ح خ د ذ ر ز',
    en: 'Letters 2: ج ح خ د ذ ر ز',
    icon: 'ج',
    goal: { fr: 'Distinguer ج ح خ et les lettres non liantes.', en: 'Tell ج ح خ apart and spot non-joining letters.' },
    lessons: [
      lesson(2, 1, { ar: 'ج ح خ', fr: 'La famille de jīm', en: 'The jīm family' }, 'letter', [
        ['ج', 'j / jīm', 'jīm — « dj » de djinn', 'jīm — “j” as in jam'],
        ['ح', 'ḥ / ḥāʾ', 'ḥāʾ — « h » soufflé de la gorge', 'ḥāʾ — breathy throat “h”'],
        ['خ', 'kh / khāʾ', 'khāʾ — « j » espagnol, jota', 'khāʾ — like Scottish “loch”'],
        ['د', 'd / dāl', 'dāl — son « d »', 'dāl — “d” sound'],
      ], { fr: 'ح n’existe pas en français : expirez fort en serrant la gorge.', en: 'ح has no English match: breathe out hard with a tight throat.' }),
      lesson(2, 2, { ar: 'ذ ر ز', fr: 'dhāl, rāʾ, zāy', en: 'dhāl, rāʾ, zāy' }, 'letter', [
        ['ذ', 'dh / dhāl', 'dhāl — « th » de l’anglais this', 'dhāl — “th” as in this'],
        ['ر', 'r / rāʾ', 'rāʾ — « r » roulé', 'rāʾ — rolled “r”'],
        ['ز', 'z / zāy', 'zāy — son « z »', 'zāy — “z” sound'],
        ['د', 'd / dāl', 'dāl — sans point (comparer avec ذ)', 'dāl — no dot (compare with ذ)'],
      ], { fr: 'ا د ذ ر ز و ne se lient jamais à la lettre suivante.', en: 'ا د ذ ر ز و never join to the following letter.' }),
      lesson(2, 3, { ar: 'كَلِمَات', fr: 'Mots', en: 'Words' }, 'word', [
        ['جَمَل', 'jamal', 'chameau', 'camel'],
        ['حَلِيب', 'ḥalīb', 'lait', 'milk'],
        ['خُبْز', 'khubz', 'pain', 'bread'],
        ['دَار', 'dār', 'demeure', 'home, dwelling'],
        ['ذَهَب', 'dhahab', 'or (métal)', 'gold'],
        ['زَيْت', 'zayt', 'huile', 'oil'],
      ]),
    ],
  },
  {
    id: 3,
    ar: 'الحُرُوف (٣)',
    fr: 'Lettres 3 : س ش ص ض ط ظ',
    en: 'Letters 3: س ش ص ض ط ظ',
    icon: 'ص',
    goal: { fr: 'Entendre les consonnes emphatiques.', en: 'Hear the emphatic consonants.' },
    lessons: [
      lesson(3, 1, { ar: 'س ش ص ض', fr: 'Sīn, shīn et les emphatiques', en: 'Sīn, shīn and emphatics' }, 'letter', [
        ['س', 's / sīn', 'sīn — « s » simple', 'sīn — plain “s”'],
        ['ش', 'sh / shīn', 'shīn — « ch » de chat', 'shīn — “sh” as in ship'],
        ['ص', 'ṣ / ṣād', 'ṣād — « s » emphatique, langue basse', 'ṣād — emphatic “s”, low tongue'],
        ['ض', 'ḍ / ḍād', 'ḍād — « d » emphatique', 'ḍād — emphatic “d”'],
      ], { fr: 'Les emphatiques (ص ض ط ظ) assombrissent la voyelle voisine : « ṣa » sonne presque « so ».', en: 'Emphatics (ص ض ط ظ) darken nearby vowels: “ṣa” sounds close to “so”.' }),
      lesson(3, 2, { ar: 'ط ظ', fr: 'ṭāʾ et ẓāʾ', en: 'ṭāʾ and ẓāʾ' }, 'letter', [
        ['ط', 'ṭ / ṭāʾ', 'ṭāʾ — « t » emphatique', 'ṭāʾ — emphatic “t”'],
        ['ظ', 'ẓ / ẓāʾ', 'ẓāʾ — « dh » emphatique', 'ẓāʾ — emphatic “dh”'],
        ['ت', 't / tāʾ', 'tāʾ — « t » simple (comparer avec ط)', 'tāʾ — plain “t” (compare with ط)'],
        ['س', 's / sīn', 'sīn — « s » simple (comparer avec ص)', 'sīn — plain “s” (compare with ص)'],
      ]),
      lesson(3, 3, { ar: 'كَلِمَات', fr: 'Mots', en: 'Words' }, 'word', [
        ['سَمَك', 'samak', 'poisson', 'fish'],
        ['شَمْس', 'shams', 'soleil', 'sun'],
        ['صَدِيق', 'ṣadīq', 'ami', 'friend'],
        ['ضَوْء', 'ḍawʾ', 'lumière', 'light'],
        ['طَالِب', 'ṭālib', 'étudiant', 'student'],
        ['ظِلّ', 'ẓill', 'ombre', 'shade, shadow'],
      ]),
    ],
  },
  {
    id: 4,
    ar: 'الحُرُوف (٤)',
    fr: 'Lettres 4 : ع → ي',
    en: 'Letters 4: ع → ي',
    icon: 'ع',
    goal: { fr: 'Finir l’alphabet : 11 lettres.', en: 'Finish the alphabet: 11 letters.' },
    lessons: [
      lesson(4, 1, { ar: 'ع غ ف ق ك', fr: 'De ʿayn à kāf', en: 'From ʿayn to kāf' }, 'letter', [
        ['ع', 'ʿ / ʿayn', 'ʿayn — contraction de la gorge', 'ʿayn — throat constriction'],
        ['غ', 'gh / ghayn', 'ghayn — « r » grasseyé parisien', 'ghayn — French guttural “r”'],
        ['ف', 'f / fāʾ', 'fāʾ — son « f »', 'fāʾ — “f” sound'],
        ['ق', 'q / qāf', 'qāf — « k » du fond de la gorge', 'qāf — “k” from deep in the throat'],
        ['ك', 'k / kāf', 'kāf — « k » simple', 'kāf — plain “k”'],
      ]),
      lesson(4, 2, { ar: 'ل م ن ه و ي', fr: 'De lām à yāʾ', en: 'From lām to yāʾ' }, 'letter', [
        ['ل', 'l / lām', 'lām — son « l »', 'lām — “l” sound'],
        ['م', 'm / mīm', 'mīm — son « m »', 'mīm — “m” sound'],
        ['ن', 'n / nūn', 'nūn — son « n »', 'nūn — “n” sound'],
        ['ه', 'h / hāʾ', 'hāʾ — « h » léger aspiré', 'hāʾ — light “h”'],
        ['و', 'w, ū / wāw', 'wāw — « w » ou « ū » long', 'wāw — “w” or long “ū”'],
        ['ي', 'y, ī / yāʾ', 'yāʾ — « y » ou « ī » long', 'yāʾ — “y” or long “ī”'],
      ]),
      lesson(4, 3, { ar: 'كَلِمَات', fr: 'Mots', en: 'Words' }, 'word', [
        ['عَيْن', 'ʿayn', 'œil ; source', 'eye; spring'],
        ['غُرْفَة', 'ghurfa', 'chambre', 'room'],
        ['قَلَم', 'qalam', 'stylo, calame', 'pen'],
        ['كِتَاب', 'kitāb', 'livre', 'book'],
        ['لَيْل', 'layl', 'nuit', 'night'],
        ['نَجْم', 'najm', 'étoile', 'star'],
        ['وَرْدَة', 'warda', 'rose (fleur)', 'rose'],
        ['يَد', 'yad', 'main', 'hand'],
      ]),
    ],
  },
  {
    id: 5,
    ar: 'الحَرَكَات',
    fr: 'Voyelles brèves (tashkīl)',
    en: 'Short vowels (tashkīl)',
    icon: 'بَ',
    goal: { fr: 'Lire fatḥa, kasra, ḍamma et sukūn.', en: 'Read fatḥa, kasra, ḍamma and sukūn.' },
    lessons: [
      lesson(5, 1, { ar: 'فَتْحَة كَسْرَة ضَمَّة سُكُون', fr: 'Les quatre signes', en: 'The four marks' }, 'syllable', [
        ['بَ', 'ba', 'fatḥa — trait au-dessus : « a »', 'fatḥa — stroke above: “a”'],
        ['بِ', 'bi', 'kasra — trait au-dessous : « i »', 'kasra — stroke below: “i”'],
        ['بُ', 'bu', 'ḍamma — petit wāw au-dessus : « u »', 'ḍamma — small wāw above: “u”'],
        ['بْ', 'b', 'sukūn — petit cercle : pas de voyelle', 'sukūn — small circle: no vowel'],
      ], { fr: 'Les voyelles brèves s’écrivent comme des signes au-dessus ou au-dessous de la consonne.', en: 'Short vowels are marks written above or below the consonant.' }),
      lesson(5, 2, { ar: 'نَقْرَأُ', fr: 'Lire avec les signes', en: 'Reading with the marks' }, 'word', [
        ['كَتَبَ', 'kataba', 'il a écrit', 'he wrote'],
        ['كُتِبَ', 'kutiba', 'il a été écrit', 'it was written'],
        ['دَرَسَ', 'darasa', 'il a étudié', 'he studied'],
        ['قُلْ', 'qul', 'dis !', 'say!'],
        ['مِنْ', 'min', 'de, depuis', 'from'],
        ['لَمْ', 'lam', 'ne… pas (passé)', 'did not'],
      ], { fr: 'Même consonnes, sens différent : كَتَبَ (kataba) ≠ كُتِبَ (kutiba). Le tashkīl change tout.', en: 'Same consonants, different meaning: كَتَبَ (kataba) ≠ كُتِبَ (kutiba).' }),
    ],
  },
  {
    id: 6,
    ar: 'المَدّ وَالتَّنْوِين وَالشَّدَّة',
    fr: 'Voyelles longues, tanwīn, shadda',
    en: 'Long vowels, tanwīn, shadda',
    icon: 'بّ',
    goal: { fr: 'Allonger, doubler et nunnater.', en: 'Lengthen, double and nunate.' },
    lessons: [
      lesson(6, 1, { ar: 'المَدّ', fr: 'Voyelles longues', en: 'Long vowels' }, 'syllable', [
        ['بَا', 'bā', 'fatḥa + alif : « ā » long', 'fatḥa + alif: long “ā”'],
        ['بِي', 'bī', 'kasra + yāʾ : « ī » long', 'kasra + yāʾ: long “ī”'],
        ['بُو', 'bū', 'ḍamma + wāw : « ū » long', 'ḍamma + wāw: long “ū”'],
        ['نُور', 'nūr', 'lumière (ū long)', 'light (long ū)'],
      ]),
      lesson(6, 2, { ar: 'التَّنْوِين', fr: 'Tanwīn (-un, -an, -in)', en: 'Tanwīn (-un, -an, -in)' }, 'word', [
        ['كِتَابٌ', 'kitābun', 'un livre (sujet)', 'a book (nominative)'],
        ['كِتَابًا', 'kitāban', 'un livre (complément)', 'a book (accusative)'],
        ['كِتَابٍ', 'kitābin', 'd’un livre (après préposition)', 'of a book (genitive)'],
        ['شُكْرًا', 'shukran', 'merci', 'thank you'],
      ], { fr: 'Le signe doublé ajoute « n » : ـٌ un, ـً an, ـٍ in. Il marque l’indéfini.', en: 'A doubled mark adds “n”: ـٌ un, ـً an, ـٍ in. It marks indefiniteness.' }),
      lesson(6, 3, { ar: 'الشَّدَّة', fr: 'Shadda (consonne doublée)', en: 'Shadda (doubled consonant)' }, 'word', [
        ['مُدَرِّس', 'mudarris', 'enseignant', 'teacher'],
        ['سُكَّر', 'sukkar', 'sucre', 'sugar'],
        ['أُمّ', 'umm', 'mère', 'mother'],
        ['جَدَّة', 'jadda', 'grand-mère', 'grandmother'],
      ], { fr: 'ـّ (shadda) = la consonne se prononce deux fois : sukkar, pas sukar.', en: 'ـّ (shadda) = the consonant is pronounced twice: sukkar, not sukar.' }),
    ],
  },
  {
    id: 7,
    ar: 'التَّحِيَّات',
    fr: 'Salutations',
    en: 'Greetings',
    icon: 'سلام',
    goal: { fr: 'Saluer, remercier, prendre congé.', en: 'Greet, thank, say goodbye.' },
    lessons: [
      lesson(7, 1, { ar: 'السَّلَام', fr: 'Saluer', en: 'Greeting' }, 'phrase', [
        ['السَّلَامُ عَلَيْكُمْ', 'as-salāmu ʿalaykum', 'la paix soit sur vous (bonjour)', 'peace be upon you (hello)'],
        ['وَعَلَيْكُمُ السَّلَامُ', 'wa-ʿalaykumu s-salām', 'et sur vous la paix (réponse)', 'and upon you peace (reply)'],
        ['مَرْحَبًا', 'marḥaban', 'bonjour, bienvenue', 'hello, welcome'],
        ['صَبَاحُ الخَيْرِ', 'ṣabāḥu l-khayr', 'bonjour (le matin)', 'good morning'],
        ['مَسَاءُ الخَيْرِ', 'masāʾu l-khayr', 'bonsoir', 'good evening'],
      ]),
      lesson(7, 2, { ar: 'الشُّكْر وَالوَدَاع', fr: 'Remercier, prendre congé', en: 'Thanks & goodbye' }, 'phrase', [
        ['شُكْرًا جَزِيلًا', 'shukran jazīlan', 'merci beaucoup', 'thank you very much'],
        ['عَفْوًا', 'ʿafwan', 'de rien ; pardon', 'you’re welcome; sorry'],
        ['كَيْفَ حَالُكَ؟', 'kayfa ḥāluka?', 'comment vas-tu ? (à un homme)', 'how are you? (to a man)'],
        ['بِخَيْرٍ، الحَمْدُ لِلّٰهِ', 'bi-khayrin, al-ḥamdu li-llāh', 'bien, Dieu merci', 'fine, thank God'],
        ['مَعَ السَّلَامَةِ', 'maʿa s-salāma', 'au revoir', 'goodbye'],
      ]),
    ],
  },
  {
    id: 8,
    ar: 'الأُسْرَة',
    fr: 'La famille',
    en: 'Family',
    icon: 'أسرة',
    goal: { fr: 'Nommer les membres de la famille.', en: 'Name family members.' },
    lessons: [
      lesson(8, 1, { ar: 'أَفْرَاد الأُسْرَة', fr: 'Proches', en: 'Close family' }, 'word', [
        ['أُسْرَة', 'usra', 'famille', 'family'],
        ['أَخ', 'akh', 'frère', 'brother'],
        ['أُخْت', 'ukht', 'sœur', 'sister'],
        ['اِبْن', 'ibn', 'fils', 'son'],
        ['بِنْت', 'bint', 'fille', 'daughter, girl'],
      ]),
      lesson(8, 2, { ar: 'العَائِلَة الكَبِيرَة', fr: 'Famille élargie', en: 'Extended family' }, 'word', [
        ['جَدّ', 'jadd', 'grand-père', 'grandfather'],
        ['عَمّ', 'ʿamm', 'oncle paternel', 'paternal uncle'],
        ['خَال', 'khāl', 'oncle maternel', 'maternal uncle'],
        ['عَمَّة', 'ʿamma', 'tante paternelle', 'paternal aunt'],
        ['خَالَة', 'khāla', 'tante maternelle', 'maternal aunt'],
      ], { fr: 'L’arabe distingue le côté paternel (عَمّ) et maternel (خَال).', en: 'Arabic distinguishes paternal (عَمّ) and maternal (خَال) sides.' }),
    ],
  },
  {
    id: 9,
    ar: 'الأَرْقَام',
    fr: 'Les nombres',
    en: 'Numbers',
    icon: '١٢٣',
    goal: { fr: 'Compter de 1 à 10, chiffres arabes orientaux.', en: 'Count 1–10, Eastern Arabic digits.' },
    lessons: [
      lesson(9, 1, { ar: 'مِنْ ١ إِلَى ٥', fr: 'De 1 à 5', en: 'From 1 to 5' }, 'word', [
        ['وَاحِد ١', 'wāḥid', 'un (1)', 'one (1)'],
        ['اِثْنَان ٢', 'ithnān', 'deux (2)', 'two (2)'],
        ['ثَلَاثَة ٣', 'thalātha', 'trois (3)', 'three (3)'],
        ['أَرْبَعَة ٤', 'arbaʿa', 'quatre (4)', 'four (4)'],
        ['خَمْسَة ٥', 'khamsa', 'cinq (5)', 'five (5)'],
      ]),
      lesson(9, 2, { ar: 'مِنْ ٦ إِلَى ١٠', fr: 'De 6 à 10', en: 'From 6 to 10' }, 'word', [
        ['سِتَّة ٦', 'sitta', 'six (6)', 'six (6)'],
        ['سَبْعَة ٧', 'sabʿa', 'sept (7)', 'seven (7)'],
        ['ثَمَانِيَة ٨', 'thamāniya', 'huit (8)', 'eight (8)'],
        ['تِسْعَة ٩', 'tisʿa', 'neuf (9)', 'nine (9)'],
        ['عَشَرَة ١٠', 'ʿashara', 'dix (10)', 'ten (10)'],
      ], { fr: 'Les chiffres s’écrivent de gauche à droite, même dans un texte arabe : ١٠ = 10.', en: 'Digits run left-to-right even inside Arabic text: ١٠ = 10.' }),
    ],
  },
  {
    id: 10,
    ar: 'الجُمْلَة الاسْمِيَّة',
    fr: 'Pronoms et phrase nominale',
    en: 'Pronouns & nominal sentence',
    icon: 'أنا',
    goal: { fr: 'Dire « je suis… », « ceci est… ».', en: 'Say “I am…”, “this is…”.' },
    lessons: [
      lesson(10, 1, { ar: 'الضَّمَائِر', fr: 'Pronoms personnels', en: 'Personal pronouns' }, 'word', [
        ['أَنَا', 'anā', 'je, moi', 'I'],
        ['أَنْتَ', 'anta', 'tu (masculin)', 'you (masc.)'],
        ['أَنْتِ', 'anti', 'tu (féminin)', 'you (fem.)'],
        ['هُوَ', 'huwa', 'il, lui', 'he'],
        ['هِيَ', 'hiya', 'elle', 'she'],
        ['نَحْنُ', 'naḥnu', 'nous', 'we'],
      ]),
      lesson(10, 2, { ar: 'جُمَل', fr: 'Phrases sans verbe « être »', en: 'Sentences without “to be”' }, 'phrase', [
        ['هٰذَا كِتَابٌ', 'hādhā kitābun', 'ceci est un livre', 'this is a book'],
        ['البَيْتُ كَبِيرٌ', 'al-baytu kabīrun', 'la maison est grande', 'the house is big'],
        ['أَنَا طَالِبٌ', 'anā ṭālibun', 'je suis étudiant', 'I am a student'],
        ['هِيَ مُدَرِّسَةٌ', 'hiya mudarrisatun', 'elle est enseignante', 'she is a teacher'],
        ['الجَوُّ جَمِيلٌ', 'al-jawwu jamīlun', 'il fait beau', 'the weather is nice'],
      ], { fr: 'Au présent, l’arabe n’utilise pas de verbe « être » : sujet défini + attribut indéfini.', en: 'In the present, Arabic drops “to be”: definite subject + indefinite predicate.' }),
    ],
  },
  {
    id: 11,
    ar: 'القِرَاءَة',
    fr: 'Lecture : proverbes et poésie',
    en: 'Reading: proverbs & poetry',
    icon: 'اقرأ',
    goal: { fr: 'Lire des textes authentiques du domaine public.', en: 'Read authentic public-domain texts.' },
    lessons: [
      lesson(11, 1, { ar: 'أَمْثَال', fr: 'Proverbes traditionnels', en: 'Traditional proverbs' }, 'phrase', [
        ['العِلْمُ نُورٌ', 'al-ʿilmu nūrun', 'le savoir est lumière', 'knowledge is light'],
        ['الوَقْتُ مِنْ ذَهَبٍ', 'al-waqtu min dhahabin', 'le temps, c’est de l’or', 'time is gold'],
        ['مَنْ جَدَّ وَجَدَ', 'man jadda wajada', 'qui persévère trouve', 'whoever strives, finds'],
        ['الصَّبْرُ مِفْتَاحُ الفَرَجِ', 'aṣ-ṣabru miftāḥu l-faraj', 'la patience est la clé du soulagement', 'patience is the key to relief'],
        ['الجَارُ قَبْلَ الدَّارِ', 'al-jāru qabla d-dār', 'le voisin avant la maison', 'the neighbour before the house'],
      ], { fr: 'Remarquez l’assimilation : al + ṣ → aṣ-ṣabru (lettre solaire).', en: 'Note assimilation: al + ṣ → aṣ-ṣabru (sun letter).' }, 'pd-proverbs'),
      lesson(11, 2, { ar: 'مِنَ الشِّعْرِ القَدِيمِ', fr: 'Vers classiques', en: 'Classical verses' }, 'phrase', [
        ['الخَيْلُ وَاللَّيْلُ وَالبَيْدَاءُ تَعْرِفُنِي', 'al-khaylu wa-l-laylu wa-l-baydāʾu taʿrifunī', 'les chevaux, la nuit et le désert me connaissent (al-Mutanabbī)', 'the horses, the night and the desert know me (al-Mutanabbī)'],
        ['وَالسَّيْفُ وَالرُّمْحُ وَالقِرْطَاسُ وَالقَلَمُ', 'wa-s-sayfu wa-r-rumḥu wa-l-qirṭāsu wa-l-qalamu', 'et l’épée, la lance, le papier et le calame (al-Mutanabbī)', 'and the sword, the spear, the paper and the pen (al-Mutanabbī)'],
        ['قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ وَمَنْزِلِ', 'qifā nabki min dhikrā ḥabībin wa-manzili', 'arrêtez-vous, pleurons au souvenir d’un être aimé et d’une demeure (Imruʾ al-Qays)', 'halt, let us weep at the memory of a beloved and a dwelling (Imruʾ al-Qays)'],
        ['أَنَا الَّذِي نَظَرَ الأَعْمَى إِلَى أَدَبِي', 'ana lladhī naẓara l-aʿmā ilā adabī', 'je suis celui dont l’aveugle a vu la littérature (al-Mutanabbī)', 'I am the one whose literature the blind man saw (al-Mutanabbī)'],
      ], { fr: 'Textes du domaine public ; traductions littérales originales ArabGram.', en: 'Public-domain texts; original literal translations by ArabGram.' }, 'pd-classical'),
      { id: 'u11l3', unitId: 11, title: { ar: 'نُصُوص القِرَاءَة', fr: 'Textes longs (emplacement)', en: 'Long texts (slot)' }, license: 'placeholder', items: [] },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = UNITS.flatMap((u) => u.lessons);
export const ALL_ITEMS: Item[] = ALL_LESSONS.flatMap((l) => l.items);
export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ALL_ITEMS.map((i) => [i.id, i]));
export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(ALL_LESSONS.map((l) => [l.id, l]));
export const lessonOfItem = (itemId: string): Lesson | undefined => LESSON_BY_ID[itemId.split('.')[0]];
export const playable = (l: Lesson) => l.items.length >= 4;
