/**
 * Leçons ajoutées après la première passe. Les identifiants `g…` déjà publiés
 * ne sont pas repris ici. Exemples originaux, vocalisés, sans citation classique.
 */
type Row = [ar: string, tr: string, fr: string, en: string];

export type ExtraSpec = {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  unit: string;
  n: number;
  topic: string;
  uAr: string;
  uFr: string;
  uEn: string;
  tAr: string;
  tFr: string;
  tEn: string;
  explain: string;
  caution?: boolean;
  rows: Row[];
};

function L(
  level: ExtraSpec['level'],
  unit: string,
  topic: string,
  uAr: string,
  uFr: string,
  uEn: string,
  tAr: string,
  tFr: string,
  tEn: string,
  explain: string,
  rows: Row[],
  caution = false,
): ExtraSpec {
  return { level, unit, n: 1, topic, uAr, uFr, uEn, tAr, tFr, tEn, explain, caution, rows };
}

const A1: ExtraSpec[] = [
  L('A1', 'u-dem-m', 'demonstratifs', 'أَسْمَاءُ الإِشَارَة', 'Démonstratif proche, masculin', 'Near demonstrative, masculine', 'هٰذَا', 'Ceci, masculin', 'This, masculine', 'هٰذَا désigne un masculin proche. Il se place devant le nom.', [
    ['هٰذَا كِتَابٌ', 'hādhā kitābun', 'ceci est un livre', 'this is a book'],
    ['هٰذَا بَيْتٌ', 'hādhā baytun', 'ceci est une maison', 'this is a house'],
    ['هٰذَا وَلَدٌ', 'hādhā waladun', 'ceci est un garçon', 'this is a boy'],
    ['هٰذَا قَلَمٌ', 'hādhā qalamun', 'ceci est un stylo', 'this is a pen'],
    ['هٰذَا بَابٌ', 'hādhā bābun', 'ceci est une porte', 'this is a door'],
  ]),
  L('A1', 'u-dem-f', 'demonstratifs', 'أَسْمَاءُ الإِشَارَة', 'Démonstratif proche, féminin', 'Near demonstrative, feminine', 'هٰذِهِ', 'Ceci, féminin', 'This, feminine', 'هٰذِهِ pour un nom féminin proche. Le nom qui suit reste indéfini dans « ceci est… ».', [
    ['هٰذِهِ سَيَّارَةٌ', 'hādhihi sayyāratun', 'ceci est une voiture', 'this is a car'],
    ['هٰذِهِ غُرْفَةٌ', 'hādhihi ghurfatun', 'ceci est une chambre', 'this is a room'],
    ['هٰذِهِ بِنْتٌ', 'hādhihi bintun', 'ceci est une fille', 'this is a girl'],
    ['هٰذِهِ وَرْدَةٌ', 'hādhihi wardatun', 'ceci est une rose', 'this is a rose'],
    ['هٰذِهِ مَدْرَسَةٌ', 'hādhihi madrasatun', 'ceci est une école', 'this is a school'],
  ]),
  L('A1', 'u-dem-far', 'demonstratifs', 'أَسْمَاءُ الإِشَارَة', 'Démonstratif lointain', 'Far demonstrative', 'ذٰلِكَ', 'Cela', 'That', 'ذٰلِكَ pour le masculin loin, تِلْكَ pour le féminin loin.', [
    ['ذٰلِكَ بَيْتٌ', 'dhālika baytun', 'cela est une maison', 'that is a house'],
    ['ذٰلِكَ رَجُلٌ', 'dhālika rajulun', 'cela est un homme', 'that is a man'],
    ['تِلْكَ سَيَّارَةٌ', 'tilka sayyāratun', 'cela est une voiture', 'that is a car'],
    ['تِلْكَ مَدِينَةٌ', 'tilka madīnatun', 'cela est une ville', 'that is a city'],
    ['ذٰلِكَ بَعِيدٌ', 'dhālika baʿīdun', 'cela est loin', 'that is far'],
  ]),
  L('A1', 'u-pron-1', 'pronoms', 'الضَّمَائِر', 'Je et nous', 'I and we', 'أَنَا', 'Pronoms de la 1re personne', 'First-person pronouns', 'أَنَا et نَحْنُ sont des pronoms indépendants. Ils ouvrent souvent la phrase.', [
    ['أَنَا طَالِبٌ', 'anā ṭālibun', 'je suis étudiant', 'I am a student'],
    ['أَنَا فِي البَيْتِ', 'anā fī l-bayti', 'je suis à la maison', 'I am at home'],
    ['نَحْنُ أَصْدِقَاءُ', 'naḥnu aṣdiqāʾu', 'nous sommes amis', 'we are friends'],
    ['نَحْنُ هُنَا', 'naḥnu hunā', 'nous sommes ici', 'we are here'],
    ['أَنَا أَقْرَأُ', 'anā aqraʾu', 'je lis', 'I read'],
  ], true),
  L('A1', 'u-pron-2', 'pronoms', 'الضَّمَائِر', 'Tu, il, elle', 'You, he, she', 'أَنْتَ', 'Pronoms de dialogue', 'Address pronouns', 'أَنْتَ pour un homme, أَنْتِ pour une femme, هُوَ et هِيَ pour la personne dont on parle.', [
    ['أَنْتَ مُعَلِّمٌ', 'anta muʿallimun', 'tu es enseignant', 'you are a teacher'],
    ['أَنْتِ مُعَلِّمَةٌ', 'anti muʿallimatun', 'tu es enseignante', 'you are a teacher (f.)'],
    ['هُوَ فِي السُّوقِ', 'huwa fī s-sūqi', 'il est au marché', 'he is at the market'],
    ['هِيَ فِي المَدْرَسَةِ', 'hiya fī l-madrasa', 'elle est à l’école', 'she is at school'],
    ['هُوَ أَخِي', 'huwa akhī', 'il est mon frère', 'he is my brother'],
  ]),
  L('A1', 'u-ask', 'questions', 'أَدَوَاتُ الاسْتِفْهَام', 'Mots de question', 'Question words', 'مَا', 'Demander', 'Asking', 'مَا pour une chose, مَنْ pour une personne, أَيْنَ pour un lieu.', [
    ['مَا هٰذَا', 'mā hādhā', 'qu’est-ce que c’est', 'what is this'],
    ['مَنْ أَنْتَ', 'man anta', 'qui es-tu', 'who are you'],
    ['أَيْنَ الكِتَابُ', 'ayna l-kitābu', 'où est le livre', 'where is the book'],
    ['كَيْفَ الحَالُ', 'kayfa l-ḥālu', 'comment ça va', 'how are things'],
    ['مَا اسْمُكَ', 'mā ismuka', 'quel est ton nom', 'what is your name'],
  ]),
  L('A1', 'u-gender', 'genre', 'المُذَكَّرُ وَالمُؤَنَّث', 'Masculin et féminin', 'Masculine and feminine', 'طَالِبٌ', 'La marque ة', 'The tāʾ marbūṭa', 'Beaucoup de féminins portent ة. Ce n’est pas une règle pour tous les noms. à vérifier pour les féminins sans ة.', [
    ['طَالِبٌ وَطَالِبَةٌ', 'ṭālibun wa-ṭālibatun', 'un étudiant et une étudiante', 'a male and a female student'],
    ['مُعَلِّمٌ وَمُعَلِّمَةٌ', 'muʿallimun wa-muʿallimatun', 'un enseignant et une enseignante', 'a male and a female teacher'],
    ['وَلَدٌ وَبِنْتٌ', 'waladun wa-bintun', 'un garçon et une fille', 'a boy and a girl'],
    ['البِنْتُ صَغِيرَةٌ', 'al-bintu ṣaghīratun', 'la fille est petite', 'the girl is small'],
    ['الوَلَدُ صَغِيرٌ', 'al-waladu ṣaghīrun', 'le garçon est petit', 'the boy is small'],
  ], true),
  L('A1', 'u-al', 'article', 'أَدَاةُ التَّعْرِيف', 'L’article al-', 'The article al-', 'الكِتَابُ', 'Rendre le nom défini', 'Making a noun definite', 'al- se place devant le nom. Le tanwīn disparaît. La voyelle finale de cas reste.', [
    ['كِتَابٌ', 'kitābun', 'un livre', 'a book'],
    ['الكِتَابُ', 'al-kitābu', 'le livre', 'the book'],
    ['بَيْتٌ', 'baytun', 'une maison', 'a house'],
    ['البَيْتُ', 'al-baytu', 'la maison', 'the house'],
    ['القَلَمُ جَدِيدٌ', 'al-qalamu jadīdun', 'le stylo est neuf', 'the pen is new'],
  ]),
  L('A1', 'u-sun', 'lettres-solaires', 'الحُرُوفُ الشَّمْسِيَّة', 'Lettres solaires', 'Sun letters', 'الشَّمْسُ', 'Le lām ne s’entend pas', 'The lām is not heard', 'Devant une lettre solaire, le l de al- s’assimile. La consonne suivante porte la shadda. Liste complète à vérifier.', [
    ['الشَّمْسُ طَالِعَةٌ', 'ash-shamsu ṭāliʿatun', 'le soleil est levé', 'the sun is up'],
    ['السُّوقُ قَرِيبٌ', 'as-sūqu qarībun', 'le marché est proche', 'the market is near'],
    ['النُّورُ قَوِيٌّ', 'an-nūru qawiyyun', 'la lumière est forte', 'the light is strong'],
    ['الرَّجُلُ هُنَا', 'ar-rajulu hunā', 'l’homme est ici', 'the man is here'],
    ['التَّمْرُ حُلْوٌ', 'at-tamru ḥulwun', 'les dattes sont douces', 'the dates are sweet'],
  ], true),
  L('A1', 'u-moon', 'lettres-lunaires', 'الحُرُوفُ القَمَرِيَّة', 'Lettres lunaires', 'Moon letters', 'القَمَرُ', 'Le lām s’entend', 'The lām is heard', 'Devant une lettre lunaire, on entend le l de al-. Pas de shadda sur la consonne suivante.', [
    ['القَمَرُ جَمِيلٌ', 'al-qamaru jamīlun', 'la lune est belle', 'the moon is beautiful'],
    ['الكِتَابُ مُفِيدٌ', 'al-kitābu mufīdun', 'le livre est utile', 'the book is useful'],
    ['البَابُ مَفْتُوحٌ', 'al-bābu maftūḥun', 'la porte est ouverte', 'the door is open'],
    ['الغُرْفَةُ هَادِئَةٌ', 'al-ghurfatu hādiʾatun', 'la chambre est calme', 'the room is calm'],
    ['المَاءُ بَارِدٌ', 'al-māʾu bāridun', 'l’eau est froide', 'the water is cold'],
  ]),
  L('A1', 'u-fi', 'prepositions', 'حُرُوفُ الجَرِّ', 'Dans et sur', 'In and on', 'فِي', 'فِي et عَلَى', 'fī and ʿalā', 'فِي et عَلَى sont des particules. Le nom qui suit prend la kasra.', [
    ['الكِتَابُ فِي الحَقِيبَةِ', 'al-kitābu fī l-ḥaqībati', 'le livre est dans le sac', 'the book is in the bag'],
    ['القَلَمُ عَلَى المَكْتَبِ', 'al-qalamu ʿalā l-maktabi', 'le stylo est sur le bureau', 'the pen is on the desk'],
    ['أَنَا فِي البَيْتِ', 'anā fī l-bayti', 'je suis à la maison', 'I am at home'],
    ['الوِسَادَةُ عَلَى السَّرِيرِ', 'al-wisādatu ʿalā s-sarīri', 'l’oreiller est sur le lit', 'the pillow is on the bed'],
    ['المَاءُ فِي الكَأْسِ', 'al-māʾu fī l-kaʾsi', 'l’eau est dans le verre', 'the water is in the glass'],
  ]),
  L('A1', 'u-ila', 'prepositions', 'حُرُوفُ الجَرِّ', 'Vers et depuis', 'To and from', 'إِلَى', 'إِلَى et مِنْ', 'ilā and min', 'إِلَى marque la direction, مِنْ le point de départ. Le nom qui suit est au génitif.', [
    ['أَذْهَبُ إِلَى المَدْرَسَةِ', 'adhhabu ilā l-madrasa', 'je vais à l’école', 'I go to school'],
    ['جِئْتُ مِنَ البَيْتِ', 'jiʾtu mina l-bayti', 'je suis venu de la maison', 'I came from the house'],
    ['الطَّرِيقُ إِلَى السُّوقِ', 'aṭ-ṭarīqu ilā s-sūqi', 'le chemin vers le marché', 'the road to the market'],
    ['خَرَجْتُ مِنَ الغُرْفَةِ', 'kharajtu mina l-ghurfati', 'je suis sorti de la chambre', 'I left the room'],
    ['مِنَ البَابِ إِلَى النَّافِذَةِ', 'mina l-bābi ilā n-nāfidha', 'de la porte à la fenêtre', 'from the door to the window'],
  ], true),
  L('A1', 'u-neg', 'negation', 'النَّفْي', 'Négation simple', 'Simple negation', 'لَيْسَ', 'Ce n’est pas', 'It is not', 'لَيْسَ nie une phrase nominale au présent de cette séance. Le détail de son effet sur le prédicat est à vérifier.', [
    ['لَيْسَ هٰذَا قَلَمًا', 'laysa hādhā qalaman', 'ceci n’est pas un stylo', 'this is not a pen'],
    ['لَيْسَ البَيْتُ بَعِيدًا', 'laysa l-baytu baʿīdan', 'la maison n’est pas loin', 'the house is not far'],
    ['لَيْسَتِ البِنْتُ هُنَا', 'laysati l-bintu hunā', 'la fille n’est pas ici', 'the girl is not here'],
    ['لَا أَعْرِفُ', 'lā aʿrifu', 'je ne sais pas', 'I do not know'],
    ['مَا هٰذَا كِتَابِي', 'mā hādhā kitābī', 'ceci n’est pas mon livre', 'this is not my book'],
  ], true),
  L('A1', 'u-color', 'couleurs', 'الأَلْوَان', 'Quelques couleurs', 'A few colours', 'أَحْمَرُ', 'Rouge, bleu, vert', 'Red, blue, green', 'Ces couleurs sont souvent des diptotes. On ne met pas de tanwīn ici. Le féminin en ة est à vérifier selon l’adjectif.', [
    ['الكِتَابُ أَحْمَرُ', 'al-kitābu aḥmaru', 'le livre est rouge', 'the book is red'],
    ['السَّمَاءُ زَرْقَاءُ', 'as-samāʾu zarqāʾu', 'le ciel est bleu', 'the sky is blue'],
    ['الشَّجَرُ أَخْضَرُ', 'ash-shajaru akhḍaru', 'l’arbre est vert', 'the tree is green'],
    ['الوَرْدَةُ حَمْرَاءُ', 'al-wardatu ḥamrāʾu', 'la rose est rouge', 'the rose is red'],
    ['الثَّوْبُ أَبْيَضُ', 'ath-thawbu abyaḍu', 'le vêtement est blanc', 'the garment is white'],
  ], true),
  L('A1', 'u-have', 'possession', 'عِنْدَ', 'J’ai, chez moi', 'I have', 'عِنْدِي', 'Avoir sans verbe avoir', 'Having without a verb “to have”', 'عِنْدِي se traduit souvent par « j’ai ». Ce n’est pas un verbe. à vérifier face à لِي et مَعِي.', [
    ['عِنْدِي كِتَابٌ', 'ʿindī kitābun', 'j’ai un livre', 'I have a book'],
    ['عِنْدَكَ قَلَمٌ', 'ʿindaka qalamun', 'tu as un stylo', 'you have a pen'],
    ['عِنْدَهَا سَيَّارَةٌ', 'ʿindahā sayyāratun', 'elle a une voiture', 'she has a car'],
    ['لِي أَخٌ', 'lī akhun', 'j’ai un frère', 'I have a brother'],
    ['مَعِي مِفْتَاحٌ', 'maʿī miftāḥun', 'j’ai une clé avec moi', 'I have a key with me'],
  ], true),
  L('A1', 'u-place', 'lieu', 'الظَّرْف', 'Ici et là', 'Here and there', 'هُنَا', 'Les adverbes de lieu', 'Place adverbs', 'هُنَا est proche, هُنَاكَ est loin. Ils ne prennent pas l’article.', [
    ['أَنَا هُنَا', 'anā hunā', 'je suis ici', 'I am here'],
    ['الكِتَابُ هُنَاكَ', 'al-kitābu hunāka', 'le livre est là-bas', 'the book is over there'],
    ['هُنَا مَدْرَسَةٌ', 'hunā madrasatun', 'ici il y a une école', 'here there is a school'],
    ['هُنَاكَ سُوقٌ', 'hunāka sūqun', 'là-bas il y a un marché', 'over there there is a market'],
    ['نَحْنُ هُنَا الآنَ', 'naḥnu hunā l-āna', 'nous sommes ici maintenant', 'we are here now'],
  ]),
];

