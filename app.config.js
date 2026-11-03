// baseUrl n'est utile que pour la PWA (GitHub Pages). Sur les builds natifs EAS,
// il préfixe les assets par "arabgram/", ce qui entre en collision avec
// l'exécutable "ArabGram" (système de fichiers insensible à la casse).
module.exports = ({ config }) => {
  // baseUrl reste /arabgram sur le web. Il n'est retiré que pour un build EAS natif.
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
