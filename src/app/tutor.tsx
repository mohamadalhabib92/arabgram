import React from 'react';
import { useTheme } from '@/kit/theme';
import { Badge, Banner, Card, Row, Screen, Section, T } from '@/kit/ui';
import { BackHeader } from '@/components/common';
import { maskValue, isConfigured } from '@/kit/config';
import { CONFIG, tutorReady } from '@/config';
import { useI18n } from '@/lib/i18n';

export default function Tutor() {
  const p = useTheme();
  const { pick } = useI18n();
  const ready = tutorReady();
  return (
    <Screen header={<BackHeader title={pick({ fr: 'Tuteur IA — phase 2', ar: 'المُعَلِّمُ الذَّكِيّ — المَرْحَلَةُ ٢', en: 'AI tutor — phase 2' })} />}>
      <Banner
        kind="warning"
        icon="sparkles-outline"
        title={pick({ fr: 'Non activé', ar: 'غَيْرُ مُفَعَّل', en: 'Not active' })}
        text={pick({
          fr: 'L’IA n’est pas active dans cette version. Le cœur d’ArabGram (leçons, révisions, course, tashkīl, audio) fonctionne entièrement hors ligne et n’appelle jamais OpenAI ni aucun service payant.',
          ar: 'الذَّكَاءُ الاِصْطِنَاعِيُّ غَيْرُ مُفَعَّلٍ. التَّطْبِيقُ يَعْمَلُ دُونَ اتِّصَال.',
          en: 'AI is not active in this version. ArabGram’s core (lessons, reviews, race, tashkīl, audio) runs fully offline and never calls OpenAI or any paid service.',
        })}
      />
      <Section title={pick({ fr: 'Architecture prévue', ar: 'البِنْيَةُ المُقْتَرَحَة', en: 'Planned architecture' })}>
        <Card>
          <T v="small">{pick({ fr: '1. Vous déployez votre propre petit serveur (ex. Node) qui détient la clé OpenAI dans ses variables d’environnement.', ar: '١. خَادِمٌ خَاصٌّ بِكَ يَحْفَظُ المِفْتَاح', en: '1. You deploy your own small server (e.g. Node) holding the OpenAI key in its environment.' })}</T>
          <T v="small">{pick({ fr: '2. L’app n’envoie que la question de l’apprenant à EXPO_PUBLIC_TUTOR_API_URL — jamais de clé.', ar: '٢. التَّطْبِيقُ يُرْسِلُ السُّؤَالَ فَقَطْ', en: '2. The app only sends the learner’s question to EXPO_PUBLIC_TUTOR_API_URL — never a key.' })}</T>
          <T v="small">{pick({ fr: '3. Le tuteur reste optionnel : sans lui, rien ne change.', ar: '٣. المُعَلِّمُ اخْتِيَارِيّ', en: '3. The tutor stays optional: without it, nothing changes.' })}</T>
        </Card>
      </Section>
      <Section title={pick({ fr: 'Configuration', ar: 'الإِعْدَادَات', en: 'Configuration' })}>
        {CONFIG.map((e) => (
          <Card key={e.name}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T v="label" selectable style={{ flex: 1 }}>{e.name}</T>
              <Badge label={isConfigured(e.value) ? pick({ fr: 'Configuré', ar: 'مُهَيَّأ', en: 'Set' }) : pick({ fr: 'À fournir', ar: 'مَطْلُوب', en: 'Required' })} color={isConfigured(e.value) ? p.success : p.warning} />
            </Row>
            <T v="small" muted selectable>{maskValue(e)}</T>
            {e.note ? <T v="caption" muted>{e.phase} · {e.note}</T> : null}
          </Card>
        ))}
        <T v="caption" muted>{ready ? pick({ fr: 'URL de serveur détectée — l’intégration reste à brancher en phase 2.', ar: 'تَمَّ رَصْدُ الخَادِم', en: 'Server URL detected — integration still to be wired in phase 2.' }) : pick({ fr: 'Aucun serveur configuré (normal pour la version hors ligne).', ar: 'لَا خَادِم', en: 'No server configured (expected for the offline version).' })}</T>
      </Section>
    </Screen>
  );
}