const A2: ExtraSpec[] = [
  L('A2', 'u-dual', 'duel', 'المُثَنَّى', 'Le duel', 'The dual', 'كِتَابَانِ', 'Deux, avec la finale انِ', 'Two, with the ending ān', 'Le duel nominatif se termine par انِ dans ces exemples. L’accusatif et le génitif en يْنِ sont à vérifier dans la séance suivante du niveau.', [
    ['كِتَابَانِ جَدِيدَانِ', 'kitābāni jadīdāni', 'deux livres neufs', 'two new books'],
    ['وَلَدَانِ صَغِيرَانِ', 'waladāni ṣaghīrāni', 'deux petits garçons', 'two small boys'],
    ['البَابَانِ مَفْتُوحَانِ', 'al-bābāni maftūḥāni', 'les deux portes sont ouvertes', 'the two doors are open'],
    ['عِنْدِي قَلَمَانِ', 'ʿindī qalamāni', 'j’ai deux stylos', 'I have two pens'],
    ['الطَّالِبَانِ هُنَا', 'aṭ-ṭālibāni hunā', 'les deux étudiants sont ici', 'the two students are here'],
  ], true),
  L('A2', 'u-dual-y', 'duel', 'المُثَنَّى', 'Duel à l’accusatif et au génitif', 'Dual in the accusative and genitive', 'كِتَابَيْنِ', 'La finale يْنِ', 'The ending ayn', 'Après un verbe ou une particule, le duel de ces phrases prend يْنِ. à vérifier dès que le nom est annexé.', [
    ['رَأَيْتُ كِتَابَيْنِ', 'raʾaytu kitābayni', 'j’ai vu deux livres', 'I saw two books'],
    ['مَعَ الوَلَدَيْنِ', 'maʿa l-waladayni', 'avec les deux garçons', 'with the two boys'],
    ['فَتَحْتُ البَابَيْنِ', 'fataḥtu l-bābayni', 'j’ai ouvert les deux portes', 'I opened the two doors'],
    ['نَظَرْتُ إِلَى القَلَمَيْنِ', 'naẓartu ilā l-qalamayni', 'j’ai regardé les deux stylos', 'I looked at the two pens'],
    ['سَلَّمْتُ عَلَى الطَّالِبَيْنِ', 'sallamtu ʿalā ṭ-ṭālibayni', 'j’ai salué les deux étudiants', 'I greeted the two students'],
  ], true),
  L('A2', 'u-mpl', 'pluriel-sain-m', 'جَمْعُ المُذَكَّرِ السَّالِم', 'Pluriel masculin sain', 'Sound masculine plural', 'مُعَلِّمُونَ', 'ونَ au nominatif', 'ūn in the nominative', 'Le pluriel masculin sain ajoute ونَ au nominatif et ينَ aux autres cas, pour des personnes. à vérifier pour les noms qui ne le prennent pas.', [
    ['المُعَلِّمُونَ هُنَا', 'al-muʿallimūna hunā', 'les enseignants sont ici', 'the teachers are here'],
    ['رَأَيْتُ المُعَلِّمِينَ', 'raʾaytu l-muʿallimīna', 'j’ai vu les enseignants', 'I saw the teachers'],
    ['مَعَ المُهَنْدِسِينَ', 'maʿa l-muhandisīna', 'avec les ingénieurs', 'with the engineers'],
    ['المُهَنْدِسُونَ نَشِيطُونَ', 'al-muhandisūna nashīṭūna', 'les ingénieurs sont actifs', 'the engineers are active'],
    ['هٰؤُلَاءِ مُعَلِّمُونَ', 'hāʾulāʾi muʿallimūna', 'ceux-ci sont des enseignants', 'these are teachers'],
  ], true),
  L('A2', 'u-fpl', 'pluriel-sain-f', 'جَمْعُ المُؤَنَّثِ السَّالِم', 'Pluriel féminin sain', 'Sound feminine plural', 'مُعَلِّمَاتٌ', 'La finale اتٌ', 'The ending āt', 'Le pluriel féminin sain se termine par ات. Au nominatif de ces exemples, la marque est la ḍamma. Le génitif en kasra est à vérifier mot à mot.', [
    ['المُعَلِّمَاتُ هُنَا', 'al-muʿallimātu hunā', 'les enseignantes sont ici', 'the teachers (f.) are here'],
    ['رَأَيْتُ مُعَلِّمَاتٍ', 'raʾaytu muʿallimātin', 'j’ai vu des enseignantes', 'I saw teachers (f.)'],
    ['طَالِبَاتٌ مُجْتَهِدَاتٌ', 'ṭālibātun mujtahidātun', 'des étudiantes appliquées', 'diligent students (f.)'],
    ['فِي الغُرُفَاتِ', 'fī l-ghurufāti', 'dans les chambres', 'in the rooms'],
    ['هٰذِهِ سَيَّارَاتٌ', 'hādhihi sayyārātun', 'ceci sont des voitures', 'these are cars'],
  ], true),
  L('A2', 'u-brk-1', 'pluriel-brise', 'جَمْعُ التَّكْسِير', 'Pluriel brisé, modèle فِعَال', 'Broken plural, fiʿāl', 'كِتَابٌ', 'كِتَابٌ devient كُتُبٌ', 'kitāb becomes kutub', 'Le pluriel brisé change l’intérieur du mot. كُتُبٌ n’ajoute pas ات. Chaque modèle se mémorise. à vérifier.', [
    ['كِتَابٌ وَكُتُبٌ', 'kitābun wa-kutubun', 'un livre et des livres', 'a book and books'],
    ['قَلَمٌ وَأَقْلَامٌ', 'qalamun wa-aqlāmun', 'un stylo et des stylos', 'a pen and pens'],
    ['وَلَدٌ وَأَوْلَادٌ', 'waladun wa-awlādun', 'un garçon et des garçons', 'a boy and boys'],
    ['هٰذِهِ كُتُبٌ', 'hādhihi kutubun', 'ceci sont des livres', 'these are books'],
    ['عِنْدِي أَقْلَامٌ', 'ʿindī aqlāmun', 'j’ai des stylos', 'I have pens'],
  ], true),
  L('A2', 'u-brk-2', 'pluriel-brise', 'جَمْعُ التَّكْسِير', 'Pluriel brisé, autres modèles', 'Broken plural, other patterns', 'رَجُلٌ', 'رِجَالٌ et بُيُوتٌ', 'rijāl and buyūt', 'Deux autres modèles seulement. Il en existe beaucoup d’autres. à vérifier avant de généraliser.', [
    ['رَجُلٌ وَرِجَالٌ', 'rajulun wa-rijālun', 'un homme et des hommes', 'a man and men'],
    ['بَيْتٌ وَبُيُوتٌ', 'baytun wa-buyūtun', 'une maison et des maisons', 'a house and houses'],
    ['الرِّجَالُ هُنَا', 'ar-rijālu hunā', 'les hommes sont ici', 'the men are here'],
    ['البُيُوتُ كَبِيرَةٌ', 'al-buyūtu kabīratun', 'les maisons sont grandes', 'the houses are big'],
    ['فِي البُيُوتِ نُورٌ', 'fī l-buyūti nūrun', 'dans les maisons il y a de la lumière', 'in the houses there is light'],
  ], true),
  L('A2', 'u-suff', 'pronoms-suffixes', 'الضَّمَائِرُ المُتَّصِلَة', 'Pronoms attachés', 'Attached pronouns', 'كِتَابِي', 'Mon, ton, son', 'My, your, his', 'Le pronom se colle au nom. Le nom perd son tanwīn. La voyelle de liaison est à vérifier devant certains suffixes.', [
    ['كِتَابِي جَدِيدٌ', 'kitābī jadīdun', 'mon livre est neuf', 'my book is new'],
    ['كِتَابُكَ هُنَا', 'kitābuka hunā', 'ton livre est ici', 'your book is here'],
    ['كِتَابُهَا صَغِيرٌ', 'kitābuhā ṣaghīrun', 'son livre à elle est petit', 'her book is small'],
    ['بَيْتُنَا قَرِيبٌ', 'baytunā qarībun', 'notre maison est proche', 'our house is near'],
    ['اِسْمُهُ سَعِيدٌ', 'ismuhu saʿīdun', 'son nom est Saʿīd', 'his name is Saʿīd'],
  ], true),
  L('A2', 'u-jar-bi', 'jar-bi', 'حَرْفُ الجَرِّ بِ', 'La particule بِ', 'The particle bi', 'بِالقَلَمِ', 'Avec, au moyen de', 'With, by means of', 'بِ met le nom au génitif. Elle marque souvent l’instrument.', [
    ['كَتَبْتُ بِالقَلَمِ', 'katabtu bi-l-qalami', 'j’ai écrit avec le stylo', 'I wrote with the pen'],
    ['ذَهَبْتُ بِالسَّيَّارَةِ', 'dhahabtu bi-s-sayyāra', 'je suis parti en voiture', 'I went by car'],
    ['مَسَحْتُ بِاليَدِ', 'masaḥtu bi-l-yadi', 'j’ai essuyé avec la main', 'I wiped with the hand'],
    ['البَابُ بِالمِفْتَاحِ', 'al-bābu bi-l-miftāḥi', 'la porte s’ouvre avec la clé', 'the door is by the key'],
    ['نَظَرْتُ بِعَيْنِي', 'naẓartu bi-ʿaynī', 'j’ai regardé de mon œil', 'I looked with my eye'],
  ], true),
  L('A2', 'u-jar-min', 'jar-min', 'حَرْفُ الجَرِّ مِنْ', 'La particule مِنْ', 'The particle min', 'مِنَ البَيْتِ', 'Depuis, une partie de', 'From, part of', 'مِنْ indique l’origine. Devant al-, on entend souvent mina. à vérifier à la liaison.', [
    ['خَرَجْتُ مِنَ البَيْتِ', 'kharajtu mina l-bayti', 'je suis sorti de la maison', 'I went out of the house'],
    ['شَرِبْتُ مِنَ المَاءِ', 'sharibtu mina l-māʾi', 'j’ai bu de l’eau', 'I drank some of the water'],
    ['جِئْتُ مِنَ السُّوقِ', 'jiʾtu mina s-sūqi', 'je suis venu du marché', 'I came from the market'],
    ['قِطْعَةٌ مِنَ الخُبْزِ', 'qiṭʿatun mina l-khubzi', 'un morceau de pain', 'a piece of bread'],
    ['مِنَ الصَّبَاحِ إِلَى اللَّيْلِ', 'mina ṣ-ṣabāḥi ilā l-layli', 'du matin au soir', 'from morning to night'],
  ], true),
  L('A2', 'u-asbaha', 'kana-asbaha', 'أَصْبَحَ', 'La sœur أَصْبَحَ', 'The sister aṣbaḥa', 'أَصْبَحَ', 'Devenir, le matin venu', 'To become', 'أَصْبَحَ se comporte ici comme كَانَ : le prédicat de ces phrases est à l’accusatif. à vérifier pour les autres temps.', [
    ['أَصْبَحَ الجَوُّ بَارِدًا', 'aṣbaḥa l-jawwu bāridan', 'le temps est devenu froid', 'the weather became cold'],
    ['أَصْبَحَ الطَّالِبُ نَشِيطًا', 'aṣbaḥa ṭ-ṭālibu nashīṭan', 'l’étudiant est devenu actif', 'the student became active'],
    ['أَصْبَحَتِ الغُرْفَةُ هَادِئَةً', 'aṣbaḥati l-ghurfatu hādiʾatan', 'la chambre est devenue calme', 'the room became calm'],
    ['أَصْبَحْنَا مُسْتَعِدِّينَ', 'aṣbaḥnā mustaʿiddīna', 'nous sommes devenus prêts', 'we became ready'],
    ['الخَبَرُ بَعْدَ أَصْبَحَ مَنْصُوبٌ', 'al-khabaru baʿda aṣbaḥa manṣūbun', 'le prédicat après aṣbaḥa est accusatif', 'the predicate after aṣbaḥa is accusative'],
  ], true),
  L('A2', 'u-laysa', 'kana-laysa', 'لَيْسَ', 'La sœur لَيْسَ', 'The sister laysa', 'لَيْسَ', 'Nier sans temps passé', 'Negation without a past tense', 'لَيْسَ n’a pas de passé dans l’usage courant. Le prédicat de ces exemples est à l’accusatif. à vérifier avec بِ.', [
    ['لَيْسَ الدَّرْسُ صَعْبًا', 'laysa d-darsu ṣaʿban', 'la leçon n’est pas difficile', 'the lesson is not hard'],
    ['لَيْسَتِ السَّيَّارَةُ جَدِيدَةً', 'laysati s-sayyāratu jadīdatan', 'la voiture n’est pas neuve', 'the car is not new'],
    ['لَسْتُ مُتْعَبًا', 'lastu mutʿaban', 'je ne suis pas fatigué', 'I am not tired'],
    ['لَيْسُوا فِي السُّوقِ', 'laysū fī s-sūqi', 'ils ne sont pas au marché', 'they are not at the market'],
    ['لَيْسَ هٰذَا بَيْتِي', 'laysa hādhā baytī', 'ceci n’est pas ma maison', 'this is not my house'],
  ], true),
  L('A2', 'u-sara', 'kana-sara', 'صَارَ', 'La sœur صَارَ', 'The sister ṣāra', 'صَارَ', 'Devenir', 'To become', 'صَارَ marque un changement. Même schéma que كَانَ dans ces phrases. à vérifier.', [
    ['صَارَ المَاءُ بَارِدًا', 'ṣāra l-māʾu bāridan', 'l’eau est devenue froide', 'the water became cold'],
    ['صَارَ الوَلَدُ طَوِيلًا', 'ṣāra l-waladu ṭawīlan', 'le garçon est devenu grand', 'the boy became tall'],
    ['صَارَتِ الغُرْفَةُ وَاسِعَةً', 'ṣārati l-ghurfatu wāsiʿatan', 'la chambre est devenue vaste', 'the room became spacious'],
    ['صِرْتُ جَاهِزًا', 'ṣirtu jāḥizan', 'je suis devenu prêt', 'I became ready'],
    ['صَارَ الخَبَرُ وَاضِحًا', 'ṣāra l-khabaru wāḍiḥan', 'la nouvelle est devenue claire', 'the news became clear'],
  ], true),
  L('A2', 'u-anna', 'inna-anna', 'أَنَّ', 'La sœur أَنَّ', 'The sister anna', 'أَنَّ', 'Que, après un verbe', 'That, after a verb', 'أَنَّ introduit une phrase après un verbe de pensée ou de parole. Son sujet est à l’accusatif ici. à vérifier après certaines particules.', [
    ['أَعْلَمُ أَنَّ الدَّرْسَ سَهْلٌ', 'aʿlamu anna d-darsa sahlun', 'je sais que la leçon est facile', 'I know that the lesson is easy'],
    ['قَالَ إِنَّ البَابَ مَفْتُوحٌ', 'qāla inna l-bāba maftūḥun', 'il a dit que la porte est ouverte', 'he said that the door is open'],
    ['ظَنَنْتُ أَنَّ الجَوَّ جَمِيلٌ', 'ẓanantu anna l-jawwa jamīlun', 'j’ai cru que le temps était beau', 'I thought the weather was fine'],
    ['اِسْمُ أَنَّ مَنْصُوبٌ', 'ismu anna manṣūbun', 'le sujet de anna est à l’accusatif', 'the subject of anna is accusative'],
    ['عَرَفْتُ أَنَّكَ هُنَا', 'araftu annaka hunā', 'j’ai su que tu es ici', 'I learned that you are here'],
  ], true),
  L('A2', 'u-amsa', 'kana-amsa', 'أَمْسَى', 'La sœur أَمْسَى', 'The sister amsā', 'أَمْسَى', 'Devenir, le soir venu', 'To become by evening', 'أَمْسَى suit le même schéma que كَانَ dans ces phrases. La liste complète des sœurs, y compris مَا انْفَكَّ, est à vérifier.', [
    ['أَمْسَى الجَوُّ لَطِيفًا', 'amsā l-jawwu laṭīfan', 'le temps est devenu doux le soir', 'the weather became mild in the evening'],
    ['أَمْسَى الطَّالِبُ مُتْعَبًا', 'amsā ṭ-ṭālibu mutʿaban', 'l’étudiant est devenu fatigué le soir', 'the student became tired in the evening'],
    ['أَمْسَتِ الغُرْفَةُ هَادِئَةً', 'amsati l-ghurfatu hādiʾatan', 'la chambre est devenue calme le soir', 'the room became calm in the evening'],
    ['أَمْسَيْنَا فِي البَيْتِ', 'amsaynā fī l-bayti', 'nous sommes arrivés au soir à la maison', 'we reached evening at home'],
    ['الخَبَرُ بَعْدَ أَمْسَى مَنْصُوبٌ', 'al-khabaru baʿda amsā manṣūbun', 'le prédicat après amsā est à l’accusatif', 'the predicate after amsā is accusative'],
  ], true),
  L('A2', 'u-zalla', 'kana-zalla', 'ظَلَّ', 'La sœur ظَلَّ', 'The sister ẓalla', 'ظَلَّ', 'Rester dans un état', 'To remain', 'ظَلَّ veut dire rester. Le prédicat de ces exemples est à l’accusatif. à vérifier.', [
    ['ظَلَّ الوَلَدُ وَاقِفًا', 'ẓalla l-waladu wāqifan', 'le garçon est resté debout', 'the boy remained standing'],
    ['ظَلَّ البَابُ مَفْتُوحًا', 'ẓalla l-bābu maftūḥan', 'la porte est restée ouverte', 'the door stayed open'],
    ['ظَلَّتِ الشَّمْسُ طَالِعَةً', 'ẓallati sh-shamsu ṭāliʿatan', 'le soleil est resté levé', 'the sun stayed up'],
    ['ظَلَلْنَا فِي الصَّفِّ', 'ẓalalnā fī ṣ-ṣaffi', 'nous sommes restés dans la classe', 'we stayed in the classroom'],
    ['ظَلَّ الخَبَرُ مَنْصُوبًا', 'ẓalla l-khabaru manṣūban', 'le prédicat est resté à l’accusatif', 'the predicate stayed accusative'],
  ], true),
  L('A2', 'u-bata', 'kana-bata', 'بَاتَ', 'La sœur بَاتَ', 'The sister bāta', 'بَاتَ', 'Passer la nuit', 'To spend the night', 'بَاتَ décrit un état pendant la nuit. Même schéma que كَانَ ici. à vérifier.', [
    ['بَاتَ الضَّيْفُ مُسْتَرِيحًا', 'bāta ḍ-ḍayfu mustarīḥan', 'l’invité a passé la nuit reposé', 'the guest spent the night at ease'],
    ['بَاتَ الطِّفْلُ نَائِمًا', 'bāta ṭ-ṭiflu nāʾiman', 'l’enfant a passé la nuit endormi', 'the child spent the night asleep'],
    ['بَاتَتِ الأُمُّ سَاهِرَةً', 'bātati l-ummu sāhiratan', 'la mère a passé la nuit éveillée', 'the mother spent the night awake'],
    ['بِتْنَا فِي الخَيْمَةِ', 'bitnā fī l-khaymati', 'nous avons passé la nuit sous la tente', 'we spent the night in the tent'],
    ['الخَبَرُ بَعْدَ بَاتَ مَنْصُوبٌ', 'al-khabaru baʿda bāta manṣūbun', 'le prédicat après bāta est à l’accusatif', 'the predicate after bāta is accusative'],
  ], true),
  L('A2', 'u-ma-zala', 'kana-ma-zala', 'مَا زَالَ', 'La sœur مَا زَالَ', 'The sister mā zāla', 'مَا زَالَ', 'Ne pas cesser', 'To still be', 'مَا زَالَ signifie « être encore ». Les sœurs مَا بَرِحَ et مَا انْفَكَّ ne sont pas détaillées ici. à vérifier.', [
    ['مَا زَالَ الدَّرْسُ صَعْبًا', 'mā zāla d-darsu ṣaʿban', 'la leçon est encore difficile', 'the lesson is still hard'],
    ['مَا زَالَ البَابُ مَفْتُوحًا', 'mā zāla l-bābu maftūḥan', 'la porte est encore ouverte', 'the door is still open'],
    ['مَا زَالَتِ الشَّمْسُ طَالِعَةً', 'mā zālati sh-shamsu ṭāliʿatan', 'le soleil est encore levé', 'the sun is still up'],
    ['مَا زِلْتُ فِي البَيْتِ', 'mā ziltu fī l-bayti', 'je suis encore à la maison', 'I am still at home'],
    ['النَّفْيُ جُزْءٌ مِنَ الأَدَاةِ', 'an-nafyu juzʾun mina l-adāti', 'la négation fait partie de l’outil', 'the negation is part of the tool'],
  ], true),
  L('A2', 'u-kaanna', 'inna-kaanna', 'كَأَنَّ', 'La sœur كَأَنَّ', 'The sister ka-anna', 'كَأَنَّ', 'Comme si', 'As if', 'كَأَنَّ compare une situation à une autre. Son sujet est à l’accusatif dans ces exemples. لَعَلَّ n’est pas dans cette séance. à vérifier.', [
    ['كَأَنَّ البَيْتَ قَلْعَةٌ', 'ka-anna l-bayta qalʿatun', 'comme si la maison était une forteresse', 'as if the house were a fortress'],
    ['كَأَنَّ الوَلَدَ أَسَدٌ', 'ka-anna l-walada asadun', 'comme si le garçon était un lion', 'as if the boy were a lion'],
    ['كَأَنَّ الجَوَّ رَبِيعٌ', 'ka-anna l-jawwa rabīʿun', 'comme si le temps était le printemps', 'as if the weather were spring'],
    ['اِسْمُ كَأَنَّ مَنْصُوبٌ', 'ismu ka-anna manṣūbun', 'le sujet de ka-anna est à l’accusatif', 'the subject of ka-anna is accusative'],
    ['الكَافُ تُضِيفُ التَّشْبِيهَ', 'al-kāfu tuḍīfu t-tashbīha', 'le kāf ajoute la comparaison', 'the kāf adds the comparison'],
  ], true),
];

