import React from 'react';
import { Banner } from '@/kit/ui';
import { useI18n } from '@/lib/i18n';
import { store } from '@/state';

/**
 * Fichier local refusé : on dit pourquoi, et que rien n’a été écrasé.
 * Le libellé arabe est nouveau et n’a pas été relu par un relecteur.
 */
export function RecoveryBanner() {
  const rec = store.useRecovery();
  const { pick } = useI18n();
  if (rec.status !== 'quarantine') return null;
  const why = rec.detail ? `${rec.reason ?? ''} · ${rec.detail}` : (rec.reason ?? '');
  return (
    <Banner
      kind="warning"
      title={pick({ fr: 'Fichier local conservé', ar: 'المَلَفُّ المَحَلِّيُّ مَحْفُوظ', en: 'Local file kept' })}
      text={pick({
        fr: `La progression enregistrée n’a pas été chargée (${why}). Elle n’a pas été écrasée ni réinitialisée. Exportez-la depuis Réglages avant toute suppression : l’export contient les octets d’origine.`,
        ar: 'لَمْ يُحَمَّلِ المَلَفُّ وَلَمْ يُسْتَبْدَلْ وَلَمْ يُمْسَحْ. صَدِّرْهُ مِنَ الإِعْدَادَاتِ قَبْلَ أَيِّ حَذْفٍ.',
        en: `Saved progress was not loaded (${why}). It was not overwritten or reset. Export it from Settings before any deletion: the export contains the original bytes.`,
      })}
    />
  );
}
