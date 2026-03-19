import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMateLogStore } from '../Matelogstore/mateLogContxt';
import { useCallback, useEffect } from 'react';
type MateLogHomeCardItem = {
  mateLogId: string;
  mateLogFish: ImageSourcePropType;
  mateLogTitle: string;
  mateLogDescription: string;
  mateLogButtonLabel: string;
  mateLogRoute: string;
};

const mateLogHomeCards: MateLogHomeCardItem[] = [
  {
    mateLogId: 'session',
    mateLogFish: require('../../elements/images/jokesonicfish1.png'),
    mateLogTitle: 'Start an Ice Session',
    mateLogDescription:
      'Save your spot, weather, notes, and everyone’s catches in one clean session',
    mateLogButtonLabel: 'Start Session',
    mateLogRoute: 'Jokesonicematesessn',
  },
  {
    mateLogId: 'jokes',
    mateLogFish: require('../../elements/images/jokesonicfish2.png'),
    mateLogTitle: 'Jokes on Ice',
    mateLogDescription: 'A quick laugh for the slow minutes',
    mateLogButtonLabel: 'Get a Joke',
    mateLogRoute: 'Jokesonicematejkes',
  },
  {
    mateLogId: 'who',
    mateLogFish: require('../../elements/images/jokesonicfish3.png'),
    mateLogTitle: 'Who Am I?',
    mateLogDescription: 'A fast guessing game for you and your mates',
    mateLogButtonLabel: 'Play Now',
    mateLogRoute: 'Jokesonicematequesint',
  },
];

const Jokesonicematehome = () => {
  const navigation = useNavigation<any>();
  const {
    mateLogNotificationsEnabled,
    setMateLogNotificationsEnabled,
    mateLogSoundEnabled,
    setMateLogSoundEnabled,
  } = useMateLogStore();

  useFocusEffect(
    useCallback(() => {
      loadMateLogNotifications();
      loadMateLogSound();
    }, [loadMateLogNotifications, loadMateLogSound]),
  );

  const loadMateLogNotifications = async () => {
    try {
      const mateLogNotificationsValue = await AsyncStorage.getItem(
        'toggleNotifications',
      );
      if (mateLogNotificationsValue !== null) {
        const isMateLogNotificationsOn = JSON.parse(mateLogNotificationsValue);
        setMateLogNotificationsEnabled(isMateLogNotificationsOn);
      }
    } catch (error) {
      console.error('Error!', error);
    }
  };

  const loadMateLogSound = async () => {
    try {
      const mateLogSoundValue = await AsyncStorage.getItem('toggleSound');
      const isMateLogSoundOn = JSON.parse(mateLogSoundValue);
      setMateLogSoundEnabled(isMateLogSoundOn);
    } catch (error) {
      console.error('Error loading settings =>', error);
    }
  };

  return (
    <View style={styles.mateLogScreen}>
      <ScrollView
        style={styles.mateLogContent}
        contentContainerStyle={styles.mateLogContentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View>
          <ImageBackground
            source={require('../../elements/images/jokesonicheader.png')}
            style={styles.mateLogHeaderBackground}
          >
            <LinearGradient
              colors={['#AAC3FD00', '#AAC3FD']}
              style={styles.mateLogHeaderGradient}
            >
              <View style={styles.mateLogHeaderRow}>
                <Text style={styles.mateLogHeaderTitle}>Home</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.mateLogSettingsButton}
                  onPress={() => navigation.navigate('Jokesonicematesetup')}
                >
                  <Image
                    source={require('../../elements/images/jokesonicsett.png')}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
          <LinearGradient
            colors={['#AAC3FD00', '#AAC3FD']}
            style={styles.mateLogHeaderBottomFade}
          />
        </View>
        <View style={styles.mateLogCardsWrap}>
          {mateLogHomeCards.map(mateLogCard => (
            <View key={mateLogCard.mateLogId} style={styles.mateLogCard}>
              <View style={styles.mateLogCardTitleRow}>
                <Image
                  source={mateLogCard.mateLogFish}
                  style={styles.mateLogCardFish}
                />
                <Text style={styles.mateLogCardTitle}>
                  {mateLogCard.mateLogTitle}
                </Text>
              </View>

              <Text style={styles.mateLogCardDescription}>
                {mateLogCard.mateLogDescription}
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate(mateLogCard.mateLogRoute)}
              >
                <LinearGradient
                  colors={['#0D7DFF', '#0062D6']}
                  style={styles.mateLogCardButton}
                >
                  <Text style={styles.mateLogCardButtonText}>
                    {mateLogCard.mateLogButtonLabel}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
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
  mateLogHeaderBackground: {
    height: 172,
    paddingHorizontal: 20,
    paddingTop: 62,
  },
  mateLogHeaderCard: {
    height: 66,
    borderRadius: 14,
    backgroundColor: '#CBE0FFBA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  mateLogHeaderTitle: {
    color: '#032E60',
    fontWeight: '600',
    fontSize: 20,
  },
  mateLogHeaderGradient: {
    width: '100%',
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
  },
  mateLogHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  mateLogHeaderBottomFade: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'absolute',
    bottom: -10,
  },
  mateLogSettingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogSettingsIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 24,
    marginTop: -1,
  },
  mateLogContent: {
    flex: 1,
  },
  mateLogContentContainer: {
    paddingBottom: 120,
    gap: 14,
  },
  mateLogCardsWrap: {
    paddingHorizontal: 20,
    gap: 12,
  },
  mateLogCard: {
    borderRadius: 12,
    backgroundColor: '#7198F2',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mateLogCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mateLogCardFish: {
    marginRight: 14,
  },
  mateLogCardTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  mateLogCardDescription: {
    color: '#F1F5FF',
    fontSize: 16,
    marginBottom: 14,
    fontWeight: '500',
  },
  mateLogCardButton: {
    height: 51,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogCardButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
});

export default Jokesonicematehome;
