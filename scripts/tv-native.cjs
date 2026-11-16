/**
 * Modules retirés du lien natif Apple TV. Inerte tant que EXPO_TV n’est pas 1.
 * expo-speech et expo-sharing n’ont pas de pod tvOS fiable ici : le salon n’en a pas besoin.
 */
const TV_AUTOLINK_EXCLUDE = ['expo-speech', 'expo-sharing'];

/** Les xcframework Maven sont le cœur iOS upstream, pas le fork tvOS. */
const TV_RN_CORE_FROM_SOURCE = '0';

module.exports = { TV_AUTOLINK_EXCLUDE, TV_RN_CORE_FROM_SOURCE };
