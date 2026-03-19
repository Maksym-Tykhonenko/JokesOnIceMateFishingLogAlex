import AsyncStorage from '@react-native-async-storage/async-storage';

const MATE_LOG_SAVED_JOKES_KEY = '@mateLog/savedJokes';
const MATE_LOG_STATS_PREFS_KEY = '@mateLog/statsPrefs';

type MateLogStatsPrefs = {
  mateLogUseSample: boolean;
  mateLogRangeTab: 'week' | 'month';
};

export const mateLogGetSavedJokes = async (): Promise<number[]> => {
  const mateLogRawValue = await AsyncStorage.getItem(MATE_LOG_SAVED_JOKES_KEY);
  if (!mateLogRawValue) {
    return [];
  }

  try {
    const mateLogParsed = JSON.parse(mateLogRawValue) as number[];
    if (!Array.isArray(mateLogParsed)) {
      return [];
    }
    return mateLogParsed.filter(mateLogIndex => Number.isInteger(mateLogIndex));
  } catch {
    return [];
  }
};

export const mateLogSetSavedJokes = async (
  mateLogSavedJokes: number[],
): Promise<void> => {
  await AsyncStorage.setItem(
    MATE_LOG_SAVED_JOKES_KEY,
    JSON.stringify(mateLogSavedJokes),
  );
};

export const mateLogGetStatsPrefs = async (): Promise<MateLogStatsPrefs | null> => {
  const mateLogRawValue = await AsyncStorage.getItem(MATE_LOG_STATS_PREFS_KEY);
  if (!mateLogRawValue) {
    return null;
  }

  try {
    const mateLogParsed = JSON.parse(mateLogRawValue) as MateLogStatsPrefs;
    if (
      typeof mateLogParsed?.mateLogUseSample !== 'boolean' ||
      (mateLogParsed?.mateLogRangeTab !== 'week' &&
        mateLogParsed?.mateLogRangeTab !== 'month')
    ) {
      return null;
    }
    return mateLogParsed;
  } catch {
    return null;
  }
};

export const mateLogSetStatsPrefs = async (
  mateLogPrefs: MateLogStatsPrefs,
): Promise<void> => {
  await AsyncStorage.setItem(MATE_LOG_STATS_PREFS_KEY, JSON.stringify(mateLogPrefs));
};