const B1: ExtraSpec[] = [
  L('B1', 'u-f2', 'forme-II', 'وَزْنُ فَعَّلَ', 'La forme II seule', 'Form II alone', 'دَرَّسَ', 'Redoubler la deuxième consonne', 'Doubling the second consonant', 'La forme II porte une shadda. Elle insiste souvent sur l’action faite sur quelque chose. Le sens exact est à vérifier pour chaque racine.', [
    ['دَرَّسَ الأُسْتَاذُ الدَّرْسَ', 'darrasa l-ustādhu d-darsa', 'le professeur a enseigné la leçon', 'the teacher taught the lesson'],
    ['عَلَّمَ الأَبُ وَلَدَهُ', 'ʿallama l-abu waladahu', 'le père a instruit son fils', 'the father taught his son'],
    ['كَسَّرَ الوَلَدُ الكُوبَ', 'kassara l-waladu l-kūba', 'le garçon a cassé le verre en morceaux', 'the boy smashed the cup'],
    ['يُدَرِّسُ الأُسْتَاذُ', 'yudarrisu l-ustādhu', 'le professeur enseigne', 'the teacher teaches'],
    ['الشَّدَّةُ عَلَامَةُ هٰذَا الوَزْنِ', 'ash-shaddatu ʿalāmatu hādhā l-wazni', 'la shadda est la marque de ce modèle', 'shadda is the mark of this pattern'],
  ], true),
  L('B1', 'u-f3', 'forme-III', 'وَزْنُ فَاعَلَ', 'La forme III seule', 'Form III alone', 'كَاتَبَ', 'Un alif après la première consonne', 'An alif after the first consonant', 'La forme III allonge souvent une action partagée. à vérifier : ce n’est pas toujours réciproque.', [
    ['كَاتَبَ الصَّدِيقُ صَدِيقَهُ', 'kātaba ṣ-ṣadīqu ṣadīqahu', 'l’ami a écrit à son ami', 'the friend corresponded with his friend'],
    ['جَالَسَ الضَّيْفُ المُضِيفَ', 'jālasa ḍ-ḍayfu l-muḍīfa', 'l’invité s’est assis avec l’hôte', 'the guest sat with the host'],
    ['سَاعَدَ الوَلَدُ أُمَّهُ', 'sāʿada l-waladu ummahu', 'le garçon a aidé sa mère', 'the boy helped his mother'],
    ['يُكَاتِبُ الطَّالِبُ أُسْتَاذَهُ', 'yukātibu ṭ-ṭālibu ustādhahu', 'l’étudiant écrit à son professeur', 'the student writes to his teacher'],
    ['الأَلِفُ بَعْدَ الحَرْفِ الأَوَّلِ', 'al-alifu baʿda l-ḥarfi l-awwali', 'le alif vient après la première lettre', 'the alif comes after the first letter'],
  ], true),
  L('B1', 'u-f4', 'forme-IV', 'وَزْنُ أَفْعَلَ', 'La forme IV seule', 'Form IV alone', 'أَخْرَجَ', 'Faire faire, ou entrer dans un état', 'Causative or entering a state', 'La forme IV commence par أ au passé. Le présent porte une ḍamma sur le préfixe. Sens à vérifier racine par racine.', [
    ['أَخْرَجَ الرَّجُلُ المِفْتَاحَ', 'akhraja r-rajulu l-miftāḥa', 'l’homme a sorti la clé', 'the man brought out the key'],
    ['أَدْخَلَ الوَلَدُ الكِتَابَ', 'adkhala l-waladu l-kitāba', 'le garçon a fait entrer le livre', 'the boy brought the book in'],
    ['أَكْرَمَ الضَّيْفَ', 'akrama ḍ-ḍayfa', 'il a honoré l’invité', 'he honoured the guest'],
    ['يُخْرِجُ المُعَلِّمُ الدَّفْتَرَ', 'yukhriju l-muʿallimu d-daftara', 'l’enseignant sort le cahier', 'the teacher takes out the notebook'],
    ['الهَمْزَةُ عَلَامَةُ المَاضِي', 'al-hamzatu ʿalāmatu l-māḍī', 'le hamza marque le passé de cette forme', 'hamza marks the past of this form'],
  ], true),
  L('B1', 'u-f5', 'forme-V', 'وَزْنُ تَفَعَّلَ', 'La forme V seule', 'Form V alone', 'تَعَلَّمَ', 'Se mettre à l’action de la forme II', 'Taking on the form II action', 'La forme V commence par تَ et garde la shadda. Elle est souvent réfléchie. à vérifier.', [
    ['تَعَلَّمَ الطَّالِبُ اللُّغَةَ', 'taʿallama ṭ-ṭālibu l-lugha', 'l’étudiant a appris la langue', 'the student learned the language'],
    ['تَكَلَّمَ الوَلَدُ بِهُدُوءٍ', 'takallama l-waladu bi-hudūʾin', 'le garçon a parlé calmement', 'the boy spoke calmly'],
    ['تَذَكَّرَ الرَّجُلُ الاسْمَ', 'tadhakkara r-rajulu l-isma', 'l’homme s’est rappelé le nom', 'the man remembered the name'],
    ['يَتَعَلَّمُ الطُّلَّابُ', 'yataʿallamu ṭ-ṭullābu', 'les étudiants apprennent', 'the students learn'],
    ['التَّاءُ وَالشَّدَّةُ مَعًا', 'at-tāʾu wa-sh-shaddatu maʿan', 'le tāʾ et la shadda vont ensemble', 'the tāʾ and the shadda go together'],
  ], true),
  L('B1', 'u-mutlaq', 'maful-mutlaq', 'المَفْعُولُ المُطْلَق', 'Le complément absolu', 'The absolute object', 'كَتَبَ كِتَابَةً', 'Répéter l’action', 'Repeating the action', 'Le mafʿūl muṭlaq est un nom d’action à l’accusatif, de la même racine que le verbe. à vérifier quand un adjectif le remplace.', [
    ['كَتَبَ كِتَابَةً وَاضِحَةً', 'kataba kitābatan wāḍiḥatan', 'il a écrit d’une écriture claire', 'he wrote a clear writing'],
    ['جَلَسَ جُلُوسًا هَادِئًا', 'jalasa julūsan hādiʾan', 'il s’est assis d’un assis calme', 'he sat a calm sitting'],
    ['فَرِحَ فَرَحًا كَبِيرًا', 'fariḥa faraḥan kabīran', 'il s’est réjoui d’une grande joie', 'he rejoiced greatly'],
    ['المَصْدَرُ مَنْصُوبٌ', 'al-maṣdaru manṣūbun', 'le nom d’action est à l’accusatif', 'the verbal noun is accusative'],
    ['ضَرَبَ ضَرْبَةً', 'ḍaraba ḍarbatan', 'il a frappé un coup', 'he struck one blow'],
  ], true),
  L('B1', 'u-fihi', 'maful-fihi', 'المَفْعُولُ فِيهِ', 'Le complément de temps et de lieu', 'The adverbial of time and place', 'صَبَاحًا', 'Quand et où', 'When and where', 'صَبَاحًا et أَمَامَ répondent à quand et où. Ils sont à l’accusatif dans ces exemples. à vérifier pour les noms de lieu annexés.', [
    ['خَرَجْتُ صَبَاحًا', 'kharajtu ṣabāḥan', 'je suis sorti le matin', 'I went out in the morning'],
    ['نَامَ لَيْلًا', 'nāma laylan', 'il a dormi la nuit', 'he slept at night'],
    ['جَلَسْتُ أَمَامَ البَابِ', 'jalastu amāma l-bābi', 'je me suis assis devant la porte', 'I sat in front of the door'],
    ['وَقَفَ خَلْفَ الجِدَارِ', 'waqafa khalfa l-jidāri', 'il s’est tenu derrière le mur', 'he stood behind the wall'],
    ['الظَّرْفُ مَنْصُوبٌ', 'aẓ-ẓarfu manṣūbun', 'le complément de cadre est à l’accusatif', 'the adverbial is accusative'],
  ], true),
  L('B1', 'u-lahu', 'maful-lah', 'المَفْعُولُ لَأَجْلِهِ', 'Le complément de cause', 'The object of reason', 'طَلَبًا', 'Pourquoi', 'Why', 'Le mafʿūl li-ajlihi est un nom d’action indéfini à l’accusatif qui donne la raison. à vérifier s’il est défini.', [
    ['دَرَسَ طَلَبًا لِلعِلْمِ', 'darasa ṭalaban li-l-ʿilmi', 'il a étudié par désir de savoir', 'he studied seeking knowledge'],
    ['وَقَفَ احْتِرَامًا', 'waqafa iḥtirāman', 'il s’est levé par respect', 'he stood out of respect'],
    ['سَافَرَ رَغْبَةً فِي العَمَلِ', 'sāfara raghbatan fī l-ʿamali', 'il a voyagé par envie de travail', 'he travelled wanting work'],
    ['المَصْدَرُ يُبَيِّنُ السَّبَبَ', 'al-maṣdaru yubayyinu s-sababa', 'le nom d’action montre la cause', 'the verbal noun shows the cause'],
    ['خَرَجَ خَوْفًا', 'kharaja khawfan', 'il est sorti par crainte', 'he went out from fear'],
  ], true),
  L('B1', 'u-maah', 'maful-maah', 'المَفْعُولُ مَعَهُ', 'Le complément d’accompagnement', 'The object of accompaniment', 'وَالنَّهْرَ', 'Avec, après وَ', 'With, after wāw', 'Après وَ au sens de « avec », le nom est à l’accusatif dans cet exemple. Ce n’est pas toujours le cas. à vérifier.', [
    ['سِرْتُ وَالنَّهْرَ', 'sirtu wa-n-nahra', 'j’ai marché le long du fleuve', 'I walked along the river'],
    ['جَلَسْتُ وَالصَّدِيقَ', 'jalastu wa-ṣ-ṣadīqa', 'je me suis assis avec l’ami', 'I sat with the friend'],
    ['الوَاوُ هُنَا بِمَعْنَى مَعَ', 'al-wāwu hunā bi-maʿnā maʿa', 'le wāw signifie ici avec', 'the wāw here means with'],
    ['الاسْمُ بَعْدَهَا مَنْصُوبٌ', 'al-ismu baʿdahā manṣūbun', 'le nom après elle est à l’accusatif', 'the noun after it is accusative'],
    ['خَرَجْتُ وَالغُرُوبَ', 'kharajtu wa-l-ghurūba', 'je suis sorti au moment du coucher', 'I went out with the sunset'],
  ], true),
  L('B1', 'u-an', 'particule-an', 'حَرْفُ النَّصْبِ أَنْ', 'La particule أَنْ', 'The particle an', 'أَنْ يَكْتُبَ', 'Que + subjonctif', 'That + subjunctive', 'أَنْ est suivie d’un verbe au subjonctif dans ces phrases. Ne pas la confondre avec أَنَّ. à vérifier.', [
    ['أُرِيدُ أَنْ أَقْرَأَ', 'urīdu an aqraʾa', 'je veux lire', 'I want to read'],
    ['يُحِبُّ أَنْ يَجْلِسَ', 'yuḥibbu an yajlisa', 'il aime s’asseoir', 'he likes to sit'],
    ['نَسْتَطِيعُ أَنْ نَخْرُجَ', 'nastaṭīʿu an nakhruja', 'nous pouvons sortir', 'we can go out'],
    ['أَنْ تَدْرُسَ خَيْرٌ', 'an tadrusa khayrun', 'que tu étudies est un bien', 'that you study is good'],
    ['الفِعْلُ بَعْدَ أَنْ مَنْصُوبٌ', 'al-fiʿlu baʿda an manṣūbun', 'le verbe après an est au subjonctif', 'the verb after an is subjunctive'],
  ], true),
  L('B1', 'u-lan', 'particule-lan', 'حَرْفُ النَّصْبِ لَنْ', 'La particule لَنْ', 'The particle lan', 'لَنْ يَذْهَبَ', 'Futur nié', 'Negated future', 'لَنْ nie le futur et met le verbe au subjonctif. Ce n’est pas le passé. à vérifier face à سَوْفَ لَا dans d’autres styles.', [
    ['لَنْ يَذْهَبَ اليَوْمَ', 'lan yadhaba l-yawma', 'il n’ira pas aujourd’hui', 'he will not go today'],
    ['لَنْ أَنْسَى الاسْمَ', 'lan ansā l-isma', 'je n’oublierai pas le nom', 'I will not forget the name'],
    ['لَنْ نَخْرُجَ لَيْلًا', 'lan nakhruja laylan', 'nous ne sortirons pas la nuit', 'we will not go out at night'],
    ['لَنْ يَكُونَ البَابُ مُغْلَقًا', 'lan yakūna l-bābu mughlaqan', 'la porte ne sera pas fermée', 'the door will not be closed'],
    ['النَّفْيُ لِلمُسْتَقْبَلِ', 'an-nafyu li-l-mustaqbali', 'la négation vise le futur', 'the negation targets the future'],
  ], true),
  L('B1', 'u-kay', 'particule-kay', 'حَرْفُ النَّصْبِ كَيْ', 'La particule كَيْ', 'The particle kay', 'كَيْ يَفْهَمَ', 'Afin que', 'So that', 'كَيْ et لِكَيْ introduisent le but. Le verbe est au subjonctif. à vérifier avec لَامُ التَّعْلِيل seule.', [
    ['دَرَسَ كَيْ يَفْهَمَ', 'darasa kay yafhama', 'il a étudié afin de comprendre', 'he studied so that he would understand'],
    ['جَلَسَ لِكَيْ يَسْتَرِيحَ', 'jalasa li-kay yastarīḥa', 'il s’est assis afin de se reposer', 'he sat in order to rest'],
    ['أَقْرَأُ كَيْ أَتَعَلَّمَ', 'aqraʾu kay ataʿallama', 'je lis afin d’apprendre', 'I read in order to learn'],
    ['خَرَجَ كَيْ يَشْتَرِيَ', 'kharaja kay yashtariya', 'il est sorti afin d’acheter', 'he went out in order to buy'],
    ['الغَرَضُ بَعْدَ كَيْ', 'al-gharaḍu baʿda kay', 'le but vient après kay', 'the purpose comes after kay'],
  ], true),
  L('B1', 'u-lam', 'particule-lam', 'حَرْفُ الجَزْمِ لَمْ', 'La particule لَمْ', 'The particle lam', 'لَمْ يَكْتُبْ', 'Passé nié', 'Negated past', 'لَمْ + verbe au jussif se traduit par un passé nié. La finale est un sukūn, ou une voyelle de liaison devant al-. à vérifier.', [
    ['لَمْ يَكْتُبِ الدَّرْسَ', 'lam yaktubi d-darsa', 'il n’a pas écrit la leçon', 'he did not write the lesson'],
    ['لَمْ أَذْهَبْ أَمْسِ', 'lam adhhab amsi', 'je ne suis pas allé hier', 'I did not go yesterday'],
    ['لَمْ تَفْتَحِ البِنْتُ البَابَ', 'lam taftaḥi l-bintu l-bāba', 'la fille n’a pas ouvert la porte', 'the girl did not open the door'],
    ['لَمْ نَنْسَ الاسْمَ', 'lam nansa l-isma', 'nous n’avons pas oublié le nom', 'we did not forget the name'],
    ['الجَزْمُ بِالسُّكُونِ', 'al-jazmu bi-s-sukūni', 'le jussif se marque par le sukūn', 'the jussive is marked by sukūn'],
  ], true),
  L('B1', 'u-alladhina', 'relatif-pluriel', 'الاسْمُ المَوْصُول', 'Le relatif au pluriel', 'The plural relative', 'الَّذِينَ', 'Ceux qui', 'Those who', 'الَّذِينَ pour un groupe d’hommes, اللَّاتِي pour un groupe de femmes dans ces phrases. Le pronom de rappel est à vérifier.', [
    ['الطُّلَّابُ الَّذِينَ نَجَحُوا', 'aṭ-ṭullābu lladhīna najaḥū', 'les étudiants qui ont réussi', 'the students who succeeded'],
    ['الرِّجَالُ الَّذِينَ جَاءُوا', 'ar-rijālu lladhīna jāʾū', 'les hommes qui sont venus', 'the men who came'],
    ['البَنَاتُ اللَّاتِي قَرَأْنَ', 'al-banātu llātī qaraʾna', 'les filles qui ont lu', 'the girls who read'],
    ['الكُتُبُ الَّتِي قَرَأْتُهَا', 'al-kutubu llatī qaraʾtuhā', 'les livres que j’ai lus', 'the books that I read'],
    ['الصِّلَةُ تَحْتَاجُ رَابِطًا', 'aṣ-ṣilatu taḥtāju rābiṭan', 'la relative a besoin d’un lien', 'the relative clause needs a link'],
  ], true),
  L('B1', 'u-hatta', 'particule-hatta', 'حَتَّى', 'Jusqu’à ce que', 'Until', 'حَتَّى يَفْهَمَ', 'حَتَّى + subjonctif', 'ḥattā + subjunctive', 'حَتَّى peut introduire un but ou une limite. Ici le verbe est au subjonctif. Les autres emplois sont à vérifier.', [
    ['اِنْتَظَرْتُ حَتَّى يَرْجِعَ', 'intaẓartu ḥattā yarjiʿa', 'j’ai attendu jusqu’à ce qu’il revienne', 'I waited until he returned'],
    ['أَقْرَأُ حَتَّى أَفْهَمَ', 'aqraʾu ḥattā afhama', 'je lis jusqu’à comprendre', 'I read until I understand'],
    ['بَقِيَ حَتَّى يَغْرُبَ', 'baqiya ḥattā yaghruba', 'il est resté jusqu’au coucher', 'he stayed until sunset'],
    ['الفِعْلُ بَعْدَهَا مَنْصُوبٌ', 'al-fiʿlu baʿdahā manṣūbun', 'le verbe après elle est au subjonctif', 'the verb after it is subjunctive'],
    ['لَا تَخْرُجْ حَتَّى أَعُودَ', 'lā takhruj ḥattā aʿūda', 'ne sors pas avant que je revienne', 'do not leave until I return'],
  ], true),
];

