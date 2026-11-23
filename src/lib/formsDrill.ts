import { letterForms } from '@/data/curriculum';

/** Quatre places d’une lettre. Les non liantes (formes confondues) sont écartées. */
export const FORM_POSITIONS = ['isolated', 'initial', 'medial', 'final'] as const;
export type FormPosition = (typeof FORM_POSITIONS)[number];

export type FormQuestion = { letter: string; glyph: string; answer: FormPosition };

export function distinctLetter(letter: string): boolean {
  const forms = letterForms(letter);
  const glyphs = FORM_POSITIONS.map((pos) => forms[pos]);
  return new Set(glyphs).size === FORM_POSITIONS.length;
}

/** Une question par lettre liante, position qui tourne. Aucun texte de leçon n’est ajouté. */
export function buildFormDrill(letters: string[], count = 6): FormQuestion[] {
  const unique: string[] = [];
  for (const letter of letters) {
    const bare = letter.trim();
    if (!bare || unique.includes(bare) || !distinctLetter(bare)) continue;
    unique.push(bare);
  }
  return unique.slice(0, count).map((letter, index) => {
    const answer = FORM_POSITIONS[index % FORM_POSITIONS.length];
    return { letter, glyph: letterForms(letter)[answer], answer };
  });
}
