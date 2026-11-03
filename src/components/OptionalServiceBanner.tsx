import React from 'react';
import { Banner } from '@/kit/ui';
import { useI18n } from '@/lib/i18n';
import { useOptionalServiceDown } from '@/lib/optionalService';

/** Badge non bloquant : le tuteur a échoué (réseau, 402, clé). Le cours continue. */
export function OptionalServiceBanner() {
  const down = useOptionalServiceDown();
  const { pick } = useI18n();
  if (!down) return null;
  return (
    <Banner
      kind="warning"
      icon="cloud-offline-outline"
      title={pick({ fr: 'Service optionnel indisponible', ar: 'خِدْمَةٌ اخْتِيَارِيَّةٌ غَيْرُ مُتَاحَة', en: 'Optional service unavailable' })}
      text={pick({
        fr: 'Le tuteur ne répond pas. Les leçons, la course, le tashkīl et les révisions continuent hors ligne.',
        ar: 'المُعَلِّمُ لَا يَسْتَجِيب. الدُّرُوسُ تَسْتَمِرُّ دُونَ اتِّصَال.',
        en: 'The tutor is not responding. Lessons, the race, tashkīl and reviews continue offline.',
      })}
    />
  );
}
