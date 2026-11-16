import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { patchPackageForTv, shouldSwapReactNativeOnEas } from './tv-build.mjs';

const require = createRequire(import.meta.url);
const configure = require('../app.config.js');
const app = require('../app.json').expo;
const { TVOS_DEPLOYMENT_TARGET, patchPodfileSource } = require('../plugins/with-tv-pods.js');
const { patchExpoRouterPodspecSource } = require('./tv-native-patch.cjs');

const phone = configure({ config: structuredClone(app) });
assert.equal(phone.ios.bundleIdentifier, 'ch.mohamadba.arabgram');
assert.equal(phone.ios.buildNumber, '1');
assert.equal(phone.ios.supportsTablet, true);
assert.equal(phone.ios.requireFullScreen, false);
assert.deepEqual(phone.ios.infoPlist.UIRequiredDeviceCapabilities, ['arm64']);
assert.equal(phone.ios.infoPlist.UIRequiresFullScreen, undefined);
assert.equal(phone.ios.infoPlist.UIApplicationSupportsIndirectInputEvents, true);
assert.equal(phone.ios.infoPlist['UISupportedInterfaceOrientations~ipad'].includes('UIInterfaceOrientationLandscapeLeft'), true);
assert.equal(phone.slug, 'arabgram');
assert.equal(phone.extra.eas.projectId, '037c54e2-c83d-4af1-b217-f9a653925abc');
const phoneNames = phone.plugins.map((plugin) => (Array.isArray(plugin) ? plugin[0] : plugin));
assert.equal(phoneNames.includes('@react-native-tvos/config-tv'), false);
assert.equal(phoneNames.includes('./plugins/with-tv-pods.js'), false);

process.env.EXPO_TV = '1';
process.env.ARABGRAM_TV_EAS_PROJECT_ID = '11111111-2222-4333-8444-555555555555';
const tv = configure({ config: structuredClone(app) });
delete process.env.EXPO_TV;
delete process.env.ARABGRAM_TV_EAS_PROJECT_ID;
const phoneAgain = configure({ config: structuredClone(app) });
assert.equal(phoneAgain.ios.buildNumber, '1');
assert.equal(phoneAgain.slug, 'arabgram');
assert.equal(tv.ios.buildNumber, '2');
assert.equal(tv.ios.bundleIdentifier, 'ch.mohamadba.arabgram');
assert.equal(tv.slug, 'arabgram-tv');
assert.equal(tv.orientation, 'landscape');
assert.equal(tv.extra.eas.projectId, '11111111-2222-4333-8444-555555555555');
assert.notEqual(tv.extra.eas.projectId, phone.extra.eas.projectId);
const tvPlugin = tv.plugins.find((plugin) => Array.isArray(plugin) && plugin[0] === '@react-native-tvos/config-tv');
assert.equal(tvPlugin[1].tvosDeploymentTarget, '16.4');
assert.equal(tvPlugin[1].isTV, true);
assert.equal(tvPlugin[1].appleTVImages.iconLayers.front, './assets/tv/icon-store-front.png');
assert.equal(tvPlugin[1].appleTVImages.iconSmallLayers.back, './assets/tv/icon-home-back.png');
assert.equal(tvPlugin[1].appleTVImages.topShelf, './assets/tv/top-shelf.png');
assert.equal(tvPlugin[1].appleTVImages.topShelfWide, './assets/tv/top-shelf-wide.png');
assert.equal(tvPlugin[1].appleTVImages.topShelfWide2x, './assets/tv/top-shelf-wide@2x.png');
assert.equal(TVOS_DEPLOYMENT_TARGET, '16.4');

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.equal(pkg.dependencies['react-native'], '0.88.0');
assert.equal(pkg.devDependencies['@react-native-tvos/config-tv'], '^0.1.7');
const patched = patchPackageForTv(pkg);
assert.equal(pkg.dependencies['react-native'], '0.88.0');
assert.equal(patched.dependencies['react-native'], 'npm:react-native-tvos@0.87-stable');
assert.equal(shouldSwapReactNativeOnEas({ EXPO_TV: '1', EAS_BUILD: '' }), false);
assert.equal(shouldSwapReactNativeOnEas({ EXPO_TV: '1', EAS_BUILD: 'true' }), true);

const pod = patchExpoRouterPodspecSource("s.platforms      = {\n    :ios => '16.4'\n  }\n  s.exclude_files = 'Tests/**/*'\n");
assert.match(pod, /:tvos => '16.4'/);
assert.match(pod, /LinkPreview\/\*\*\/\*/);
assert.match(pod, /Toolbar\/\*\*\/\*/);
const podfile = patchPodfileSource("platform :ios, '16.4'\nuse_expo_modules!\npost_install do |installer|\nend\n");
assert.match(podfile, /platform :tvos, '16.4'/);
assert.match(podfile, /RCT_USE_PREBUILT_RNCORE'\] = '0'/);
assert.match(podfile, /expo-speech/);
assert.match(podfile, /TVOS_DEPLOYMENT_TARGET'\] = '16.4'/);

for (const name of ['icon-home-front.png', 'icon-home-back.png', 'icon-home-front@2x.png', 'icon-store-front.png', 'icon-store-back.png', 'top-shelf.png', 'top-shelf-wide.png', 'top-shelf@2x.png', 'top-shelf-wide@2x.png']) {
  const bytes = readFileSync(new URL(`../assets/tv/${name}`, import.meta.url));
  assert.ok(bytes.length > 500, name);
}

console.log('test-tv: ok');
