import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { alpha, useTheme } from '@/kit/theme';
import { Banner, Button, Ionicons, Row, Screen, T } from '@/kit/ui';
import { AR } from '@/components/common';
import { useI18n } from '@/lib/i18n';
import { finishOnboarding, setSettings, type UiLang } from '@/state';

function Choice({ title, sub, selected, onPress, icon }: { title: string; sub?: string; selected: boolean; onPress: () => void; icon?: React.ComponentProps<typeof Ionicons>['name'] }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={title}
      onPress={onPress}
      style={{
        minHeight: 56,
        padding: 14,
        borderRadius: t.radius,
        borderWidth: 2,
        borderColor: selected ? t.primary : t.border,
        backgroundColor: selected ? alpha(t.primary, 0.08) : t.surface,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {icon ? <Ionicons name={icon} size={22} color={selected ? t.primary : t.textMuted} /> : null}
      <View style={{ flex: 1 }}>
        <T v="h3">{title}</T>
        {sub ? <T v="small" muted>{sub}</T> : null}
      </View>
      <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={selected ? t.primary : t.textMuted} />
    </Pressable>
  );
}

export default function Onboarding() {
  const t = useTheme();
  const { lang, pick } = useI18n();
  const [step, setStep] = useState(0);
  const [start, setStart] = useState(1);
  const [goal, setGoal] = useState(50);

  const setLang = (l: UiLang) => setSettings({ lang: l, gloss: l === 'en' ? 'en' : 'fr' });

  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: 4, marginTop: 24 }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: t.primary, alignItems: 'center', justifyContent: 'center' }}>
          <AR size={40} center color={t.primaryText} weight="700">ع</AR>
        </View>
        <AR size={34} center weight="700">أَهْلًا وَسَهْلًا</AR>
        <T v="h2" center>ArabGram</T>
        <T v="body" muted center>
          {pick({ fr: 'Apprendre à lire l’arabe, lettre après lettre, avec le tashkīl.', ar: 'تَعَلَّمْ قِرَاءَةَ العَرَبِيَّةِ حَرْفًا حَرْفًا مَعَ التَّشْكِيلِ', en: 'Learn to read Arabic, letter by letter, with full vowel marks.' })}
        </T>
      </View>

      <Row gap={6} style={{ justifyContent: 'center' }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i <= step ? t.primary : t.border }} />
        ))}
      </Row>

      {step === 0 && (
        <View style={{ gap: 10 }}>
          <T v="h3">{pick({ fr: 'Langue de l’interface', ar: 'لُغَةُ الوَاجِهَةِ', en: 'Interface language' })}</T>
          <Choice title="العَرَبِيَّة" sub="Arabic-first · من اليمين إلى اليسار" selected={lang === 'ar'} onPress={() => setLang('ar')} icon="language" />
          <Choice title="Français" sub="Traductions en français" selected={lang === 'fr'} onPress={() => setLang('fr')} icon="language" />
          <Choice title="English" sub="Translations in English" selected={lang === 'en'} onPress={() => setLang('en')} icon="language" />
          <Button title={pick({ fr: 'Continuer', ar: 'تَابِعْ', en: 'Continue' })} onPress={() => setStep(1)} full />
        </View>
      )}

      {step === 1 && (
        <View style={{ gap: 10 }}>
          <T v="h3">{pick({ fr: 'Votre niveau', ar: 'مُسْتَوَاكَ', en: 'Your level' })}</T>
          <Choice icon="leaf-outline" title={pick({ fr: 'Je débute', ar: 'مُبْتَدِئ', en: 'Beginner' })} sub={pick({ fr: 'Commencer par l’alphabet (unité 1)', ar: 'اِبْدَأْ بِالحُرُوفِ', en: 'Start with the alphabet (unit 1)' })} selected={start === 1} onPress={() => setStart(1)} />
          <Choice icon="text-outline" title={pick({ fr: 'Je connais les lettres', ar: 'أَعْرِفُ الحُرُوفَ', en: 'I know the letters' })} sub={pick({ fr: 'Ouvrir jusqu’au tashkīl (unité 5)', ar: 'اِفْتَحْ حَتَّى الحَرَكَاتِ', en: 'Unlock up to vowel marks (unit 5)' })} selected={start === 5} onPress={() => setStart(5)} />
          <Choice icon="book-outline" title={pick({ fr: 'Je lis avec le tashkīl', ar: 'أَقْرَأُ بِالتَّشْكِيلِ', en: 'I read with vowel marks' })} sub={pick({ fr: 'Ouvrir jusqu’au vocabulaire (unité 7)', ar: 'اِفْتَحْ حَتَّى المُفْرَدَاتِ', en: 'Unlock up to vocabulary (unit 7)' })} selected={start === 7} onPress={() => setStart(7)} />
          <Row>
            <Button title={pick({ fr: 'Retour', ar: 'رُجُوع', en: 'Back' })} kind="secondary" onPress={() => setStep(0)} style={{ flex: 1 }} />
            <Button title={pick({ fr: 'Continuer', ar: 'تَابِعْ', en: 'Continue' })} onPress={() => setStep(2)} style={{ flex: 2 }} />
          </Row>
        </View>
      )}

      {step === 2 && (
        <View style={{ gap: 10 }}>
          <T v="h3">{pick({ fr: 'Objectif quotidien', ar: 'هَدَفُكَ اليَوْمِيّ', en: 'Daily goal' })}</T>
          {[
            { xp: 30, fr: 'Détente — 30 XP (~5 min)', ar: 'خَفِيف — ٣٠', en: 'Casual — 30 XP (~5 min)' },
            { xp: 50, fr: 'Régulier — 50 XP (~10 min)', ar: 'مُنْتَظِم — ٥٠', en: 'Regular — 50 XP (~10 min)' },
            { xp: 80, fr: 'Intensif — 80 XP (~15 min)', ar: 'مُكَثَّف — ٨٠', en: 'Intense — 80 XP (~15 min)' },
          ].map((g) => (
            <Choice key={g.xp} icon="flag-outline" title={pick(g)} selected={goal === g.xp} onPress={() => setGoal(g.xp)} />
          ))}
          <Banner
            kind="info"
            icon="cloud-offline-outline"
            text={pick({
              fr: 'Tout fonctionne hors ligne, sans compte et sans API payante. Votre progression reste sur cet appareil.',
              ar: 'يَعْمَلُ كُلُّ شَيْءٍ دُونَ اتِّصَالٍ وَدُونَ حِسَابٍ. يَبْقَى تَقَدُّمُكَ عَلَى هٰذَا الجِهَازِ.',
              en: 'Everything works offline, with no account and no paid API. Your progress stays on this device.',
            })}
          />
          <Row>
            <Button title={pick({ fr: 'Retour', ar: 'رُجُوع', en: 'Back' })} kind="secondary" onPress={() => setStep(1)} style={{ flex: 1 }} />
            <Button
              title={pick({ fr: 'Commencer', ar: 'اِبْدَأْ', en: 'Start' })}
              icon="play"
              onPress={() => {
                finishOnboarding({ lang, startUnit: start, dailyGoal: goal });
                router.replace('/learn');
              }}
              style={{ flex: 2 }}
            />
          </Row>
        </View>
      )}
    </Screen>
  );
}
