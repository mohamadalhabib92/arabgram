# ArabGram — audit 12 axes (7 novembre 2026)

Périmètre : dépôt `mohamadalhabib92/arabgram` uniquement. Base auditée : `main` à `b699d3f81cafe96af24e529db452ad2a0ac7d7fe` (merge de la PR #1). PR ouverte déjà présente et non modifiée : [#2](https://github.com/mohamadalhabib92/arabgram/pull/2) (`ux/passe-plaisir-2026-11-04`). Référence de demande : RHMasterCH#1, ArabGram seul.

Méthode : lecture du code à ce SHA, `npm test` et `npx tsc --noEmit` sur la branche de correctif. Aucune mesure d’appareil, aucune sauvegarde iOS/Android, aucun build EAS, aucun envoi store, aucun déploiement, aucune migration de production, aucun appel payant, aucun fichier réel envoyé à un tiers.

Ce document décrit l’état **avant** le correctif, puis le seul fondement livré dans la PR de conservation. Il ne prétend pas qu’une vocalisation, une traduction ou un score d’apprentissage a été validé.

## Diagnostic (5 lignes)

1. ArabGram est une application Expo (React Native + web) hors ligne pour **lire** l’arabe : 11 unités, 27 leçons avec items (`lesson(` dans `src/data/curriculum.ts`) plus l’emplacement vide `u11l3`, Leitner 5 boîtes, course du guide, test de tashkīl, interface français / arabe RTL / anglais. Pas de compte.
2. Vocalisation automatique, caméra, import de documents, traduction à la demande, favoris et import de progression sont **absents** du code. L’écran tuteur n’existe qu’en développement et n’appelle aucun modèle tant que l’URL reste un placeholder.
3. Le risque le plus élevé pour les données déjà là : un JSON **lisible** mais incompatible (schéma futur, champ au mauvais type, document étranger) était adopté puis réécrit sur `arabgram@v1`, ce qui pouvait remplacer XP, cartes, leçons, jours, historique de course et réglages par un profil vide ou tronqué.
4. Le correctif de cette PR refuse cette adoption, conserve les octets, rejoue une édition de démarrage sur l’instantané adopté, et n’efface la clé que par la réinitialisation explicite. Il n’ajoute aucun corpus ni aucun service.
5. Les chiffres de l’app (XP, précision, boîtes) sont des compteurs locaux. Ils ne sont pas une mesure d’apprentissage validée, et l’app ne porte pas d’accréditation.

## Présent et demandé

| Demande | Dans `main` à `b699d3f` | Preuve |
|---|---|---|
| Lire l’arabe, lettres, ḥarakāt, exercices | Présent, contenu marqué « à valider » | `src/data/curriculum.ts`, `src/data/licenses.ts` |
| Répétition espacée | Leitner local, intervalles 0, 0, 1, 3, 7, 16 jours | `src/state.ts` `LEITNER_DAYS` (l.113 au SHA de base) |
| Vocalisation automatique d’un texte libre | Absente. Le corpus est déjà vocalisé à la main. Le composeur du test de tashkīl assemble une lettre et un signe connus (`src/data/tashkil.ts`) | Aucun module de diacritisation |
| Caméra, OCR, envoi de document | Absents. `app.json` ne déclare pas d’usage caméra. `src/kit/files.ts` ne fait qu’exporter un texte | `app.json` `ios` / `android` |
| Traduction à la demande | Absente. Gloses `fr`/`en` figées dans le curriculum. Réglage `gloss` choisit l’une des deux | `src/app/(tabs)/settings.tsx` |
| Favoris | Absents. Aucune clé, aucun écran | recherche `favorite` / `bookmark` sans implémentation |
| Import de fichier utilisateur | Absent. Export JSON seulement | `settings.tsx` vers l.139 au SHA de base |
| Compte / déconnexion | Absents. `FEATURE_ACCOUNT` vaut false | `src/config.ts` l.18-20 et l.35 |
| Tuteur IA | Écran masqué hors `__DEV__`. Pas d’appel au démarrage | `src/config.ts` `showTutorScreen`, `src/app/tutor.tsx` |
| Audio | Voix **déjà installée** sur l’appareil (`expo-speech`). Pas un service de vocalisation | `src/lib/speech.ts` |
| Rebuild SwiftUI ou nouveau site | Non entrepris. L’app Expo actuelle reste l’app | — |

## Priorités (impact × effort, 1 = faible, 5 = élevé)

| Priorité | Sujet | Impact | Effort | État |
|---|---|---|---|---|
| P1 | Ne plus réécrire `arabgram@v1` si le fichier n’est pas un profil v1 adoptable | 5 | 3 | Livré dans cette PR (tests mémoire) |
| P2 | Relecture humaine du corpus vocalisé, des proverbes et des vers (attribution comprise) | 5 | 4 | Ouvert — décision Mohamed |
| P3 | Trancher la licence du contenu original (la mention CC BY-SA est une proposition non confirmée) | 4 | 2 | Ouvert — décision Mohamed |
| P4 | Faire tourner `npm test` en CI sur les PR, en plus de `tsc` au déploiement de `main` | 3 | 2 | Ouvert — pas dans cette PR (le workflow Pages ne doit pas être élargi ici) |
| P5 | Réinitialisation : aujourd’hui elle ne conserve que langue, glose et thème | 3 | 1 | Ouvert, volontairement hors de ce correctif |
| P6 | Historique de course coupé à 50 sessions | 2 | 2 | Ouvert |
| P7 | Vocalisation proposée, avec original intact, alternatives et incertitude affichée | 5 | 5 | Plus tard. Pas de corpus inventé ici |
| P8 | Caméra / document : original et dérivé séparés, consentement local, pas d’envoi par défaut | 4 | 5 | Plus tard |
| P9 | Traduction à la demande : source, coût, consentement tiers, aucun appel dans cette PR | 4 | 5 | Plus tard |
| P10 | Instrument de mesure relu par une personne compétente en didactique de l’arabe. Pas d’accréditation | 4 | 4 | Ouvert |
| P11 | Vérification VoiceOver / TalkBack / iPad sur appareil | 4 | 3 | La PR #2 traite une partie UX. Cette session ne l’a pas fusionnée et ne l’a pas jouée sur appareil |
| P12 | Rebuild SwiftUI ou web séparé | 2 | 5 | Plus tard, pas de big bang |

## Cinq travaux pour la semaine qui vient

1. Relire et fusionner le correctif de conservation (cette PR) **avant** d’empiler vocalisation, caméra ou compte. Le fichier local est le seul exemplaire de la progression.
2. Mohamed tranche la licence du contenu original et désigne un relecteur pour l’unité 11 (proverbes, vers, vocalisation, traductions). Tant que ce n’est pas fait, les écrans restent sur « à valider ».
3. Résoudre le chevauchement avec la PR #2 sur `src/app/(tabs)/settings.tsx` (voir plus bas) sans recopier cette PR sur la branche UX.
4. Ajouter `npm test` au contrôle des PR. Le workflow `.github/workflows/pages.yml` ne lance que `tsc` et l’export web, et seulement sur `main`.
5. Décider du geste « Réinitialiser » : aujourd’hui il efface aussi contraste, tailles, chiffres, audio, objectif et déblocage, alors que le bandeau ne parle que des réglages de langue (`settings.tsx` au SHA de base, vers l.149-160).

## Cinq prompts développeur (bornés)

1. **Conservation déjà spécifiée par les tests de cette PR.** Ne pas réouvrir le sujet en ajoutant un second format. Étendre seulement si un nouveau champ v1 a un type précis et un test d’ancien fixture.
2. **CI.** « Ajoute un workflow de PR qui lance `npm ci`, `npx tsc --noEmit` et `npm test`. Ne déploie pas Pages depuis les PR. Ne change pas `baseUrl`. »
3. **Réinitialisation.** « Au geste confirmé seulement, efface XP, jours, leçons, cartes, course et record de tashkīl, et conserve l’objet `settings` entier, y compris les clés inconnues. Teste qu’un fichier en quarantaine n’est toujours pas effacé sans ce geste. »
4. **Relecture contenu, sans générer de texte.** « Liste `u11l3` et chaque item de licence `pd-proverbs` / `pd-classical` avec fichier et ligne. N’écris pas de vocalisation de remplacement. Attends le texte fourni par Mohamed. »
5. **Vocalisation future, quand elle sera décidée.** « Pour une chaîne source, conserve l’original byte à byte dans un champ séparé du dérivé. Affiche au plus les analyses réellement renvoyées par un outil nommé, chacune avec un score de cet outil s’il en fournit un. S’il n’en fournit pas, affiche “incertain” et n’invente pas de ḥarakāt. Aucun envoi réseau sans consentement séparé, coût et nom du tiers. Interdis le remplacement silencieux du texte de l’utilisateur. »

## Cibles proposées (pas des résultats mesurés)

Ces cibles sont des seuils à tenir. Seul le premier bloc est couvert par les tests de cette PR, sur un stockage **en mémoire**, pas sur un téléphone.

| Cible | Seuil proposé | Tenue aujourd’hui |
|---|---|---|
| Fichier refusé (JSON cassé, non-objet, schéma > 1, document étranger, champ au mauvais type) | 0 écriture et 0 suppression sur la clé | Oui dans `src/persist.test.ts` (mémoire) |
| Profil d’avant le champ `digits` | XP, cartes, leçons, jours, course, réglages et record de tashkīl reviennent ; `digits` défaut `latn` | Oui, test déjà présent + champs inconnus ajoutés |
| Champ inconnu (`schemaVersion: 1`, note, drapeau de réglage, clé de carte, clé de course) | Encore là après une édition | Oui, test mémoire |
| Course de deux chargements | La lecture lente ne réécrit pas par-dessus la lecture récente ; une écriture engagée est relue | Oui, test mémoire |
| Sauvegarde iCloud / Android Auto Backup / restauration d’appareil | À exécuter sur appareil avant toute bascule store | **Non fait. Reste le portail de bascule.** |
| Items encore étiquetés « à valider » | 0 avant une soumission store qui présenterait le texte comme établi | Non atteint. Les licences disent toutes `review: 'à valider'` (`src/data/licenses.ts`) |
| Accréditation, label CEFR, « contenu validé » | 0 occurrence dans l’app et la fiche store tant qu’un tiers compétent n’a pas signé | La fiche `store/ios-metadata.md` ne revendique pas de diplôme. Elle ne doit pas en gagner un. |
| Appels IA, OCR ou traduction payants pendant les tests de dev | 0 | 0 dans cette session |
| Couverture VoiceOver iPhone, TalkBack, Safari iPad | Parcours noté sur appareil, avec build | Non fait ici |

## Axe 1 — Produit

L’app tient le parcours décrit dans `README.md` (l.7-29 au SHA de base) : onboarding, leçons, exercices trois sens, seuil de leçon 60 % (`PASS` dans `src/state.ts`), Leitner, course avec ou sans chrono, test de tashkīl, export JSON, réinitialisation. Le README dit lui-même que le code a été recréé à partir du cahier des charges.

Hors de ce périmètre, et donc non livré : vocalisation d’un texte quelconque, photo, PDF, traduction demandée par l’utilisateur, favoris, sync, compte. Le dire dans une fiche store serait faux.

## Axe 2 — Produits du même créneau (sources, pas un classement)

Aucune session comparative n’a été jouée. Aucun chiffre de note, de rétention ou de « meilleur que » n’est repris. Les noms ci-dessous situent le créneau. Leurs promesses sont les leurs.

| Nom | Rôle dans le créneau | Source consultée le 7 nov. 2026 |
|---|---|---|
| Duolingo, cours d’arabe | Alphabet, écriture droite-gauche, arabe standard | https://www.duolingo.com/course/ar/en/Learn-Arabic et https://blog.duolingo.com/learning-other-writing-systems/ |
| Kaleela | Alphabet, arabe standard, dialectes, grammaire annoncée par l’éditeur | https://kaleela.com/en/ |
| AlifBee | Arabe standard, lettres et voyelles, grammaire annoncée par l’éditeur | https://alifbee.com/en/ |
| CAMeL Tools `camel_diac` | Outil de recherche pour **proposer** une vocalisation, pas une vérité | https://camel-tools.readthedocs.io/en/stable/cli/camel_diac.html et Obeid et al., LREC 2020, https://aclanthology.org/2020.lrec-1.868.pdf |

Un outil comme `camel_diac` peut, plus tard, **proposer** des analyses. Il ne doit pas écraser le texte source ni être présenté comme un correcteur certifié. Cette PR ne l’intègre pas.

## Axe 3 — Sources et licences

`src/data/licenses.ts` classe tout le contenu en `review: 'à valider'`. Quatre statuts : original ArabGram (CC BY-SA **proposé**, non confirmé), proverbes (domaine public **à valider**), vers présentés comme al-Mutanabbī et Imruʾ al-Qays (attribution et statut **à valider**), placeholder `u11l3` vide (`src/data/curriculum.ts`, objet `id: 'u11l3'`). Les traductions sont décrites comme originales et non relues. Aucun manuel n’est embarqué, d’après ces fichiers et le README. La police Noto Naskh est citée en SIL OFL dans le README. Ceci n’est pas un avis juridique.

## Axe 4 — UX iPhone, iPad, web, RTL

`app.json` : `supportsTablet: true`, `orientation: "default"`, `ios.bundleIdentifier` `ch.mohamadba.arabgram`. Le web est une PWA (`experiments.baseUrl` `/arabgram`). RTL : `src/app/_layout.tsx` met `direction` et, sur le web, `documentElement.dir` / `lang` selon `settings.lang === 'ar'`.

Aucun iPhone, iPad ou navigateur n’a été tenu pendant cet audit. Aucune capture n’est fournie. La PR #2 ajoute du mouvement, un mode Focus et des réglages ; elle n’est pas fusionnée et sa branche n’a pas été modifiée.

## Axe 5 — Accessibilité

Sur `main` : cibles annoncées ≥ 44 pt dans le README, contraste et tailles réglables, course sans chrono, `reduceMotion`, libellés sur une partie des contrôles (ex. exercices dans `src/app/drill.tsx`). La PR #2 ajoute des tests de contraste et un scan ; ils ne sont pas sur `main` et n’ont pas été exécutés ici. VoiceOver, TalkBack, Dynamic Type sur appareil : non vérifiés.

## Axe 6 — Architecture, hors-ligne, CI

Un store maison (`src/kit/store.ts`) parle à AsyncStorage. La clé d’apprentissage est `arabgram@v1` (`createPersistedStore('arabgram', …, 1)`). Pas de réseau pour les leçons. Le bandeau hors-ligne est informatif (`src/kit/net.tsx`, `OfflineBadge`).

CI : `.github/workflows/pages.yml` sur push `main` seulement — `npm ci`, `tsc`, `npm run build:web`, déploiement Pages. **`npm test` n’y figure pas.** Un correctif de données peut donc être publié sur `main` sans que les tests de persistance tournent dans GitHub. Cette PR ne change pas ce workflow, pour ne pas élargir le déploiement.

`BootGate` (`src/kit/ui.tsx`, vers l.666-672 au SHA de base) peut laisser entrer l’utilisateur avec « Continuer hors ligne » pendant que la lecture continue. C’est la course que le store rejoue maintenant sur l’instantané, au lieu d’écraser la mémoire avec le disque ou l’inverse.

## Axe 7 — Performance

Pas de profilage. Le curriculum est embarqué. L’écriture est différée de 150 ms (`writeSoon` dans `src/kit/store.ts`). Aucun chiffre de démarrage, de mémoire ou d’images par seconde n’a été mesuré. En inventer un serait faux.

## Axe 8 — Sécurité, nLPD, RGPD

Aujourd’hui la progression reste sur l’appareil. La politique `public/privacy/index.html` (datée 27 octobre 2026 dans le fichier) dit qu’il n’y a pas de compte, pas de publicité, pas de suivi, et cite la nLPD et le RGPD. Elle devra être réécrite **avant** toute caméra, tout OCR ou tout envoi à un modèle : ce serait un nouveau traitement, avec base légale, destinataire, durée et coût à expliquer.

`src/lib/crash.ts` peut POST une erreur vers Sentry **si** `EXPO_PUBLIC_SENTRY_DSN` est un DSN réel. Le dépôt laisse le placeholder `YOUR_`. Le corps envoyé est le message d’exception et une pile tronquée, pas l’objet de progression. `probeOptionalService` (`src/lib/optionalService.ts`) ne part qu’au geste utilisateur, et pas si l’URL commence par `YOUR_`.

Pas de secret dans cette PR. `.env.example` ne contient que des placeholders. Cette session n’a pas appelé d’API payante.

Point de données : l’export des Réglages partage le JSON en local (`src/kit/files.ts`, téléchargement web ou feuille de partage). Ce n’est pas un envoi à ArabGram.

## Axe 9 — Linguistique

L’arabe du curriculum est déjà vocalisé. Les fichiers disent que la vocalisation des proverbes et des vers est **à valider** (`src/data/licenses.ts`, leçon classique dans `curriculum.ts`). Le test de tashkīl (`src/data/tashkil.ts`) interroge des paires minimales écrites à l’avance (`كَتَبَ` / `كُتِبَ` / `كُتُب`, etc.). Ce n’est pas un analyseur. Plusieurs lectures d’un même squelette sont normales en arabe ; un outil qui n’en rend qu’une, sans le dire, induit en erreur.

Règle pour plus tard, non implémentée : l’original de l’utilisateur reste intact ; toute proposition est une couche dérivée ; s’il n’y a pas de score fourni par l’outil, l’interface dit que c’est incertain ; aucune ḥaraka n’est inventée pour « compléter ». Le bandeau arabe ajouté par cette PR (fichier local conservé) est **nouveau et non relu**.

## Axe 10 — Pédagogie, retrieval, répétition

Ce qui est dans le code : rappel par QCM (forme arabe, glose, translittération), seconde chance en fin de série (`src/app/drill.tsx`), Leitner (bonne réponse : boîte + 1 ; erreur : boîte 1), seuil 60 % pour marquer une leçon, XP et série de jours, course vitesse × précision. `src/app/(tabs)/progress.tsx` affiche ces compteurs.

Ce qui n’est pas dans le code : pré-test / post-test, instrument publié, accord inter-juges, relecture didactique, courbe de rétention mesurée sur des apprenants. Les compteurs ne deviennent pas une preuve d’apprentissage parce qu’ils s’affichent. Aucune accréditation n’est revendiquée ici, et il ne faut pas en ajouter une sur la fiche `store/ios-metadata.md`.

## Axe 11 — IA, licences, stores

IA : phase 2, écran dev, bannière « Non activé » (`src/app/tutor.tsx`). Pas de clé OpenAI dans l’app (`src/config.ts` le dit). Cette PR n’ajoute pas de fournisseur.

Stores : `store/ios-metadata.md` est un brouillon. Il dit qu’aucune soumission n’a été faite. `eas.json` existe ; **aucun build n’a été lancé**. Identifiants laissés tels quels (`ch.mohamadba.arabgram`). La fiche demande des captures iPhone et iPad : elles ne sont pas produites ici.

Le placeholder `u11l3` et les mentions « à valider » sont le point de licence à régler avant une review Apple ou Google, plus que le moteur de persistance.

## Axe 12 — Croissance, KPI éthiques, synergies

Aucun analytics n’est branché (cohérent avec la politique de confidentialité). Des KPI éthiques **proposés**, non calculés, faute de données : part des sessions 100 % hors ligne, nombre d’exports avant une réinitialisation, nombre d’items encore « à valider », nombre d’appels tiers (cible 0 tant que le consentement n’existe pas). Pas de cohorte, pas de revenu, pas de comparaison de croissance.

Synergies : la PR #2 pose d’autres clés (`arabgram:focus@v1`, `arabgram:vibrations@v1` d’après sa description) **à côté** de `arabgram@v1`, avec son propre code de lecture. Ce correctif ne les protège pas, parce qu’elles ne passent pas par `createPersistedStore` et que leur branche n’a pas été éditée. Un rebuild SwiftUI ultérieur devra lire `arabgram@v1` avec les mêmes refus (schéma futur, champs inconnus) au lieu de réinitialiser l’appareil. Pas de big bang dans cette PR.

Le portefeuille d’apps hors ArabGram est hors périmètre.

## Correctif livré (un seul fondement)

Fichiers : `src/lib/learningSnapshot.ts`, `src/kit/store.ts`, `src/state.ts`, `src/persist.test.ts`, `src/components/RecoveryBanner.tsx`, `src/app/(tabs)/settings.tsx`, `src/app/(tabs)/progress.tsx`, `src/app/(tabs)/review.tsx`.

Comportement :

- `inspectLearningSnapshot` décide sans écrire. Adoption seulement si l’objet ressemble à un profil v1 : pas de version de schéma autre que `1`, au moins une clé connue s’il y a des clés, types connus respectés quand le champ est présent.
- JSON illisible, `null`, tableau, chaîne, schéma futur, document sans clé de profil, ou champ connu au mauvais type : quarantaine. La clé n’est ni réécrite ni supprimée. L’export porte `rawSnapshot` (octets exacts) et `current: null`, pour qu’un profil vide ne soit pas pris pour la sauvegarde.
- Champs inconnus conservés (sommet, réglages, carte, session, course) et recopiés quand une carte Leitner est mise à jour (`nextSrsCard`).
- Édition par fonction pendant le chargement : rejouée **sur** l’instantané adopté, pas sur le profil vide. Un `set(objetEntier)` pendant le chargement ne remplace pas un fichier existant (le test historique). Il est appliqué seulement si la clé est vide.
- Deux chargements : le plus ancien ne réécrit pas l’état du plus récent. Une écriture déjà partie est poussée avant la relecture suivante.
- Panne de `getItem` : aucune écriture. Une édition faite **après** l’échec reste en mémoire et n’est écrite qu’au chargement suivant s’il réussit, rejouée sur le vrai profil.
- Panne de `setItem` : la mémoire garde la valeur, `writeFailed` passe à vrai, la clé n’est pas vidée.
- `reset()` est le seul `removeItem`. Un fichier refusé y survit tant que l’utilisateur ne confirme pas la suppression.
- Bandeau sur Progrès et Réglages quand le fichier est refusé. L’export des Réglages écrit l’enveloppe `arabgram-learning-export`.
- `progress.tsx` et `review.tsx` ne plantent plus si une carte n’a pas `ok` ou `due` (sinon la boundary racine empêcherait d’atteindre l’export).

Hors correctif, à dessein : pas de nouveau mot arabe, pas d’import de document, pas de séparation original/dérivé au-delà du refus d’un document étranger dans la même clé, pas de changement du plafond de 50 courses, pas de changement de la liste de réglages gardés au reset.

## Chevauchement avec la PR #2

Branche `ux/passe-plaisir-2026-11-04` **non modifiée**.

Fichier touché des deux côtés : `src/app/(tabs)/settings.tsx`. La PR #2 y ajoute le réglage Vibrations et un import `src/kit/haptics`. Cette PR y ajoute `RecoveryBanner`, l’import correspondant, et remplace le corps de l’export (`JSON.stringify(store.get())` devient `JSON.stringify(exportLearningRecord())`). Le bloc Vibrations et le bloc export sont distincts ; un merge peut quand même accrocher les imports.

Non touchés ici, alors que la PR #2 les modifie : `src/app/_layout.tsx`, `src/kit/ui.tsx`, `package.json`, `src/app/(tabs)/learn.tsx`, et les fichiers Focus. `src/kit/store.ts` et `src/state.ts` ne sont pas dans la PR #2.

Les clés Focus et Vibrations de la PR #2 ont leur propre lecture. Les y faire passer par le même garde-fou demanderait d’éditer cette branche : ce n’est pas fait.

## Tests réellement exécutés

Commandes, sur cette branche, après `npm ci` :

- `npm test` → `node --experimental-strip-types --import ./scripts/register-alias.mjs --test src/persist.test.ts` → **15 tests, 15 réussites, 0 échec** (répétée après le dernier correctif de typage du test).
- `npx tsc --noEmit` → succès (code de sortie 0).

Le stockage de test est un `Map` en mémoire (`KvStorage`). Cela couvre : ancien profil, champs inconnus, schéma futur, document étranger, `xp` chaîne, `[]` / `null` / chaîne JSON, inspection sans écriture, édition pendant le chargement, deux hydratations, écriture relue par l’hydratation suivante, panne de lecture, panne d’écriture, `reset` séparé d’un refus, carte Leitner avec clé inconnue, carte non planifiable ignorée par les compteurs.

Non exécuté : backup iOS, restauration d’appareil, Expo Go, Safari, iPad, build web, EAS, Pages. Le portail de bascule reste : instantané + restauration isolée **sur l’appareil**, pas seulement ce `Map`.

Le bandeau n’a pas été ouvert dans un navigateur. Son apparition dépend de `recovery().status === 'quarantine'`, état couvert par les tests ; le rendu visuel, non.

## Limites et décisions encore ouvertes

- Propriétaire : licence du contenu original, relecteur des vers et proverbes, texte de `u11l3`, relecture du bandeau arabe nouveau.
- Produit : que garde exactement « Réinitialiser » parmi les réglages d’accessibilité.
- Produit : faut-il lever le plafond de 50 sessions de course, ou exporter l’historique complet à part.
- Plus tard, et seulement avec un consentement séparé : vocalisation proposée, caméra, documents, traduction. Original intact, dérivé séparé, outil nommé, incertitude visible, aucun score inventé.
- La PR #2 reste à fusionner à part, en résolvant `settings.tsx`.
- Aucune bascule store tant que la restauration sur appareil n’a pas été faite, et tant que le contenu « à valider » est présenté comme tel.
