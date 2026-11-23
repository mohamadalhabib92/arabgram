/**
 * Un passage arabe reste de droite à gauche, même dans une interface latine.
 * L’isolat U+2067…U+2069 empêche le latin voisin de réordonner les lettres.
 */
export function isolateArabic(text: string): string {
  if (!text || text.includes('\u2067')) return text;
  return `\u2067${text}\u2069`;
}

/** Dernier style appliqué : un `textAlign: 'left'` du parent ne renverse pas l’arabe. */
export function arabicRunStyle(center?: boolean): { writingDirection: 'rtl'; textAlign: 'right' | 'center' } {
  return { writingDirection: 'rtl', textAlign: center ? 'center' : 'right' };
}
