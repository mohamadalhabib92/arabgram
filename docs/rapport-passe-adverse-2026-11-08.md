# ArabGram — passe adverse conservation (8 novembre 2026)

Même PR : https://github.com/mohamadalhabib92/arabgram/pull/3  
Branche : `cursor/conservation-donnees-07ec`  
Base relue : `a9bad234ab727a30cc218de7140d205a9da4cc02`  
Correctif : `dc6b31d360e5eaae2426df063ba7ce987a5756ba`  
`main` au moment de la passe : `b699d3f81cafe96af24e529db452ad2a0ac7d7fe`

Fixtures synthétiques seulement (profils construits dans `src/persist.test.ts`). Aucune donnée réelle. Aucun appareil. Aucun navigateur utilisé comme preuve. Stockage des tests : `Map` en mémoire.

## Défaut prouvé

Sur `a9bad23`, `reset()` mettait `loadSettled` à vrai dans le `catch` de `removeItem`, même si la suppression avait échoué et qu’aucun profil n’avait été adopté. La mémoire restait l’état initial vide. L’appel suivant à `hydrate()` voyait `loadSettled`, copiait cet état vide dans `pendingFlush`, puis `rememberWrite` l’écrivait sur la clé avant de relire (`src/kit/store.ts`, enchaînement flush puis `getItem`).

Le bouton Réglages enchaînait en plus, sans regarder le résultat : `store.set` d’un profil minimal (langue / glose / thème seulement). Sur une mémoire vide, cet enregistrement aurait aussi remplacé le fichier.

Reproduction avant correctif, fixture `richProfile()` (XP 420, carte, `notes`, `imports`, aucun fichier utilisateur) :

```text
node --experimental-strip-types --import ./scripts/register-alias.mjs --test --test-name-pattern "reset avant lecture" src/persist.test.ts
```

Résultat observé sur `a9bad23` : échec `writes` **1 !== 0**. Une écriture partait. Après `dc6b31d`, le même test exige 0 écriture et les octets d’origine.

Cause dans le code, pas supposée : le `catch` de `removeItem` autorisait l’écriture ; le flush de `hydrate` consommait cette autorisation.

## Correctif borné

- Suppression refusée : on ne réautorise l’écriture que si un profil a déjà été adopté (`recovery.status === 'ready'`). Sinon `loadSettled` reste faux, donc pas de flush de l’état vide.
- `afterResetAttempt` (`src/state.ts`) ne pose le profil minimal que si la clé a vraiment disparu (`shouldRestoreLanguageAfterReset` : `ready`, `raw === null`, pas `writeFailed`).
- Sinon, si la mémoire n’a pas encore adopté le fichier, elle le relit. Le toast dit que rien n’a été remplacé. Il ne contient pas le JSON.
- L’export reste le bouton explicite des Réglages. Le bandeau de quarantaine ne colle pas le document.

Fichiers : `src/kit/store.ts`, `src/state.ts`, `src/app/(tabs)/settings.tsx`, `src/persist.test.ts`.

## Résultats

Commande : `npm test` (`src/persist.test.ts`) puis `npx tsc --noEmit`.

| Passe | Résultat |
|---|---|
| Suite au départ de `a9bad23` (historique de la PR) | 15/15, `tsc` ok |
| Reproduction du défaut sur `a9bad23` | 1 échec, `writes` 1 !== 0 |
| Suite après `dc6b31d` | **22/22**, 0 échec |
| `npx tsc --noEmit` après `dc6b31d` | code de sortie 0 |

Les 7 tests ajoutés couvrent : reset avant lecture + `removeItem` rejeté ; le geste Réglages dans le même cas ; fichier déjà refusé (schéma futur) + reset refusé ; reset pendant une lecture encore en attente ; 50 éditions en file pendant le chargement (XP 420 → 470, notes, imports, carte, contraste conservés) ; reset refusé après adoption (le thème « light » du suivi n’est pas appliqué, le fichier « dark » reste) ; suppression acceptée, qui retire encore la clé et n’écrit le profil minimal qu’ensuite.

Déjà verts et relancés : ancien profil, champs inconnus, schéma futur / étranger / mal typé / non-objet, JSON illisible, panne de lecture, panne d’écriture, deux hydratations, écriture relue, carte illisible non notée.

## Vérifié, sans changement de code

| Sujet | Constat |
|---|---|
| Déconnexion | Aucun `signOut` / logout dans le code applicatif. `FEATURE_ACCOUNT` est false (`src/config.ts`). Rien à rendre « non destructeur » : le chemin n’existe pas. |
| Plafond 50 de la course | `recordPacer` coupe encore à 50 sessions. Ce n’est pas l’écriture vide prouvée. Non modifié. |
| File de 50 éditions au chargement | Rejouée sur l’instantané, pas écrasée par l’état vide. Test vert, pas de changement d’algorithme au-delà du reset. |
| JSON enfant | Pas d’affichage automatique du document. Export seulement au bouton. |
| Caméra, vocalisation auto, IA, texte pédagogique | Absents. Rien ajouté. |
| PR #2 `ux/passe-plaisir-2026-11-04` | Branche non modifiée. |

## Conflit avec la PR #2

Les deux PR touchent `src/app/(tabs)/settings.tsx`. La #2 ajoute Vibrations. Celle-ci change l’import et le bouton Effacer (`afterResetAttempt` + toast si la suppression échoue). `src/kit/store.ts` et `src/state.ts` ne sont pas dans la #2. Les clés Focus et Vibrations de la #2 ne passent pas par ce store.

## Ignoré comme preuve

- `Map` mémoire, pas une sauvegarde iCloud, Android Auto Backup, ni une restauration après réinstallation.
- Pas de Safari, pas d’Expo Go, pas d’iPad, pas de capture.
- Le bandeau et le toast n’ont pas été ouverts à l’écran. Le texte arabe du toast est nouveau et non relu.
- Pas de build web, pas d’EAS, pas de Pages, pas de migration.

## Déclencheurs de `main`

`.github/workflows/pages.yml` part sur `push` vers **`main`** et sur `workflow_dispatch`. Un push de `cursor/conservation-donnees-07ec` ne lance pas ce déploiement. Cette passe n’a pas poussé `main`, n’a pas fusionné, n’a pas lancé le workflow.

## Critères de publication

Non atteints. Ne pas merger, ne pas builder, ne pas publier, ne pas déployer, ne pas migrer sur la foi de cette passe.

Il manque encore, avant toute publication :

1. Sauvegarde puis restauration **sur un appareil** (ou un équivalent qui n’est pas ce `Map`), avec le fichier riche encore là après le scénario « suppression refusée ».
2. Retour arrière vérifié sur cet appareil : réinstaller ou restaurer la sauvegarde et relire `arabgram@v1` sans profil vide.
3. Relecture du toast arabe et, séparément, du corpus encore marqué « à valider ».
4. Résolution du chevauchement `settings.tsx` avec la PR #2 si les deux doivent entrer dans `main`.
5. `npm test` dans le contrôle des PR : aujourd’hui Pages ne lance que `tsc` et l’export web, et seulement depuis `main`.
