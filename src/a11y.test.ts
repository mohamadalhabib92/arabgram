import { equal } from 'node:assert/strict';
import { test } from 'node:test';
import { kitPairs, type Pair } from '@/kit/a11yPairs';
import { bestInk, contrast, ensureContrast, mix, TOAST } from '@/kit/contrast';
import { createVibrationPref } from '@/kit/vibrations';
import { makePalette, UNIT_COLORS, UNIT_COLORS_DARK } from '@/theme';

/** Contraste AA, clair ET sombre, contraste normal ET élevé. */
const variants = [
  ['clair', false, false],
  ['sombre', true, false],
  ['clair contraste élevé', false, true],
  ['sombre contraste élevé', true, true],
] as const;

test('contraste AA de tous les composants, en clair et en sombre', () => {
  const failures: string[] = [];
  for (const [name, dark, hc] of variants) {
    const p = makePalette({ dark, contrast: hc, scale: 1 });
    const pairs: Pair[] = kitPairs(p, name, {
      buttons: [
        ['principal', p.primaryText, p.primary],
        ['danger', p.onDanger, p.danger],
        ['succès', p.onSuccess, p.success],
      ],
      ghostInk: p.primary,
      chipInk: (c) => ensureContrast(ensureContrast(c, mix(c, p.surface, 0.16), p.text), mix(c, p.bg, 0.16), p.text),
      badgeInk: (c) => ensureContrast(c, mix(c, p.surface, 0.15), p.text),
      badgeColors: [
        ['succès', p.success],
        ['alerte', p.warning],
        ['principal', p.primary],
      ],
      toast: dark ? TOAST.dark : TOAST.light,
      fieldError: p.danger,
      emptyInk: p.primary,
    });
    pairs.push([`${name} · texte sur accent`, p.onAccent, p.accent, 4.5]);
    const units = dark ? UNIT_COLORS_DARK : UNIT_COLORS;
    units.forEach((u, i) => pairs.push([`${name} · unité ${i + 1} / surface`, u, p.surface, 4.5]));
    for (const [label, fg, bg, min] of pairs) {
      const r = contrast(fg, bg);
      if (r < min) failures.push(`${label} : ${r.toFixed(2)} < ${min}`);
    }
  }
  equal(failures.length, 0, 'Contraste insuffisant :\n' + failures.join('\n'));
});

test('mix : couleur pleine équivalente au voile (repli « Réduire la transparence »)', () => {
  equal(mix('#000000', '#FFFFFF', 0.5), '#808080');
  equal(mix('#0E6B5C', '#FFFFFF', 0), '#FFFFFF');
  equal(mix('#0E6B5C', '#FFFFFF', 1), '#0E6B5C');
  equal(bestInk('#000000'), '#FFFFFF');
});

test('Vibrations : activées par défaut, clé dédiée, aucune autre clé touchée', async () => {
  const mem = new Map<string, string>([['arabgram@v1', '{"xp":1}']]);
  const writes: string[] = [];
  const storage = {
    getItem: async (k: string) => mem.get(k) ?? null,
    setItem: async (k: string, v: string) => {
      writes.push(k);
      mem.set(k, v);
    },
  };
  const pref = createVibrationPref(storage, 'arabgram:vibrations@v1');
  await pref.hydrate();
  equal(pref.get(), true);
  pref.set(false);
  equal(pref.get(), false);
  await new Promise((r) => setTimeout(r, 0));
  equal(mem.get('arabgram:vibrations@v1'), 'off');
  equal(mem.get('arabgram@v1'), '{"xp":1}');
  equal(writes.every((k) => k === 'arabgram:vibrations@v1'), true);
  const again = createVibrationPref(storage, 'arabgram:vibrations@v1');
  await again.hydrate();
  equal(again.get(), false);
  const broken = createVibrationPref({ getItem: async () => Promise.reject(new Error('x')), setItem: async () => {} }, 'k');
  await broken.hydrate();
  equal(broken.get(), true);
});
