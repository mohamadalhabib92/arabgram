import { Redirect } from 'expo-router';
import { store } from '@/state';

export default function Index() {
  const onboarded = store.useSelect((s) => s.onboarded);
  return <Redirect href={onboarded ? '/learn' : '/onboarding'} />;
}
