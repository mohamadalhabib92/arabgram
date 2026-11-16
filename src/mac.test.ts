import { featureAvailable, shellMetrics } from '@/lib/shellMetrics';
import { activateKeyTarget, bindKeyTarget, focusSearch, hasSearch, moveKeyTarget, registerSearch, resetKeyTargets } from '@/lib/keys';
import { test } from 'node:test';

function equal(actual: unknown, expected: unknown) {
  if (actual !== expected) throw new Error(`${String(actual)} !== ${String(expected)}`);
}

function ok(value: unknown) {
  if (!value) throw new Error('assertion');
}

test('l’iPhone, même large en paysage, garde la colonne téléphone', () => {
  const phone = shellMetrics({ width: 956, pad: false, mac: false, tv: false, web: false });
  equal(phone.wide, false);
  equal(phone.sidebar, false);
  equal(phone.contentMax, 820);
  equal(phone.typeBoost, 1);
  equal(phone.keyboard, false);
});

test('iPad étroit reste une colonne, iPad large ouvre la barre latérale', () => {
  const portrait = shellMetrics({ width: 768, pad: true, mac: false, tv: false, web: false });
  equal(portrait.wide, false);
  equal(portrait.contentMax, 820);
  const landscape = shellMetrics({ width: 1024, pad: true, mac: false, tv: false, web: false });
  equal(landscape.wide, true);
  equal(landscape.sidebar, true);
  equal(landscape.contentMax, 1080);
  equal(landscape.typeBoost, 1);
  equal(landscape.keyboard, false);
});

test('le Mac élargit la typo et le clavier, et une petite fenêtre redevient une colonne', () => {
  const wide = shellMetrics({ width: 1280, pad: true, mac: true, tv: false, web: false });
  equal(wide.wide, true);
  equal(wide.contentMax, 1080);
  equal(wide.typeBoost, 1.12);
  equal(wide.keyboard, true);
  const small = shellMetrics({ width: 700, pad: true, mac: true, tv: false, web: false });
  equal(small.wide, false);
  equal(small.contentMax, 820);
  equal(small.keyboard, true);
  equal(small.typeBoost, 1.12);
});

test('la télé ne prend pas la mise en page Mac', () => {
  const tv = shellMetrics({ width: 1920, pad: false, mac: false, tv: true, web: false });
  equal(tv.wide, false);
  equal(tv.keyboard, false);
});

test('haptics, caméra et notifications sont coupés sur Mac ; la voix et le partage restent', () => {
  equal(featureAvailable('haptics', { mac: true, tv: false }), false);
  equal(featureAvailable('camera', { mac: true, tv: false }), false);
  equal(featureAvailable('notifications', { mac: true, tv: false }), false);
  equal(featureAvailable('speech', { mac: true, tv: false }), true);
  equal(featureAvailable('share', { mac: true, tv: false }), true);
  equal(featureAvailable('speech', { mac: false, tv: false }), true);
  equal(featureAvailable('haptics', { mac: false, tv: true }), false);
});

test('Tab, flèches, Entrée et Cmd+F restent dans le registre clavier', () => {
  resetKeyTargets();
  const hits: string[] = [];
  const stopA = bindKeyTarget(() => hits.push('a'), () => {});
  bindKeyTarget(() => hits.push('b'), () => {});
  moveKeyTarget(1);
  activateKeyTarget();
  moveKeyTarget(1);
  activateKeyTarget();
  equal(hits.join(','), 'a,b');
  let focused = false;
  const stopSearch = registerSearch(() => {
    focused = true;
  });
  ok(hasSearch());
  focusSearch();
  equal(focused, true);
  stopSearch();
  stopA();
  resetKeyTargets();
});
