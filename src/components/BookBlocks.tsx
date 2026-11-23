import React, { createContext, useContext, useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { alpha, useTheme } from '@/kit/theme';
import { Button, Card, Ionicons, Row, T, useToast } from '@/kit/ui';
import { AR, AudioButton, LicenseTag, Translit } from '@/components/common';
import { QuizChoices } from '@/components/QuizChoices';
import { ITEM_BY_ID } from '@/data/curriculum';
import {
  bookForms,
  bookMarks,
  bookPairs,
  bookParts,
  bookPassages,
  runs,
  runsToText,
  type Block,
  type BookQuestion,
  type Run,
} from '@/data/book';
import { arabicFamily } from '@/lib/fonts';
import { useI18n } from '@/lib/i18n';
import { isShareCancel, shareEbookPdf } from '@/lib/shareEbook';
import { formatDigits } from '@/kit/format';
import { TYPE } from '@/theme';
import { store } from '@/state';

const GotoCtx = createContext<(sectionId: string) => void>(() => {});

export function BookBody({ blocks, onGoto }: { blocks: Block[]; onGoto: (sectionId: string) => void }) {
  return (
    <GotoCtx.Provider value={onGoto}>
      <View style={{ direction: 'ltr', gap: 14 }} accessibilityLanguage="fr">
        {blocks.map((block, index) => (
          <BlockView key={index} block={block} />
        ))}
      </View>
    </GotoCtx.Provider>
  );
}

export function PdfButton({ detail }: { detail?: string }) {
  const p = useTheme();
  const toast = useToast();
  const { pick } = useI18n();
  const [busy, setBusy] = useState(false);
  const title = pick({ fr: 'Ouvrir / partager le PDF', ar: 'فَتْح / مُشَارَكَة PDF', en: 'Open / share the PDF' });
  return (
    <Card accent={p.accent}>
      {detail ? <Rich runs={runs(detail)} /> : null}
      <Button
        icon="share-outline"
        title={title}
        loading={busy}
        a11y={title}
        onPress={() => {
          setBusy(true);
          shareEbookPdf()
            .catch((error: unknown) => {
              if (!isShareCancel(error)) {
                toast(pick({ fr: 'Le PDF n’a pas pu s’ouvrir.', ar: 'تَعَذَّرَ فَتْحُ المِلَفّ', en: 'The PDF could not be opened.' }), 'error');
              }
            })
            .finally(() => setBusy(false));
        }}
      />
    </Card>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'h':
      return (
        <View accessibilityRole="header">
          <T v="h2" selectable>
            {block.text}
          </T>
        </View>
      );
    case 'p':
      return <Rich runs={block.runs} />;
    case 'ul':
      return <Bullet items={block.items} ordered={false} />;
    case 'ol':
      return <Bullet items={block.items} ordered />;
    case 'defs':
      return (
        <View style={{ gap: 8 }}>
          {block.rows.map((row, index) => (
            <Card key={index}>
              <Rich runs={row.term} v="h3" />
              <Rich runs={row.detail} />
            </Card>
          ))}
        </View>
      );
    case 'tip':
      return <Tip tone={block.tone} label={block.label} runs={block.runs} />;
    case 'letters':
      return <Letters ids={block.ids} />;
    case 'forms':
      return <Forms letters={block.letters} />;
    case 'items':
      return <Items block={block} />;
    case 'marks':
      return <Marks />;
    case 'pairs':
      return <Pairs />;
    case 'passages':
      return <Passages ids={block.ids} translit={block.translit} />;
    case 'cards':
      return <Cards ids={block.ids} />;
    case 'digits':
      return <Digits ids={block.ids} />;
    case 'nominal':
      return <Nominal />;
    case 'boxes':
      return <Boxes boxes={block.boxes} note={block.note} />;
    case 'mind':
      return <Mind block={block} />;
    case 'reveal':
      return <Reveal block={block} />;
    case 'quiz':
      return <Quiz block={block} />;
    case 'pdf':
      return <PdfButton detail={block.text} />;
    case 'goto':
      return <Goto label={block.label} sectionId={block.sectionId} />;
    case 'route':
      return <Button kind="secondary" title={block.label} onPress={() => router.push(block.href as '/learn')} />;
    case 'open':
      return (
        <Button
          kind="secondary"
          title={block.label}
          onPress={() => router.push({ pathname: '/ebook/[id]', params: { id: block.partId } })}
        />
      );
    case 'practice':
      return <Practice unitIds={block.unitIds} />;
    case 'parts':
      return <PartJump />;
    default:
      return null;
  }
}

function Rich({ runs: list, v = 'body', center }: { runs: Run[]; v?: 'body' | 'h2' | 'h3' | 'small'; center?: boolean }) {
  const theme = useTheme();
  const arScale = store.useSelect((s) => s.settings.arScale);
  const hasAr = list.some((run) => run.ar);
  const size = v === 'h2' ? 19 : v === 'h3' ? 16 : v === 'small' ? 13 : 15;
  const fs = size * theme.fontScale;
  return (
    <Text
      selectable
      accessibilityLanguage="fr"
      style={{
        fontSize: fs,
        lineHeight: Math.round(fs * (hasAr ? 1.85 : 1.45)),
        color: theme.text,
        textAlign: center ? 'center' : 'left',
        writingDirection: 'ltr',
        fontWeight: v === 'body' || v === 'small' ? '400' : '700',
      }}
    >
      {list.map((run, index) =>
        run.ar ? (
          <Text
            key={index}
            accessibilityLanguage="ar"
            // @ts-ignore lang est lu par le DOM web
            lang="ar"
            style={{
              fontFamily: arabicFamily(),
              writingDirection: 'rtl',
              fontSize: fs * Math.max(1, arScale / 1.15),
              fontWeight: run.b ? '700' : '500',
            }}
          >
            {run.text}
          </Text>
        ) : (
          <Text key={index} style={{ fontStyle: run.i ? 'italic' : 'normal', fontWeight: run.b ? '700' : '400' }}>
            {formatDigits(run.text, theme.digits)}
          </Text>
        ),
      )}
    </Text>
  );
}

function Bullet({ items, ordered }: { items: Run[][]; ordered: boolean }) {
  return (
    <View style={{ gap: 8 }} accessibilityRole="list">
      {items.map((item, index) => (
        <Row key={index} style={{ alignItems: 'flex-start' }}>
          <T v="body" style={{ minWidth: 22 }}>
            {ordered ? `${index + 1}.` : '•'}
          </T>
          <View style={{ flex: 1 }}>
            <Rich runs={item} />
          </View>
        </Row>
      ))}
    </View>
  );
}

function Tip({ tone, label, runs: list }: { tone: 'info' | 'warning' | 'source'; label: string; runs: Run[] }) {
  const p = useTheme();
  const color = tone === 'warning' ? p.warning : tone === 'source' ? p.info : p.primary;
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${label}. ${runsToText(list)}`}
      style={{ borderWidth: 1, borderColor: color, borderRadius: p.radius, padding: 12, gap: 4, backgroundColor: alpha(color, 0.08) }}
    >
      <T v="label" color={color}>
        {label}
      </T>
      <Rich runs={list} />
    </View>
  );
}

function Letters({ ids }: { ids: string[] }) {
  const p = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {ids.map((id) => {
        const item = ITEM_BY_ID[id];
        if (!item) return null;
        const gloss = item.fr.includes('—') ? item.fr.split('—').slice(1).join('—').trim() : item.fr;
        return (
          <View
            key={id}
            accessibilityLabel={`${item.ar}, ${item.tr}, ${gloss}`}
            style={{
              width: 148,
              minHeight: 132,
              flexGrow: 1,
              borderRadius: p.radius,
              borderWidth: 1,
              borderColor: p.border,
              backgroundColor: p.surface,
              padding: 10,
              alignItems: 'center',
              gap: 2,
              overflow: 'visible',
            }}
          >
            <AR size={40} center weight="600">
              {item.ar}
            </AR>
            <Translit center>{item.tr}</Translit>
            <T v="small" center>
              {gloss}
            </T>
            <AudioButton text={item.ar} />
          </View>
        );
      })}
    </View>
  );
}

function Forms({ letters }: { letters: string[] }) {
  const p = useTheme();
  const cells = [
    ['isolated', 'Isolée'],
    ['initial', 'Initiale'],
    ['medial', 'Médiane'],
    ['final', 'Finale'],
  ] as const;
  return (
    <View style={{ gap: 8 }}>
      {letters.map((letter) => {
        const forms = bookForms(letter);
        const joins = forms.initial !== forms.isolated;
        return (
          <Card key={letter}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T v="label" muted>
                {joins ? 'se lie des deux côtés' : 'non liante'}
              </T>
              <AudioButton text={letter} />
            </Row>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {cells.map(([key, label]) => (
                <View key={key} style={{ minWidth: 72, alignItems: 'center' }} accessibilityLabel={`${label} ${forms[key]}`}>
                  <T v="caption" muted>
                    {label}
                  </T>
                  <AR size={32} center>
                    {forms[key]}
                  </AR>
                </View>
              ))}
            </View>
            <View style={{ height: 0, borderBottomWidth: 1, borderColor: p.border }} />
          </Card>
        );
      })}
    </View>
  );
}

function Items({ block }: { block: Extract<Block, { kind: 'items' }> }) {
  return (
    <View style={{ gap: 8 }}>
      {block.title ? (
        <View style={{ gap: 4 }}>
          <View accessibilityRole="header">
            <T v="h3">{block.title}</T>
          </View>
          {block.titleAr ? (
            <AR size={22} weight="600">
              {block.titleAr}
            </AR>
          ) : null}
          {block.license ? <LicenseTag id={block.license} compact /> : null}
        </View>
      ) : null}
      {block.ids.map((id) => {
        const item = ITEM_BY_ID[id];
        if (!item) return null;
        return (
          <Card key={id}>
            <Row style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <AudioButton text={item.ar} />
              <View style={{ flex: 1 }}>
                <AR size={item.kind === 'phrase' ? 26 : 32} weight="600">
                  {item.ar}
                </AR>
              </View>
            </Row>
            <Translit>{item.tr}</Translit>
            <T v="body">{item.fr}</T>
          </Card>
        );
      })}
    </View>
  );
}

function Marks() {
  const samples = [
    ['بَ', 'au-dessus : a'],
    ['بِ', 'au-dessous : i'],
    ['بُ', 'petit wāw : u'],
    ['بْ', 'cercle : rien'],
  ];
  return (
    <View style={{ gap: 8 }}>
      {bookMarks.map((mark) => (
        <Card key={mark.id}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, gap: 2 }}>
              <AR size={20}>{mark.name}</AR>
              <T v="body">{mark.fr}</T>
              <T v="small" muted style={{ fontStyle: 'italic' }}>
                {mark.suffix('b')}
              </T>
            </View>
            <AR size={36}>{`ب${mark.char}`}</AR>
          </Row>
        </Card>
      ))}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {samples.map(([ar, label]) => (
          <Card key={ar} style={{ flexGrow: 1, minWidth: 120, alignItems: 'center' }}>
            <AR size={36} center>
              {ar}
            </AR>
            <T v="small" center>
              {label}
            </T>
          </Card>
        ))}
      </View>
    </View>
  );
}

function Pairs() {
  return (
    <View style={{ gap: 8 }}>
      {bookPairs.map((pair) => (
        <Card key={pair.ar}>
          <Row style={{ justifyContent: 'space-between' }}>
            <AudioButton text={pair.ar} />
            <AR size={28}>{pair.ar}</AR>
          </Row>
          <T v="small" muted style={{ fontStyle: 'italic' }}>
            {pair.answer}
          </T>
          <T v="body">{pair.fr}</T>
        </Card>
      ))}
    </View>
  );
}

function Passages({ ids, translit }: { ids: string[]; translit: boolean }) {
  return (
    <View style={{ gap: 8 }}>
      {ids.map((id) => {
        const passage = bookPassages.find((entry) => entry.id === id);
        if (!passage) return null;
        const arabic = passage.words.map((word) => word.ar).join(' ');
        return (
          <Card key={id}>
            <T v="caption" muted>
              {passage.title.fr} · niveau {passage.level}
            </T>
            <AR size={20}>{passage.title.ar}</AR>
            <LicenseTag id={passage.license} compact />
            <AR size={26}>{arabic}</AR>
            <AudioButton text={arabic} />
            {translit ? (
              <T v="small" muted style={{ fontStyle: 'italic' }}>
                {passage.words.map((word) => word.tr).join(' · ')}
              </T>
            ) : null}
            <T v="small" muted>
              {passage.gloss.fr}
            </T>
          </Card>
        );
      })}
    </View>
  );
}

function Cards({ ids }: { ids: string[] }) {
  const p = useTheme();
  const width = useWindowDimensions().width;
  const columns = width >= 700 ? 3 : 2;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {ids.map((id) => {
        const item = ITEM_BY_ID[id];
        if (!item) return null;
        return <Memo key={id} itemId={id} columns={columns} />;
      })}
      <View style={{ width: 0, height: 0, backgroundColor: p.bg }} />
    </View>
  );
}

function Memo({ itemId, columns }: { itemId: string; columns: number }) {
  const p = useTheme();
  const item = ITEM_BY_ID[itemId];
  const [back, setBack] = useState(false);
  if (!item) return null;
  const basis = columns === 3 ? '31%' : '47%';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.ar}. ${item.tr}. ${item.fr}.`}
      accessibilityHint="Toucher pour retourner la carte"
      onPress={() => setBack((value) => !value)}
      style={{ flexBasis: basis, flexGrow: 1, minHeight: 132, borderRadius: p.radius, borderWidth: 1, borderColor: p.border, backgroundColor: back ? alpha(p.primary, 0.08) : p.surface, padding: 12, alignItems: 'center', justifyContent: 'center', gap: 4 }}
    >
      {back ? (
        <>
          <T v="small" center style={{ fontStyle: 'italic' }}>
            {item.tr}
          </T>
          <T v="body" center>
            {item.fr}
          </T>
        </>
      ) : (
        <AR size={item.kind === 'letter' ? 36 : 26} center weight="600">
          {item.ar}
        </AR>
      )}
    </Pressable>
  );
}

