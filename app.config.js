// baseUrl n'est utile que pour la PWA (GitHub Pages). Sur les builds natifs EAS,
// il préfixe les assets par "arabgram/", ce qui entre en collision avec
// l'exécutable "ArabGram" (système de fichiers insensible à la casse).
//
// Apple TV : seulement si EXPO_TV=1 (profil production-tv). Sans cette variable,
// le bundle, le buildNumber iPhone et les plugins restent ceux d'app.json.
const PHONE_BUILD = '1';
const TV_BUILD = '2';

module.exports = ({ config }) => {
  if (process.env.EXPO_TV === '1') return withAppleTv(config);
  if (process.env.EAS_BUILD && config.experiments) {
    const { baseUrl, ...rest } = config.experiments;
    config.experiments = rest;
  }
  config.extra = {
    ...(config.extra ?? {}),
    featureTutor: process.env.FEATURE_TUTOR === 'true',
    featureAccount: process.env.FEATURE_ACCOUNT === 'true',
  };
  return config;
};

function withAppleTv(config) {
  if (process.env.EAS_BUILD && config.experiments) {
    const { baseUrl, ...rest } = config.experiments;
    config.experiments = rest;
  }
  const keep = new Set(['expo-router', 'expo-font']);
  const plugins = (config.plugins || []).filter((plugin) => keep.has(Array.isArray(plugin) ? plugin[0] : plugin));
  plugins.push([
    '@react-native-tvos/config-tv',
    {
      isTV: true,
      tvosDeploymentTarget: '16.4',
      appleTVImages: {
        iconSmallLayers: { front: './assets/tv/icon-home-front.png', back: './assets/tv/icon-home-back.png' },
        iconSmall2xLayers: { front: './assets/tv/icon-home-front@2x.png', back: './assets/tv/icon-home-back@2x.png' },
        iconLayers: { front: './assets/tv/icon-store-front.png', back: './assets/tv/icon-store-back.png' },
        topShelf: './assets/tv/top-shelf.png',
        topShelf2x: './assets/tv/top-shelf@2x.png',
        topShelfWide: './assets/tv/top-shelf-wide.png',
        topShelfWide2x: './assets/tv/top-shelf-wide@2x.png',
      },
    },
  ]);
  plugins.push('./plugins/with-tv-pods.js');
  config.plugins = plugins;
  config.orientation = 'landscape';
  config.slug = 'arabgram-tv';
  config.owner = config.owner || 'habib548';
  config.ios = config.ios || {};
  config.ios.bundleIdentifier = 'ch.mohamadba.arabgram';
  config.ios.buildNumber = TV_BUILD;
  if (!config.ios.appleTeamId) config.ios.appleTeamId = 'Y9XF9RY2BU';
  config.ios.entitlements = {};
  const info = { ...(config.ios.infoPlist || {}) };
  delete info.NSCameraUsageDescription;
  delete info.NSMicrophoneUsageDescription;
  delete info.NSPhotoLibraryUsageDescription;
  config.ios.infoPlist = info;
  config.extra = {
    ...(config.extra || {}),
    featureTutor: false,
    featureAccount: false,
  };
  const tvProject = process.env.ARABGRAM_TV_EAS_PROJECT_ID || '';
  if (tvProject && !tvProject.startsWith('SET_')) {
    config.extra.eas = { ...(config.extra.eas || {}), projectId: tvProject };
  }
  if (process.env.EAS_BUILD === 'true' && (!tvProject || tvProject.startsWith('SET_'))) {
    throw new Error('Apple TV : créez le projet Expo arabgram-tv et posez son projectId dans ARABGRAM_TV_EAS_PROJECT_ID. Ne réutilisez pas le projet iPhone, sinon le compteur de build distant écrase le CFBundleVersion 2.');
  }
  if (config.ios.buildNumber !== TV_BUILD) throw new Error('TV build number');
  if (PHONE_BUILD !== '1') throw new Error('phone build drifted');
  return config;
}
