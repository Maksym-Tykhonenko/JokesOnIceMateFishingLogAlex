import AsyncStorage from '@react-native-async-storage/async-storage';

export type MateLogCatch = {
  mateLogId: string;
  mateLogName: string;
  mateLogType: 'my' | 'mate';
  mateLogFishName: string;
  mateLogFishCount: number;
  mateLogWeightKg: string;
  mateLogImageUri?: string;
};

export type MateLogSession = {
  mateLogId: string;
  mateLogSessionName: string;
  mateLogLocationName: string;
  mateLogLatitude: number;
  mateLogLongitude: number;
  mateLogTemperature: string;
  mateLogWind: string;
  mateLogClouds: string;
  mateLogDate: string;
  mateLogIsCompleted?: boolean;
  mateLogSessionNotes?: string;
  mateLogCatches?: MateLogCatch[];
};

type MateLogCreateSessionPayload = Omit<MateLogSession, 'mateLogId'>;

const MATE_LOG_SESSIONS_KEY = '@mateLog/sessions';
const mateLogSessionsListeners = new Set<() => void>();

const mateLogNotifySessionsChanged = () => {
  mateLogSessionsListeners.forEach(mateLogListener => {
    mateLogListener();
  });
};

export const mateLogSubscribeSessions = (mateLogListener: () => void) => {
  mateLogSessionsListeners.add(mateLogListener);
  return () => {
    mateLogSessionsListeners.delete(mateLogListener);
  };
};

export const mateLogGetSessions = async (): Promise<MateLogSession[]> => {
  const mateLogRawValue = await AsyncStorage.getItem(MATE_LOG_SESSIONS_KEY);

  if (!mateLogRawValue) {
    return [];
  }

  try {
    const mateLogParsed = JSON.parse(mateLogRawValue) as MateLogSession[];
    return Array.isArray(mateLogParsed) ? mateLogParsed : [];
  } catch {
    return [];
  }
};

export const mateLogAddSession = async (
  mateLogPayload: MateLogCreateSessionPayload,
): Promise<void> => {
  const mateLogCurrentSessions = await mateLogGetSessions();

  const mateLogNewSession: MateLogSession = {
    ...mateLogPayload,
    mateLogId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mateLogIsCompleted: false,
  };

  const mateLogUpdatedSessions = [mateLogNewSession, ...mateLogCurrentSessions];
  await AsyncStorage.setItem(
    MATE_LOG_SESSIONS_KEY,
    JSON.stringify(mateLogUpdatedSessions),
  );
  mateLogNotifySessionsChanged();
};

export const mateLogUpdateSession = async (
  mateLogSessionId: string,
  mateLogPayload: MateLogCreateSessionPayload,
): Promise<void> => {
  const mateLogCurrentSessions = await mateLogGetSessions();

  const mateLogUpdatedSessions = mateLogCurrentSessions.map(mateLogSession => {
    if (mateLogSession.mateLogId !== mateLogSessionId) {
      return mateLogSession;
    }

    return {
      ...mateLogSession,
      ...mateLogPayload,
    };
  });

  await AsyncStorage.setItem(
    MATE_LOG_SESSIONS_KEY,
    JSON.stringify(mateLogUpdatedSessions),
  );
  mateLogNotifySessionsChanged();
};

export const mateLogDeleteSession = async (
  mateLogSessionId: string,
): Promise<void> => {
  const mateLogCurrentSessions = await mateLogGetSessions();
  const mateLogUpdatedSessions = mateLogCurrentSessions.filter(
    mateLogSession => mateLogSession.mateLogId !== mateLogSessionId,
  );

  await AsyncStorage.setItem(
    MATE_LOG_SESSIONS_KEY,
    JSON.stringify(mateLogUpdatedSessions),
  );
  mateLogNotifySessionsChanged();
};

export const mateLogSetSessionCompleted = async (
  mateLogSessionId: string,
  mateLogIsCompleted: boolean,
): Promise<void> => {
  const mateLogCurrentSessions = await mateLogGetSessions();
  const mateLogUpdatedSessions = mateLogCurrentSessions.map(mateLogSession => {
    if (mateLogSession.mateLogId !== mateLogSessionId) {
      return mateLogSession;
    }

    return {
      ...mateLogSession,
      mateLogIsCompleted,
    };
  });

  await AsyncStorage.setItem(
    MATE_LOG_SESSIONS_KEY,
    JSON.stringify(mateLogUpdatedSessions),
  );
  mateLogNotifySessionsChanged();
};

export const mateLogSaveSessionRuntimeData = async (
  mateLogSessionId: string,
  mateLogSessionNotes: string,
  mateLogCatches: MateLogCatch[],
): Promise<void> => {
  const mateLogCurrentSessions = await mateLogGetSessions();
  const mateLogUpdatedSessions = mateLogCurrentSessions.map(mateLogSession => {
    if (mateLogSession.mateLogId !== mateLogSessionId) {
      return mateLogSession;
    }

    return {
      ...mateLogSession,
      mateLogSessionNotes,
      mateLogCatches,
    };
  });

  await AsyncStorage.setItem(
    MATE_LOG_SESSIONS_KEY,
    JSON.stringify(mateLogUpdatedSessions),
  );
  mateLogNotifySessionsChanged();
};