function Digits({ ids }: { ids: string[] }) {
  const p = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {ids.map((id) => {
        const item = ITEM_BY_ID[id];
        if (!item) return null;
        const parts = item.ar.split(' ');
        const digit = parts[parts.length - 1] ?? item.ar;
        const word = parts.slice(0, -1).join(' ') || item.ar;
        return (
          <View key={id} accessibilityLabel={`${word}, ${digit}, ${item.tr}, ${item.fr}`} style={{ minWidth: 104, flexGrow: 1, alignItems: 'center', borderWidth: 1, borderColor: p.border, borderRadius: p.radius, backgroundColor: p.surface, padding: 8 }}>
            <AR size={34} center>
              {digit}
            </AR>
            <AR size={18} center>
              {word}
            </AR>
            <Translit center>{item.tr}</Translit>
          </View>
        );
      })}
    </View>
  );
}

function Nominal() {
  const cells = [
    { ar: 'الكِتَابُ', label: 'sujet défini (al- … -u)' },
    { ar: '+', label: '' },
    { ar: 'جَدِيدٌ', label: 'attribut indéfini (tanwīn -un)' },
    { ar: '=', label: '' },
  ];
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'stretch' }}>
        {cells.map((cell) => (
          <Card key={cell.ar} style={{ flexGrow: 1, minWidth: 96, alignItems: 'center' }}>
            {cell.ar === '+' || cell.ar === '=' ? (
              <T v="h2" center>
                {cell.ar}
              </T>
            ) : (
              <AR size={28} center>
                {cell.ar}
              </AR>
            )}
            {cell.label ? (
              <T v="small" center muted>
                {cell.label}
              </T>
            ) : null}
          </Card>
        ))}
      </View>
      <Card>
        <T v="h3" center>
          « Le livre est neuf »
        </T>
        <T v="small" center muted>
          exemple tiré du passage « Mon livre »
        </T>
      </Card>
    </View>
  );
}

