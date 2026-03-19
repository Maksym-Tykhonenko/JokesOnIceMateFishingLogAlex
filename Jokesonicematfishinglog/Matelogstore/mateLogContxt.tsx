import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const StoreContext = createContext<any>({});

export const useMateLogStore = () => {
  return useContext(StoreContext);
};

export const MateLogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mateLogNotificationsEnabled, setMateLogNotificationsEnabled] =
    useState(false);
  const [mateLogSoundEnabled, setMateLogSoundEnabled] = useState(false);

  useEffect(() => {
    const mateLogLoadPrefs = async () => {
      try {
        const mateLogNotificationsValue = await AsyncStorage.getItem(
          'toggleNotifications',
        );
        if (mateLogNotificationsValue !== null) {
          setMateLogNotificationsEnabled(JSON.parse(mateLogNotificationsValue));
        }

        const mateLogSoundValue = await AsyncStorage.getItem('toggleSound');
        if (mateLogSoundValue !== null) {
          setMateLogSoundEnabled(JSON.parse(mateLogSoundValue));
        }
      } catch {
        // Ignore storage read errors and keep defaults
      }
    };

    mateLogLoadPrefs().catch(() => {});
  }, []);

  const contextValues = {
    mateLogNotificationsEnabled,
    setMateLogNotificationsEnabled,
    mateLogSoundEnabled,
    setMateLogSoundEnabled,
  };

  return (
    <StoreContext.Provider value={contextValues}>
      {children}
    </StoreContext.Provider>
  );
};
