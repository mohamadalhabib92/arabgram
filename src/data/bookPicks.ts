/** Tirage figé de l’ebook (arabgram.py, random.Random). Les libellés viennent du curriculum. */
export type BookMode = 'ar2fr' | 'fr2ar' | 'ar2tr';
export type BookPickItem = { ar: string; tr: string; fr: string };
export type BookQuizPick = { mode: BookMode; answer: number; items: BookPickItem[] };
export type BookChapterPicks = { quiz: BookQuizPick[]; read: BookPickItem[]; write: BookPickItem[] };
export const BOOK_PICKS: Record<string, BookChapterPicks> = {
  "ch1": {
    "quiz": [
      {
        "mode": "ar2fr",
        "answer": 1,
        "items": [
          {
            "ar": "حَلِيب",
            "tr": "ḥalīb",
            "fr": "lait"
          },
          {
            "ar": "تُوت",
            "tr": "tūt",
            "fr": "mûres"
          },
          {
            "ar": "دَار",
            "tr": "dār",
            "fr": "demeure"
          }
        ]
      },
      {
        "mode": "fr2ar",
        "answer": 0,
        "items": [
          {
            "ar": "ذَهَب",
            "tr": "dhahab",
            "fr": "or (métal)"
          },
          {
            "ar": "أَب",
            "tr": "ab",
            "fr": "père"
          },
          {
            "ar": "زَيْت",
            "tr": "zayt",
            "fr": "huile"
          }
        ]
      },
      {
        "mode": "ar2tr",
        "answer": 2,
        "items": [
          {
            "ar": "تُوت",
            "tr": "tūt",
            "fr": "mûres"
          },
          {
            "ar": "ذَهَب",
            "tr": "dhahab",
            "fr": "or (métal)"
          },
          {
            "ar": "دَار",
            "tr": "dār",
            "fr": "demeure"
          }
        ]
      },
      {
        "mode": "ar2fr",
        "answer": 0,
        "items": [
          {
            "ar": "بَيْت",
            "tr": "bayt",
            "fr": "maison"
          },
          {
            "ar": "زَيْت",
            "tr": "zayt",
            "fr": "huile"
          },
          {
            "ar": "ذَهَب",
            "tr": "dhahab",
            "fr": "or (métal)"
          }
        ]
      }
    ],
    "read": [
      {
        "ar": "حَلِيب",
        "tr": "ḥalīb",
        "fr": "lait"
      },
      {
        "ar": "زَيْت",
        "tr": "zayt",
        "fr": "huile"
      },
      {
        "ar": "أَب",
        "tr": "ab",
        "fr": "père"
      },
      {
        "ar": "ثَوْب",
        "tr": "thawb",
        "fr": "vêtement (robe longue)"
      },
      {
        "ar": "خُبْز",
        "tr": "khubz",
        "fr": "pain"
      },
      {
        "ar": "تُوت",
        "tr": "tūt",
        "fr": "mûres"
      }
    ],
    "write": [
      {
        "ar": "حَلِيب",
        "tr": "ḥalīb",
        "fr": "lait"
      },
      {
        "ar": "ثَوْب",
        "tr": "thawb",
        "fr": "vêtement (robe longue)"
      },
      {
        "ar": "خُبْز",
        "tr": "khubz",
        "fr": "pain"
      },
      {
        "ar": "جَمَل",
        "tr": "jamal",
        "fr": "chameau"
      }
    ]
  },
  "ch2": {
    "quiz": [
      {
        "mode": "ar2fr",
        "answer": 2,
        "items": [
          {
            "ar": "قَلَم",
            "tr": "qalam",
            "fr": "stylo, calame"
          },
          {
            "ar": "صَدِيق",
            "tr": "ṣadīq",
            "fr": "ami"
          },
          {
            "ar": "ضَوْء",
            "tr": "ḍawʾ",
            "fr": "lumière"
          }
        ]
      },
      {
        "mode": "fr2ar",
        "answer": 0,
        "items": [
          {
            "ar": "طَالِب",
            "tr": "ṭālib",
            "fr": "étudiant"
          },
          {
            "ar": "سَمَك",
            "tr": "samak",
            "fr": "poisson"
          },
          {
            "ar": "غُرْفَة",
            "tr": "ghurfa",
            "fr": "chambre"
          }
        ]
      },
      {
        "mode": "ar2tr",
        "answer": 2,
        "items": [
          {
            "ar": "سَمَك",
            "tr": "samak",
            "fr": "poisson"
          },
          {
            "ar": "يَد",
            "tr": "yad",
            "fr": "main"
          },
          {
            "ar": "شَمْس",
            "tr": "shams",
            "fr": "soleil"
          }
        ]
      },
      {
        "mode": "ar2fr",
        "answer": 2,
        "items": [
          {
            "ar": "صَدِيق",
            "tr": "ṣadīq",
            "fr": "ami"
          },
          {
            "ar": "طَالِب",
            "tr": "ṭālib",
            "fr": "étudiant"
          },
          {
            "ar": "عَيْن",
            "tr": "ʿayn",
            "fr": "œil ; source"
          }
        ]
      }
    ],
    "read": [
      {
        "ar": "صَدِيق",
        "tr": "ṣadīq",
        "fr": "ami"
      },
      {
        "ar": "كِتَاب",
        "tr": "kitāb",
        "fr": "livre"
      },
      {
        "ar": "شَمْس",
        "tr": "shams",
        "fr": "soleil"
      },
      {
        "ar": "طَالِب",
        "tr": "ṭālib",
        "fr": "étudiant"
      },
      {
        "ar": "نَجْم",
        "tr": "najm",
        "fr": "étoile"
      },
      {
        "ar": "غُرْفَة",
        "tr": "ghurfa",
        "fr": "chambre"
      }
    ],
    "write": [
      {
        "ar": "وَرْدَة",
        "tr": "warda",
        "fr": "rose (fleur)"
      },
      {
        "ar": "غُرْفَة",
        "tr": "ghurfa",
        "fr": "chambre"
      },
      {
        "ar": "يَد",
        "tr": "yad",
        "fr": "main"
      },
      {
        "ar": "لَيْل",
        "tr": "layl",
        "fr": "nuit"
      }
    ]
  },
  "ch3": {
    "quiz": [
      {
        "mode": "ar2fr",
        "answer": 1,
        "items": [
          {
            "ar": "جَدَّة",
            "tr": "jadda",
            "fr": "grand-mère"
          },
          {
            "ar": "شُكْرًا",
            "tr": "shukran",
            "fr": "merci"
          },
          {
            "ar": "أُمّ",
            "tr": "umm",
            "fr": "mère"
          }
        ]
      },
      {
        "mode": "fr2ar",
        "answer": 1,
        "items": [
          {
            "ar": "كِتَابٍ",
            "tr": "kitābin",
            "fr": "d’un livre (après préposition)"
          },
          {
            "ar": "مِنْ",
            "tr": "min",
            "fr": "de, depuis"
          },
          {
            "ar": "قُلْ",
            "tr": "qul",
            "fr": "dis !"
          }
        ]
      },
      {
        "mode": "ar2tr",
        "answer": 0,
        "items": [
          {
            "ar": "سُكَّر",
            "tr": "sukkar",
            "fr": "sucre"
          },
          {
            "ar": "كُتِبَ",
            "tr": "kutiba",
            "fr": "il a été écrit"
          },
          {
            "ar": "دَرَسَ",
            "tr": "darasa",
            "fr": "il a étudié"
          }
        ]
      },
      {
        "mode": "ar2fr",
        "answer": 1,
        "items": [
          {
            "ar": "قُلْ",
            "tr": "qul",
            "fr": "dis !"
          },
          {
            "ar": "لَمْ",
            "tr": "lam",
            "fr": "ne… pas (passé)"
          },
          {
            "ar": "كِتَابًا",
            "tr": "kitāban",
            "fr": "un livre (complément)"
          }
        ]
      }
    ],
    "read": [
      {
        "ar": "جَدَّة",
        "tr": "jadda",
        "fr": "grand-mère"
      },
      {
        "ar": "كَتَبَ",
        "tr": "kataba",
        "fr": "il a écrit"
      },
      {
        "ar": "كُتِبَ",
        "tr": "kutiba",
        "fr": "il a été écrit"
      },
      {
        "ar": "سُكَّر",
        "tr": "sukkar",
        "fr": "sucre"
      },
      {
        "ar": "لَمْ",
        "tr": "lam",
        "fr": "ne… pas (passé)"
      },
      {
        "ar": "دَرَسَ",
        "tr": "darasa",
        "fr": "il a étudié"
      }
    ],
    "write": [
      {
        "ar": "سُكَّر",
        "tr": "sukkar",
        "fr": "sucre"
      },
      {
        "ar": "أُمّ",
        "tr": "umm",
        "fr": "mère"
      },
      {
        "ar": "مُدَرِّس",
        "tr": "mudarris",
        "fr": "enseignant"
      },
      {
        "ar": "مِنْ",
        "tr": "min",
        "fr": "de, depuis"
      }
    ]
  },
  "ch4": {
    "quiz": [
      {
        "mode": "ar2fr",
        "answer": 2,
        "items": [
          {
            "ar": "السَّلَامُ عَلَيْكُمْ",
            "tr": "as-salāmu ʿalaykum",
            "fr": "la paix soit sur vous (bonjour)"
          },
          {
            "ar": "وَعَلَيْكُمُ السَّلَامُ",
            "tr": "wa-ʿalaykumu s-salām",
            "fr": "et sur vous la paix (réponse)"
          },
          {
            "ar": "عَمَّة",
            "tr": "ʿamma",
            "fr": "tante paternelle"
          }
        ]
      },
      {
        "mode": "fr2ar",
        "answer": 2,
        "items": [
          {
            "ar": "أَخ",
            "tr": "akh",
            "fr": "frère"
          },
          {
            "ar": "أُخْت",
            "tr": "ukht",
            "fr": "sœur"
          },
          {
            "ar": "مَرْحَبًا",
            "tr": "marḥaban",
            "fr": "bonjour, bienvenue"
          }
        ]
      },
      {
        "mode": "ar2tr",
        "answer": 0,
        "items": [
          {
            "ar": "جَدّ",
            "tr": "jadd",
            "fr": "grand-père"
          },
          {
            "ar": "عَمّ",
            "tr": "ʿamm",
            "fr": "oncle paternel"
          },
          {
            "ar": "عَفْوًا",
            "tr": "ʿafwan",
            "fr": "de rien ; pardon"
          }
        ]
      },
      {
        "mode": "ar2fr",
        "answer": 1,
        "items": [
          {
            "ar": "عَمَّة",
            "tr": "ʿamma",
            "fr": "tante paternelle"
          },
          {
            "ar": "بِخَيْرٍ، الحَمْدُ لِلّٰهِ",
            "tr": "bi-khayrin, al-ḥamdu li-llāh",
            "fr": "bien, Dieu merci"
          },
          {
            "ar": "خَالَة",
            "tr": "khāla",
            "fr": "tante maternelle"
          }
        ]
      }
    ],
    "read": [
      {
        "ar": "كَيْفَ حَالُكَ؟",
        "tr": "kayfa ḥāluka?",
        "fr": "comment vas-tu ? (à un homme)"
      },
      {
        "ar": "عَمَّة",
        "tr": "ʿamma",
        "fr": "tante paternelle"
      },
      {
        "ar": "خَال",
        "tr": "khāl",
        "fr": "oncle maternel"
      },
      {
        "ar": "مَسَاءُ الخَيْرِ",
        "tr": "masāʾu l-khayr",
        "fr": "bonsoir"
      },
      {
        "ar": "أَخ",
        "tr": "akh",
        "fr": "frère"
      },
      {
        "ar": "بِنْت",
        "tr": "bint",
        "fr": "fille"
      }
    ],
    "write": [
      {
        "ar": "خَالَة",
        "tr": "khāla",
        "fr": "tante maternelle"
      },
      {
        "ar": "جَدّ",
        "tr": "jadd",
        "fr": "grand-père"
      },
      {
        "ar": "مَرْحَبًا",
        "tr": "marḥaban",
        "fr": "bonjour, bienvenue"
      },
      {
        "ar": "السَّلَامُ عَلَيْكُمْ",
        "tr": "as-salāmu ʿalaykum",
        "fr": "la paix soit sur vous (bonjour)"
      }
    ]
  },
  "ch5": {
    "quiz": [
      {
        "mode": "ar2fr",
        "answer": 2,
        "items": [
          {
            "ar": "أَنَا طَالِبٌ",
            "tr": "anā ṭālibun",
            "fr": "je suis étudiant"
          },
          {
            "ar": "ثَلَاثَة ٣",
            "tr": "thalātha",
            "fr": "trois (3)"
          },
          {
            "ar": "أَنَا",
            "tr": "anā",
            "fr": "je, moi"
          }
        ]
      },
      {
        "mode": "fr2ar",
        "answer": 1,
        "items": [
          {
            "ar": "هِيَ مُدَرِّسَةٌ",
            "tr": "hiya mudarrisatun",
            "fr": "elle est enseignante"
          },
          {
            "ar": "خَمْسَة ٥",
            "tr": "khamsa",
            "fr": "cinq (5)"
          },
          {
            "ar": "اِثْنَان ٢",
            "tr": "ithnān",
            "fr": "deux (2)"
          }
        ]
      },
      {
        "mode": "ar2tr",
        "answer": 0,
        "items": [
          {
            "ar": "أَنْتِ",
            "tr": "anti",
            "fr": "tu (féminin)"
          },
          {
            "ar": "ثَلَاثَة ٣",
            "tr": "thalātha",
            "fr": "trois (3)"
          },
          {
            "ar": "اِثْنَان ٢",
            "tr": "ithnān",
            "fr": "deux (2)"
          }
        ]
      },
      {
        "mode": "ar2fr",
        "answer": 2,
        "items": [
          {
            "ar": "تِسْعَة ٩",
            "tr": "tisʿa",
            "fr": "neuf (9)"
          },
          {
            "ar": "أَرْبَعَة ٤",
            "tr": "arbaʿa",
            "fr": "quatre (4)"
          },
          {
            "ar": "اِثْنَان ٢",
            "tr": "ithnān",
            "fr": "deux (2)"
          }
        ]
      }
    ],
    "read": [
      {
        "ar": "ثَمَانِيَة ٨",
        "tr": "thamāniya",
        "fr": "huit (8)"
      },
      {
        "ar": "عَشَرَة ١٠",
        "tr": "ʿashara",
        "fr": "dix (10)"
      },
      {
        "ar": "أَرْبَعَة ٤",
        "tr": "arbaʿa",
        "fr": "quatre (4)"
      },
      {
        "ar": "أَنْتِ",
        "tr": "anti",
        "fr": "tu (féminin)"
      },
      {
        "ar": "نَحْنُ",
        "tr": "naḥnu",
        "fr": "nous"
      },
      {
        "ar": "خَمْسَة ٥",
        "tr": "khamsa",
        "fr": "cinq (5)"
      }
    ],
    "write": [
      {
        "ar": "ثَلَاثَة ٣",
        "tr": "thalātha",
        "fr": "trois (3)"
      },
      {
        "ar": "الجَوُّ جَمِيلٌ",
        "tr": "al-jawwu jamīlun",
        "fr": "il fait beau"
      },
      {
        "ar": "وَاحِد ١",
        "tr": "wāḥid",
        "fr": "un (1)"
      },
      {
        "ar": "أَنْتِ",
        "tr": "anti",
        "fr": "tu (féminin)"
      }
    ]
  },
  "ch6": {
    "quiz": [
      {
        "mode": "ar2fr",
        "answer": 2,
        "items": [
          {
            "ar": "الجَارُ قَبْلَ الدَّارِ",
            "tr": "al-jāru qabla d-dār",
            "fr": "le voisin avant la maison"
          },
          {
            "ar": "وَالسَّيْفُ وَالرُّمْحُ وَالقِرْطَاسُ وَالقَلَمُ",
            "tr": "wa-s-sayfu wa-r-rumḥu wa-l-qirṭāsu wa-l-qalamu",
            "fr": "et l’épée, la lance, le papier et le calame (al-Mutanabbī)"
          },
          {
            "ar": "الصَّبْرُ مِفْتَاحُ الفَرَجِ",
            "tr": "aṣ-ṣabru miftāḥu l-faraj",
            "fr": "la patience est la clé du soulagement"
          }
        ]
      },
      {
        "mode": "fr2ar",
        "answer": 1,
        "items": [
          {
            "ar": "مَنْ جَدَّ وَجَدَ",
            "tr": "man jadda wajada",
            "fr": "qui persévère trouve"
          },
          {
            "ar": "الخَيْلُ وَاللَّيْلُ وَالبَيْدَاءُ تَعْرِفُنِي",
            "tr": "al-khaylu wa-l-laylu wa-l-baydāʾu taʿrifunī",
            "fr": "les chevaux, la nuit et le désert me connaissent (al-Mutanabbī)"
          },
          {
            "ar": "الوَقْتُ مِنْ ذَهَبٍ",
            "tr": "al-waqtu min dhahabin",
            "fr": "le temps, c’est de l’or"
          }
        ]
      },
      {
        "mode": "ar2tr",
        "answer": 2,
        "items": [
          {
            "ar": "الخَيْلُ وَاللَّيْلُ وَالبَيْدَاءُ تَعْرِفُنِي",
            "tr": "al-khaylu wa-l-laylu wa-l-baydāʾu taʿrifunī",
            "fr": "les chevaux, la nuit et le désert me connaissent (al-Mutanabbī)"
          },
          {
            "ar": "وَالسَّيْفُ وَالرُّمْحُ وَالقِرْطَاسُ وَالقَلَمُ",
            "tr": "wa-s-sayfu wa-r-rumḥu wa-l-qirṭāsu wa-l-qalamu",
            "fr": "et l’épée, la lance, le papier et le calame (al-Mutanabbī)"
          },
          {
            "ar": "أَنَا الَّذِي نَظَرَ الأَعْمَى إِلَى أَدَبِي",
            "tr": "ana lladhī naẓara l-aʿmā ilā adabī",
            "fr": "je suis celui dont l’aveugle a vu la littérature (al-Mutanabbī)"
          }
        ]
      },
      {
        "mode": "ar2fr",
        "answer": 0,
        "items": [
          {
            "ar": "الوَقْتُ مِنْ ذَهَبٍ",
            "tr": "al-waqtu min dhahabin",
            "fr": "le temps, c’est de l’or"
          },
          {
            "ar": "الجَارُ قَبْلَ الدَّارِ",
            "tr": "al-jāru qabla d-dār",
            "fr": "le voisin avant la maison"
          },
          {
            "ar": "أَنَا الَّذِي نَظَرَ الأَعْمَى إِلَى أَدَبِي",
            "tr": "ana lladhī naẓara l-aʿmā ilā adabī",
            "fr": "je suis celui dont l’aveugle a vu la littérature (al-Mutanabbī)"
          }
        ]
      }
    ],
    "read": [
      {
        "ar": "الجَارُ قَبْلَ الدَّارِ",
        "tr": "al-jāru qabla d-dār",
        "fr": "le voisin avant la maison"
      },
      {
        "ar": "الخَيْلُ وَاللَّيْلُ وَالبَيْدَاءُ تَعْرِفُنِي",
        "tr": "al-khaylu wa-l-laylu wa-l-baydāʾu taʿrifunī",
        "fr": "les chevaux, la nuit et le désert me connaissent (al-Mutanabbī)"
      },
      {
        "ar": "وَالسَّيْفُ وَالرُّمْحُ وَالقِرْطَاسُ وَالقَلَمُ",
        "tr": "wa-s-sayfu wa-r-rumḥu wa-l-qirṭāsu wa-l-qalamu",
        "fr": "et l’épée, la lance, le papier et le calame (al-Mutanabbī)"
      },
      {
        "ar": "قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ وَمَنْزِلِ",
        "tr": "qifā nabki min dhikrā ḥabībin wa-manzili",
        "fr": "arrêtez-vous, pleurons au souvenir d’un être aimé et d’une demeure (Imruʾ al-Qays)"
      },
      {
        "ar": "أَنَا الَّذِي نَظَرَ الأَعْمَى إِلَى أَدَبِي",
        "tr": "ana lladhī naẓara l-aʿmā ilā adabī",
        "fr": "je suis celui dont l’aveugle a vu la littérature (al-Mutanabbī)"
      },
      {
        "ar": "العِلْمُ نُورٌ",
        "tr": "al-ʿilmu nūrun",
        "fr": "le savoir est lumière"
      }
    ],
    "write": [
      {
        "ar": "قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ وَمَنْزِلِ",
        "tr": "qifā nabki min dhikrā ḥabībin wa-manzili",
        "fr": "arrêtez-vous, pleurons au souvenir d’un être aimé et d’une demeure (Imruʾ al-Qays)"
      },
      {
        "ar": "الصَّبْرُ مِفْتَاحُ الفَرَجِ",
        "tr": "aṣ-ṣabru miftāḥu l-faraj",
        "fr": "la patience est la clé du soulagement"
      },
      {
        "ar": "الخَيْلُ وَاللَّيْلُ وَالبَيْدَاءُ تَعْرِفُنِي",
        "tr": "al-khaylu wa-l-laylu wa-l-baydāʾu taʿrifunī",
        "fr": "les chevaux, la nuit et le désert me connaissent (al-Mutanabbī)"
      },
      {
        "ar": "العِلْمُ نُورٌ",
        "tr": "al-ʿilmu nūrun",
        "fr": "le savoir est lumière"
      }
    ]
  }
};
