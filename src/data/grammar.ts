import { LESSON_BY_ID, UNITS, type Item, type Lesson } from '@/data/curriculum';
import { EXTRA_SPECS } from '@/data/grammarDeep';
import type { LessonRecord, State } from '@/state';

/**
 * Grammaire originale ArabGram, A1 → C1.
 * Les unités de lecture 1–11 ne sont pas recopiées : leurs identifiants restent
 * ceux du parcours déjà sauvé. Ici, seulement des leçons nouvelles (`g…`).
 * Tout exemple est vocalisé. Ce qui n’est pas sûr porte « à vérifier ».
 * Aucun texte d’al-Ājurrūmiyya, du Qaṭr ou de l’Alfiyya n’est cité.
 */

export type LevelId = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export const LEVEL_ORDER: LevelId[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export type ExerciseKind = 'identify' | 'irab' | 'transform' | 'fill';

export type GrammarExercise = {
  kind: ExerciseKind;
  prompt: string;
  /** Phrase vocalisée, ou la même phrase avec le dernier mot masqué. */
  ar: string;
  /** Réponse : sens français, ou phrase arabe vocalisée pour transformer / compléter. */
  answer: string;
};

export type GrammarLesson = Lesson & {
  level: LevelId;
  minutes: number;
  /** Sujet couvert, pour le rapport de couverture. */
  topic: string;
  caution: boolean;
  exercises: GrammarExercise[];
};

export type GrammarUnit = {
  id: string;
  level: LevelId;
  ar: string;
  fr: string;
  en: string;
  topic: string;
  lessons: GrammarLesson[];
};

export type GrammarLevel = {
  id: LevelId;
  ar: string;
  fr: string;
  en: string;
  minutes: number;
  blurb: { fr: string; en: string };
  units: GrammarUnit[];
};

type Raw = [ar: string, tr: string, fr: string, en: string];

const CAUTION = ' à vérifier';

function items(lessonId: string, rows: Raw[]): Item[] {
  return rows.map(([ar, tr, fr, en], i) => ({ id: `${lessonId}.${i + 1}`, ar, tr, fr, en, kind: 'phrase' as const }));
}

function lesson(
  level: LevelId,
  unit: string,
  n: number,
  title: Lesson['title'],
  topic: string,
  rows: Raw[],
  tip: string,
  caution = false,
): GrammarLesson {
  const id = `g${level.toLowerCase()}${unit}l${n}`;
  const note = caution && !tip.includes('à vérifier') ? `${tip}${CAUTION}` : tip;
  return {
    id,
    unitId: 0,
    level,
    minutes: 5,
    topic,
    caution: caution || note.includes('à vérifier'),
    title,
    tip: { fr: note, en: caution ? `${tip} (to be checked)` : tip },
    license: 'ag-original',
    items: items(id, rows),
    exercises: makeExercises(rows, topic),
  };
}

const EXERCISE_KINDS: ExerciseKind[] = ['identify', 'irab', 'transform', 'fill'];

function maskLast(ar: string): string {
  const parts = ar.split(' ');
  if (parts.length < 2) return `…… ${ar}`;
  parts[parts.length - 1] = '……';
  return parts.join(' ');
}

function makeExercises(rows: Raw[], topic: string): GrammarExercise[] {
  const [a, b, c, d] = rows;
  const other = rows[rows.length - 1];
  return [
    { kind: 'identify', prompt: `Identifiez le sens (${topic}).`, ar: a[0], answer: a[2] },
    { kind: 'irab', prompt: 'Décrivez le rôle montré par cette phrase. La voyelle finale hors de cet exemple est à vérifier.', ar: b[0], answer: b[2] },
    { kind: 'transform', prompt: 'Passez à l’autre forme de la séance, en gardant toutes les voyelles.', ar: c[0], answer: other[0] },
    { kind: 'fill', prompt: `Complétez. Sens attendu : « ${d[2]} ».`, ar: maskLast(d[0]), answer: d[0] },
  ];
}

export function exerciseKinds(): ExerciseKind[] {
  return EXERCISE_KINDS;
}

function unit(level: LevelId, id: string, ar: string, fr: string, en: string, topic: string, lessons: GrammarLesson[]): GrammarUnit {
  return { id, level, ar, fr, en, topic, lessons };
}

export const GRAMMAR_LEVELS: GrammarLevel[] = [
  {
    id: 'A1',
    ar: 'المُسْتَوَى الأَوَّل',
    fr: 'A1 · Lire et reconnaître',
    en: 'A1 · Read and recognise',
    minutes: 5,
    blurb: { fr: 'Alphabet déjà dans le parcours, puis les trois espèces et la phrase minimale.', en: 'The alphabet path you already have, then the three word classes and a minimal sentence.' },
    units: [
      unit('A1', 'u-read', 'القِرَاءَة', 'Préparer la lecture', 'Reading readiness', 'alphabet', [
        lesson('A1', 'u-read', 1, { ar: 'أَقْرَأُ الحَرْفَ', fr: 'Je lis la lettre', en: 'I read the letter' }, 'alphabet', [
          ['اِقْرَأِ الحَرْفَ', 'iqraʾi l-ḥarf', 'lis la lettre', 'read the letter'],
          ['هٰذَا حَرْفٌ', 'hādhā ḥarfun', 'ceci est une lettre', 'this is a letter'],
          ['الحَرْفُ وَاضِحٌ', 'al-ḥarfu wāḍiḥun', 'la lettre est claire', 'the letter is clear'],
          ['أَسْمَعُ ثُمَّ أَقْرَأُ', 'asmaʿu thumma aqraʾu', 'j’écoute puis je lis', 'I listen, then I read'],
        ], 'La lecture des lettres est le parcours des unités 1 à 6. Cette séance ne le remplace pas.'),
      ]),
      unit('A1', 'u-kinds', 'الكَلِمَة', 'Les trois espèces', 'The three word classes', 'ism-fil-harf', [
        lesson('A1', 'u-kinds', 1, { ar: 'اِسْمٌ فِعْلٌ حَرْفٌ', fr: 'Nom, verbe, particule', en: 'Noun, verb, particle' }, 'ism-fil-harf', [
          ['كِتَابٌ اِسْمٌ', 'kitābun ismun', 'kitābun est un nom', 'kitābun is a noun'],
          ['كَتَبَ فِعْلٌ', 'kataba fiʿlun', 'kataba est un verbe', 'kataba is a verb'],
          ['فِي حَرْفٌ', 'fī ḥarfun', 'fī est une particule', 'fī is a particle'],
          ['الكَلِمَةُ ثَلَاثَةٌ', 'al-kalimatu thalāthatun', 'le mot a trois espèces', 'a word is one of three kinds'],
        ], 'Nom : on peut dire « un livre ». Verbe : un temps. Particule : ni l’un ni l’autre.'),
        lesson('A1', 'u-kinds', 2, { ar: 'أُمَيِّزُ', fr: 'Je distingue', en: 'I tell them apart' }, 'ism-fil-harf', [
          ['البَيْتُ اِسْمٌ', 'al-baytu ismun', 'la maison est un nom', 'the house is a noun'],
          ['جَلَسَ فِعْلٌ', 'jalasa fiʿlun', 'il s’est assis : verbe', 'he sat: a verb'],
          ['إِلَى حَرْفٌ', 'ilā ḥarfun', 'ilā est une particule', 'ilā is a particle'],
          ['مِنْ حَرْفٌ', 'min ḥarfun', 'min est une particule', 'min is a particle'],
        ], 'Une séance : quatre cartes, puis on s’arrête.'),
      ]),
      unit('A1', 'u-jumla', 'الجُمْلَة', 'Phrase minimale', 'Minimal sentence', 'mubtada-khabar', [
        lesson('A1', 'u-jumla', 1, { ar: 'مُبْتَدَأٌ وَخَبَرٌ', fr: 'Sujet et prédicat', en: 'Subject and predicate' }, 'mubtada-khabar', [
          ['الكِتَابُ جَدِيدٌ', 'al-kitābu jadīdun', 'le livre est neuf', 'the book is new'],
          ['البَيْتُ كَبِيرٌ', 'al-baytu kabīrun', 'la maison est grande', 'the house is big'],
          ['الطَّالِبُ نَشِيطٌ', 'aṭ-ṭālibu nashīṭun', 'l’étudiant est actif', 'the student is active'],
          ['المُبْتَدَأُ وَالخَبَرُ', 'al-mubtadaʾu wa-l-khabaru', 'le sujet et le prédicat', 'the subject and the predicate'],
        ], 'Pas de verbe « être ». Le sujet est défini, le prédicat indéfini. Même idée que l’unité 10.'),
      ]),
    ],
  },
  {
    id: 'A2',
    ar: 'المُسْتَوَى الثَّانِي',
    fr: 'A2 · Les premières marques',
    en: 'A2 · The first endings',
    minutes: 5,
    blurb: { fr: 'Voyelles de fonction, kāna, inna, verbe simple, annexion, adjectif, nombres.', en: 'Case vowels, kāna, inna, a simple verb, annexation, adjective, numbers.' },
    units: [
      unit('A2', 'u-irab', 'الإِعْرَاب', 'Les trois voyelles de fonction', 'The three case vowels', 'irab', [
        lesson('A2', 'u-irab', 1, { ar: 'رَفْعٌ نَصْبٌ جَرٌّ', fr: 'Nominatif, accusatif, génitif', en: 'Nominative, accusative, genitive' }, 'irab', [
          ['الكِتَابُ مَرْفُوعٌ', 'al-kitābu marfūʿun', 'al-kitābu est au nominatif', 'al-kitābu is nominative'],
          ['قَرَأْتُ الكِتَابَ', 'qaraʾtu l-kitāba', 'j’ai lu le livre (accusatif)', 'I read the book (accusative)'],
          ['فِي الكِتَابِ', 'fī l-kitābi', 'dans le livre (génitif)', 'in the book (genitive)'],
          ['الضَّمَّةُ وَالفَتْحَةُ وَالكَسْرَةُ', 'aḍ-ḍammatu wa-l-fatḥatu wa-l-kasratu', 'ḍamma, fatḥa et kasra', 'ḍamma, fatḥa and kasra'],
        ], 'La voyelle finale change le rôle, pas la lettre. à vérifier pour les cas où la marque n’est pas une voyelle brève.'),
      ]),
      unit('A2', 'u-kana', 'كَانَ', 'kāna et quelques sœurs', 'kāna and a few sisters', 'kana', [
        lesson('A2', 'u-kana', 1, { ar: 'كَانَ وَأَخَوَاتُهَا', fr: 'kāna change le prédicat', en: 'kāna changes the predicate' }, 'kana', [
          ['كَانَ الجَوُّ جَمِيلًا', 'kāna l-jawwu jamīlan', 'le temps était beau', 'the weather was fine'],
          ['لَيْسَ البَيْتُ بَعِيدًا', 'laysa l-baytu baʿīdan', 'la maison n’est pas loin', 'the house is not far'],
          ['أَصْبَحَ الطَّالِبُ نَشِيطًا', 'aṣbaḥa ṭ-ṭālibu nashīṭan', 'l’étudiant est devenu actif', 'the student became active'],
          ['الخَبَرُ مَنْصُوبٌ', 'al-khabaru manṣūbun', 'le prédicat est à l’accusatif', 'the predicate is accusative'],
        ], 'kāna, laysa, aṣbaḥa : trois sœurs seulement dans cette séance. La liste classique complète est à vérifier.'),
      ]),
      unit('A2', 'u-inna', 'إِنَّ', 'inna et quelques sœurs', 'inna and a few sisters', 'inna', [
        lesson('A2', 'u-inna', 1, { ar: 'إِنَّ وَأَخَوَاتُهَا', fr: 'inna met le sujet à l’accusatif', en: 'inna puts the subject in the accusative' }, 'inna', [
          ['إِنَّ الكِتَابَ جَدِيدٌ', 'inna l-kitāba jadīdun', 'le livre est vraiment neuf', 'the book is indeed new'],
          ['لَكِنَّ البَيْتَ صَغِيرٌ', 'lākinna l-bayta ṣaghīrun', 'mais la maison est petite', 'but the house is small'],
          ['لَيْتَ الجَوَّ جَمِيلٌ', 'layta l-jawwa jamīlun', 'si seulement le temps était beau', 'if only the weather were fine'],
          ['اِسْمُ إِنَّ مَنْصُوبٌ', 'ismu inna manṣūbun', 'le sujet de inna est à l’accusatif', 'the subject of inna is accusative'],
        ], 'inna, lākinna, layta. Les autres sœurs (anna, ka-anna, laʿalla) sont à vérifier avant de les enseigner comme liste fermée.'),
      ]),
      unit('A2', 'u-verb', 'الفِعْل', 'Le verbe simple', 'The simple verb', 'forme-I', [
        lesson('A2', 'u-verb', 1, { ar: 'الفِعْلُ الثُّلَاثِيّ', fr: 'Forme I, passé et présent', en: 'Form I, past and present' }, 'forme-I', [
          ['كَتَبَ الطَّالِبُ', 'kataba ṭ-ṭālibu', 'l’étudiant a écrit', 'the student wrote'],
          ['يَكْتُبُ الطَّالِبُ', 'yaktubu ṭ-ṭālibu', 'l’étudiant écrit', 'the student writes'],
          ['جَلَسَ الوَلَدُ', 'jalasa l-waladu', 'le garçon s’est assis', 'the boy sat'],
          ['يَجْلِسُ الوَلَدُ', 'yajlisu l-waladu', 'le garçon s’assoit', 'the boy sits'],
        ], 'Forme I seulement. La voyelle du présent (u ou i) se mémorise avec le verbe. à vérifier mot par mot.'),
      ]),
      unit('A2', 'u-idafa', 'الإِضَافَة', 'L’annexion', 'Annexation', 'idafa', [
        lesson('A2', 'u-idafa', 1, { ar: 'مُضَافٌ وَمُضَافٌ إِلَيْهِ', fr: 'Deux noms, un seul article', en: 'Two nouns, one article' }, 'idafa', [
          ['بَابُ البَيْتِ', 'bābu l-bayti', 'la porte de la maison', 'the door of the house'],
          ['كِتَابُ الطَّالِبِ', 'kitābu ṭ-ṭālibi', 'le livre de l’étudiant', 'the student’s book'],
          ['اِسْمُ الوَلَدِ', 'ismu l-waladi', 'le nom du garçon', 'the boy’s name'],
          ['المُضَافُ بِلَا تَنْوِينٍ', 'al-muḍāfu bilā tanwīnin', 'le premier nom n’a pas de tanwīn', 'the first noun has no tanwīn'],
        ], 'Le second nom est au génitif. Pas d’article sur le premier.'),
      ]),
      unit('A2', 'u-nat', 'النَّعْت', 'L’adjectif', 'The adjective', 'nat', [
        lesson('A2', 'u-nat', 1, { ar: 'النَّعْتُ يُطَابِقُ', fr: 'L’adjectif suit le nom', en: 'The adjective follows the noun' }, 'nat', [
          ['الكِتَابُ الجَدِيدُ', 'al-kitābu l-jadīdu', 'le livre neuf', 'the new book'],
          ['البَيْتُ الكَبِيرُ', 'al-baytu l-kabīru', 'la grande maison', 'the big house'],
          ['طَالِبٌ نَشِيطٌ', 'ṭālibun nashīṭun', 'un étudiant actif', 'an active student'],
          ['النَّعْتُ بَعْدَ المَنْعُوتِ', 'an-naʿtu baʿda l-manʿūti', 'l’adjectif vient après le nom', 'the adjective comes after the noun'],
        ], 'Même définition, même voyelle finale, même genre dans ces exemples simples.'),
      ]),
      unit('A2', 'u-num', 'العَدَد', 'Nombres et compté', 'Numbers and the counted noun', 'nombres', [
        lesson('A2', 'u-num', 1, { ar: 'وَاحِدٌ وَاثْنَانِ', fr: 'Un et deux suivent le nom', en: 'One and two follow the noun' }, 'nombres', [
          ['كِتَابٌ وَاحِدٌ', 'kitābun wāḥidun', 'un seul livre', 'one book'],
          ['كِتَابَانِ اثْنَانِ', 'kitābāni thnāni', 'deux livres', 'two books'],
          ['ثَلَاثَةُ كُتُبٍ', 'thalāthatu kutubin', 'trois livres', 'three books'],
          ['العَدَدُ يَحْتَاجُ مُرَاجَعَةً', 'al-ʿadadu yaḥtāju murājaʿatan', 'le nombre demande une relecture', 'number agreement needs review'],
        ], 'Un et deux s’accordent. À partir de trois, la règle change. Le détail 3–10 est à vérifier avant une leçon plus longue.'),
      ]),
    ],
  },
  {
    id: 'B1',
    ar: 'المُسْتَوَى الثَّالِث',
    fr: 'B1 · Étendre la phrase',
    en: 'B1 · Extend the sentence',
    minutes: 5,
    blurb: { fr: 'Formes II à V, compléments, ḥāl, relatifs, jussif et subjonctif.', en: 'Forms II–V, objects, ḥāl, relatives, jussive and subjunctive.' },
    units: [
      unit('B1', 'u-forms', 'المَزِيد', 'Formes II à V', 'Forms II to V', 'formes-II-V', [
        lesson('B1', 'u-forms', 1, { ar: 'فَعَّلَ وَفَاعَلَ', fr: 'Formes II et III', en: 'Forms II and III' }, 'formes-II-V', [
          ['دَرَّسَ الأُسْتَاذُ', 'darrasa l-ustādhu', 'le professeur a enseigné', 'the teacher taught'],
          ['كَاتَبَ الصَّدِيقُ', 'kātaba ṣ-ṣadīqu', 'l’ami a correspondu', 'the friend corresponded'],
          ['يُدَرِّسُ الأُسْتَاذُ', 'yudarrisu l-ustādhu', 'le professeur enseigne', 'the teacher teaches'],
          ['الشَّدَّةُ عَلَامَةُ التَّضْعِيفِ', 'ash-shaddatu ʿalāmatu t-taḍʿīfi', 'la shadda marque le redoublement', 'shadda marks doubling'],
        ], 'II redouble, III allonge le alif. Sens précis à vérifier selon le verbe.'),
        lesson('B1', 'u-forms', 2, { ar: 'أَفْعَلَ وَتَفَعَّلَ', fr: 'Formes IV et V', en: 'Forms IV and V' }, 'formes-II-V', [
          ['أَخْرَجَ الوَلَدُ', 'akhraja l-waladu', 'le garçon a fait sortir', 'the boy brought out'],
          ['تَعَلَّمَ الطَّالِبُ', 'taʿallama ṭ-ṭālibu', 'l’étudiant a appris', 'the student learned'],
          ['يُخْرِجُ الوَلَدُ', 'yukhriju l-waladu', 'le garçon fait sortir', 'the boy brings out'],
          ['يَتَعَلَّمُ الطَّالِبُ', 'yataʿallamu ṭ-ṭālibu', 'l’étudiant apprend', 'the student learns'],
        ], 'IV commence souvent par a- au passé. V par ta-. à vérifier sur chaque racine.'),
      ]),
      unit('B1', 'u-maful', 'المَفْعُول', 'Le complément d’objet', 'The direct object', 'maful', [
        lesson('B1', 'u-maful', 1, { ar: 'المَفْعُولُ بِهِ', fr: 'Qui subit l’action', en: 'Who receives the action' }, 'maful', [
          ['قَرَأَ الطَّالِبُ الكِتَابَ', 'qaraʾa ṭ-ṭālibu l-kitāba', 'l’étudiant a lu le livre', 'the student read the book'],
          ['كَتَبَ الوَلَدُ الدَّرْسَ', 'kataba l-waladu d-darsa', 'le garçon a écrit la leçon', 'the boy wrote the lesson'],
          ['فَتَحَ الرَّجُلُ البَابَ', 'fataḥa r-rajulu l-bāba', 'l’homme a ouvert la porte', 'the man opened the door'],
          ['المَفْعُولُ مَنْصُوبٌ', 'al-mafʿūlu manṣūbun', 'le complément est à l’accusatif', 'the object is accusative'],
        ], 'L’agent reste au nominatif. L’objet prend la fatḥa.'),
      ]),
      unit('B1', 'u-hal', 'الحَال', 'La circonstance', 'The circumstantial', 'hal', [
        lesson('B1', 'u-hal', 1, { ar: 'جَاءَ ضَاحِكًا', fr: 'Comment il est arrivé', en: 'How he arrived' }, 'hal', [
          ['جَاءَ الوَلَدُ ضَاحِكًا', 'jāʾa l-waladu ḍāḥikan', 'le garçon est arrivé en riant', 'the boy arrived laughing'],
          ['خَرَجَ الرَّجُلُ مُسْرِعًا', 'kharaja r-rajulu musriʿan', 'l’homme est sorti en hâte', 'the man left in a hurry'],
          ['جَلَسَ الطَّالِبُ هَادِئًا', 'jalasa ṭ-ṭālibu hādiʾan', 'l’étudiant s’est assis calme', 'the student sat calmly'],
          ['الحَالُ نَكِرَةٌ مَنْصُوبَةٌ', 'al-ḥālu nakiratun manṣūbatun', 'le ḥāl est indéfini et accusatif', 'the ḥāl is indefinite and accusative'],
        ], 'Il répond à « comment ? ». à vérifier quand le ḥāl est une phrase, pas un seul mot.'),
      ]),
      unit('B1', 'u-rel', 'الصِّلَة', 'La relative', 'The relative clause', 'relatif', [
        lesson('B1', 'u-rel', 1, { ar: 'الَّذِي وَالَّتِي', fr: 'Celui qui, celle qui', en: 'The one who' }, 'relatif', [
          ['الطَّالِبُ الَّذِي كَتَبَ', 'aṭ-ṭālibu lladhī kataba', 'l’étudiant qui a écrit', 'the student who wrote'],
          ['البِنْتُ الَّتِي قَرَأَتْ', 'al-bintu llatī qaraʾat', 'la fille qui a lu', 'the girl who read'],
          ['الكِتَابُ الَّذِي قَرَأْتُهُ', 'al-kitābu lladhī qaraʾtuhu', 'le livre que j’ai lu', 'the book that I read'],
          ['الصِّلَةُ بَعْدَ الاسْمِ', 'aṣ-ṣilatu baʿda l-ismi', 'la relative suit le nom', 'the relative follows the noun'],
        ], 'Le pronom de rappel (-hu) est souvent nécessaire. à vérifier au duel et au pluriel.'),
      ]),
      unit('B1', 'u-mood', 'الجَزْم', 'Jussif et subjonctif', 'Jussive and subjunctive', 'jussif-subjonctif', [
        lesson('B1', 'u-mood', 1, { ar: 'لَمْ وَلَنْ', fr: 'lam et lan', en: 'lam and lan' }, 'jussif-subjonctif', [
          ['لَمْ يَكْتُبِ الطَّالِبُ', 'lam yaktubi ṭ-ṭālibu', 'l’étudiant n’a pas écrit', 'the student did not write'],
          ['لَنْ يَكْتُبَ الطَّالِبُ', 'lan yaktuba ṭ-ṭālibu', 'l’étudiant n’écrira pas', 'the student will not write'],
          ['لِكَيْ يَفْهَمَ', 'li-kay yafhama', 'afin qu’il comprenne', 'so that he understands'],
          ['السُّكُونُ بَعْدَ لَمْ', 'as-sukūnu baʿda lam', 'sukūn après lam', 'sukūn after lam'],
        ], 'lam + jussif (passé nié). lan + subjonctif (futur nié). La voyelle de liaison avant al- est à vérifier à l’oral.'),
      ]),
    ],
  },
  {
    id: 'B2',
    ar: 'المُسْتَوَى الرَّابِع',
    fr: 'B2 · Formes et compléments',
    en: 'B2 · Forms and complements',
    minutes: 5,
    blurb: { fr: 'Formes VI–X, verbes faibles, cinq noms, tamyīz, exception, condition, passif.', en: 'Forms VI–X, weak verbs, the five nouns, specification, exception, condition, passive.' },
    units: [
      unit('B2', 'u-forms2', 'الأَوْزَان', 'Formes VI à X', 'Forms VI to X', 'formes-VI-X', [
        lesson('B2', 'u-forms2', 1, { ar: 'تَفَاعَلَ وَانْفَعَلَ', fr: 'VI et VII', en: 'VI and VII' }, 'formes-VI-X', [
          ['تَكَاتَبَ الصَّدِيقَانِ', 'takātaba ṣ-ṣadīqāni', 'les deux amis ont correspondu', 'the two friends corresponded'],
          ['اِنْكَسَرَ الكُوبُ', 'inkasara l-kūbu', 'le verre s’est cassé', 'the cup broke'],
          ['يَتَكَاتَبُ الصَّدِيقَانِ', 'yatakātabu ṣ-ṣadīqāni', 'les deux amis correspondent', 'the two friends correspond'],
          ['يَنْكَسِرُ الكُوبُ', 'yankasiru l-kūbu', 'le verre se casse', 'the cup breaks'],
        ], 'Sens réciproque ou de résultat. à vérifier verbe par verbe.'),
        lesson('B2', 'u-forms2', 2, { ar: 'اِفْتَعَلَ وَاسْتَفْعَلَ', fr: 'VIII et X', en: 'VIII and X' }, 'formes-VI-X', [
          ['اِجْتَمَعَ النَّاسُ', 'ijtamaʿa n-nāsu', 'les gens se sont réunis', 'the people gathered'],
          ['اِسْتَخْرَجَ الطَّالِبُ', 'istakhraja ṭ-ṭālibu', 'l’étudiant a extrait', 'the student extracted'],
          ['يَجْتَمِعُ النَّاسُ', 'yajtamiʿu n-nāsu', 'les gens se réunissent', 'the people gather'],
          ['يَسْتَخْرِجُ الطَّالِبُ', 'yastakhriju ṭ-ṭālibu', 'l’étudiant extrait', 'the student extracts'],
        ], 'La forme IX (اِفْعَلَّ) est rare ici et à vérifier avant un exemple de couleur.'),
      ]),
      unit('B2', 'u-weak', 'المُعْتَلّ', 'Verbes faibles', 'Weak verbs', 'verbes-faibles', [
        lesson('B2', 'u-weak', 1, { ar: 'قَالَ وَوَعَدَ وَرَمَى', fr: 'Creux, assimilé, défectueux', en: 'Hollow, assimilated, defective' }, 'verbes-faibles', [
          ['قَالَ الرَّجُلُ', 'qāla r-rajulu', 'l’homme a dit', 'the man said'],
          ['يَقُولُ الرَّجُلُ', 'yaqūlu r-rajulu', 'l’homme dit', 'the man says'],
          ['وَعَدَ الصَّدِيقُ', 'waʿada ṣ-ṣadīqu', 'l’ami a promis', 'the friend promised'],
          ['رَمَى الوَلَدُ', 'ramā l-waladu', 'le garçon a jeté', 'the boy threw'],
        ], 'Trois familles seulement, un verbe chacune. Le classement mithāl / ajwaf / nāqiṣ est à vérifier.'),
      ]),
      unit('B2', 'u-five', 'الأَسْمَاء', 'Les cinq noms', 'The five nouns', 'cinq-noms', [
        lesson('B2', 'u-five', 1, { ar: 'أَبٌ وَأَخٌ', fr: 'Père et frère à l’état annexé', en: 'Father and brother when annexed' }, 'cinq-noms', [
          ['جَاءَ أَبُوكَ', 'jāʾa abūka', 'ton père est venu', 'your father came'],
          ['رَأَيْتُ أَبَاكَ', 'raʾaytu abāka', 'j’ai vu ton père', 'I saw your father'],
          ['مَرَرْتُ بِأَبِيكَ', 'marartu bi-abīka', 'je suis passé près de ton père', 'I passed by your father'],
          ['وَأَخُوكَ كَذٰلِكَ', 'wa-akhūka kadhālika', 'et ton frère de même', 'and your brother likewise'],
        ], 'ū / ā / ī quand le nom est annexé à un pronom. ḥam, dhū et fū sont à vérifier dans une séance à part.'),
      ]),
      unit('B2', 'u-tamyiz', 'التَّمْيِيز', 'Le spécificatif', 'Specification', 'tamyiz', [
        lesson('B2', 'u-tamyiz', 1, { ar: 'أَكْثَرُ عِلْمًا', fr: 'De quoi on parle', en: 'What is being measured' }, 'tamyiz', [
          ['هُوَ أَكْثَرُ عِلْمًا', 'huwa aktharu ʿilman', 'il a plus de savoir', 'he has more knowledge'],
          ['اِشْتَرَيْتُ مِتْرًا قُمَاشًا', 'ishtaraytu mitran qumāshan', 'j’ai acheté un mètre de tissu', 'I bought a metre of cloth'],
          ['طَابَ المَكَانُ هَوَاءً', 'ṭāba l-makānu hawāʾan', 'l’endroit est bon par son air', 'the place is pleasant in its air'],
          ['التَّمْيِيزُ نَكِرَةٌ مَنْصُوبَةٌ', 'at-tamyīzu nakiratun manṣūbatun', 'le tamyīz est indéfini et accusatif', 'tamyīz is indefinite and accusative'],
        ], 'Il lève une ambiguïté. à vérifier pour le tamyīz après un nombre.'),
      ]),
      unit('B2', 'u-istithna', 'الاسْتِثْنَاء', 'L’exception', 'The exception', 'istithna', [
        lesson('B2', 'u-istithna', 1, { ar: 'إِلَّا', fr: 'Sauf', en: 'Except' }, 'istithna', [
          ['حَضَرَ الطُّلَّابُ إِلَّا وَاحِدًا', 'ḥaḍara ṭ-ṭullābu illā wāḥidan', 'les étudiants sont venus sauf un', 'the students came except one'],
          ['مَا حَضَرَ إِلَّا وَاحِدٌ', 'mā ḥaḍara illā wāḥidun', 'seul un est venu', 'only one came'],
          ['قَرَأْتُ الكُتُبَ إِلَّا كِتَابًا', 'qaraʾtu l-kutuba illā kitāban', 'j’ai lu les livres sauf un', 'I read the books except one'],
          ['الاسْتِثْنَاءُ بِإِلَّا', 'al-istithnāʾu bi-illā', 'l’exception avec illā', 'exception with illā'],
        ], 'Phrase affirmative : l’excepté est à l’accusatif. La phrase niée change la donne. à vérifier.'),
      ]),
      unit('B2', 'u-cond', 'الشَّرْط', 'La condition', 'The conditional', 'conditionnel', [
        lesson('B2', 'u-cond', 1, { ar: 'إِنْ وَإِذَا', fr: 'Si et quand', en: 'If and when' }, 'conditionnel', [
          ['إِنْ تَدْرُسْ تَنْجَحْ', 'in tadrus tanjaḥ', 'si tu étudies, tu réussis', 'if you study, you succeed'],
          ['إِذَا جَاءَ الضَّيْفُ', 'idhā jāʾa ḍ-ḍayfu', 'quand l’invité vient', 'when the guest comes'],
          ['مَنْ يَعْمَلْ يَنْتَفِعْ', 'man yaʿmal yantafiʿ', 'qui agit en profite', 'whoever works benefits'],
          ['جَوَابُ الشَّرْطِ بَعْدَهُ', 'jawābu sh-sharṭi baʿdahu', 'l’apodose suit la protase', 'the result follows the condition'],
        ], 'in + deux jussifs dans l’exemple court. idhā n’est pas le même outil. à vérifier.'),
      ]),
      unit('B2', 'u-pass', 'المَجْهُول', 'Le passif', 'The passive', 'passif', [
        lesson('B2', 'u-pass', 1, { ar: 'كُتِبَ الدَّرْسُ', fr: 'L’action sans agent', en: 'The action without an agent' }, 'passif', [
          ['كُتِبَ الدَّرْسُ', 'kutiba d-darsu', 'la leçon a été écrite', 'the lesson was written'],
          ['يُكْتَبُ الدَّرْسُ', 'yuktabu d-darsu', 'la leçon est écrite', 'the lesson is written'],
          ['فُتِحَ البَابُ', 'futiḥa l-bābu', 'la porte a été ouverte', 'the door was opened'],
          ['نَائِبُ الفَاعِلِ مَرْفُوعٌ', 'nāʾibu l-fāʿili marfūʿun', 'le sujet apparent est au nominatif', 'the deputy subject is nominative'],
        ], 'Forme I seulement. Le passif des formes dérivées est à vérifier.'),
      ]),
    ],
  },
  {
    id: 'C1',
    ar: 'المُسْتَوَى الخَامِس',
    fr: 'C1 · Carte avancée',
    en: 'C1 · Advanced map',
    minutes: 5,
    blurb: { fr: 'Carte des thèmes d’al-Ājurrūmiyya, puis des sujets du Qaṭr et de l’Alfiyya, et une porte vers la balāgha. Textes originaux, pas les manuels.', en: 'A map of Ājurrūmiyya topics, then Qaṭr and Alfiyya topics, and a door into balāgha. Original wording, not the manuals.' },
    units: [
      unit('C1', 'u-ajur', 'الخَرِيطَة', 'Carte du niveau Ājurrūmiyya', 'Ājurrūmiyya-level map', 'ajurrumiyya', [
        lesson('C1', 'u-ajur', 1, { ar: 'الكَلَامُ وَالإِعْرَابُ', fr: 'Parole et désinence', en: 'Speech and inflection' }, 'ajurrumiyya', [
          ['الكَلَامُ لَفْظٌ مُفِيدٌ', 'al-kalāmu lafẓun mufīdun', 'la parole est une expression utile', 'speech is a meaningful utterance'],
          ['المَرْفُوعَاتُ كَثِيرَةٌ', 'al-marfūʿātu kathīratun', 'les nominatifs sont nombreux', 'nominatives are many'],
          ['المَنْصُوبَاتُ كَثِيرَةٌ', 'al-manṣūbātu kathīratun', 'les accusatifs sont nombreux', 'accusatives are many'],
          ['المَجْرُورَاتُ بِالحَرْفِ', 'al-majrūrātu bi-l-ḥarfi', 'les génitifs par particule', 'genitives by particle'],
        ], 'Carte des chapitres, pas le texte du manuel. Chaque définition classique est à vérifier sur une édition que vous possédez.'),
        lesson('C1', 'u-ajur', 2, { ar: 'عَلَامَاتُ الإِعْرَابِ', fr: 'Les marques, au-delà de la voyelle', en: 'Endings beyond the short vowel' }, 'ajurrumiyya', [
          ['جَاءَ المُسْلِمُونَ', 'jāʾa l-muslimūna', 'les musulmans sont venus (wāw)', 'the Muslims came (wāw)'],
          ['رَأَيْتُ المُسْلِمِينَ', 'raʾaytu l-muslimīna', 'j’ai vu les musulmans (yāʾ)', 'I saw the Muslims (yāʾ)'],
          ['الطَّالِبَانِ مُجْتَهِدَانِ', 'aṭ-ṭālibāni mujtahidāni', 'les deux étudiants sont appliqués', 'the two students are diligent'],
          ['العَلَامَةُ قَدْ تَكُونُ حَرْفًا', 'al-ʿalāmatu qad takūnu ḥarfan', 'la marque peut être une lettre', 'the marker can be a letter'],
        ], 'Pluriel sain et duel. Le détail des cinq noms et du verbe est à vérifier.'),
      ]),
      unit('C1', 'u-qatr', 'التَّوَابِع', 'Sujets du Qaṭr et de l’Alfiyya', 'Qaṭr and Alfiyya topics', 'qatr-alfiyya', [
        lesson('C1', 'u-qatr', 1, { ar: 'بَدَلٌ وَتَوْكِيدٌ', fr: 'Apposition et renforcement', en: 'Apposition and emphasis' }, 'qatr-alfiyya', [
          ['جَاءَ أَخُوكَ زَيْدٌ', 'jāʾa akhūka zaydun', 'ton frère Zayd est venu', 'your brother Zayd came'],
          ['جَاءَ الطُّلَّابُ كُلُّهُمْ', 'jāʾa ṭ-ṭullābu kulluhum', 'les étudiants sont tous venus', 'the students all came'],
          ['البَدَلُ يُوَضِّحُ', 'al-badalu yuwaḍḍiḥu', 'l’apposition précise', 'the substitute clarifies'],
          ['التَّوْكِيدُ يُقَوِّي', 'at-tawkīdu yuqawwī', 'le renforcement appuie', 'emphasis strengthens'],
        ], 'Aperçu, pas les chapitres du Qaṭr an-Nadā ni de l’Alfiyya. L’analyse de ces deux phrases est à vérifier.'),
        lesson('C1', 'u-qatr', 2, { ar: 'عَطْفٌ وَنَعْتٌ سَبَبِيّ', fr: 'Coordination et adjectif indirect', en: 'Coordination and indirect adjective' }, 'qatr-alfiyya', [
          ['جَاءَ زَيْدٌ وَعَمْرٌو', 'jāʾa zaydun wa-ʿamrun', 'Zayd et Amr sont venus', 'Zayd and Amr came'],
          ['جَاءَ الرَّجُلُ الكَرِيمُ أَبُوهُ', 'jāʾa r-rajulu l-karīmu abūhu', 'l’homme dont le père est généreux est venu', 'the man whose father is generous came'],
          ['الوَاوُ تُشْرِكُ', 'al-wāwu tushriku', 'le wāw met au même rôle', 'wāw shares the role'],
          ['النَّعْتُ السَّبَبِيُّ دَقِيقٌ', 'an-naʿtu s-sababiyyu daqīqun', 'l’adjectif indirect est délicat', 'the indirect adjective is subtle'],
        ], 'Sujets de grammaire avancée, formulés ici avec des phrases originales. à vérifier.'),
      ]),
      unit('C1', 'u-balagha', 'البَلَاغَة', 'Porte de la balāgha', 'A door into balāgha', 'balagha', [
        lesson('C1', 'u-balagha', 1, { ar: 'تَشْبِيهٌ', fr: 'La comparaison', en: 'The simile' }, 'balagha', [
          ['العِلْمُ كَالنُّورِ', 'al-ʿilmu ka-n-nūri', 'le savoir est comme la lumière', 'knowledge is like light'],
          ['الكَافُ أَدَاةُ التَّشْبِيهِ', 'al-kāfu adātu t-tashbīhi', 'le kāf est l’outil de la comparaison', 'kāf is the tool of comparison'],
          ['المُشَبَّهُ العِلْمُ', 'al-mushabbahu l-ʿilmu', 'le comparé est le savoir', 'the thing compared is knowledge'],
          ['المُشَبَّهُ بِهِ النُّورُ', 'al-mushabbahu bihi n-nūru', 'le comparant est la lumière', 'the standard is light'],
        ], 'Introduction seulement. Les termes de balāgha sont à vérifier sur un manuel que vous avez le droit d’utiliser.'),
        lesson('C1', 'u-balagha', 2, { ar: 'اِسْتِعَارَةٌ وَكِنَايَةٌ', fr: 'Image et détour', en: 'Metaphor and allusion' }, 'balagha', [
          ['رَأَيْتُ أَسَدًا فِي الفَصْلِ', 'raʾaytu asadan fī l-faṣli', 'j’ai vu un lion dans la classe', 'I saw a lion in the classroom'],
          ['المَقْصُودُ رَجُلٌ شُجَاعٌ', 'al-maqṣūdu rajulun shujāʿun', 'on vise un homme courageux', 'a brave man is meant'],
          ['زَيْدٌ كَثِيرُ الرَّمَادِ', 'zaydun kathīru r-ramādi', 'Zayd a beaucoup de cendres', 'Zayd has much ash'],
          ['الكِنَايَةُ لَا تُصَرِّحُ', 'al-kināyatu lā tuṣarriḥu', 'l’allusion ne dit pas tout', 'allusion does not state everything'],
        ], 'Image d’un lion pour un brave, et cendres pour l’hospitalité : exemples pédagogiques originaux. Le classement istiʿāra / kināya est à vérifier.'),
      ]),
    ],
  },
];

for (const spec of EXTRA_SPECS) {
  const level = GRAMMAR_LEVELS.find((entry) => entry.id === spec.level);
  if (!level) throw new Error(`niveau inconnu ${spec.level}`);
  level.units.push(
    unit(spec.level, spec.unit, spec.uAr, spec.uFr, spec.uEn, spec.topic, [
      lesson(spec.level, spec.unit, spec.n, { ar: spec.tAr, fr: spec.tFr, en: spec.tEn }, spec.topic, spec.rows, spec.explain, spec.caution),
    ]),
  );
}

export const GRAMMAR_LESSONS: GrammarLesson[] = GRAMMAR_LEVELS.flatMap((level) => level.units.flatMap((u) => u.lessons));

export const GRAMMAR_BY_ID: Record<string, GrammarLesson> = Object.fromEntries(GRAMMAR_LESSONS.map((l) => [l.id, l]));

export function lessonByAnyId(id: string): Lesson | undefined {
  return LESSON_BY_ID[id] ?? GRAMMAR_BY_ID[id];
}

/** Exemples de la leçon, plus une carte de révision par exercice. Les ids .1 .2 ne bougent pas. */
export function reviewItems(lessonId: string): Item[] | null {
  const lesson = GRAMMAR_BY_ID[lessonId];
  if (!lesson) return null;
  const cards: Item[] = lesson.exercises.map((exercise, index) => {
    const answerHasArabic = /[\u0600-\u06FF]/.test(exercise.answer);
    return {
      id: `${lesson.id}.x${index + 1}`,
      ar: answerHasArabic ? exercise.answer : exercise.ar,
      tr: exercise.kind,
      fr: answerHasArabic ? exercise.prompt : exercise.answer,
      en: exercise.prompt,
      kind: 'phrase',
    };
  });
  return [...lesson.items, ...cards];
}

export function levelById(id: string): GrammarLevel | undefined {
  return GRAMMAR_LEVELS.find((level) => level.id === id);
}

export function levelIndex(id: LevelId): number {
  return LEVEL_ORDER.indexOf(id);
}

const done = (record: LessonRecord | undefined) => (record?.best ?? 0) >= 0.6;

export function levelStats(state: State, id: LevelId): { done: number; total: number; ratio: number } {
  const lessons = GRAMMAR_LESSONS.filter((lesson) => lesson.level === id);
  const total = lessons.length;
  const finished = lessons.filter((lesson) => done(state.lessons[lesson.id])).length;
  return { done: finished, total, ratio: total ? finished / total : 0 };
}

/** Première leçon de 5 minutes encore ouverte, à partir du placement (ou de A1). */
export function nextGrammarLesson(state: State): GrammarLesson | null {
  const start = state.placement ? levelIndex(state.placement) : 0;
  const from = start < 0 ? 0 : start;
  for (const id of LEVEL_ORDER.slice(from)) {
    for (const lesson of GRAMMAR_LESSONS) {
      if (lesson.level === id && !done(state.lessons[lesson.id])) return lesson;
    }
  }
  return null;
}

export function levelUnlocked(state: State, id: LevelId): boolean {
  if (id === 'A1') return true;
  if (state.placement && levelIndex(state.placement) >= levelIndex(id)) return true;
  const prev = LEVEL_ORDER[levelIndex(id) - 1];
  return levelStats(state, prev).ratio >= 1;
}

export type CoverageRow = {
  level: LevelId;
  lessons: number;
  items: number;
  topics: string[];
  caution: number;
  readingUnits: number;
};

export function coverageReport(): CoverageRow[] {
  return GRAMMAR_LEVELS.map((level) => ({
    level: level.id,
    lessons: level.units.reduce((n, u) => n + u.lessons.length, 0),
    items: level.units.reduce((n, u) => n + u.lessons.reduce((m, l) => m + l.items.length, 0), 0),
    topics: level.units.map((u) => u.topic),
    caution: level.units.reduce((n, u) => n + u.lessons.filter((l) => l.caution).length, 0),
    readingUnits: level.id === 'A1' ? UNITS.length : 0,
  }));
}

const HARAKA = /[\u064B-\u0652]/;

export function arabicIsVocalized(text: string): boolean {
  return HARAKA.test(text);
}

export type PlacementQuestion = {
  id: string;
  level: LevelId;
  prompt: string;
  ar: string;
  options: string[];
  answer: number;
};

/** Huit questions fixes. Le score ne modifie pas les boîtes de Leitner. */
export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  { id: 'p1', level: 'A1', prompt: 'Quelle espèce est كِتَابٌ ?', ar: 'كِتَابٌ', options: ['nom', 'verbe', 'particule'], answer: 0 },
  { id: 'p2', level: 'A1', prompt: 'Dans الكِتَابُ جَدِيدٌ, جَدِيدٌ est…', ar: 'الكِتَابُ جَدِيدٌ', options: ['le prédicat', 'une particule', 'un verbe'], answer: 0 },
  { id: 'p3', level: 'A2', prompt: 'Après فِي, الكِتَابِ est…', ar: 'فِي الكِتَابِ', options: ['au génitif', 'un verbe', 'au nominatif seulement'], answer: 0 },
  { id: 'p4', level: 'A2', prompt: 'كَانَ الجَوُّ جَمِيلًا : جَمِيلًا est…', ar: 'كَانَ الجَوُّ جَمِيلًا', options: ['prédicat à l’accusatif', 'sujet', 'particule'], answer: 0 },
  { id: 'p5', level: 'B1', prompt: 'Dans قَرَأَ الطَّالِبُ الكِتَابَ, الكِتَابَ est…', ar: 'قَرَأَ الطَّالِبُ الكِتَابَ', options: ['complément d’objet', 'particule', 'prédicat de kāna'], answer: 0 },
  { id: 'p6', level: 'B1', prompt: 'لَمْ يَكْتُبْ met le verbe…', ar: 'لَمْ يَكْتُبْ', options: ['au jussif', 'après inna', 'au génitif'], answer: 0 },
  { id: 'p7', level: 'B2', prompt: 'كُتِبَ الدَّرْسُ est…', ar: 'كُتِبَ الدَّرْسُ', options: ['un passif', 'un nom', 'une comparaison'], answer: 0 },
  { id: 'p8', level: 'C1', prompt: 'العِلْمُ كَالنُّورِ est d’abord…', ar: 'العِلْمُ كَالنُّورِ', options: ['une comparaison', 'un passif', 'une exception'], answer: 0 },
];

/**
 * Niveau proposé : le plus haut où toutes les questions de ce niveau
 * et des niveaux inférieurs sont justes. Sinon on descend. Zéro bonne réponse → A1.
 */
export function placementFromAnswers(picks: Record<string, number>): LevelId {
  const correct = (level: LevelId) =>
    PLACEMENT_QUESTIONS.filter((q) => q.level === level).every((q) => picks[q.id] === q.answer) &&
    PLACEMENT_QUESTIONS.some((q) => q.level === level);
  for (let i = LEVEL_ORDER.length - 1; i >= 0; i -= 1) {
    const id = LEVEL_ORDER[i];
    const lowerOk = LEVEL_ORDER.slice(0, i).every((lower) => correct(lower));
    if (correct(id) && lowerOk) return id;
  }
  return 'A1';
}
