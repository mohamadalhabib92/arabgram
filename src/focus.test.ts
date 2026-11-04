import { test } from 'node:test';
import { focusCases } from '@/kit/focus.cases';

// Clés existantes de l’app : elles ne doivent jamais être lues ni écrites par le Mode Focus.
for (const c of focusCases('arabgram:focus@v1', ['arabgram@v1', 'arabgram:vibrations@v1'])) test(`Mode Focus — ${c.name}`, c.run);
