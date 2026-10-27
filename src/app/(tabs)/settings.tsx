import React, { useState } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { Banner, Button, Card, Header, ListItem, Row, Screen, Section, Segmented, Sheet, T, ToggleRow, useToast } from '@/kit/ui';
import { AR, useArabicVoice } from '@/components/common';
import { exportText } from '@/kit/files';
import { useI18n } from '@/lib/i18n';
import { DEFAULT_SETTINGS, setSettings, store, type Gloss, type Settings as S, type UiLang } from '@/state';

export default function SettingsTab() {
  const p = useTheme();
  const { t, pick } = useI18n();
  const toast = useToast();
  const st = store.useSelect((s) => s.settings);
  const voice = useArabicVoice();
  const [confirm, setConfirm] = useState(false);
  const scaleOpts = [
    { key: '0.9', label: 'A−' },
    { key: '1', label: 'A' },
    { key: '1.15', label: 'A+' },
    { key: '1.3', label: 'A++' },
  ];
  const arOpts = [
    { key: '1', label: '١×' },
    { key: '1.2', label: '١٫٢×' },
    { key: '1.4', label: '١٫٤×' },
    { key: '1.7', label: '١٫٧×' },
  ];
  const near = (v: number, opts: { key: string }[]) => opts.reduce((b, o) => (Math.abs(+o.key - v) < Math.abs(+b - v) ? o.key : b), opts[0].key);

  return (
    <Screen header={<Header title={t('settings')} />}>
      <Section title={pick({ fr: 'Langue', ar: 'اللُّغَة', en: 'Language' })}>
        <Card>
          <T v="label" muted>{pick({ fr: 'Interface', ar: 'الوَاجِهَة', en: 'Interface' })}</T>
          <Segmented<UiLang>
            options={[
              { key: 'fr', label: 'Français' },
              { key: 'ar', label: 'العربية' },
              { key: 'en', label: 'English' },
            ]}
            value={st.lang}
            onChange={(lang) => setSettings({ lang })}
          />
          <T v="label" muted>{pick({ fr: 'Traductions des mots', ar: 'لُغَةُ التَّرْجَمَة', en: 'Word translations' })}</T>
          <Segmented<Gloss>
            options={[
              { key: 'fr', label: 'Français' },
              { key: 'en', label: 'English' },
            ]}
            value={st.gloss}
            onChange={(gloss) => setSettings({ gloss })}
          />
        </Card>
      </Section>

      <Section title={pick({ fr: 'Affichage et accessibilité', ar: 'العَرْضُ وَالإِتَاحَة', en: 'Display & accessibility' })}>
        <Card>
          <T v="label" muted>{pick({ fr: 'Thème', ar: 'المَظْهَر', en: 'Theme' })}</T>
          <Segmented<S['theme']>
            options={[
              { key: 'system', label: pick({ fr: 'Système', ar: 'النِّظَام', en: 'System' }) },
              { key: 'light', label: pick({ fr: 'Clair', ar: 'فَاتِح', en: 'Light' }) },
              { key: 'dark', label: pick({ fr: 'Sombre', ar: 'دَاكِن', en: 'Dark' }) },
            ]}
            value={st.theme}
            onChange={(theme) => setSettings({ theme })}
          />
          <ToggleRow label={pick({ fr: 'Contraste élevé', ar: 'تَبَايُنٌ عَالٍ', en: 'High contrast' })} value={st.contrast} onChange={(contrast) => setSettings({ contrast })} />
          <T v="label" muted>{pick({ fr: 'Taille du texte', ar: 'حَجْمُ النَّصّ', en: 'Text size' })}</T>
          <Segmented options={scaleOpts} value={near(st.textScale, scaleOpts)} onChange={(k) => setSettings({ textScale: +k })} />
          <T v="label" muted>{pick({ fr: 'Taille de l’arabe', ar: 'حَجْمُ الخَطِّ العَرَبِيّ', en: 'Arabic size' })}</T>
          <Segmented options={arOpts} value={near(st.arScale, arOpts)} onChange={(k) => setSettings({ arScale: +k })} />
          <AR size={26} center>بِسْمِ اللّٰهِ — السَّلَامُ عَلَيْكُمْ</AR>
          <ToggleRow label={pick({ fr: 'Afficher la translittération', ar: 'إِظْهَارُ النَّقْحَرَة', en: 'Show transliteration' })} value={st.showTranslit} onChange={(showTranslit) => setSettings({ showTranslit })} />
          <ToggleRow label={pick({ fr: 'Réduire les animations', ar: 'تَقْلِيلُ الحَرَكَة', en: 'Reduce motion' })} value={st.reduceMotion} onChange={(reduceMotion) => setSettings({ reduceMotion })} />
          <ToggleRow label={pick({ fr: 'Course sans chrono', ar: 'سِبَاقٌ دُونَ تَوْقِيت', en: 'Untimed race' })} sub={pick({ fr: 'Pas de limite de temps par mot.', ar: 'بِلَا حَدٍّ زَمَنِيّ', en: 'No time limit per word.' })} value={st.untimedPacer} onChange={(untimedPacer) => setSettings({ untimedPacer })} />
        </Card>
      </Section>

      <Section title={pick({ fr: 'Audio', ar: 'الصَّوْت', en: 'Audio' })}>
        <Card>
          <ToggleRow
            label={pick({ fr: 'Prononciation (voix de l’appareil)', ar: 'النُّطْقُ (صَوْتُ الجِهَاز)', en: 'Pronunciation (device voice)' })}
            sub={
              voice === null
                ? pick({ fr: 'Recherche d’une voix arabe…', ar: 'جَارٍ البَحْث…', en: 'Looking for an Arabic voice…' })
                : voice
                  ? pick({ fr: 'Voix arabe disponible sur cet appareil.', ar: 'الصَّوْتُ العَرَبِيُّ مُتَاح', en: 'Arabic voice available on this device.' })
                  : pick({ fr: 'Aucune voix arabe détectée : installez-en une dans les réglages système (synthèse vocale).', ar: 'لَا يُوجَدُ صَوْتٌ عَرَبِيّ', en: 'No Arabic voice detected: install one in system text-to-speech settings.' })
            }
            value={st.audio}
            onChange={(audio) => setSettings({ audio })}
          />
          <T v="caption" muted>{pick({ fr: 'Synthèse locale via expo-speech : aucun service payant, aucune donnée envoyée par l’app.', ar: 'تَوْلِيدٌ مَحَلِّيّ', en: 'Local synthesis via expo-speech: no paid service, no data sent by the app.' })}</T>
        </Card>
      </Section>

      <Section title={pick({ fr: 'Apprentissage', ar: 'التَّعَلُّم', en: 'Learning' })}>
        <Card>
          <T v="label" muted>{pick({ fr: 'Objectif quotidien', ar: 'الهَدَفُ اليَوْمِيّ', en: 'Daily goal' })}</T>
          <Segmented
            options={[
              { key: '30', label: '30 XP' },
              { key: '50', label: '50 XP' },
              { key: '80', label: '80 XP' },
              { key: '120', label: '120 XP' },
            ]}
            value={String(st.dailyGoal)}
            onChange={(k) => setSettings({ dailyGoal: +k })}
          />
          <ToggleRow label={pick({ fr: 'Débloquer toutes les unités', ar: 'فَتْحُ كُلِّ الوَحَدَات', en: 'Unlock all units' })} sub={pick({ fr: 'Pour les apprenants avancés ou les enseignants.', ar: 'لِلْمُتَقَدِّمِين', en: 'For advanced learners or teachers.' })} value={st.unlockAll} onChange={(unlockAll) => setSettings({ unlockAll })} />
        </Card>
      </Section>

      <Section title={pick({ fr: 'Plus', ar: 'المَزِيد', en: 'More' })}>
        <Card>
          <ListItem icon="text-outline" title={pick({ fr: 'Test de tashkīl et rendu', ar: 'اِخْتِبَارُ التَّشْكِيل', en: 'Tashkīl & rendering test' })} onPress={() => router.push('/tashkil-test')} />
          <ListItem icon="library-outline" title={pick({ fr: 'Sources et licences', ar: 'المَصَادِرُ وَالتَّرَاخِيص', en: 'Sources & licences' })} onPress={() => router.push('/sources')} />
          <ListItem icon="sparkles-outline" iconColor={p.accent} title={pick({ fr: 'Tuteur IA (phase 2) et configuration', ar: 'المُعَلِّمُ الذَّكِيّ (المَرْحَلَةُ ٢)', en: 'AI tutor (phase 2) & configuration' })} onPress={() => router.push('/tutor')} />
          <ListItem
            icon="download-outline"
            title={pick({ fr: 'Exporter ma progression (JSON)', ar: 'تَصْدِيرُ التَّقَدُّم', en: 'Export my progress (JSON)' })}
            onPress={async () => {
              await exportText('arabgram-progression.json', JSON.stringify(store.get(), null, 2), 'application/json');
              toast(pick({ fr: 'Export prêt', ar: 'تَمَّ التَّصْدِير', en: 'Export ready' }), 'success');
            }}
          />
        </Card>
      </Section>

      <Button title={pick({ fr: 'Réinitialiser la progression', ar: 'إِعَادَةُ ضَبْطِ التَّقَدُّم', en: 'Reset progress' })} kind="danger" icon="trash-outline" onPress={() => setConfirm(true)} />
      <T v="caption" muted center>ArabGram · {Platform.OS} · {pick({ fr: 'données locales uniquement', ar: 'بَيَانَاتٌ مَحَلِّيَّة', en: 'local data only' })}</T>

      <Sheet visible={confirm} onClose={() => setConfirm(false)} title={pick({ fr: 'Tout effacer ?', ar: 'حَذْفُ الكُلّ؟', en: 'Erase everything?' })}>
        <Banner kind="warning" text={pick({ fr: 'XP, série, boîtes de révision et historique de course seront supprimés de cet appareil. Vos réglages de langue sont conservés.', ar: 'سَيُحْذَفُ كُلُّ التَّقَدُّم', en: 'XP, streak, review boxes and race history will be deleted from this device. Language settings are kept.' })} />
        <Row>
          <Button title={pick({ fr: 'Annuler', ar: 'إِلْغَاء', en: 'Cancel' })} kind="secondary" onPress={() => setConfirm(false)} style={{ flex: 1 }} />
          <Button
            title={pick({ fr: 'Effacer', ar: 'اِحْذِفْ', en: 'Erase' })}
            kind="danger"
            style={{ flex: 1 }}
            onPress={async () => {
              const keep = store.get().settings;
              await store.reset();
              store.set((s) => ({ ...s, onboarded: true, settings: { ...DEFAULT_SETTINGS, lang: keep.lang, gloss: keep.gloss, theme: keep.theme } }));
              setConfirm(false);
              toast(pick({ fr: 'Progression réinitialisée', ar: 'تَمَّتْ إِعَادَةُ الضَّبْط', en: 'Progress reset' }), 'success');
            }}
          />
        </Row>
      </Sheet>
    </Screen>
  );
}
