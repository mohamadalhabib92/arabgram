# Kaizen

Petites améliorations, sans retirer de fonction et sans toucher au profil `arabgram@v1`.

## 2026-11-23

La course du guide mesure déjà une allure sur des passages fixes. Il manquait une mesure courte, attachée à l’unité que l’on vient de lire. Les formes de lettres étaient affichées, pas exercées. En français, le titre arabe d’une unité était aligné à gauche.

### 1. Lecture chronométrée en fin d’unité

**Avant.** Aucun écran ne chronométrait les mots de l’unité ni n’en gardait la précision.

**Après.** Depuis une unité ouverte, « Lecture chronométrée » propose au plus huit mots ou phrases déjà présents. À la fin : mots par minute et précision. L’historique est sous la clé neuve `arabgram:fluency@v1` (40 dernières mesures). Les leçons, l’XP et les boîtes ne bougent pas.

**Fichiers.** `src/lib/fluency.ts`, `src/lib/fluencyStore.ts`, `src/app/read-check/[id].tsx`, `src/app/unit/[id].tsx`, `src/kit/focusApp.tsx` (la route reste accessible en Mode Focus).

**Tests.** `src/kaizen.test.ts` : liste de mots, vitesse, précision, plafond, clé dédiée, profil `arabgram@v1` inchangé, JSON illisible ignoré.

### 2. Exercice des quatre formes

**Avant.** Isolée, début, milieu et fin étaient montrées dans la leçon et le livre. Aucun exercice ne demandait la place d’une forme. Les lettres non liantes confondent deux places : elles ne servent pas de question.

**Après.** Outil « Formes » : six lettres liantes déjà dans le parcours, une forme chacune, quatre réponses. Rien n’est ajouté au curriculum, rien n’est stocké.

**Fichiers.** `src/lib/formsDrill.ts`, `src/app/forms.tsx`, `src/app/(tabs)/learn.tsx`.

**Tests.** `src/kaizen.test.ts` : `ا` écartée, `ب` retenue, six questions, glyphes distincts.

### 3. Arabe aligné à droite, isolé du latin

**Avant.** Le composant arabe acceptait un `textAlign: 'left'` par-dessus. Sur Apprendre, le titre arabe de l’unité passait à gauche dès que l’interface n’était pas en arabe. Un mot arabe collé à du latin pouvait être réordonné.

**Après.** L’alignement droite (ou centré) et `writingDirection: 'rtl'` s’appliquent en dernier. Le texte est entouré des isolats U+2067 et U+2069. Le titre d’unité sur Apprendre n’impose plus la gauche.

**Fichiers.** `src/lib/arabicRun.ts`, `src/components/common.tsx`, `src/app/(tabs)/learn.tsx`.

**Tests.** `src/kaizen.test.ts` : isolat, pas de double isolat, alignement droite et rtl.
