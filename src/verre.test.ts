import { equal, ok } from 'node:assert/strict';
import { test } from 'node:test';
import { contrast, mix } from '@/kit/contrast';
import { GLASS, SPACE, TYPE_SCALE, buttonChrome, glassAlpha, glassSolid } from '@/kit/verre';
import { UNIT_COLORS, UNIT_COLORS_DARK, makePalette } from '@/theme';

test('jetons : espacement croissant, typographie lisible', () => {
  equal(SPACE.xxs, 4);
  equal(SPACE.md, 16);
  ok(SPACE.xs < SPACE.sm && SPACE.sm < SPACE.md && SPACE.md < SPACE.lg);
  ok(TYPE_SCALE.caption < TYPE_SCALE.body && TYPE_SCALE.body < TYPE_SCALE.h1 && TYPE_SCALE.h1 < TYPE_SCALE.display);
  ok(glassAlpha(true, true) > glassAlpha(true, false));
});

test('verre : texte, muet et encres d’unité restent AA, y compris sur le lavis', () => {
  const failures: string[] = [];
  for (const dark of [false, true]) {
    for (const tv of [false, true]) {
      for (const hc of [false, true]) {
        const p = makePalette({ dark, contrast: hc, scale: 1 });
        const units = dark ? UNIT_COLORS_DARK : UNIT_COLORS;
        const wash = dark ? GLASS.washDark : GLASS.washLight;
        const behind = mix(p.primary, p.bg, wash);
        const behindAccent = mix(p.accent, p.bg, wash);
        for (const [name, back] of [
          ['fond', p.bg],
          ['lavis', behind],
          ['lavis accent', behindAccent],
        ] as const) {
          const solid = glassSolid({ dark, bg: p.bg, surface: p.surface, reduceTransparency: false, tv, behind: back });
          const pairs: [string, number][] = [
            [`${name} texte`, contrast(p.text, solid)],
            [`${name} muet`, contrast(p.textMuted, solid)],
            [`${name} unité`, Math.min(...units.map((u) => contrast(u, solid)))],
          ];
          for (const [label, ratio] of pairs) {
            if (ratio < 4.5) failures.push(`${dark ? 'sombre' : 'clair'}${hc ? ' HC' : ''} tv=${tv} ${label} ${ratio.toFixed(2)}`);
          }
        }
        equal(glassSolid({ dark, bg: p.bg, surface: p.surface, reduceTransparency: true, tv }), p.surface);
      }
    }
  }
  equal(failures.length, 0, failures.join('\n'));
});

test('bouton : relief visible, enfoncement, texte inchangé sur la face', () => {
  for (const [face, ink, dark] of [
    ['#0E6B5C', '#FFFFFF', false],
    ['#3FB59E', '#06231D', true],
    ['#B42318', '#FFFFFF', false],
    ['#F2726A', '#06231D', true],
  ] as const) {
    const up = buttonChrome({ face, pressed: false, dark });
    const down = buttonChrome({ face, pressed: true, dark });
    ok(up.borderBottomWidth > down.borderBottomWidth, face);
    ok(down.transform[0].translateY > up.transform[0].translateY, face);
    ok(contrast(up.borderBottomColor, '#FFFFFF') > contrast(face, '#FFFFFF'), `lèvre plus sombre ${face}`);
    ok(contrast(up.borderTopColor, '#000000') > contrast(face, '#000000'), `arête plus claire ${face}`);
    ok(contrast(ink, face) >= 4.5, `encre sur la face ${face}`);
    ok(up.boxShadow.includes('inset'), face);
    const flat = buttonChrome({ face, pressed: false, dark, flat: true });
    equal(flat.backgroundColor, 'transparent');
    equal(flat.transform[0].translateY, 0);
  }
});
