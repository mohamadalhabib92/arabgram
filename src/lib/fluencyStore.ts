import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUENCY_KEY, parseFluency, type FluencyLog } from '@/lib/fluency';

/** Lecture seule de l’historique de fluidité. N’ouvre pas `arabgram@v1`. */
export function useFluencyLog(): FluencyLog {
  const [log, setLog] = useState<FluencyLog>({ checks: [] });
  const load = useCallback(() => {
    AsyncStorage.getItem(FLUENCY_KEY)
      .then((raw) => setLog(parseFluency(raw)))
      .catch(() => setLog({ checks: [] }));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return log;
}
