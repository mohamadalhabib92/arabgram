/** Tailles de lecture à dix pieds. Pas d’achat, pas de clavier. */
export const TV_BUNDLE_ID = 'ch.mohamadba.arabgram';
export const TV_BUILD = '2';
export const TV_ARABIC_MIN = 42;

export function tvArabicSize(text: string): { fontSize: number; lineHeight: number } {
  const n = [...(text ?? '')].length;
  const fontSize = n <= 12 ? 72 : n <= 28 ? 56 : n <= 48 ? 46 : TV_ARABIC_MIN;
  return { fontSize: Math.max(TV_ARABIC_MIN, fontSize), lineHeight: Math.round(Math.max(TV_ARABIC_MIN, fontSize) * 1.85) };
}

/** Trois choix stables : la bonne réponse et deux autres de la même leçon, sans hasard. */
export function tvChoices(correct: string, pool: string[]): string[] {
  const others = pool.filter((item) => item !== correct);
  const picked = others.slice(0, 2);
  while (picked.length < 2) picked.push('—');
  return [correct, ...picked].slice(0, 3).sort((a, b) => a.localeCompare(b));
}
