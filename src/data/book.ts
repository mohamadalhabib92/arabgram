import { ALL_ITEMS, UNITS, letterForms, type Item, type Lesson, type Unit } from '@/data/curriculum';
import type { BookProgress } from '@/state';
import { PASSAGES } from '@/data/passages';
import { MARKS, PHONETIC_TEST } from '@/data/tashkil';
import { BOOK_PICKS, type BookMode, type BookPickItem } from '@/data/bookPicks';

/**
 * Livre ArabGram : le compagnon français de l’ebook, bâti sur le curriculum
 * (mêmes unités, leçons, signes et passages) plus les textes propres à l’ebook.
 * Les tirages d’exercices et de quiz sont ceux du PDF (bookPicks).
 */

export type { BookProgress };

export type Run = { text: string; ar?: boolean; b?: boolean; i?: boolean };

export type BookQuestion = {
  id: string;
  prompt: Run[];
  options: { runs: Run[]; arabic: boolean }[];
  answer: number;
  explain: Run[];
  source: string;
};

export type MindBranch = { title: string; lines: string[] };

export type Block =
  | { kind: 'h'; text: string }
  | { kind: 'p'; runs: Run[] }
  | { kind: 'ul'; items: Run[][] }
  | { kind: 'ol'; items: Run[][] }
  | { kind: 'defs'; rows: { term: Run[]; detail: Run[] }[] }
  | { kind: 'tip'; tone: 'info' | 'warning' | 'source'; label: string; runs: Run[] }
  | { kind: 'letters'; ids: string[] }
  | { kind: 'forms'; letters: string[] }
  | { kind: 'items'; title?: string; titleAr?: string; ids: string[]; license?: Lesson['license'] }
  | { kind: 'marks' }
  | { kind: 'pairs' }
  | { kind: 'passages'; ids: string[]; translit: boolean }
  | { kind: 'cards'; ids: string[] }
  | { kind: 'digits'; ids: string[] }
  | { kind: 'nominal' }
  | { kind: 'boxes'; boxes: { title: string; sub: string }[]; note: string }
  | { kind: 'mind'; center: string; branches: MindBranch[]; blank?: boolean }
  | { kind: 'reveal'; title: string; prompt: string; lines: { show: Run[]; answer: Run[] }[] }
  | { kind: 'quiz'; hint: string; questions: BookQuestion[] }
  | { kind: 'pdf'; text: string }
  | { kind: 'goto'; sectionId: string; label: string }
  | { kind: 'route'; href: string; label: string }
  | { kind: 'open'; partId: string; label: string }
  | { kind: 'practice'; unitIds: number[] }
  | { kind: 'parts' };

export type BookSection = {
  id: string;
  title: string;
  /** Atelier, tableau ou carte à compléter : le quadrillage est dans le PDF. */
  paper: boolean;
  blocks: Block[];
};

export type BookPart = {
  id: string;
  group: 'avant' | 'chapitre' | 'fin';
  kicker: string;
  title: string;
  blurb: string;
  unitIds: number[];
  sections: BookSection[];
};

const AR_RUN = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+(?:[ \u00A0]+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)*/g;

