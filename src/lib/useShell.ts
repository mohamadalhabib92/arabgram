import { Platform, useWindowDimensions } from 'react-native';
import { isIosAppOnMac } from '@/lib/mac';
import { shellMetrics, type ShellMetrics } from '@/lib/shellMetrics';

export function useShell(): ShellMetrics & { mac: boolean; width: number } {
  const { width } = useWindowDimensions();
  const mac = isIosAppOnMac();
  return {
    ...shellMetrics({
      width,
      pad: Platform.OS === 'ios' && Boolean((Platform as { isPad?: boolean }).isPad),
      mac,
      tv: Platform.isTV === true,
      web: Platform.OS === 'web',
    }),
    mac,
    width,
  };
}
