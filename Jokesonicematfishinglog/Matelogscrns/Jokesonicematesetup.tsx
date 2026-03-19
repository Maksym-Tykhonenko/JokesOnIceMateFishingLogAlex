// Settings

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { ReactNode } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useMateLogStore } from '../Matelogstore/mateLogContxt';

type MateLogSettingsItemProps = {
  mateLogIcon: ImageSourcePropType;
  mateLogTitle: string;
  mateLogRight?: ReactNode;
  mateLogOnPress?: () => void;
};

const MateLogSettingsItem = ({
  mateLogIcon,
  mateLogTitle,
  mateLogRight,
  mateLogOnPress,
}: MateLogSettingsItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.mateLogRow}
      onPress={mateLogOnPress}
      disabled={!mateLogOnPress}
    >
      <View style={styles.mateLogRowLeft}>
        <View style={styles.mateLogRowIconWrap}>
          <Image source={mateLogIcon} />
        </View>
        <Text style={styles.mateLogRowTitle}>{mateLogTitle}</Text>
      </View>
      {mateLogRight ?? <View />}
    </TouchableOpacity>
  );
};

const Jokesonicematesetup = () => {
  const navigation = useNavigation<any>();
  const {
    mateLogNotificationsEnabled,
    setMateLogNotificationsEnabled,
    mateLogSoundEnabled,
    setMateLogSoundEnabled,
  } = useMateLogStore();

  const toggleNotifications = async (selectedValue: boolean) => {
    Toast.show({
      text1: !mateLogNotificationsEnabled
        ? 'Notifications turned on'
        : 'Notifications turned off',
    });

    try {
      await AsyncStorage.setItem(
        'toggleNotifications',
        JSON.stringify(selectedValue),
      );
      setMateLogNotificationsEnabled(selectedValue);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const toggleSound = async (selectedValue: boolean) => {
    mateLogNotificationsEnabled &&
      Toast.show({
        text1: !mateLogSoundEnabled
          ? 'Timer sound turned on!'
          : 'Timer sound turned off!',
      });

    try {
      await AsyncStorage.setItem('toggleSound', JSON.stringify(selectedValue));

      setMateLogSoundEnabled(selectedValue);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const mateLogResetAllData = () => {
    Alert.alert(
      'Reset everything?',
      'This will permanently delete all sessions, catches, saved spots, notes, and statistics. This action cannot be undone',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setMateLogNotificationsEnabled(false);
              setMateLogSoundEnabled(false);
              Toast.show({
                type: 'success',
                text1: 'All data reset successfully',
              });
            } catch (error) {
              console.log('Reset error', error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.mateLogScreen}>
      <ScrollView
        style={styles.mateLogScroll}
        contentContainerStyle={styles.mateLogScrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View>
          <ImageBackground
            source={require('../../elements/images/jokesonicheader.png')}
            style={styles.mateLogHeaderBackground}
          >
            <View style={styles.mateLogHeaderCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mateLogBackButton}
                onPress={() => navigation.goBack()}
              >
                <Image
                  source={require('../../elements/images/jokesonicbakc.png')}
                />
              </TouchableOpacity>
              <Text style={styles.mateLogHeaderTitle}>Settings</Text>
            </View>
          </ImageBackground>
          <LinearGradient
            colors={['#AAC3FD00', '#AAC3FD']}
            style={styles.mateLogHeaderBottomFade}
          />
        </View>

        <View style={styles.mateLogRowsWrap}>
          <MateLogSettingsItem
            mateLogIcon={require('../../elements/images/jokesonicbntf.png')}
            mateLogTitle="Notifications"
            mateLogRight={
              <Switch
                value={mateLogNotificationsEnabled}
                onValueChange={selectedValue =>
                  toggleNotifications(selectedValue)
                }
                trackColor={{ false: '#3B5B88', true: '#FFC227' }}
                thumbColor="#F7F7F7"
                ios_backgroundColor="#3B5B88"
              />
            }
          />

          <MateLogSettingsItem
            mateLogIcon={require('../../elements/images/jokesonicsnd.png')}
            mateLogTitle="Timer Sound"
            mateLogRight={
              <Switch
                value={mateLogSoundEnabled}
                onValueChange={selectedValue => toggleSound(selectedValue)}
                trackColor={{ false: '#295082', true: '#FFC227' }}
                thumbColor="#F7F7F7"
                ios_backgroundColor="#295082"
              />
            }
          />

          <View style={styles.mateLogRowSeparator} />
          <MateLogSettingsItem
            mateLogIcon={require('../../elements/images/jokesonicshr.png')}
            mateLogTitle="Share the App"
            mateLogOnPress={() => {
              Linking.openURL(
                'https://apps.apple.com/us/app/ice-missing-mate-on-log/id6760100410',
              );
            }}
          />
          <MateLogSettingsItem
            mateLogIcon={require('../../elements/images/jokesonicrest.png')}
            mateLogTitle="Reset All Data"
            mateLogOnPress={mateLogResetAllData}
          />
          <MateLogSettingsItem
            mateLogIcon={require('../../elements/images/jokesonicterms.png')}
            mateLogTitle="Terms of Use"
            mateLogOnPress={() => {
              Linking.openURL(
                'https://www.termsfeed.com/live/336ade72-999d-413d-ac80-b19f11fb84a6',
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mateLogScreen: {
    flex: 1,
    backgroundColor: '#A9C1F4',
  },
  mateLogScroll: {
    flex: 1,
  },
  mateLogScrollContent: {
    paddingBottom: 30,
  },
  mateLogHeaderBackground: {
    height: 172,
    paddingTop: 62,
    paddingHorizontal: 20,
  },
  mateLogHeaderCard: {
    height: 66,
    borderRadius: 14,
    backgroundColor: '#CBE0FFBA',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mateLogBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mateLogHeaderTitle: {
    color: '#032E60',
    fontSize: 20,
    fontWeight: '600',
  },
  mateLogRowsWrap: {
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 10,
  },
  mateLogRow: {
    minHeight: 58,
    borderRadius: 12,
    backgroundColor: '#032E60',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mateLogRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  mateLogRowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0075FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  mateLogRowIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  mateLogRowTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  mateLogRowSeparator: {
    marginVertical: 8,
  },
  mateLogHeaderBottomFade: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'absolute',
    bottom: -10,
  },
});

export default Jokesonicematesetup;