/** Isole chaque segment arabe, comme le moteur de l’ebook. */
export function runs(text: string): Run[] {
  const out: Run[] = [];
  let last = 0;
  for (const match of text.matchAll(AR_RUN)) {
    const index = match.index ?? 0;
    if (index > last) out.push({ text: text.slice(last, index) });
    out.push({ ar: true, text: match[0] });
    last = index + match[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out.filter((run) => run.text.length > 0);
}

export function runsToText(list: Run[]): string {
  return list.map((run) => run.text).join('');
}

const P = (text: string): Block => ({ kind: 'p', runs: runs(text) });

const PDF = (text: string): Block => ({ kind: 'pdf', text });

export const FORMS_NOTE =
  'Une lettre arabe change de forme selon sa place dans le mot. Le tatweel (ـ) montre de quel côté elle se lie. Les lettres ا د ذ ر ز و ne se lient jamais à la lettre suivante : leurs formes initiale et isolée sont identiques.';

export const UNICODE_SHAPING =
  'Règle de l’app (formes contextuelles avec tatweel) vérifiée dans la base Unicode : ا د ذ ر ز و ont le type de liaison « R » (liaison à droite seulement), les autres lettres de l’alphabet le type « D » (double). Source : Unicode Character Database, ArabicShaping.txt, version 18.0.';

export const UNICODE_BIDI =
  'Vérification pour cet ebook : les chiffres arabes orientaux ٠–٩ (U+0660–U+0669) ont la classe bidirectionnelle « AN » (Arabic Number) : un nombre garde ses chiffres dans l’ordre gauche → droite à l’intérieur d’un texte arabe. Sources : Unicode Standard Annex #9 (algorithme bidirectionnel) et UnicodeData.txt, version 18.0.';

export const SUN_LETTERS = 'ت ث د ذ ر ز س ش ص ض ط ظ ل ن';
export const MOON_MNEMONIC = 'اِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ';

export const EMPTY_SLOT_NOTE =
  'La leçon u11l3 « Textes longs » est un emplacement vide dans l’app (contenu à fournir) : elle n’est donc pas reprise ici.';

export const CREDITS_SOURCES = [
  'ArabGram — dépôt GitHub mohamadalhabib92/arabgram, branche main : src/data/curriculum.ts, tashkil.ts, passages.ts, licenses.ts, README.md (contenu original ArabGram ; licence de diffusion à confirmer par le propriétaire, proposition CC BY-SA 4.0).',
  'Proverbes arabes traditionnels (domaine public) et vers d’al-Mutanabbī (m. 965) et d’Imruʾ al-Qays (VIe s.), domaine public — traductions originales de l’app, attribution « à valider ».',
  'Unicode Consortium, Unicode Character Database 18.0 : ArabicShaping.txt (types de liaison) et UnicodeData.txt (classe bidi AN des chiffres ٠–٩) — unicode.org/Public/UCD/latest, consulté le 10.11.2026.',
  'Unicode Standard Annex #9, « Unicode Bidirectional Algorithm » — unicode.org/reports/tr9.',
  'Wikipédia (en), « Sun and moon letters », consulté le 10.11.2026 (liste des lettres solaires et mnémotechnique des lettres lunaires).',
  'Application web : https://mohamadalhabib92.github.io/arabgram/',
] as const;

export const PWA_URL = 'https://mohamadalhabib92.github.io/arabgram/';

const QUIZ_HINT =
  'Touche une réponse : la correction s’affiche sous la question. Sur le PDF, le lien ouvre une page de correction, puis « Revenir à la question ». Marque ton score si tu lis sur papier.';

const QUIZ_SOURCE = 'App ArabGram, curriculum';

const itemKey = (it: { ar: string; tr: string; fr: string }) => `${it.ar}\0${it.tr}\0${it.fr}`;
const ITEM_KEY = new Map(ALL_ITEMS.map((it) => [itemKey(it), it]));

function mustItem(it: BookPickItem): Item {
  const found = ITEM_KEY.get(itemKey(it));
  if (!found) throw new Error(`Livre : « ${it.ar} » absent du curriculum`);
  return found;
}

function unitBy(id: number): Unit {
  const unit = UNITS.find((entry) => entry.id === id);
  if (!unit) throw new Error(`Livre : unité ${id} absente`);
  return unit;
}

function ofKinds(unitIds: number[], kinds: Item['kind'][]): Item[] {
  const out: Item[] = [];
  for (const id of unitIds) {
    for (const lesson of unitBy(id).lessons) {
      for (const item of lesson.items) if (kinds.includes(item.kind)) out.push(item);
    }
  }
  return out;
}

function dedupeAr(items: Item[]): Item[] {
  const seen = new Set<string>();
  const out: Item[] = [];
  for (const item of items) {
    if (seen.has(item.ar)) continue;
    seen.add(item.ar);
    out.push(item);
  }
  return out;
}

function letterTips(unitIds: number[]): string[] {
  const keys = ['point', 'lient', 'gorge', 'emphatiques'];
  const tips: string[] = [];
  for (const id of unitIds) {
    for (const lesson of unitBy(id).lessons) {
      const tip = lesson.tip;
      if (tip && keys.some((key) => tip.fr.includes(key))) tips.push(tip.fr);
    }
  }
  return tips;
}

function wordGroups(unitIds: number[]): { lesson: Lesson; items: Item[] }[] {
  const out: { lesson: Lesson; items: Item[] }[] = [];
  for (const id of unitIds) {
    for (const lesson of unitBy(id).lessons) {
      const items = lesson.items.filter((item) => item.kind === 'word' || item.kind === 'phrase');
      if (items.length) out.push({ lesson, items });
    }
  }
  return out;
}

function unitHeaders(unitIds: number[]): Block[] {
  return unitIds.map((id) => {
    const unit = unitBy(id);
    return {
      kind: 'p' as const,
      runs: [
        { b: true, text: `Unité ${unit.id} de l’app` },
        { text: ' — ' },
        { ar: true, text: unit.ar },
        { text: ` · ${unit.fr} · Objectif : ${unit.goal.fr}` },
      ],
    };
  });
}

function questionsFor(chapterId: string): BookQuestion[] {
  return BOOK_PICKS[chapterId].quiz.map((pick, index) => {
    const correct = pick.items[pick.answer];
    const prompt = promptOf(pick.mode, correct);
    const options = pick.items.map((item) => optionOf(pick.mode, item));
    return {
      id: `${chapterId}-q${index + 1}`,
      prompt,
      options,
      answer: pick.answer,
      explain: [
        { ar: true, text: correct.ar },
        { text: ' se lit ' },
        { i: true, text: correct.tr },
        { text: ` et signifie « ${correct.fr} ».` },
      ],
      source: QUIZ_SOURCE,
    };
  });
}

function promptOf(mode: BookMode, item: BookPickItem): Run[] {
  if (mode === 'fr2ar') return runs(`Comment écrit-on « ${item.fr} » ?`);
  const lead = mode === 'ar2fr' ? 'Que signifie ' : 'Comment lit-on ';
  return [{ text: lead }, { ar: true, text: item.ar }, { text: ' ?' }];
}

function optionOf(mode: BookMode, item: BookPickItem): { runs: Run[]; arabic: boolean } {
  if (mode === 'fr2ar') return { arabic: true, runs: [{ ar: true, text: item.ar }] };
  if (mode === 'ar2tr') return { arabic: false, runs: [{ i: true, text: item.tr }] };
  return { arabic: false, runs: runs(item.fr) };
}

function revealBlock(title: string, prompt: string, lines: { show: Run[]; answer: Run[] }[]): Block {
  return { kind: 'reveal', title, prompt, lines };
}

function readLines(items: BookPickItem[]): { show: Run[]; answer: Run[] }[] {
  return items.map((item) => ({
    show: [{ ar: true, text: item.ar }, { text: ' →' }],
    answer: [{ ar: true, text: item.ar }, { text: ' = ' }, { i: true, text: item.tr }, { text: ` — ${item.fr}` }],
  }));
}

function writeLines(items: BookPickItem[]): { show: Run[]; answer: Run[] }[] {
  return items.map((item) => ({
    show: runs(`« ${item.fr} » →`),
    answer: [...runs(`« ${item.fr} » = `), { ar: true, text: item.ar }, { text: ' (' }, { i: true, text: item.tr }, { text: ')' }],
  }));
}

type Mind = { center: string; branches: MindBranch[] };

const CHAPTERS: {
  id: string;
  title: string;
  units: number[];
  letters: string[];
  objs: string[];
  mind: Mind;
}[] = [
  {
    id: 'ch1',
    title: 'L’alphabet (1) : de alif à zāy',
    units: [1, 2],
    letters: 'ا ب ت ث ج ح خ د ذ ر ز'.split(' '),
    objs: [
      'Reconnaître alif et la famille de bāʾ (ب ت ث) en comptant les points.',
      'Distinguer ج ح خ et repérer les lettres non liantes.',
      'Lire 11 premiers mots (père, porte, maison…).',
    ],
    mind: {
      center: 'Lettres\nalif → zāy',
      branches: [
        { title: 'Alif', lines: ['ا = ā long', 'support de voyelle'] },
        { title: 'Famille bāʾ', lines: ['ب 1 point dessous', 'ت 2 points · ث 3'] },
        { title: 'Famille jīm', lines: ['ج dj · ح h soufflé', 'خ kh (jota)'] },
        { title: 'Non liantes', lines: ['ا د ذ ر ز و', 'pas de lien à gauche'] },
        { title: 'd · dh · r · z', lines: ['د / ذ (1 point)', 'ر / ز (1 point)'] },
        { title: 'Mots', lines: ['بَيْت maison', 'خُبْز pain'] },
      ],
    },
  },
  {
    id: 'ch2',
    title: 'L’alphabet (2) : de sīn à yāʾ',
    units: [3, 4],
    letters: 'س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي'.split(' '),
    objs: [
      'Entendre les consonnes emphatiques ص ض ط ظ.',
      'Finir l’alphabet : 11 lettres de ʿayn à yāʾ.',
      'Lire 14 mots (soleil, ami, livre, étoile…).',
    ],
    mind: {
      center: 'Lettres\nsīn → yāʾ',
      branches: [
        { title: 'Sifflantes', lines: ['س s · ش ch'] },
        { title: 'Emphatiques', lines: ['ص ض ط ظ', 'assombrissent la voyelle'] },
        { title: 'Gorge', lines: ['ع ʿayn · غ gh', 'ق qāf (fond)'] },
        { title: 'Simples', lines: ['ف f · ك k · ل l', 'م m · ن n · ه h'] },
        { title: 'Semi-voyelles', lines: ['و w / ū', 'ي y / ī'] },
        { title: 'Mots', lines: ['شَمْس soleil', 'كِتَاب livre'] },
      ],
    },
  },
  {
    id: 'ch3',
    title: 'Les signes : tashkīl, tanwīn, shadda',
    units: [5, 6],
    letters: [],
    objs: [
      'Lire fatḥa, kasra, ḍamma et sukūn.',
      'Allonger (ā ī ū), doubler (shadda) et nunnater (tanwīn).',
      'Comprendre que le tashkīl change le sens : كَتَبَ ≠ كُتِبَ.',
    ],
    mind: {
      center: 'Tashkīl',
      branches: [
        { title: 'Voyelles brèves', lines: ['بَ ba · بِ bi · بُ bu'] },
        { title: 'Sukūn', lines: ['بْ pas de voyelle'] },
        { title: 'Voyelles longues', lines: ['بَا bā · بِي bī', 'بُو bū'] },
        { title: 'Tanwīn', lines: ['ـٌ un · ـً an · ـٍ in', 'marque l’indéfini'] },
        { title: 'Shadda', lines: ['ـّ consonne doublée', 'sukkar'] },
        { title: 'Sens', lines: ['كَتَبَ kataba', 'كُتِبَ kutiba'] },
      ],
    },
  },
  {
    id: 'ch4',
    title: 'Saluer et parler de sa famille',
    units: [7, 8],
    letters: [],
    objs: [
      'Saluer, répondre, remercier et prendre congé.',
      'Nommer les membres de la famille proche et élargie.',
      'Distinguer côté paternel (عَمّ) et maternel (خَال).',
    ],
    mind: {
      center: 'Salutations\n& famille',
      branches: [
        { title: 'Saluer', lines: ['السَّلَامُ عَلَيْكُمْ', 'مَرْحَبًا'] },
        { title: 'Matin / soir', lines: ['صَبَاحُ الخَيْرِ', 'مَسَاءُ الخَيْرِ'] },
        { title: 'Merci · au revoir', lines: ['شُكْرًا جَزِيلًا', 'مَعَ السَّلَامَةِ'] },
        { title: 'Proches', lines: ['أَخ · أُخْت', 'اِبْن · بِنْت'] },
        { title: 'Côté père', lines: ['جَدّ · عَمّ · عَمَّة'] },
        { title: 'Côté mère', lines: ['خَال · خَالَة'] },
      ],
    },
  },
  {
    id: 'ch5',
    title: 'Compter et dire « je suis… »',
    units: [9, 10],
    letters: [],
    objs: [
      'Compter de 1 à 10 et lire les chiffres arabes orientaux.',
      'Utiliser les pronoms personnels أَنَا، أَنْتَ، هُوَ…',
      'Construire une phrase nominale sans verbe « être ».',
    ],
    mind: {
      center: 'Nombres\n& phrases',
      branches: [
        { title: '1 → 5', lines: ['وَاحِد ١ … خَمْسَة ٥'] },
        { title: '6 → 10', lines: ['سِتَّة ٦ … عَشَرَة ١٠'] },
        { title: 'Chiffres', lines: ['écrits de gauche', 'à droite : ١٠ = 10'] },
        { title: 'Pronoms', lines: ['أَنَا je · نَحْنُ nous', 'هُوَ il · هِيَ elle'] },
        { title: 'Phrase nominale', lines: ['sujet défini +', 'attribut indéfini'] },
        { title: 'Exemple', lines: ['البَيْتُ كَبِيرٌ'] },
      ],
    },
  },
  {
    id: 'ch6',
    title: 'Lecture : proverbes, poésie et petits textes',
    units: [11],
    letters: [],
    objs: [
      'Lire des proverbes traditionnels et des vers classiques.',
      'Repérer l’assimilation de l’article (lettres solaires).',
      'Lire les 4 passages de la « Course du guide ».',
    ],
    mind: {
      center: 'Lecture',
      branches: [
        { title: 'Proverbes', lines: ['العِلْمُ نُورٌ', 'مَنْ جَدَّ وَجَدَ'] },
        { title: 'al-Mutanabbī', lines: ['الخَيْلُ وَاللَّيْلُ…'] },
        { title: 'Imruʾ al-Qays', lines: ['قِفَا نَبْكِ…'] },
        { title: 'Article al-', lines: ['aṣ-ṣabru (solaire)', 'al-qalamu (lunaire)'] },
        { title: 'Passages', lines: ['Mon livre · À la maison', 'Proverbes · Le vers'] },
        { title: 'Statut', lines: ['attributions', '« à valider »'] },
      ],
    },
  },
];

function chapterPart(spec: (typeof CHAPTERS)[number], index: number): BookPart {
  const n = index + 1;
  const words = ofKinds(spec.units, ['word', 'phrase']);
  const syll = ofKinds(spec.units, ['syllable']);
  const letters = dedupeAr(ofKinds(spec.units, ['letter']));
  const picks = BOOK_PICKS[spec.id];
  const sections: BookSection[] = [];
  const sid = (suffix: string) => `${spec.id}-${suffix}`;

  sections.push({
    id: spec.id,
    title: 'Ouverture',
    paper: false,
    blocks: [
      { kind: 'h', text: 'Objectifs du chapitre' },
      { kind: 'ul', items: spec.objs.map((obj) => runs(obj)) },
      { kind: 'mind', center: spec.mind.center, branches: spec.mind.branches },
      ...unitHeaders(spec.units),
      { kind: 'practice', unitIds: spec.units },
    ],
  });

  if (letters.length) {
    sections.push({
      id: sid('letters'),
      title: 'Les lettres',
      paper: false,
      blocks: [
        ...unitHeaders(spec.units),
        { kind: 'letters', ids: letters.map((item) => item.id) },
        ...letterTips(spec.units).map((tip) => ({ kind: 'tip' as const, tone: 'info' as const, label: 'Astuce', runs: runs(tip) })),
      ],
    });
    sections.push({
      id: sid('forms'),
      title: 'Les quatre formes',
      paper: false,
      blocks: [
        P(FORMS_NOTE),
        { kind: 'forms', letters: spec.letters },
        { kind: 'tip', tone: 'source', label: 'Pour aller plus loin', runs: runs(UNICODE_SHAPING) },
      ],
    });
    sections.push({
      id: sid('trace'),
      title: 'Atelier d’écriture',
      paper: true,
      blocks: [
        { kind: 'p', runs: [{ text: 'Modèle : ' }, { ar: true, text: spec.letters.slice(0, 9).join(' ') }] },
        P('Recopie chaque lettre trois fois dans le quadrillage, de droite à gauche. Puis écris-la sous ses quatre formes.'),
        PDF('Le quadrillage est dans le PDF, pour le stylet ou la reMarkable.'),
      ],
    });
  }

  if (spec.id === 'ch3') {
    const tips = spec.units.flatMap((id) => unitBy(id).lessons.flatMap((lesson) => (lesson.tip ? [lesson.tip.fr] : [])));
    sections.push({
      id: sid('marks'),
      title: 'Les signes du tashkīl',
      paper: false,
      blocks: [
        ...unitHeaders(spec.units),
        { kind: 'marks' },
        { kind: 'h', text: 'Où se place le signe ?' },
        ...tips.map((tip) => ({ kind: 'tip' as const, tone: 'info' as const, label: 'Astuce', runs: runs(tip) })),
      ],
    });
    sections.push({
      id: sid('pairs'),
      title: 'Voyelles longues et paires minimales',
      paper: false,
      blocks: [
        P('Syllabes de l’app : la voyelle longue = voyelle brève + lettre de prolongation.'),
        { kind: 'items', ids: syll.map((item) => item.id) },
        { kind: 'h', text: 'Le test des paires minimales' },
        P('Même squelette consonantique, signes différents : lis à voix haute, puis vérifie.'),
        { kind: 'pairs' },
        { kind: 'route', href: '/tashkil-test', label: 'Ouvrir le test de tashkīl dans l’app' },
      ],
    });
  }

  if (spec.id === 'ch5') {
    const numbers = ofKinds([9], ['word']);
    const note = unitBy(9).lessons.find((lesson) => lesson.tip)?.tip?.fr ?? '';
    sections.push({
      id: sid('num'),
      title: 'Les nombres de 1 à 10',
      paper: true,
      blocks: [
        ...unitHeaders([9]),
        { kind: 'digits', ids: numbers.map((item) => item.id) },
        { kind: 'tip', tone: 'warning', label: 'À valider', runs: runs(`Note de l’app : « ${note} »`) },
        { kind: 'tip', tone: 'source', label: 'Pour aller plus loin', runs: runs(UNICODE_BIDI) },
        { kind: 'h', text: 'À toi : écris les chiffres' },
        PDF('Le quadrillage pour écrire les chiffres est dans le PDF.'),
      ],
    });
  }

  if (words.length) {
    const showTips = letters.length === 0 && spec.id !== 'ch3';
    const blocks: Block[] = [];
    for (const group of wordGroups(spec.units)) {
      blocks.push({
        kind: 'items',
        title: group.lesson.title.fr,
        titleAr: group.lesson.title.ar,
        ids: group.items.map((item) => item.id),
        license: group.lesson.license,
      });
      if (showTips && group.lesson.tip) {
        const tone = group.lesson.tip.fr.includes('valider') ? 'warning' : 'info';
        const label = tone === 'warning' ? 'À valider' : 'Astuce';
        blocks.push({ kind: 'tip', tone, label, runs: runs(group.lesson.tip.fr) });
      }
    }
    if (spec.id === 'ch1') {
      blocks.push({
        kind: 'tip',
        tone: 'info',
        label: 'Astuce',
        runs: [
          { text: 'Exemple illustré : ' },
          { b: true, ar: true, text: 'بَيْت' },
          { text: ' (bayt, maison) = ' },
          { ar: true, text: 'ب' },
          { text: ' + ' },
          { ar: true, text: 'يْ' },
          { text: ' + ' },
          { ar: true, text: 'ت' },
          { text: '. Le ' },
          { ar: true, text: 'ب' },
          { text: ' se lie à gauche (forme initiale), le ' },
          { ar: true, text: 'ي' },
          { text: ' au milieu, le ' },
          { ar: true, text: 'ت' },
          { text: ' en finale.' },
        ],
      });
    }
    if (spec.id === 'ch6') {
      blocks.push({ kind: 'tip', tone: 'warning', label: 'Attention', runs: runs(EMPTY_SLOT_NOTE) });
    }
    sections.push({
      id: sid('words'),
      title: spec.id === 'ch6' ? 'Proverbes et vers' : 'Mots et phrases',
      paper: false,
      blocks,
    });
  }

  if (spec.id === 'ch5') {
    sections.push({
      id: sid('gram'),
      title: 'La phrase nominale en image',
      paper: true,
      blocks: [
        {
          kind: 'p',
          runs: [
            { text: 'Au présent, l’arabe n’utilise pas de verbe « être » : ' },
            { b: true, text: 'sujet défini + attribut indéfini' },
            { text: ' (conseil de l’app, unité 10).' },
          ],
        },
        { kind: 'nominal' },
        { kind: 'h', text: 'Écris trois phrases à toi' },
        P('Utilise un pronom (أَنَا، هُوَ، هِيَ) et un mot du vocabulaire.'),
        PDF('Les lignes pour écrire tes phrases sont dans le PDF.'),
      ],
    });
  }

  if (spec.id === 'ch6') {
    sections.push({
      id: sid('sun'),
      title: 'L’article al- : lettres solaires et lunaires',
      paper: false,
      blocks: [
        P('Conseil de l’app (unité 11) : « Remarquez l’assimilation : al + ṣ → aṣ-ṣabru (lettre solaire). » (description pédagogique « à valider » dans l’app).'),
        {
          kind: 'defs',
          rows: [
            { term: [{ ar: true, text: 'الصَّبْرُ' }], detail: runs('aṣ-ṣabru — solaire : le l disparaît, ṣ doublé') },
            { term: [{ ar: true, text: 'وَالسَّيْفُ' }], detail: runs('wa-s-sayfu — solaire') },
            { term: [{ ar: true, text: 'وَالرُّمْحُ' }], detail: runs('wa-r-rumḥu — solaire') },
            { term: [{ ar: true, text: 'الجَارُ قَبْلَ الدَّارِ' }], detail: runs('al-jāru qabla d-dār — ج lunaire · د solaire') },
            { term: [{ ar: true, text: 'وَالقَلَمُ' }], detail: runs('wa-l-qalamu — lunaire : le l se prononce') },
            { term: [{ ar: true, text: 'العِلْمُ' }], detail: runs('al-ʿilmu — lunaire') },
          ],
        },
        {
          kind: 'tip',
          tone: 'source',
          label: 'Pour aller plus loin',
          runs: [
            { text: 'Complément de l’ebook : les 14 lettres solaires sont ' },
            { ar: true, text: SUN_LETTERS },
            { text: ' ; les 14 autres sont lunaires (moyen mnémotechnique des lettres lunaires : ' },
            { ar: true, text: MOON_MNEMONIC },
            { text: '). Source : article « Sun and moon letters », Wikipédia (en), consulté le 10.11.2026.' },
          ],
        },
        { kind: 'h', text: 'Lire en course : les passages du guide' },
        { kind: 'passages', ids: ['p1', 'p2'], translit: false },
        { kind: 'route', href: '/pacer', label: 'Lancer la course du guide' },
      ],
    });
    sections.push({
      id: sid('pass'),
      title: 'Passages 3 et 4',
      paper: true,
      blocks: [
        { kind: 'passages', ids: ['p3', 'p4'], translit: true },
        { kind: 'h', text: 'Recopie un vers à la main' },
        PDF('Les lignes pour recopier un vers sont dans le PDF.'),
      ],
    });
  }

  const cardItems = [...words, ...syll].slice(0, 12);
  const cards = letters.length && cardItems.length < 12 ? [...letters.slice(0, 12 - cardItems.length), ...cardItems] : cardItems;
  sections.push({
    id: sid('cards'),
    title: 'Cartes mémo',
    paper: false,
    blocks: [
      P('Touche une carte pour la retourner. Le sens est aussi lu par le lecteur d’écran sans avoir à retourner la carte.'),
      { kind: 'cards', ids: cards.map((item) => item.id) },
    ],
  });
  sections.push({
    id: sid('ex'),
    title: 'Exercices',
    paper: false,
    blocks: [
      P('Dans l’app, touche une ligne pour révéler la réponse. Sur le PDF, la ligne est à remplir au stylet.'),
      revealBlock(`Chapitre ${n} — Lire et traduire`, 'Écris la translittération et le sens de chaque mot sur la ligne.', readLines(picks.read)),
      revealBlock(`Chapitre ${n} — Du français à l’arabe`, 'Écris le mot en arabe (avec ses signes si tu peux).', writeLines(picks.write)),
      { kind: 'open', partId: 'answers', label: 'Voir ces corrigés dans le livre' },
    ],
  });
  sections.push({
    id: sid('mmblank'),
    title: 'Complète la carte mentale',
    paper: true,
    blocks: [
      P('Recopie de mémoire au moins un exemple par branche, puis invente ta propre branche (en pointillés). Compare ensuite avec la carte du début du chapitre.'),
      { kind: 'goto', sectionId: spec.id, label: 'Carte du chapitre' },
      { kind: 'mind', center: spec.mind.center, branches: [...spec.mind.branches.map((branch) => ({ title: branch.title, lines: [] })), { title: 'Ta branche', lines: [] }], blank: true },
      PDF('La carte à compléter au stylet est dans le PDF.'),
    ],
  });
  sections.push({
    id: sid('sum'),
    title: 'L’essentiel',
    paper: true,
    blocks: [
      { kind: 'mind', center: spec.mind.center, branches: spec.mind.branches },
      P('Ma phrase-résumé : trois lignes sont prévues dans le PDF.'),
      PDF('Les lignes « Ma phrase-résumé » sont dans le PDF.'),
    ],
  });
  sections.push({
    id: sid('quiz'),
    title: 'Quiz éclair',
    paper: false,
    blocks: [{ kind: 'quiz', hint: QUIZ_HINT, questions: questionsFor(spec.id) }],
  });

  return {
    id: spec.id,
    group: 'chapitre',
    kicker: `Chapitre ${n}`,
    title: spec.title,
    blurb: spec.objs[0],
    unitIds: spec.units,
    sections,
  };
}

function frontMatter(): BookPart[] {
  return [
    {
      id: 'method',
      group: 'avant',
      kicker: 'Avant de lire',
      title: 'La méthode ArabGram',
      blurb: 'Lire l’arabe, lettre après lettre, avec le tashkīl.',
      unitIds: [],
      sections: [
        {
          id: 'howto',
          title: 'Mode d’emploi',
          paper: false,
          blocks: [
            { kind: 'h', text: 'Mode d’emploi de cet ebook' },
            P('Cet ebook est pensé pour une liseuse à stylet (reMarkable 2, reMarkable Paper Pro) et fonctionne aussi dans Apple Livres, Aperçu ou Acrobat.'),
            {
              kind: 'defs',
              rows: [
                { term: runs('Bouton'), detail: runs('Touche-le : c’est un lien interne (sommaire, chapitre, corrigé, retour).') },
                { term: runs('Réponse A'), detail: runs('Quiz : touche une réponse, une page te dit si c’est juste, puis « ← Revenir à la question ».') },
                { term: runs('Case à cocher'), detail: runs('À la main au stylet (aucun champ de formulaire : rien ne se perd).') },
                { term: runs('Lignes, quadrillage, pointillés'), detail: runs('Espace d’écriture : réponds, trace, complète les cartes mentales à la main.') },
              ],
            },
            {
              kind: 'tip',
              tone: 'info',
              label: 'Astuce',
              runs: runs('Sur reMarkable, touche les liens du doigt ; le plan du document (signets) mène aussi à chaque chapitre. Les encadrés portent un libellé et un motif (bord plein, pointillés, double trait, hachures) : ils restent lisibles en niveaux de gris.'),
            },
            P('Dans l’app, chaque chapitre est une suite d’écrans. Les quiz et les lignes d’exercice se corrigent au toucher. L’atelier d’écriture, le tableau de Leitner et les cartes à compléter s’ouvrent dans le PDF.'),
            { kind: 'goto', sectionId: 'method', label: 'La méthode ArabGram' },
            { kind: 'route', href: '/progress', label: 'Ma progression dans l’app' },
          ],
        },
        {
          id: 'method',
          title: 'La méthode',
          paper: false,
          blocks: [
            { kind: 'h', text: 'La méthode ArabGram' },
            {
              kind: 'p',
              runs: [
                { text: 'L’app enseigne à ' },
                { b: true, text: 'lire' },
                { text: ' l’arabe, lettre après lettre, avec le ' },
                { i: true, text: 'tashkīl' },
                { text: ' (voyelles brèves). Le parcours compte 11 unités et environ 25 leçons, regroupées ici en 6 chapitres.' },
              ],
            },
            {
              kind: 'defs',
              rows: [
                { term: runs('Exercices'), detail: runs('arabe → sens, sens → arabe, arabe → translittération ; les erreurs reviennent une fois en fin de série.') },
                { term: runs('Réussite'), detail: runs('une leçon est réussie à 60 % ; l’unité suivante s’ouvre quand toutes ses leçons sont réussies.') },
                { term: runs('Révisions (Leitner)'), detail: runs('5 boîtes, intervalles de 0, 1, 3, 7 et 16 jours.') },
                {
                  term: [{ text: 'Course du guide ' }, { ar: true, text: 'سباق المرشد' }],
                  detail: runs('le guide lit à allure fixe ; score = vitesse × précision ; +5 mots/min si ≥ 80 %, −5 sous 60 % ; mode sans chrono.'),
                },
                { term: runs('Test de tashkīl'), detail: runs('composeur lettre + signe, quiz de 10 paires minimales.') },
              ],
            },
            { kind: 'h', text: 'Les 5 boîtes de Leitner' },
            {
              kind: 'boxes',
              boxes: [
                { title: 'Boîte 1', sub: '0 jour' },
                { title: 'Boîte 2', sub: '1 jour' },
                { title: 'Boîte 3', sub: '3 jours' },
                { title: 'Boîte 4', sub: '7 jours' },
                { title: 'Boîte 5', sub: '16 jours' },
              ],
              note: 'bonne réponse → boîte suivante · erreur → boîte 1 (pointillés)',
            },
            { kind: 'goto', sectionId: 'leitner', label: 'Mon tableau de Leitner papier' },
            { kind: 'route', href: '/review', label: 'Réviser dans l’app' },
          ],
        },
        {
          id: 'leitner',
          title: 'Tableau de Leitner',
          paper: true,
          blocks: [
            { kind: 'h', text: 'Mon tableau de Leitner (papier)' },
            P('Écris chaque mot difficile, puis coche au stylet la boîte où il se trouve. Une bonne réponse : une case vers la droite. Une erreur : retour en boîte 1.'),
            {
              kind: 'defs',
              rows: [{ term: runs('Colonnes'), detail: runs('Mot (arabe) · Sens · B1 · B2 · B3 · B4 · B5 — douze lignes dans le PDF.') }],
            },
            PDF('Le tableau à cocher est dans le PDF. Dans l’app, les boîtes se mettent à jour toutes seules pendant les exercices.'),
          ],
        },
      ],
    },
  ];
}

function backMatter(chapters: BookPart[]): BookPart[] {
  const answerBlocks: Block[] = [{ kind: 'h', text: 'Corrigés des exercices' }, P('Les mêmes réponses que les exercices de chaque chapitre. Touche une ligne dans le chapitre pour les voir au fil de la lecture.')];
  for (const part of chapters) {
    for (const section of part.sections) {
      for (const block of section.blocks) {
        if (block.kind === 'reveal') {
          answerBlocks.push({ kind: 'h', text: block.title });
          answerBlocks.push({ kind: 'ul', items: block.lines.map((line) => line.answer) });
        }
        if (block.kind === 'quiz') {
          answerBlocks.push({ kind: 'h', text: `${part.kicker} — Quiz éclair` });
          block.questions.forEach((question, index) => {
            const choice = question.options[question.answer];
            answerBlocks.push({ kind: 'p', runs: [{ b: true, text: `${index + 1}. ` }, ...question.prompt] });
            answerBlocks.push({ kind: 'p', runs: [{ text: 'Bonne réponse : ' }, ...choice.runs, { text: '. ' }, ...question.explain] });
          });
        }
      }
    }
  }

  const glossary: Block[] = [
    { kind: 'h', text: 'Glossaire' },
    {
      kind: 'defs',
      rows: [
        { term: [{ text: 'Alif ' }, { ar: true, text: 'ا' }], detail: runs('Première lettre ; support de la voyelle longue « ā ».') },
        { term: [{ text: 'Tatweel ' }, { ar: true, text: 'ـ' }], detail: runs('Trait d’allongement utilisé pour montrer les formes initiale, médiane et finale.') },
        { term: runs('Lettres non liantes'), detail: runs('ا د ذ ر ز و : ne se lient jamais à la lettre suivante.') },
        { term: runs('Emphatiques'), detail: runs('ص ض ط ظ : consonnes qui « assombrissent » la voyelle voisine.') },
        { term: runs('Tashkīl / ḥarakāt'), detail: runs('Signes de vocalisation écrits au-dessus ou au-dessous des consonnes.') },
        ...MARKS.map((mark) => ({
          term: [...runs(`${mark.fr.split('—')[0].trim()} `), { ar: true, text: mark.name }],
          detail: runs(mark.fr),
        })),
        { term: runs('Voyelle longue (madd)'), detail: runs('Voyelle brève + alif, yāʾ ou wāw : bā, bī, bū.') },
        { term: runs('Lettre solaire'), detail: runs('Lettre devant laquelle le l de l’article al- s’assimile (aṣ-ṣabru).') },
        { term: runs('Phrase nominale'), detail: runs('Phrase sans verbe « être » au présent : sujet défini + attribut indéfini.') },
        { term: runs('Translittération'), detail: runs('Écriture de l’arabe en lettres latines (style DIN simplifié dans l’app).') },
        { term: runs('Leitner'), detail: runs('Méthode de révision par boîtes (5 boîtes : 0, 1, 3, 7 et 16 jours).') },
        { term: [{ text: 'Course du guide ' }, { ar: true, text: 'سباق المرشد' }], detail: runs('Jeu de lecture à allure fixe de l’app ; score = vitesse × précision.') },
      ],
    },
  ];

  return [
    {
      id: 'recap',
      group: 'fin',
      kicker: 'Fin',
      title: 'Carte mentale récapitulative',
      blurb: 'Touche un chapitre pour y retourner.',
      unitIds: [],
      sections: [
        {
          id: 'recap',
          title: 'Récapitulatif',
          paper: false,
          blocks: [
            { kind: 'h', text: 'Carte mentale récapitulative' },
            P('Touche un numéro de chapitre pour y retourner.'),
            {
              kind: 'mind',
              center: 'ArabGram',
              branches: [
                { title: 'Alphabet', lines: ['28 lettres', '4 formes · 6 non liantes'] },
                { title: 'Tashkīl', lines: ['fatḥa · kasra · ḍamma', 'sukūn · shadda · tanwīn'] },
                { title: 'Parler', lines: ['salutations', 'famille'] },
                { title: 'Compter', lines: ['1 → 10', 'chiffres ١٢٣'] },
                { title: 'Phrase', lines: ['pronoms', 'phrase nominale'] },
                { title: 'Lire', lines: ['proverbes · vers', 'passages du guide'] },
              ],
            },
            { kind: 'parts' },
          ],
        },
      ],
    },
    {
      id: 'glossary',
      group: 'fin',
      kicker: 'Fin',
      title: 'Glossaire',
      blurb: 'Les mots du livre, reliés aux signes de l’app.',
      unitIds: [],
      sections: [{ id: 'glossary', title: 'Glossaire', paper: false, blocks: glossary }],
    },
    {
      id: 'answers',
      group: 'fin',
      kicker: 'Fin',
      title: 'Corrigés',
      blurb: 'Exercices et quiz des six chapitres.',
      unitIds: [],
      sections: [{ id: 'answers', title: 'Corrigés', paper: false, blocks: answerBlocks }],
    },
    {
      id: 'app',
      group: 'fin',
      kicker: 'Fin',
      title: 'Continuer avec l’app',
      blurb: 'La course, les boîtes et la voix de l’appareil.',
      unitIds: [],
      sections: [
        {
          id: 'app',
          title: 'L’app',
          paper: false,
          blocks: [
            { kind: 'h', text: 'Continuer avec l’app ArabGram' },
            P('Écoute la prononciation, révise avec les boîtes de Leitner et fais la Course du guide dans l’app.'),
            {
              kind: 'ul',
              items: [
                runs('Parcours de 11 unités, ~25 leçons, interface français / العربية / English'),
                runs('Révisions espacées avec pastille « à revoir »'),
                runs('Test de tashkīl et composeur lettre + signe'),
                runs('Audio par la voix arabe de ton appareil · 100 % hors ligne, sans compte'),
              ],
            },
            P(PWA_URL),
            P('Application web installable (PWA) : ouvre le lien dans le navigateur de ton téléphone ou ordinateur, puis « Ajouter à l’écran d’accueil ». Elle fonctionne hors ligne, sans compte. Les versions App Store / Google Play ne sont pas encore publiées.'),
            P('Sur reMarkable, les liens web ne s’ouvrent pas toujours : le PDF du livre se partage depuis l’app, et le lien s’ouvre sur le téléphone.'),
            { kind: 'route', href: '/learn', label: 'Aller au parcours' },
            { kind: 'route', href: '/review', label: 'Révisions Leitner' },
            { kind: 'route', href: '/pacer', label: 'Course du guide' },
            { kind: 'route', href: '/tashkil-test', label: 'Test de tashkīl' },
          ],
        },
      ],
    },
    {
      id: 'credits',
      group: 'fin',
      kicker: 'Fin',
      title: 'Crédits et sources',
      blurb: 'Auteur, dépôt et sources citées, inchangés.',
      unitIds: [],
      sections: [
        {
          id: 'credits',
          title: 'Crédits',
          paper: false,
          blocks: [
            { kind: 'h', text: 'Crédits et sources' },
            { kind: 'p', runs: [{ b: true, text: 'Auteur : ' }, { text: 'Mohamed El Habib Ba (Vaud, Suisse) — conception de l’app ArabGram et de cet ebook.' }] },
            {
              kind: 'p',
              runs: [
                { b: true, text: 'Contenu : ' },
                { text: 'repris de l’app ArabGram, dépôt public GitHub ' },
                { i: true, text: 'mohamadalhabib92/arabgram' },
                { text: ', branche ' },
                { i: true, text: 'main (commit b699d3f)' },
                { text: ' (lu le 10.11.2026).' },
              ],
            },
            { kind: 'p', runs: [{ b: true, text: 'Hors du livre : ' }, { text: 'l’app propose aussi l’audio et un tuteur IA (phase 2, non actif) ; ils ne sont pas reproduits ici.' }] },
            { kind: 'h', text: 'Sources citées' },
            { kind: 'ol', items: CREDITS_SOURCES.map((source) => runs(source)) },
            P('Polices : Noto Sans, Noto Naskh Arabic, Source Serif 4 (SIL Open Font License 1.1). Mise en page : HTML/CSS et WeasyPrint. Diagrammes vectoriels générés pour cet ebook.'),
            P('© 2026 Mohamed El Habib Ba. Contenu pédagogique ; les mentions « à valider » de l’app sont conservées telles quelles.'),
            { kind: 'route', href: '/sources', label: 'Sources et licences dans l’app' },
          ],
        },
      ],
    },
  ];
}

let cached: BookPart[] | null = null;

export function bookParts(): BookPart[] {
  if (!cached) {
    const chapters = CHAPTERS.map(chapterPart);
    cached = [...frontMatter(), ...chapters, ...backMatter(chapters)];
  }
  return cached;
}

export function bookPart(id: string): BookPart | undefined {
  return bookParts().find((part) => part.id === id);
}

export function chapterForUnit(unitId: number): BookPart | undefined {
  return bookParts().find((part) => part.unitIds.includes(unitId));
}

export function resolveSection(part: BookPart, saved: string | undefined): string {
  if (saved && part.sections.some((section) => section.id === saved)) return saved;
  return part.sections[0]?.id ?? part.id;
}

/** Prochaine position, ou null si le chapitre ou la section n’existe pas. Les autres champs du livre sont conservés. */
export function nextBook(book: BookProgress, partId: string, sectionId: string): BookProgress | null {
  const part = bookPart(partId);
  if (!part || !part.sections.some((section) => section.id === sectionId)) return null;
  return { ...book, recent: partId, positions: { ...book.positions, [partId]: sectionId } };
}

export function referencedItemIds(part: BookPart): string[] {
  const ids: string[] = [];
  for (const section of part.sections) {
    for (const block of section.blocks) {
      if (block.kind === 'letters' || block.kind === 'items' || block.kind === 'cards' || block.kind === 'digits') ids.push(...block.ids);
    }
  }
  return ids;
}

export function collectText(part: BookPart): string {
  const out: string[] = [];
  const push = (list: Run[]) => out.push(runsToText(list));
  const walk = (block: Block) => {
    switch (block.kind) {
      case 'h':
      case 'pdf':
        out.push(block.kind === 'h' ? block.text : block.text);
        break;
      case 'p':
      case 'tip':
        push(block.runs);
        break;
      case 'ul':
      case 'ol':
        block.items.forEach(push);
        break;
      case 'defs':
        block.rows.forEach((row) => {
          push(row.term);
          push(row.detail);
        });
        break;
      case 'mind':
        out.push(block.center);
        block.branches.forEach((branch) => {
          out.push(branch.title);
          branch.lines.forEach((line) => out.push(line));
        });
        break;
      case 'reveal':
        out.push(block.title, block.prompt);
        block.lines.forEach((line) => {
          push(line.show);
          push(line.answer);
        });
        break;
      case 'quiz':
        out.push(block.hint);
        block.questions.forEach((question) => {
          push(question.prompt);
          question.options.forEach((option) => push(option.runs));
          push(question.explain);
        });
        break;
      case 'boxes':
        block.boxes.forEach((box) => out.push(box.title, box.sub));
        out.push(block.note);
        break;
      case 'goto':
      case 'route':
      case 'open':
        out.push(block.label);
        break;
      case 'forms':
        block.letters.forEach((letter) => out.push(letter));
        break;
      case 'passages':
        out.push(...block.ids);
        break;
      default:
        break;
    }
  };
  for (const section of part.sections) {
    out.push(section.title);
    section.blocks.forEach(walk);
  }
  return out.join('\n');
}

/** Repères utilisés par les écrans : passages et signes restent ceux de l’app. */
export const bookPassages = PASSAGES;
export const bookMarks = MARKS;
export const bookPairs = PHONETIC_TEST;
export const bookForms = letterForms;