function Boxes({ boxes, note }: { boxes: { title: string; sub: string }[]; note: string }) {
  const p = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {boxes.map((box, index) => (
          <View key={box.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View accessibilityLabel={`${box.title}, ${box.sub}`} style={{ minWidth: 88, minHeight: TYPE.minTarget, borderRadius: 12, borderWidth: 1, borderColor: p.border, backgroundColor: p.surface, alignItems: 'center', justifyContent: 'center', padding: 8 }}>
              <T v="label">{box.title}</T>
              <T v="small" muted>
                {box.sub}
              </T>
            </View>
            {index < boxes.length - 1 ? <Ionicons name="arrow-forward" size={16} color={p.textMuted} /> : null}
          </View>
        ))}
      </View>
      <T v="small" muted>
        {note}
      </T>
    </View>
  );
}

function Mind({ block }: { block: Extract<Block, { kind: 'mind' }> }) {
  const p = useTheme();
  const [title, sub] = block.center.split('\n');
  return (
    <View accessibilityRole="summary" style={{ borderWidth: 1, borderColor: p.primary, borderRadius: p.radius, padding: 12, gap: 10, backgroundColor: alpha(p.primary, 0.06) }}>
      <T v="h3" center>
        {title}
      </T>
      {sub ? (
        <T v="small" center muted>
          {sub}
        </T>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {block.branches.map((branch) => (
          <Card key={branch.title} style={{ flexGrow: 1, minWidth: 140 }}>
            <T v="label" color={p.primary}>
              {branch.title}
            </T>
            {branch.lines.length ? (
              branch.lines.map((line) => <Rich key={line} runs={runs(line)} v="small" />)
            ) : (
              <T v="small" muted>
                {block.blank ? 'à compléter' : ''}
              </T>
            )}
          </Card>
        ))}
      </View>
    </View>
  );
}

function Reveal({ block }: { block: Extract<Block, { kind: 'reveal' }> }) {
  const p = useTheme();
  const { pick } = useI18n();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const show = pick({ fr: 'Afficher la réponse', ar: 'أَظْهِرِ الجَوَاب', en: 'Show the answer' });
  const hide = pick({ fr: 'Masquer la réponse', ar: 'أَخْفِ الجَوَاب', en: 'Hide the answer' });
  return (
    <Card>
      <T v="h3">{block.title}</T>
      <T v="body">{block.prompt}</T>
      {block.lines.map((line, index) => {
        const shown = !!open[index];
        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={{ expanded: shown }}
            accessibilityLabel={`${runsToText(line.show)}. ${shown ? runsToText(line.answer) : show}`}
            onPress={() => setOpen((prev) => ({ ...prev, [index]: !prev[index] }))}
            style={{ minHeight: TYPE.minTarget, borderTopWidth: 1, borderTopColor: p.border, paddingVertical: 8, gap: 4 }}
          >
            <Rich runs={line.show} />
            {shown ? <Rich runs={line.answer} /> : <T v="label" color={p.primary}>{show}</T>}
            {shown ? <T v="caption" muted>{hide}</T> : null}
          </Pressable>
        );
      })}
    </Card>
  );
}

function Quiz({ block }: { block: Extract<Block, { kind: 'quiz' }> }) {
  const p = useTheme();
  const { pick } = useI18n();
  const [picked, setPicked] = useState<Record<string, number>>({});
  const answered = block.questions.filter((question) => picked[question.id] != null).length;
  const score = block.questions.filter((question) => picked[question.id] === question.answer).length;
  return (
    <View style={{ gap: 12 }}>
      <T v="body">{block.hint}</T>
      {block.questions.map((question, index) => (
        <Question key={question.id} question={question} index={index} total={block.questions.length} picked={picked[question.id]} onPick={(choice) => setPicked((prev) => ({ ...prev, [question.id]: choice }))} />
      ))}
      <Card>
        <T v="h3">
          {pick({ fr: 'Mon score', ar: 'نَتِيجَتِي', en: 'My score' })} : {score} / {block.questions.length}
        </T>
        <T v="small" muted>
          {answered < block.questions.length
            ? pick({ fr: 'Le score se met à jour à chaque réponse. Il n’est pas enregistré dans les boîtes de Leitner.', ar: 'لَا يُحْفَظُ فِي صَنَادِيقِ لَايْتْنَر', en: 'Updated as you answer. Not saved into the Leitner boxes.' })
            : pick({ fr: 'Lecture seulement : ce quiz ne modifie pas ta progression.', ar: 'لَا يُغَيِّرُ تَقَدُّمَكَ', en: 'Reading only: this quiz does not change your progress.' })}
        </T>
      </Card>
      <View style={{ height: 0, backgroundColor: p.bg }} />
    </View>
  );
}

function Question({
  question,
  index,
  total,
  picked,
  onPick,
}: {
  question: BookQuestion;
  index: number;
  total: number;
  picked: number | undefined;
  onPick: (index: number) => void;
}) {
  const p = useTheme();
  const revealed = picked != null;
  const ok = picked === question.answer;
  return (
    <Card>
      <T v="caption" muted>
        Question {index + 1}/{total}
      </T>
      <Rich runs={question.prompt} v="h3" />
      <QuizChoices
        count={question.options.length}
        pickedIndex={picked ?? null}
        answerIndex={question.answer}
        revealed={revealed}
        onPick={onPick}
        labelFor={(i) => `${String.fromCharCode(65 + i)}. ${runsToText(question.options[i].runs)}`}
        renderOption={(i) =>
          question.options[i].arabic ? (
            <AR size={26} center>
              {runsToText(question.options[i].runs)}
            </AR>
          ) : (
            <Rich runs={question.options[i].runs} center />
          )
        }
      />
      {revealed ? (
        <View style={{ gap: 4, padding: 8, borderRadius: 12, backgroundColor: alpha(ok ? p.success : p.danger, 0.1) }}>
          <T v="label" color={ok ? p.success : p.danger}>
            {ok ? 'Bravo, c’est juste !' : 'Pas tout à fait…'}
          </T>
          <Rich runs={[{ text: 'Bonne réponse : ' }, ...question.options[question.answer].runs]} />
          <Rich runs={question.explain} />
          <T v="caption" muted>
            Source : {question.source}
          </T>
        </View>
      ) : null}
    </Card>
  );
}

function Goto({ label, sectionId }: { label: string; sectionId: string }) {
  const goto = useContext(GotoCtx);
  return <Button kind="secondary" title={label} onPress={() => goto(sectionId)} />;
}

function Practice({ unitIds }: { unitIds: number[] }) {
  const { t, pick } = useI18n();
  return (
    <View style={{ gap: 8 }}>
      <T v="label" muted>
        {pick({ fr: 'Pratiquer dans l’app', ar: 'تَدَرَّبْ فِي التَّطْبِيق', en: 'Practice in the app' })}
      </T>
      <Row wrap>
        {unitIds.map((id) => (
          <Button key={id} small title={`${t('unit')} ${id}`} onPress={() => router.push({ pathname: '/unit/[id]', params: { id: String(id) } })} />
        ))}
      </Row>
    </View>
  );
}

function PartJump() {
  const chapters = bookParts().filter((part) => part.group === 'chapitre');
  return (
    <Row wrap>
      {chapters.map((part, index) => (
        <Button key={part.id} small kind="secondary" title={String(index + 1)} a11y={part.title} onPress={() => router.push({ pathname: '/ebook/[id]', params: { id: part.id } })} />
      ))}
    </Row>
  );
}
