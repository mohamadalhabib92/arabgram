import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { alpha, useTheme } from '@/kit/theme';
import { Banner, Button, Card, EmptyState, IconButton, Ionicons, Progress, Row, Screen, Stat, T } from '@/kit/ui';
import { AR, AudioButton, LicenseTag, Translit } from '@/components/common';
import { LESSON_BY_ID } from '@/data/curriculum';
import { buildDrill, makeQuestion, type Question } from '@/lib/drill';
import { useI18n } from '@/lib/i18n';
import { PASS, addXp, dueItems, gradeItem, recordLesson, store } from '@/state';

type Phase = 'ask' | 'feedback' | 'done';

export default function Drill() {
  const p = useTheme();
  const params = useLocalSearchParams<{ lesson?: string; mode?: string }>();
  const { lang, t, pick } = useI18n();
  const gloss = store.useSelect((s) => s.settings.gloss);
  const showTr = store.useSelect((s) => s.settings.showTranslit);
  const lesson = params.lesson ? LESSON_BY_ID[String(params.lesson)] : undefined;
  const review = params.mode === 'review';

  // La file est figée au montage : les notes Leitner ne la modifient pas en cours de route.
  const initialQueue = useMemo<Question[]>(() => {
    if (lesson) return buildDrill(lesson.items, gloss, 12);
    if (review) return buildDrill(dueItems(store.get()), gloss, 12);
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [queue, setQueue] = useState<Question[]>(initialQueue);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('ask');
  const [firstOk, setFirstOk] = useState(0);
  const [xp, setXp] = useState(0);
  const total = initialQueue.length;

  if (!total)
    return (
      <Screen>
        <EmptyState
          icon={review ? 'checkmark-done-circle-outline' : 'help-circle-outline'}
          title={review ? pick({ fr: 'Rien à réviser', ar: 'لَا شَيْءَ لِلْمُرَاجَعَةِ', en: 'Nothing to review' }) : pick({ fr: 'Exercice indisponible', ar: 'التَّمْرِينُ غَيْرُ مُتَاحٍ', en: 'Exercise unavailable' })}
          text={review ? pick({ fr: 'Revenez plus tard ou faites une nouvelle leçon.', ar: 'عُدْ لَاحِقًا', en: 'Come back later or do a new lesson.' }) : undefined}
          action={<Button title={t('learn')} onPress={() => router.replace('/learn')} />}
        />
      </Screen>
    );

  const q = queue[idx];

  const choose = (opt: string) => {
    if (phase !== 'ask') return;
    const ok = opt === q.answer;
    setPicked(opt);
    setPhase('feedback');
    if (!q.retry) {
      gradeItem(q.item.id, ok);
      if (ok) setFirstOk((n) => n + 1);
    }
    if (ok) setXp((n) => n + (q.retry ? 5 : 10));
    else if (!q.retry) setQueue((prev) => [...prev, { ...makeQuestion(q.item, gloss, prev.length + 1, q.kind), retry: true }]);
  };

  const next = () => {
    if (idx + 1 < queue.length) {
      setIdx(idx + 1);
      setPicked(null);
      setPhase('ask');
      return;
    }
    const acc = firstOk / total;
    let gained = xp;
    if (lesson) {
      recordLesson(lesson.id, acc);
      if (acc >= PASS) gained += 10;
    }
    addXp(gained);
    setXp(gained);
    setPhase('done');
  };

  if (phase === 'done') {
    const acc = firstOk / total;
    const passed = acc >= PASS;
    return (
      <Screen>
        <View style={{ alignItems: 'center', gap: 6, marginTop: 24 }}>
          <Ionicons name={passed ? 'trophy' : 'refresh-circle'} size={64} color={passed ? p.accent : p.warning} />
          <AR size={30} center weight="700">{passed ? 'أَحْسَنْتَ!' : 'حَاوِلْ مَرَّةً أُخْرَى'}</AR>
          <T v="h2" center>
            {passed ? pick({ fr: 'Leçon réussie', ar: 'نَجَحْتَ', en: 'Lesson passed' }) : pick({ fr: 'Encore un essai ?', ar: 'مَرَّةً أُخْرَى؟', en: 'One more try?' })}
          </T>
        </View>
        <Row>
          <Stat label={t('accuracy')} value={`${Math.round(acc * 100)} %`} color={passed ? p.success : p.warning} />
          <Stat label="XP" value={`+${xp}`} color={p.primary} />
        </Row>
        <Banner kind="info" icon="albums-outline" text={pick({ fr: 'Chaque réponse a mis à jour vos boîtes Leitner : les erreurs reviennent dès aujourd’hui, les réussites plus tard.', ar: 'الأَخْطَاءُ تَعُودُ اليَوْمَ، وَالصَّحِيحُ لَاحِقًا', en: 'Each answer updated your Leitner boxes: mistakes return today, successes later.' })} />
        {lesson && !passed ? <Button title={pick({ fr: 'Recommencer', ar: 'أَعِدْ', en: 'Retry' })} icon="refresh" onPress={() => router.replace({ pathname: '/drill', params: { lesson: lesson.id } })} /> : null}
        <Button title={t('continue')} kind={lesson && !passed ? 'secondary' : 'primary'} onPress={() => (lesson ? router.replace({ pathname: '/unit/[id]', params: { id: String(lesson.unitId) } }) : router.replace('/review'))} />
      </Screen>
    );
  }

  const ok = picked === q.answer;
  const prompt =
    q.kind === 'ar2gloss'
      ? q.item.kind === 'letter'
        ? pick({ fr: 'Quelle est cette lettre ?', ar: 'مَا هٰذَا الحَرْفُ؟', en: 'Which letter is this?' })
        : pick({ fr: 'Que signifie… ?', ar: 'مَا مَعْنَى…؟', en: 'What does this mean?' })
      : q.kind === 'gloss2ar'
        ? pick({ fr: 'Choisissez l’arabe pour :', ar: 'اِخْتَرِ الكَلِمَةَ العَرَبِيَّةَ:', en: 'Pick the Arabic for:' })
        : pick({ fr: 'Comment se lit… ?', ar: 'كَيْفَ تُقْرَأُ؟', en: 'How is this read?' });
  const arabicOptions = q.kind === 'gloss2ar';

  return (
    <Screen
      header={
        <Row style={{ paddingHorizontal: 12, paddingTop: 8, width: '100%', maxWidth: 820, alignSelf: 'center' }}>
          <IconButton icon="close" a11y={t('quit')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/learn'))} />
          <View style={{ flex: 1 }}>
            <Progress value={Math.min(idx, total) / Math.max(queue.length, 1)} />
          </View>
          <T v="label" muted>{Math.min(idx + 1, queue.length)}/{queue.length}</T>
        </Row>
      }
      footer={
        phase === 'feedback' ? (
          <View style={{ padding: 14, gap: 8, backgroundColor: alpha(ok ? p.success : p.danger, 0.12), borderTopWidth: 2, borderTopColor: ok ? p.success : p.danger }}>
            <View style={{ width: '100%', maxWidth: 820, alignSelf: 'center', gap: 8 }}>
              <Row>
                <Ionicons name={ok ? 'checkmark-circle' : 'close-circle'} size={26} color={ok ? p.success : p.danger} />
                <T v="h3" color={ok ? p.success : p.danger}>{ok ? t('correct') : t('wrong')}</T>
              </Row>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <T v="body">{q.item[gloss]}</T>
                  <T v="small" muted style={{ fontStyle: 'italic' }}>{q.item.tr}</T>
                </View>
                <AR size={26}>{q.item.ar}</AR>
                <AudioButton text={q.item.ar} />
              </Row>
              {!ok && !q.retry ? <T v="small" muted>{pick({ fr: 'Cette question reviendra à la fin.', ar: 'سَيَعُودُ هٰذَا السُّؤَالُ فِي النِّهَايَةِ', en: 'This question will come back at the end.' })}</T> : null}
              <Button title={t('continue')} kind={ok ? 'success' : 'danger'} onPress={next} full />
            </View>
          </View>
        ) : null
      }
    >
      {lesson ? <LicenseTag id={lesson.license} compact /> : <T v="caption" muted>{t('review')} · Leitner</T>}
      {q.retry ? <T v="caption" color={p.warning}>{pick({ fr: 'Deuxième chance', ar: 'فُرْصَةٌ ثَانِيَةٌ', en: 'Second chance' })}</T> : null}
      <T v="h2">{prompt}</T>
      <Card style={{ alignItems: 'center', paddingVertical: 22 }}>
        {q.kind === 'gloss2ar' ? (
          <T v="h1" center>{q.item[gloss]}</T>
        ) : (
          <>
            <AR size={q.item.kind === 'letter' ? 60 : q.item.kind === 'phrase' ? 30 : 42} center weight="600">{q.item.ar}</AR>
            {q.kind === 'ar2gloss' && showTr ? <Translit center>{q.item.tr}</Translit> : null}
            <AudioButton text={q.item.ar} />
          </>
        )}
      </Card>
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        {q.options.map((opt, i) => {
          const isAns = opt === q.answer;
          const isPick = opt === picked;
          const border = phase === 'feedback' && isAns ? p.success : phase === 'feedback' && isPick ? p.danger : p.border;
          const bg = phase === 'feedback' && isAns ? alpha(p.success, 0.12) : phase === 'feedback' && isPick ? alpha(p.danger, 0.12) : p.surface;
          return (
            <Pressable
              key={opt + i}
              accessibilityRole="radio"
              accessibilityLabel={`${pick({ fr: 'Réponse', ar: 'جَوَاب', en: 'Answer' })} ${i + 1} : ${opt}`}
              accessibilityState={{ selected: isPick, disabled: phase !== 'ask' }}
              onPress={() => choose(opt)}
              style={({ pressed }) => ({
                minHeight: 56,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: p.radius,
                borderWidth: 2,
                borderColor: border,
                backgroundColor: bg,
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              {arabicOptions ? <AR size={26} center>{opt}</AR> : <T v="h3" center>{opt}</T>}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