const B2: ExtraSpec[] = [
  L('B2', 'u-mithal', 'mithal', 'المِثَال', 'Verbe assimilé (mithāl)', 'Assimilated verb', 'وَعَدَ', 'Un wāw ou un yāʾ en première position', 'Wāw or yāʾ first', 'وَعَدَ garde le wāw au passé et le perd souvent au présent. Ce n’est pas vrai de tous les verbes. à vérifier.', [
    ['وَعَدَ الصَّدِيقُ', 'waʿada ṣ-ṣadīqu', 'l’ami a promis', 'the friend promised'],
    ['يَعِدُ الصَّدِيقُ', 'yaʿidu ṣ-ṣadīqu', 'l’ami promet', 'the friend promises'],
    ['وَصَلَ الضَّيْفُ', 'waṣala ḍ-ḍayfu', 'l’invité est arrivé', 'the guest arrived'],
    ['يَصِلُ الضَّيْفُ', 'yaṣilu ḍ-ḍayfu', 'l’invité arrive', 'the guest arrives'],
    ['الوَاوُ يَسْقُطُ فِي المُضَارِعِ هُنَا', 'al-wāwu yasquṭu fī l-muḍāriʿi hunā', 'le wāw tombe au présent ici', 'the wāw drops in the present here'],
  ], true),
  L('B2', 'u-ajwaf', 'ajwaf', 'الأَجْوَف', 'Verbe creux (ajwaf)', 'Hollow verb', 'قَالَ', 'Une voyelle longue au milieu', 'A long vowel in the middle', 'قَالَ vient d’une racine avec wāw au milieu. Au présent on entend يَقُولُ. Les autres voyelles sont à vérifier.', [
    ['قَالَ الرَّجُلُ الحَقَّ', 'qāla r-rajulu l-ḥaqqa', 'l’homme a dit la vérité', 'the man said the truth'],
    ['يَقُولُ الرَّجُلُ', 'yaqūlu r-rajulu', 'l’homme dit', 'the man says'],
    ['بَاعَ التَّاجِرُ', 'bāʿa t-tājiru', 'le marchand a vendu', 'the merchant sold'],
    ['يَبِيعُ التَّاجِرُ', 'yabīʿu t-tājiru', 'le marchand vend', 'the merchant sells'],
    ['نَامَ الوَلَدُ', 'nāma l-waladu', 'le garçon a dormi', 'the boy slept'],
  ], true),
  L('B2', 'u-naqis', 'naqis', 'النَّاقِص', 'Verbe défectueux (nāqiṣ)', 'Defective verb', 'رَمَى', 'Une voyelle faible à la fin', 'A weak letter at the end', 'رَمَى se termine par un alif au passé. Le présent يَرْمِي garde le yāʾ. à vérifier au jussif, où la lettre finale tombe souvent.', [
    ['رَمَى الوَلَدُ الكُرَةَ', 'ramā l-waladu l-kurata', 'le garçon a jeté la balle', 'the boy threw the ball'],
    ['يَرْمِي الوَلَدُ', 'yarmī l-waladu', 'le garçon jette', 'the boy throws'],
    ['دَعَا الرَّجُلُ ضَيْفَهُ', 'daʿā r-rajulu ḍayfahu', 'l’homme a invité son hôte', 'the man invited his guest'],
    ['يَدْعُو الرَّجُلُ', 'yadʿū r-rajulu', 'l’homme invite', 'the man invites'],
    ['مَشَى الطَّالِبُ', 'mashā ṭ-ṭālibu', 'l’étudiant a marché', 'the student walked'],
  ], true),
  L('B2', 'u-lafif-q', 'lafif-maqrun', 'اللَّفِيفُ المَقْرُون', 'Lafif joint', 'Adjacent weak verb', 'رَوَى', 'Deux lettres faibles côte à côte', 'Two weak letters side by side', 'رَوَى a un wāw puis un yāʾ. On ne généralise pas à partir d’un seul verbe. à vérifier.', [
    ['رَوَى الجَدُّ حِكَايَةً', 'rawā l-jaddu ḥikāyatan', 'le grand-père a raconté une histoire', 'the grandfather told a story'],
    ['يَرْوِي الجَدُّ', 'yarwī l-jaddu', 'le grand-père raconte', 'the grandfather tells'],
    ['طَوَى الوَلَدُ الوَرَقَةَ', 'ṭawā l-waladu l-waraqa', 'le garçon a plié la feuille', 'the boy folded the paper'],
    ['يَطْوِي الوَلَدُ', 'yaṭwī l-waladu', 'le garçon plie', 'the boy folds'],
    ['الحَرْفَانِ الضَّعِيفَانِ مُتَتَالِيَانِ', 'al-ḥarfāni ḍ-ḍaʿīfāni mutatāliyāni', 'les deux lettres faibles se suivent', 'the two weak letters follow each other'],
  ], true),
  L('B2', 'u-lafif-f', 'lafif-mafruq', 'اللَّفِيفُ المَفْرُوق', 'Lafif séparé', 'Separated weak verb', 'وَقَى', 'Faiblesse au début et à la fin', 'Weakness at both ends', 'وَقَى a un wāw au début et un yāʾ à la fin. Le présent يَقِي perd le wāw ici. à vérifier.', [
    ['وَقَى اللَّهُ المَسَافِرَ', 'waqā llāhu l-musāfira', 'Dieu a protégé le voyageur', 'God protected the traveller'],
    ['يَقِي الثَّوْبُ مِنَ البَرْدِ', 'yaqī th-thawbu mina l-bardi', 'le vêtement protège du froid', 'the garment protects from the cold'],
    ['وَعَى الطَّالِبُ الدَّرْسَ', 'waʿā ṭ-ṭālibu d-darsa', 'l’étudiant a retenu la leçon', 'the student grasped the lesson'],
    ['يَعِي الطَّالِبُ', 'yaʿī ṭ-ṭālibu', 'l’étudiant retient', 'the student grasps'],
    ['الحَرْفَانِ الضَّعِيفَانِ مُتَبَاعِدَانِ', 'al-ḥarfāni ḍ-ḍaʿīfāni mutatāʿidāni', 'les deux lettres faibles sont séparées', 'the two weak letters are apart'],
  ], true),
  L('B2', 'u-mahmuz', 'mahmuz', 'المَهْمُوز', 'Verbe à hamza (mahmūz)', 'Hamzated verb', 'سَأَلَ', 'Un hamza dans la racine', 'A hamza in the root', 'سَأَلَ porte le hamza au milieu. أَكَلَ le porte au début. L’écriture du hamza change selon la voyelle. à vérifier.', [
    ['سَأَلَ الطَّالِبُ سُؤَالًا', 'saʾala ṭ-ṭālibu suʾālan', 'l’étudiant a posé une question', 'the student asked a question'],
    ['يَسْأَلُ الطَّالِبُ', 'yasʾalu ṭ-ṭālibu', 'l’étudiant demande', 'the student asks'],
    ['أَكَلَ الوَلَدُ خُبْزًا', 'akala l-waladu khubzan', 'le garçon a mangé du pain', 'the boy ate bread'],
    ['يَأْكُلُ الوَلَدُ', 'yaʾkulu l-waladu', 'le garçon mange', 'the boy eats'],
    ['قَرَأَ الرَّجُلُ', 'qaraʾa r-rajulu', 'l’homme a lu', 'the man read'],
  ], true),
  L('B2', 'u-mudaaf', 'mudaaf', 'المُضَاعَف', 'Verbe sourd (muḍāʿaf)', 'Doubled verb', 'مَدَّ', 'Deux consonnes identiques', 'Two identical consonants', 'مَدَّ réunit deux dāl. Au présent on entend يَمُدُّ avec shadda. L’impératif est à vérifier.', [
    ['مَدَّ يَدَهُ', 'madda yadahu', 'il a tendu sa main', 'he stretched out his hand'],
    ['يَمُدُّ يَدَهُ', 'yamuddu yadahu', 'il tend sa main', 'he stretches out his hand'],
    ['ظَلَّ الجَوُّ جَمِيلًا', 'ẓalla l-jawwu jamīlan', 'le temps est resté beau', 'the weather stayed fine'],
    ['يَظَلُّ الوَلَدُ هُنَا', 'yaẓallu l-waladu hunā', 'le garçon reste ici', 'the boy stays here'],
    ['الشَّدَّةُ تَجْمَعُ الحَرْفَيْنِ', 'ash-shaddatu tajmaʿu l-ḥarfayni', 'la shadda réunit les deux lettres', 'shadda joins the two letters'],
  ], true),
  L('B2', 'u-diptote', 'diptotes', 'المَمْنُوعُ مِنَ الصَّرْف', 'Noms sans tanwīn', 'Diptotes', 'أَحْمَدُ', 'Pas de tanwīn, et génitif en fatḥa', 'No tanwīn, genitive with fatḥa', 'أَحْمَدُ et أَحْمَرُ ne prennent pas le tanwīn ici. Au génitif, la marque est une fatḥa, pas une kasra. à vérifier dès qu’ils portent l’article ou sont annexés.', [
    ['جَاءَ أَحْمَدُ', 'jāʾa aḥmadu', 'Aḥmad est venu', 'Aḥmad came'],
    ['رَأَيْتُ أَحْمَدَ', 'raʾaytu aḥmada', 'j’ai vu Aḥmad', 'I saw Aḥmad'],
    ['مَرَرْتُ بِأَحْمَدَ', 'marartu bi-aḥmada', 'je suis passé près d’Aḥmad', 'I passed by Aḥmad'],
    ['الثَّوْبُ أَحْمَرُ', 'ath-thawbu aḥmaru', 'le vêtement est rouge', 'the garment is red'],
    ['لَا تَنْوِينَ فِي هٰذِهِ الأَمْثِلَةِ', 'lā tanwīna fī hādhihi l-amthila', 'pas de tanwīn dans ces exemples', 'no tanwīn in these examples'],
  ], true),
  L('B2', 'u-f6', 'forme-VI', 'وَزْنُ تَفَاعَلَ', 'La forme VI', 'Form VI', 'تَكَاتَبَ', 'Action partagée', 'A shared action', 'La forme VI commence par تَ et garde le alif de la forme III. Elle est souvent réciproque. à vérifier.', [
    ['تَكَاتَبَ الصَّدِيقَانِ', 'takātaba ṣ-ṣadīqāni', 'les deux amis ont correspondu', 'the two friends corresponded'],
    ['تَعَاوَنَ الطَّالِبَانِ', 'taʿāwana ṭ-ṭālibāni', 'les deux étudiants ont coopéré', 'the two students cooperated'],
    ['تَسَاعَدَ الجَارَانِ', 'tasāʿada l-jārāni', 'les deux voisins se sont entraidés', 'the two neighbours helped each other'],
    ['يَتَعَاوَنُ الزُّمَلَاءُ', 'yataʿāwanu z-zumalāʾu', 'les collègues coopèrent', 'the colleagues cooperate'],
    ['التَّاءُ وَالأَلِفُ مَعًا', 'at-tāʾu wa-l-alifu maʿan', 'le tāʾ et le alif vont ensemble', 'the tāʾ and the alif go together'],
  ], true),
  L('B2', 'u-f7', 'forme-VII', 'وَزْنُ انْفَعَلَ', 'La forme VII', 'Form VII', 'اِنْكَسَرَ', 'Il s’est produit', 'It happened', 'La forme VII commence par اِنْ. Elle décrit souvent un résultat sans agent nommé. à vérifier.', [
    ['اِنْكَسَرَ الكُوبُ', 'inkasara l-kūbu', 'le verre s’est cassé', 'the cup broke'],
    ['اِنْفَتَحَ البَابُ', 'infataḥa l-bābu', 'la porte s’est ouverte', 'the door opened'],
    ['يَنْكَسِرُ الزُّجَاجُ', 'yankasiru z-zujāju', 'le verre se casse', 'the glass breaks'],
    ['اِنْقَطَعَ الحَبْلُ', 'inqaṭaʿa l-ḥablu', 'la corde s’est coupée', 'the rope snapped'],
    ['لَا فَاعِلَ ظَاهِرًا هُنَا', 'lā fāʿila ẓāhiran hunā', 'pas d’agent visible ici', 'no visible agent here'],
  ], true),
  L('B2', 'u-f8', 'forme-VIII', 'وَزْنُ افْتَعَلَ', 'La forme VIII', 'Form VIII', 'اِجْتَمَعَ', 'Un tāʾ après la première consonne', 'A tāʾ after the first consonant', 'La forme VIII insère un tāʾ. اِجْتَمَعَ signifie se réunir. Le sens n’est pas mécanique. à vérifier.', [
    ['اِجْتَمَعَ النَّاسُ', 'ijtamaʿa n-nāsu', 'les gens se sont réunis', 'the people gathered'],
    ['اِشْتَرَى الرَّجُلُ خُبْزًا', 'ishtarā r-rajulu khubzan', 'l’homme a acheté du pain', 'the man bought bread'],
    ['اِحْتَرَمَ الطَّالِبُ أُسْتَاذَهُ', 'iḥtarama ṭ-ṭālibu ustādhahu', 'l’étudiant a respecté son professeur', 'the student respected his teacher'],
    ['يَجْتَمِعُ الزُّمَلَاءُ', 'yajtamiʿu z-zumalāʾu', 'les collègues se réunissent', 'the colleagues meet'],
    ['التَّاءُ بَعْدَ الحَرْفِ الأَوَّلِ', 'at-tāʾu baʿda l-ḥarfi l-awwali', 'le tāʾ vient après la première lettre', 'the tāʾ comes after the first letter'],
  ], true),
  L('B2', 'u-f9', 'forme-IX', 'وَزْنُ افْعَلَّ', 'La forme IX', 'Form IX', 'اِحْمَرَّ', 'Couleur ou défaut', 'Colour or defect', 'La forme IX est rare. اِحْمَرَّ veut dire devenir rouge. On ne l’emploie pas pour n’importe quel verbe. à vérifier.', [
    ['اِحْمَرَّ الوَجْهُ', 'iḥmarra l-wajhu', 'le visage est devenu rouge', 'the face turned red'],
    ['يَحْمَرُّ الوَجْهُ', 'yaḥmarru l-wajhu', 'le visage rougit', 'the face reddens'],
    ['اِصْفَرَّ الوَرَقُ', 'iṣfarra l-waraqu', 'le papier est devenu jaune', 'the paper turned yellow'],
    ['يَصْفَرُّ الوَرَقُ', 'yaṣfarru l-waraqu', 'le papier jaunit', 'the paper yellows'],
    ['هٰذَا الوَزْنُ لِلأَلْوَانِ غَالِبًا', 'hādhā l-waznu li-l-alwāni ghāliban', 'ce modèle sert surtout aux couleurs', 'this pattern is mostly for colours'],
  ], true),
  L('B2', 'u-f10', 'forme-X', 'وَزْنُ اسْتَفْعَلَ', 'La forme X', 'Form X', 'اِسْتَخْرَجَ', 'Demander ou trouver', 'To seek or to extract', 'La forme X commence par اِسْتَ. اِسْتَخْرَجَ signifie extraire. D’autres verbes de cette forme demandent quelque chose. à vérifier.', [
    ['اِسْتَخْرَجَ الطَّالِبُ المَعْنَى', 'istakhraja ṭ-ṭālibu l-maʿnā', 'l’étudiant a extrait le sens', 'the student extracted the meaning'],
    ['اِسْتَقْبَلَ الرَّجُلُ ضَيْفَهُ', 'istaqbala r-rajulu ḍayfahu', 'l’homme a accueilli son invité', 'the man received his guest'],
    ['اِسْتَمَعَ الوَلَدُ', 'istamaʿa l-waladu', 'le garçon a écouté', 'the boy listened'],
    ['يَسْتَخْرِجُ العَالِمُ', 'yastakhriju l-ʿālimu', 'le savant extrait', 'the scholar extracts'],
    ['السِّينُ وَالتَّاءُ فِي أَوَّلِهِ', 'as-sīnu wa-t-tāʾu fī awwalihi', 'le sīn et le tāʾ sont au début', 'sīn and tāʾ are at the start'],
  ], true),
  L('B2', 'u-law', 'conditionnel-law', 'لَوْ', 'La condition avec لَوْ', 'The conditional with law', 'لَوْ', 'Si, pour ce qui n’est pas réalisé', 'If, for what did not happen', 'لَوْ dans ces phrases vise quelque chose qui n’a pas eu lieu. Ce n’est pas le même outil que إِنْ. à vérifier.', [
    ['لَوْ دَرَسَ لَنَجَحَ', 'law darasa la-najaḥa', 's’il avait étudié, il aurait réussi', 'if he had studied, he would have succeeded'],
    ['لَوْ جَاءَ لَرَأَيْتُهُ', 'law jāʾa la-raʾaytuhu', 's’il était venu, je l’aurais vu', 'if he had come, I would have seen him'],
    ['اللَّامُ فِي الجَوَابِ', 'al-lāmu fī l-jawābi', 'le lām est dans l’apodose', 'the lām is in the result clause'],
    ['لَوْ عَرَفْتُ لَقُلْتُ', 'law ʿaraftu la-qultu', 'si j’avais su, j’aurais dit', 'if I had known, I would have said'],
    ['لَيْسَ هٰذَا شَرْطَ إِنْ', 'laysa hādhā sharṭa in', 'ceci n’est pas la condition de in', 'this is not the in-conditional'],
  ], true),
];

