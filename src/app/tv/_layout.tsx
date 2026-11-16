import { Stack } from 'expo-router';
import { useTheme } from '@/kit/theme';

export default function TvLayout() {
  const theme = useTheme();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }} />;
}
