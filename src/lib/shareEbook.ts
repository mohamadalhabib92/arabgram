import { Platform, Share } from 'react-native';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';

const PDF = require('../../assets/ebook/arabgram-ebook.pdf');
const FILE_NAME = 'arabgram-ebook.pdf';

export function isShareCancel(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /cancel|dismiss|abort/i.test(message);
}

/** Ouvre la feuille de partage du PDF (reMarkable, Fichiers, AirDrop) ou le télécharge. */
export async function shareEbookPdf(): Promise<void> {
  const asset = Asset.fromModule(PDF);
  if (Platform.OS === 'web') {
    await shareOnWeb(asset.uri);
    return;
  }
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  if (!uri) throw new Error('pdf-missing');
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: 'ArabGram — ebook',
    });
    return;
  }
  await Share.share({ url: uri, title: 'ArabGram — ebook' });
}

async function shareOnWeb(uri: string): Promise<void> {
  if (typeof fetch !== 'function' || typeof document === 'undefined') throw new Error('pdf-web');
  const res = await fetch(uri);
  if (!res.ok) throw new Error('pdf-fetch');
  const blob = await res.blob();
  const file = new File([blob], FILE_NAME, { type: 'application/pdf' });
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  if (nav?.share && nav.canShare?.({ files: [file] })) {
    await nav.share({ files: [file], title: 'ArabGram — Lire l’arabe, lettre après lettre' });
    return;
  }
  const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
  const opened = typeof window !== 'undefined' ? window.open(url, '_blank', 'noopener') : null;
  if (opened) return;
  const a = document.createElement('a');
  a.href = url;
  a.download = FILE_NAME;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