const C1: ExtraSpec[] = [
  L('C1', 'u-tawkid', 'tawkid', 'التَّوْكِيد', 'Le renforcement', 'Emphasis', 'كُلُّهُمْ', 'كُلّ et نَفْس', 'kull and nafs', 'كُلُّهُمْ renforce le groupe. Le pronom doit renvoyer au nom renforcé. à vérifier pour عَيْن.', [
    ['جَاءَ الطُّلَّابُ كُلُّهُمْ', 'jāʾa ṭ-ṭullābu kulluhum', 'les étudiants sont tous venus', 'the students all came'],
    ['قَرَأْتُ الكِتَابَ كُلَّهُ', 'qaraʾtu l-kitāba kullahū', 'j’ai lu le livre en entier', 'I read the whole book'],
    ['حَضَرَ الرَّجُلُ نَفْسُهُ', 'ḥaḍara r-rajulu nafsuhu', 'l’homme lui-même est venu', 'the man himself came'],
    ['التَّوْكِيدُ يُقَوِّي الاسْمَ', 'at-tawkīdu yuqawwī l-isma', 'le renforcement appuie le nom', 'emphasis strengthens the noun'],
    ['الضَّمِيرُ يَعُودُ عَلَى المُؤَكَّدِ', 'aḍ-ḍamīru yaʿūdu ʿalā l-muʾakkadi', 'le pronom renvoie au nom renforcé', 'the pronoun refers to the emphasised noun'],
  ], true),
  L('C1', 'u-nida', 'nida', 'النِّدَاء', 'L’appel', 'The vocative', 'يَا', 'يَا + nom', 'yā + noun', 'يَا sert à appeler. Le nom sans article est souvent à l’accusatif dans يَا رَجُلُ / يَا رَجُلَ. Les deux états sont à vérifier selon que le nom est un nom propre ou un nom commun.', [
    ['يَا رَجُلُ تَعَالَ', 'yā rajulu taʿāla', 'homme, viens', 'man, come'],
    ['يَا طَالِبُ اجْلِسْ', 'yā ṭālibu jlis', 'étudiant, assieds-toi', 'student, sit'],
    ['يَا أَحْمَدُ أَقْبِلْ', 'yā aḥmadu aqbil', 'Aḥmad, approche', 'Aḥmad, come forward'],
    ['يَا بِنْتُ اسْمَعِي', 'yā bintu smaʿī', 'fille, écoute', 'girl, listen'],
    ['النِّدَاءُ يُوَجِّهُ الكَلَامَ', 'an-nidāʾu yuwaǧǧihu l-kalāma', 'l’appel dirige la parole', 'the vocative directs the speech'],
  ], true),
  L('C1', 'u-taajjub', 'taajjub', 'التَّعَجُّب', 'L’exclamation d’admiration', 'Admiration', 'مَا أَجْمَلَ', 'Comme c’est beau', 'How beautiful', 'مَا أَجْمَلَ السَّمَاءَ est une formule d’admiration. Le nom après le verbe est à l’accusatif ici. L’autre formule أَجْمِلْ بِ est à vérifier.', [
    ['مَا أَجْمَلَ السَّمَاءَ', 'mā ajmala s-samāʾa', 'comme le ciel est beau', 'how beautiful the sky is'],
    ['مَا أَكْرَمَ الضَّيْفَ', 'mā akrama ḍ-ḍayfa', 'comme l’invité est généreux', 'how generous the guest is'],
    ['مَا أَوْضَحَ الدَّرْسَ', 'mā awḍaḥa d-darsa', 'comme la leçon est claire', 'how clear the lesson is'],
    ['صِيغَةُ التَّعَجُّبِ ثَابِتَةٌ هُنَا', 'ṣīghatu t-taʿajjubi thābitatun hunā', 'la formule d’admiration est fixe ici', 'the admiration pattern is fixed here'],
    ['الاسْمُ بَعْدَهَا مَنْصُوبٌ', 'al-ismu baʿdahā manṣūbun', 'le nom après elle est à l’accusatif', 'the noun after it is accusative'],
  ], true),
  L('C1', 'u-madh', 'madh', 'المَدْح', 'La louange', 'Praise', 'نِعْمَ', 'نِعْمَ pour louer', 'niʿma for praise', 'نِعْمَ الرَّجُلُ زَيْدٌ loue. La construction exacte varie. à vérifier.', [
    ['نِعْمَ الرَّجُلُ زَيْدٌ', 'niʿma r-rajulu zaydun', 'quel homme excellent que Zayd', 'what an excellent man Zayd is'],
    ['نِعْمَ الطَّالِبُ المُجْتَهِدُ', 'niʿma ṭ-ṭālibu l-mujtahidu', 'quel bon étudiant que l’appliqué', 'what a fine student the diligent one is'],
    ['المَدْحُ يَرْفَعُ المَمْدُوحَ', 'al-madḥu yarfaʿu l-mamdūḥa', 'la louange élève celui qu’on loue', 'praise lifts the one praised'],
    ['نِعْمَ الخُلُقُ الصِّدْقُ', 'niʿma l-khuluqu ṣ-ṣidqu', 'quelle belle qualité que la sincérité', 'what a fine quality sincerity is'],
    ['هٰذِهِ صِيغَةُ مَدْحٍ', 'hādhihi ṣīghatu madḥin', 'ceci est une formule de louange', 'this is a formula of praise'],
  ], true),
  L('C1', 'u-dhamm', 'dhamm', 'الذَّمّ', 'Le blâme', 'Blame', 'بِئْسَ', 'بِئْسَ pour blâmer', 'biʾsa for blame', 'بِئْسَ est le pendant de نِعْمَ pour le blâme. L’analyse du nom qui suit est à vérifier.', [
    ['بِئْسَ الخُلُقُ الكَذِبُ', 'biʾsa l-khuluqu l-kadhibu', 'quel mauvais trait que le mensonge', 'what a bad trait lying is'],
    ['بِئْسَ القَوْلُ السُّخْرِيَةُ', 'biʾsa l-qawlu s-sukhriyatu', 'quelle mauvaise parole que la moquerie', 'what a bad speech mockery is'],
    ['الذَّمُّ يَذُمُّ المَذْمُومَ', 'adh-dhammu yadhummu l-madhmūma', 'le blâme blâme ce qui est blâmé', 'blame blames what is blamed'],
    ['بِئْسَ الجَارُ الخَائِنُ', 'biʾsa l-jāru l-khāʾinu', 'quel mauvais voisin que le traître', 'what a bad neighbour the traitor is'],
    ['لَا نَقْلِبُ نِعْمَ إِلَى بِئْسَ بِلَا سِيَاقٍ', 'lā naqlibu niʿma ilā biʾsa bilā siyāqin', 'on ne retourne pas niʿma en biʾsa sans contexte', 'do not flip niʿma to biʾsa without context'],
  ], true),
  L('C1', 'u-ishtighal', 'ishtighal', 'الاشْتِغَال', 'L’occupation du verbe', 'Occupation', 'زَيْدًا أَكْرَمْتُهُ', 'Le verbe est déjà pris par un pronom', 'The verb is already taken by a pronoun', 'Dans زَيْدًا أَكْرَمْتُهُ, le verbe a déjà un pronom. Le nom d’avant est à l’accusatif dans cet exemple pédagogique. à vérifier.', [
    ['زَيْدًا أَكْرَمْتُهُ', 'zaydan akramtuhu', 'Zayd, je l’ai honoré', 'Zayd, I honoured him'],
    ['الدَّرْسَ كَتَبْتُهُ', 'ad-darsa katabtuhu', 'la leçon, je l’ai écrite', 'the lesson, I wrote it'],
    ['الضَّمِيرُ يَشْغَلُ الفِعْلَ', 'aḍ-ḍamīru yashghalu l-fiʿla', 'le pronom occupe le verbe', 'the pronoun occupies the verb'],
    ['الاسْمُ السَّابِقُ مَنْصُوبٌ هُنَا', 'al-ismu s-sābiqū manṣūbun hunā', 'le nom précédent est à l’accusatif ici', 'the earlier noun is accusative here'],
    ['لَا نَعُمِّمُ هٰذَا الإِعْرَابَ', 'lā naʿummimu hādhā l-iʿrāba', 'nous ne généralisons pas cette analyse', 'we do not generalise this parsing'],
  ], true),
  L('C1', 'u-tanazu', 'tanazu', 'التَّنَازُع', 'Deux verbes, un complément', 'Two verbs, one complement', 'كَتَبَ وَقَرَأَ', 'Qui régit le nom', 'Which verb governs the noun', 'Deux verbes peuvent viser un seul complément. Quel verbe le régit dépend de l’école. à vérifier.', [
    ['كَتَبَ وَقَرَأَ الطَّالِبُ الدَّرْسَ', 'kataba wa-qaraʾa ṭ-ṭālibu d-darsa', 'l’étudiant a écrit et lu la leçon', 'the student wrote and read the lesson'],
    ['فِعْلَانِ وَمَعْمُولٌ وَاحِدٌ', 'fiʿlāni wa-maʿmūlun wāḥidun', 'deux verbes et un seul complément', 'two verbs and one complement'],
    ['التَّحْلِيلُ يَخْتَلِفُ', 'at-taḥlīlu yakhtalifu', 'l’analyse diffère', 'the analysis differs'],
    ['لَا نَخْتَارُ مَذْهَبًا هُنَا', 'lā nakhtāru madhhaban hunā', 'nous ne choisissons pas d’école ici', 'we do not pick a school here'],
    ['المَعْنَى يَبْقَى وَاضِحًا', 'al-maʿnā yabqā wāḍiḥan', 'le sens reste clair', 'the meaning stays clear'],
  ], true),
  L('C1', 'u-nisba', 'nisba', 'النِّسْبَة', 'L’adjectif de relation', 'The nisba adjective', 'مَدَنِيّ', 'La finale يّ', 'The ending ī', 'On ajoute يّ pour dire « relatif à ». مَدِينَةٌ donne مَدَنِيٌّ dans cet exemple pédagogique. La voyelle intérieure est à vérifier.', [
    ['رَجُلٌ مَدَنِيٌّ', 'rajulun madaniyyun', 'un homme de la ville', 'a city man'],
    ['لُغَةٌ عَرَبِيَّةٌ', 'lughatun ʿarabiyyatun', 'une langue arabe', 'an Arabic language'],
    ['تِجَارَةٌ مِصْرِيَّةٌ', 'tijāratun miṣriyyatun', 'un commerce égyptien', 'an Egyptian trade'],
    ['اليَاءُ المُشَدَّدَةُ عَلَامَةٌ', 'al-yāʾu l-mushaddadatu ʿalāmatun', 'le yāʾ redoublé est une marque', 'the doubled yāʾ is a marker'],
    ['النِّسْبَةُ تَصِفُ الأَصْلَ', 'an-nisbatu taṣifu l-aṣla', 'la relation décrit l’origine', 'nisba describes origin'],
  ], true),
  L('C1', 'u-tasghir', 'tasghir', 'التَّصْغِير', 'Le diminutif', 'The diminutive', 'كُتَيِّبٌ', 'Un petit livre', 'A little book', 'كُتَيِّبٌ est un diminutif pédagogique de كِتَابٌ. Le modèle exact change avec le nombre de lettres. à vérifier.', [
    ['كُتَيِّبٌ صَغِيرٌ', 'kutayyibun ṣaghīrun', 'un petit livret', 'a little booklet'],
    ['وُلَيْدٌ يَلْعَبُ', 'wulayyidun yalʿabu', 'un petit garçon joue', 'a little boy plays'],
    ['التَّصْغِيرُ يُصَغِّرُ المَعْنَى', 'at-taṣghīru yuṣaghghiru l-maʿnā', 'le diminutif réduit le sens', 'the diminutive shrinks the meaning'],
    ['لَيْسَ كُلُّ اسْمٍ عَلَى هٰذَا الوَزْنِ', 'laysa kullu ismin ʿalā hādhā l-wazni', 'tout nom n’est pas sur ce modèle', 'not every noun is on this pattern'],
    ['نَحْفَظُ المِثَالَ وَلَا نَعُمِّمُ', 'naḥfaẓu l-mithāla wa-lā naʿummimu', 'nous retenons l’exemple et nous ne généralisons pas', 'we keep the example and do not generalise'],
  ], true),
  L('C1', 'u-masdar', 'masdar', 'المَصْدَر', 'Types de noms d’action', 'Verbal-noun types', 'كِتَابَةٌ', 'Le nom de l’action', 'The noun of the action', 'كِتَابَةٌ est le nom d’action de كَتَبَ dans cet exemple. Les modèles sont nombreux. à vérifier.', [
    ['الكِتَابَةُ مُفِيدَةٌ', 'al-kitābatu mufīdatun', 'l’écriture est utile', 'writing is useful'],
    ['الجُلُوسُ هُنَا مُرِيحٌ', 'al-julūsu hunā murīḥun', 's’asseoir ici est reposant', 'sitting here is restful'],
    ['التَّعَلُّمُ يَحْتَاجُ وَقْتًا', 'at-taʿallumu yaḥtāju waqtan', 'l’apprentissage demande du temps', 'learning needs time'],
    ['المَصْدَرُ اسْمٌ لَا فِعْلٌ', 'al-maṣdaru ismun lā fiʿlun', 'le nom d’action est un nom, pas un verbe', 'the verbal noun is a noun, not a verb'],
    ['لِكُلِّ وَزْنٍ مَصْدَرٌ غَالِبٌ', 'li-kulli waznin maṣdarun ghālibun', 'chaque modèle a un nom d’action fréquent', 'each pattern has a frequent verbal noun'],
  ], true),
  L('C1', 'u-fail', 'ism-fail', 'اِسْمُ الفَاعِل', 'Le participe actif', 'The active participle', 'كَاتِبٌ', 'Celui qui fait', 'The one who does', 'كَاتِبٌ est celui qui écrit, sur le modèle فَاعِل pour la forme I. Les autres formes ont d’autres modèles. à vérifier.', [
    ['الرَّجُلُ كَاتِبٌ', 'ar-rajulu kātibun', 'l’homme est un écrivain', 'the man is a writer'],
    ['الطَّالِبُ جَالِسٌ', 'aṭ-ṭālibu jālisun', 'l’étudiant est assis', 'the student is sitting'],
    ['المُعَلِّمُ قَادِمٌ', 'al-muʿallimu qādimun', 'l’enseignant est en train d’arriver', 'the teacher is coming'],
    ['اِسْمُ الفَاعِلِ يَصِفُ مَنْ فَعَلَ', 'ismu l-fāʿili yaṣifu man faʿala', 'le participe actif décrit celui qui a fait', 'the active participle describes the doer'],
    ['وَزْنُ فَاعِلٍ لِلثُّلَاثِيِّ', 'waznu fāʿilin li-th-thulāthiyyi', 'le modèle fāʿil est pour le verbe simple', 'the fāʿil pattern is for the simple verb'],
  ], true),
  L('C1', 'u-maful-ism', 'ism-maful', 'اِسْمُ المَفْعُول', 'Le participe passif', 'The passive participle', 'مَكْتُوبٌ', 'Ce qui est fait', 'What is done', 'مَكْتُوبٌ signifie écrit, sur مَفْعُول pour la forme I. à vérifier pour les formes dérivées.', [
    ['الدَّرْسُ مَكْتُوبٌ', 'ad-darsu maktūbun', 'la leçon est écrite', 'the lesson is written'],
    ['البَابُ مَفْتُوحٌ', 'al-bābu maftūḥun', 'la porte est ouverte', 'the door is open'],
    ['الخَبَرُ مَسْمُوعٌ', 'al-khabaru masmūʿun', 'la nouvelle est entendue', 'the news is heard'],
    ['اِسْمُ المَفْعُولِ يَصِفُ المَفْعُولَ', 'ismu l-mafʿūli yaṣifu l-mafʿūla', 'le participe passif décrit ce qui subit', 'the passive participle describes what undergoes'],
    ['وَزْنُ مَفْعُولٍ لِلثُّلَاثِيِّ', 'waznu mafʿūlin li-th-thulāthiyyi', 'le modèle mafʿūl est pour le verbe simple', 'the mafʿūl pattern is for the simple verb'],
  ], true),
  L('C1', 'u-sifa', 'sifa-mushabbaha', 'الصِّفَةُ المُشَبَّهَة', 'L’adjectif assimilé', 'The assimilated adjective', 'كَرِيمٌ', 'Une qualité stable', 'A stable quality', 'كَرِيمٌ décrit une qualité durable, pas une action en cours. La frontière avec le participe est à vérifier.', [
    ['الرَّجُلُ كَرِيمٌ', 'ar-rajulu karīmun', 'l’homme est généreux', 'the man is generous'],
    ['البِنْتُ جَمِيلَةٌ', 'al-bintu jamīlatun', 'la fille est belle', 'the girl is beautiful'],
    ['الخَشَبُ صُلْبٌ', 'al-khashabu ṣulbun', 'le bois est dur', 'the wood is hard'],
    ['الصِّفَةُ ثَابِتَةٌ', 'aṣ-ṣifatu thābitatun', 'la qualité est stable', 'the quality is stable'],
    ['لَيْسَتْ حَدَثًا يَقَعُ الآنَ', 'laysat ḥadathan yaqaʿu l-āna', 'ce n’est pas un événement qui a lieu maintenant', 'it is not an event happening now'],
  ], true),
  L('C1', 'u-tafdil', 'ism-tafdil', 'اِسْمُ التَّفْضِيل', 'Le comparatif et le superlatif', 'The elative', 'أَكْبَرُ', 'Plus et le plus', 'More and the most', 'أَكْبَرُ مِنْ compare. الكِتَابُ الأَكْبَرُ est un superlatif dans cet exemple. Les formes irrégulières sont à vérifier.', [
    ['هٰذَا أَكْبَرُ مِنْ ذٰلِكَ', 'hādhā akbaru min dhālika', 'ceci est plus grand que cela', 'this is bigger than that'],
    ['هِيَ أَجْمَلُ مِنْ أُخْتِهَا', 'hiya ajmalu min ukhtihā', 'elle est plus belle que sa sœur', 'she is more beautiful than her sister'],
    ['الكِتَابُ الأَكْبَرُ هُنَا', 'al-kitābu l-akbaru hunā', 'le plus grand livre est ici', 'the biggest book is here'],
    ['اِسْمُ التَّفْضِيلِ عَلَى أَفْعَلَ', 'ismu t-tafḍīli ʿalā afʿala', 'l’élatif est souvent sur afʿal', 'the elative is often on afʿal'],
    ['مِنْ بَعْدَ المُقَارَنَةِ', 'min baʿda l-muqārana', 'min vient après la comparaison', 'min comes after the comparison'],
  ], true),
  L('C1', 'u-adad', 'adad', 'العَدَد', 'Règles du nombre, aperçu', 'Number rules, a sketch', 'ثَلَاثَةُ كُتُبٍ', '3–10, puis 11–19', '3–10, then 11–19', 'De 3 à 10, le nombre est d’un genre et le compté est au pluriel génitif dans cet exemple. 11 à 19 se construisent autrement. Tout le chapitre est à vérifier.', [
    ['ثَلَاثَةُ كُتُبٍ', 'thalāthatu kutubin', 'trois livres', 'three books'],
    ['خَمْسُ طَالِبَاتٍ', 'khamsu ṭālibātin', 'cinq étudiantes', 'five students (f.)'],
    ['أَحَدَ عَشَرَ كِتَابًا', 'aḥada ʿashara kitāban', 'onze livres', 'eleven books'],
    ['عِشْرُونَ قَلَمًا', 'ʿishrūna qalaman', 'vingt stylos', 'twenty pens'],
    ['المَعْدُودُ يُغَيِّرُ صُورَتَهُ', 'al-maʿdūdu yughayyiru ṣūratahu', 'le nom compté change de forme', 'the counted noun changes shape'],
  ], true),
  L('C1', 'u-waqf', 'waqf', 'الوَقْف', 'L’arrêt en fin de mot', 'Pausing at the end of a word', 'كِتَابْ', 'On pose le sukūn', 'We put a sukūn', 'À l’arrêt, on n’entend souvent plus la voyelle finale : كِتَابُ devient كِتَابْ. Le tāʾ marbūṭa devient un h. à vérifier en récitation.', [
    ['قَرَأْتُ الكِتَابْ', 'qaraʾtu l-kitāb', 'j’ai lu le livre, avec arrêt', 'I read the book, with a pause'],
    ['هٰذِهِ مَدْرَسَهْ', 'hādhihi madrasa', 'ceci est une école, avec arrêt', 'this is a school, with a pause'],
    ['الوَقْفُ يُسْقِطُ الحَرَكَةَ غَالِبًا', 'al-waqfu yusqiṭu l-ḥaraka ghāliban', 'l’arrêt fait souvent tomber la voyelle', 'pausing often drops the vowel'],
    ['التَّاءُ المَرْبُوطَةُ تُسْمَعُ هَاءً', 'at-tāʾu l-marbūṭatu tusmaʿu hāʾan', 'le tāʾ marbūṭa s’entend comme hāʾ', 'tāʾ marbūṭa is heard as hāʾ'],
    ['فِي الوَصْلِ تَعُودُ الحَرَكَةُ', 'fī l-waṣli taʿūdu l-ḥaraka', 'en liaison, la voyelle revient', 'in connection, the vowel returns'],
  ], true),
  L('C1', 'u-hamza', 'hamza', 'الهَمْزَة', 'Écriture du hamza, aperçu', 'Hamza spelling, a sketch', 'سَأَلَ', 'Le support change', 'The seat changes', 'Le hamza s’écrit sur alif, wāw ou yāʾ selon les voyelles voisines. Ces quatre mots illustrent des cas fréquents, pas toute la règle. à vérifier.', [
    ['سَأَلَ الطَّالِبُ', 'saʾala ṭ-ṭālibu', 'l’étudiant a demandé', 'the student asked'],
    ['قَرَأَ الدَّرْسَ', 'qaraʾa d-darsa', 'il a lu la leçon', 'he read the lesson'],
    ['مُؤْمِنٌ صَادِقٌ', 'muʾminun ṣādiqun', 'un croyant sincère', 'a sincere believer'],
    ['بِئْرٌ عَمِيقَةٌ', 'biʾrun ʿamīqatun', 'un puits profond', 'a deep well'],
    ['الكُرْسِيُّ لِلجُلُوسِ', 'al-kursiyyu li-l-julūsi', 'la chaise est pour s’asseoir', 'the chair is for sitting'],
  ], true),
  L('C1', 'u-kam', 'exclamation-kam', 'كَمْ', 'L’exclamation avec كَمْ', 'Exclamation with kam', 'كَمْ', 'Combien, pour s’exclamer', 'How much, as an exclamation', 'كَمْ التَّعَجُّبِيَّة est suivie d’un nom indéfini à l’accusatif dans cet exemple. كَمْ de question se construit autrement. à vérifier.', [
    ['كَمْ كِتَابًا قَرَأْتَ', 'kam kitāban qaraʾta', 'que de livres tu as lus', 'how many books you have read'],
    ['كَمْ طَالِبًا نَجَحَ', 'kam ṭāliban najaḥa', 'que d’étudiants ont réussi', 'how many students succeeded'],
    ['كَمْ يَوْمًا اِنْتَظَرْنَا', 'kam yawman intaẓarnā', 'que de jours nous avons attendu', 'how many days we waited'],
    ['التَّمْيِيزُ بَعْدَ كَمْ مَنْصُوبٌ هُنَا', 'at-tamyīzu baʿda kam manṣūbun hunā', 'le spécificatif après kam est accusatif ici', 'the specification after kam is accusative here'],
    ['لَا نَخْلِطُهَا بِكَمْ السُّؤَالِ', 'lā nakhluṭuhā bi-kam is-suʾāli', 'nous ne la mélangeons pas avec le kam de question', 'we do not mix it with question kam'],
  ], true),
  L('C1', 'u-hal-jumla', 'hal-phrase', 'الحَالُ الجُمْلَة', 'Le ḥāl en forme de phrase', 'The ḥāl as a clause', 'وَهُوَ يَضْحَكُ', 'Une phrase à la place d’un mot', 'A clause instead of a word', 'Le ḥāl peut être une phrase liée par وَ et un pronom. Ce n’est plus un seul mot à l’accusatif. à vérifier.', [
    ['جَاءَ الوَلَدُ وَهُوَ يَضْحَكُ', 'jāʾa l-waladu wa-huwa yaḍḥaku', 'le garçon est arrivé en riant', 'the boy arrived while he was laughing'],
    ['خَرَجْتُ وَالشَّمْسُ طَالِعَةٌ', 'kharajtu wa-sh-shamsu ṭāliʿatun', 'je suis sorti alors que le soleil était levé', 'I went out while the sun was up'],
    ['جَلَسَ وَالكِتَابُ فِي يَدِهِ', 'jalasa wa-l-kitābu fī yadihi', 'il s’est assis le livre à la main', 'he sat with the book in his hand'],
    ['وَاوُ الحَالِ تَرْبِطُ', 'wāwu l-ḥāli tarbiṭu', 'le wāw du ḥāl relie', 'the ḥāl wāw links'],
    ['الضَّمِيرُ يَعُودُ عَلَى الصَّاحِبِ', 'aḍ-ḍamīru yaʿūdu ʿalā ṣ-ṣāḥibi', 'le pronom renvoie au support', 'the pronoun refers to the antecedent'],
  ], true),
];

export const EXTRA_SPECS: ExtraSpec[] = [...A1, ...A2, ...B1, ...B2, ...C1];
