import React, { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { alpha, useTheme } from '@/kit/theme';
import { Banner, Button, Card, EmptyState, Row, Screen, T } from '@/kit/ui';
import { AR, AudioButton, BackHeader, LicenseTag, Translit } from '@/components/common';
import { LESSON_BY_ID, UNITS, letterForms, playable } from '@/data/curriculum';
import { GRAMMAR_BY_ID, lessonByAnyId } from '@/data/grammar';
import { chapterForUnit } from '@/data/book';
import { LICENSES } from '@/data/licenses';
import { useI18n } from '@/lib/i18n';
import { store, unitUnlocked } from '@/state';

export default function LessonScreen() {
  const p = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lang, t, pick } = useI18n();
  const s = store.use();
  const gloss = s.settings.gloss;
  const lesson = lessonByAnyId(String(id)) ?? LESSON_BY_ID[String(id)];
  if (!lesson)
    return (
      <Screen header={<BackHeader title={t('lesson')} />}>
        <EmptyState icon="help-circle-outline" title={pick({ fr: 'Leçon introuvable', ar: 'الدَّرْسُ غَيْرُ مَوْجُودٍ', en: 'Lesson not found' })} action={<Button title={t('learn')} onPress={() => router.replace('/learn')} />} />
      </Screen>
    );
  const unit = lesson.unitId ? UNITS.find((u) => u.id === lesson.unitId) : undefined;
  const open = unit ? unitUnlocked(s, unit.id) : true;
  const lic = LICENSES[lesson.license];
  const grammar = GRAMMAR_BY_ID[lesson.id];
  const [openExercise, setOpenExercise] = useState<number | null>(null);

  if (!playable(lesson))
    return (
      <Screen header={<BackHeader title={lesson.title[gloss]} subtitle={unit ? `${t('unit')} ${unit.id}` : pick({ fr: 'Grammaire', ar: 'قَوَاعِد', en: 'Grammar' })} />}>
        <Banner kind="warning" icon="alert-circle" title={lic.short[lang]} text={lic.detail[gloss]} />
        <Card>
          <T v="h3">{pick({ fr: 'Comment remplir cet emplacement', ar: 'كَيْفَ تَمْلَأُ هٰذَا المَكَانَ', en: 'How to fill this slot' })}</T>
          <T v="body" muted>
            {pick({
              fr: '1. Utilisez des textes que vous possédez, du domaine public ou sous licence ouverte (ex. CC BY / CC BY-SA).\n2. Ajoutez-les dans src/data/curriculum.ts (leçon u11l3) avec leur licence.\n3. Les métadonnées s’affichent alors automatiquement ici et dans « Sources & licences ».',
              en: '1. Use texts you own, public-domain or open-licensed (e.g. CC BY / CC BY-SA).\n2. Add them to src/data/curriculum.ts (lesson u11l3) with their licence.\n3. Metadata then shows here and in “Sources & licences”.',
            })}
          </T>
        </Card>
        <Button title={t('sources')} kind="secondary" icon="document-text-outline" onPress={() => router.push('/sources')} />
      </Screen>
    );

  return (
    <Screen
      header={<BackHeader title={lang === 'ar' ? lesson.title.ar : lesson.title[gloss]} subtitle={unit ? `${t('unit')} ${unit.id} · ${lang === 'ar' ? unit.ar : unit[gloss]}` : pick({ fr: 'Séance de 5 minutes', ar: 'خَمْسُ دَقَائِق', en: 'A 5-minute session' })} />}
      footer={
        <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: p.border, backgroundColor: p.surface }}>
          <View style={{ width: '100%', maxWidth: 820, alignSelf: 'center' }}>
            <Button
              title={pick({ fr: 'Commencer l’exercice', ar: 'اِبْدَأِ التَّمْرِينَ', en: 'Start exercise' })}
              icon="play"
              disabled={!open}
              onPress={() => router.push({ pathname: '/drill', params: { lesson: lesson.id } })}
              full
            />
          </View>
        </View>
      }
    >
      <LicenseTag id={lesson.license} />
      {grammar ? <T v="label" muted>{pick({ fr: 'Explication', ar: 'شَرْح', en: 'Explanation' })}</T> : null}
      {lesson.tip ? <Banner kind="info" icon="bulb-outline" text={lesson.tip[gloss]} /> : null}
      {unit && chapterForUnit(unit.id) ? (
        <Button
          kind="secondary"
          icon="library-outline"
          title={pick({ fr: 'Ce chapitre dans le livre', ar: 'هٰذَا الفَصْلُ فِي الكِتَاب', en: 'This chapter in the book' })}
          onPress={() => router.push({ pathname: '/ebook/[id]', params: { id: chapterForUnit(unit.id)!.id } })}
        />
      ) : null}
      {!open ? <Banner kind="warning" icon="lock-closed" text={pick({ fr: 'Unité verrouillée : lecture possible, exercice après l’unité précédente.', ar: 'الوَحْدَةُ مُقْفَلَةٌ', en: 'Locked unit: you can read, exercise after the previous unit.' })} /> : null}
      {grammar ? (
        <View style={{ gap: 8 }}>
          <T v="label" muted>{pick({ fr: 'Exercices de la séance', ar: 'تَمَارِين', en: 'Session exercises' })}</T>
          {grammar.exercises.map((exercise, index) => {
            const labels = { identify: 'Identifier', irab: 'iʿrāb', transform: 'Transformer', fill: 'Compléter' };
            const shown = openExercise === index;
            return (
              <Card key={exercise.kind} onPress={() => setOpenExercise(shown ? null : index)} a11y={`${labels[exercise.kind]}. ${exercise.prompt}`}>
                <T v="caption" color={p.primary}>{labels[exercise.kind]}</T>
                <T v="body">{exercise.prompt}</T>
                <AR size={24}>{exercise.ar}</AR>
                {shown ? (/[\u0600-\u06FF]/.test(exercise.answer) ? <AR size={24}>{exercise.answer}</AR> : <T v="body">{exercise.answer}</T>) : <T v="small" muted>{pick({ fr: 'Toucher pour la réponse', ar: 'اِلْمَسْ لِلجَوَاب', en: 'Tap for the answer' })}</T>}
              </Card>
            );
          })}
        </View>
      ) : null}
      {lesson.items.map((it) => {
        const forms = it.kind === 'letter' ? letterForms(it.ar) : null;
        return (
          <Card key={it.id}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <AudioButton text={it.ar} />
              <View style={{ flex: 1 }}>
                <AR size={it.kind === 'letter' ? 44 : it.kind === 'phrase' ? 26 : 32} weight="600">{it.ar}</AR>
              </View>
            </Row>
            <Translit>{it.tr}</Translit>
            <T v="body">{it[gloss]}</T>
            {forms ? (
              <Row gap={8} wrap style={{ justifyContent: 'flex-end' }}>
                {([
                  ['isolated', pick({ fr: 'isolée', ar: 'مُنْفَصِلَة', en: 'isolated' })],
                  ['initial', pick({ fr: 'début', ar: 'أَوَّل', en: 'initial' })],
                  ['medial', pick({ fr: 'milieu', ar: 'وَسَط', en: 'medial' })],
                  ['final', pick({ fr: 'fin', ar: 'آخِر', en: 'final' })],
                ] as const).map(([k, label]) => (
                  <View key={k} style={{ alignItems: 'center', minWidth: 58, paddingVertical: 4, borderRadius: 10, backgroundColor: alpha(p.primary, 0.06) }}>
                    <AR size={24} center>{forms[k]}</AR>
                    <T v="caption" muted>{label}</T>
                  </View>
                ))}
              </Row>
            ) : null}
          </Card>
        );
      })}
    </Screen>
  );
}
