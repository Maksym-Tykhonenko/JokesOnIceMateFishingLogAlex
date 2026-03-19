import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Jokesonicematequesint = () => {
  const navigation = useNavigation<any>();

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
                <Text style={styles.mateLogHeaderTitle}>Who Am I?</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
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

        <View style={styles.mateLogBody}>
          <Image
            source={require('../../elements/images/jokesocawhom.png')}
            style={styles.mateLogHeroImage}
          />

          <Text style={styles.mateLogSubtitle}>
            Guess the secret word using yes/no questions
          </Text>

          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.mateLogStartButtonWrap}
            onPress={() => navigation.navigate('Jokesonicematequesetup')}
          >
            <LinearGradient
              colors={['#0D7DFF', '#0062D6']}
              style={styles.mateLogStartButton}
            >
              <Text style={styles.mateLogStartButtonText}>Start</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mateLogScreen: { flex: 1, backgroundColor: '#A9C1F4' },
  mateLogContent: { flex: 1 },
  mateLogContentContainer: { paddingBottom: 120 },
  mateLogHeaderBackground: {
    height: 172,
    paddingHorizontal: 20,
    paddingTop: 62,
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
  mateLogHeaderTitle: {
    color: '#032E60',
    fontWeight: '600',
    fontSize: 20,
  },
  mateLogSettingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogHeaderBottomFade: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    position: 'absolute',
    bottom: -10,
  },
  mateLogBody: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 16,
  },
  mateLogHeroImage: {
    resizeMode: 'contain',
    marginTop: 40,
  },
  mateLogSubtitle: {
    color: '#032E60',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    width: '96%',
  },
  mateLogStartButton: {
    height: 51,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  mateLogStartButtonWrap: { width: '100%' },
  mateLogStartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

export default Jokesonicematequesint;
