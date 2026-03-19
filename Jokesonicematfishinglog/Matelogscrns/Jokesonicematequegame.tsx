// Question Game

import LinearGradient from 'react-native-linear-gradient';
import { mateLogWhoAmICategories } from '../utils/mateLogWhoAmIData';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';

type MateLogPlayerCard = {
  mateLogPlayerName: string;
  mateLogWord: string;
};

const mateLogShuffleWords = (mateLogWords: string[]) => {
  const mateLogCopy = [...mateLogWords];
  for (
    let mateLogIndex = mateLogCopy.length - 1;
    mateLogIndex > 0;
    mateLogIndex -= 1
  ) {
    const mateLogSwapIndex = Math.floor(Math.random() * (mateLogIndex + 1));
    const mateLogTemp = mateLogCopy[mateLogIndex];
    mateLogCopy[mateLogIndex] = mateLogCopy[mateLogSwapIndex];
    mateLogCopy[mateLogSwapIndex] = mateLogTemp;
  }
  return mateLogCopy;
};

const Jokesonicematequegame = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mateLogPlayers = useMemo(
    () =>
      (route.params?.mateLogPlayers as string[] | undefined)?.filter(Boolean) ||
      [],
    [route.params?.mateLogPlayers],
  );
  const mateLogCategoryTitle =
    (route.params?.mateLogCategoryTitle as string | undefined) ||
    'Ice Fishing Essentials';

  const [mateLogCurrentPlayerIndex, setMateLogCurrentPlayerIndex] = useState(0);
  const [mateLogIsWordShown, setMateLogIsWordShown] = useState(false);
  const [mateLogIsPauseModalOpen, setMateLogIsPauseModalOpen] = useState(false);
  const [mateLogIsGameEnded, setMateLogIsGameEnded] = useState(false);
  const mateLogHelicopterFloatAnim = useRef(new Animated.Value(-7)).current;
  const mateLogRevealScaleAnim = useRef(new Animated.Value(1)).current;
  const mateLogWordFadeAnim = useRef(new Animated.Value(0)).current;
  const mateLogWordTranslateAnim = useRef(new Animated.Value(8)).current;

  const mateLogCards = useMemo<MateLogPlayerCard[]>(() => {
    const mateLogCategoryWords =
      mateLogWhoAmICategories.find(
        mateLogCategory =>
          mateLogCategory.mateLogTitle === mateLogCategoryTitle,
      )?.mateLogWords || mateLogWhoAmICategories[0].mateLogWords;

    const mateLogShuffledWords = mateLogShuffleWords(mateLogCategoryWords);
    const mateLogSafePlayers =
      mateLogPlayers.length > 0 ? mateLogPlayers : ['Player 1', 'Player 2'];

    return mateLogSafePlayers.map((mateLogPlayerName, mateLogPlayerIndex) => ({
      mateLogPlayerName:
        mateLogPlayerName || `Player ${mateLogPlayerIndex + 1}`,
      mateLogWord:
        mateLogShuffledWords[mateLogPlayerIndex % mateLogShuffledWords.length],
    }));
  }, [mateLogCategoryTitle, mateLogPlayers]);

  const mateLogCurrentCard = mateLogCards[mateLogCurrentPlayerIndex];
  const mateLogIsLastPlayer =
    mateLogCurrentPlayerIndex >= mateLogCards.length - 1;

  const mateLogGoNext = () => {
    if (mateLogIsLastPlayer) {
      setMateLogIsGameEnded(true);
      return;
    }
    setMateLogCurrentPlayerIndex(prev => prev + 1);
    setMateLogIsWordShown(false);
    mateLogRevealScaleAnim.setValue(1);
    mateLogWordFadeAnim.setValue(0);
    mateLogWordTranslateAnim.setValue(8);
  };

  const mateLogRevealWord = () => {
    if (mateLogIsWordShown) {
      return;
    }

    Animated.sequence([
      Animated.timing(mateLogRevealScaleAnim, {
        toValue: 0.97,
        duration: 90,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(mateLogRevealScaleAnim, {
        toValue: 1,
        duration: 130,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    setMateLogIsWordShown(true);
    mateLogWordFadeAnim.setValue(0);
    mateLogWordTranslateAnim.setValue(8);
    Animated.parallel([
      Animated.timing(mateLogWordFadeAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(mateLogWordTranslateAnim, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const mateLogFloatingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(mateLogHelicopterFloatAnim, {
          toValue: 7,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(mateLogHelicopterFloatAnim, {
          toValue: -7,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: false },
    );

    mateLogFloatingLoop.start();

    return () => {
      mateLogFloatingLoop.stop();
    };
  }, [mateLogHelicopterFloatAnim]);

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
              <View
                style={[
                  styles.mateLogHeaderRow,
                  mateLogIsGameEnded && styles.mateLogHeaderRowCentered,
                ]}
              >
                {!mateLogIsGameEnded && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.mateLogPauseButton}
                    onPress={() => setMateLogIsPauseModalOpen(true)}
                  >
                    <Text style={styles.mateLogPauseButtonText}>II</Text>
                  </TouchableOpacity>
                )}

                <Text style={[styles.mateLogHeaderTitle]}>
                  {mateLogIsGameEnded
                    ? 'Who Am I?'
                    : mateLogCurrentCard?.mateLogPlayerName || 'Who Am I?'}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
          <LinearGradient
            colors={['#AAC3FD00', '#AAC3FD']}
            style={styles.mateLogHeaderBottomFade}
          />
        </View>

        <View style={styles.mateLogBody}>
          {mateLogIsGameEnded ? (
            mateLogCards.map((mateLogCard, mateLogIndex) => (
              <View
                key={`mateLog-end-${mateLogCard.mateLogPlayerName}-${mateLogIndex}`}
                style={[
                  styles.mateLogPlayerCard,
                  styles.mateLogPlayerCardCompact,
                ]}
              >
                <Image
                  source={require('../../elements/images/jokesocahell.png')}
                  style={styles.mateLogCardImageSmall}
                />

                <Text style={styles.mateLogCardPlayerName}>
                  {mateLogCard.mateLogPlayerName}
                </Text>
                <Text style={styles.mateLogCardWord}>
                  {mateLogCard.mateLogWord}
                </Text>
              </View>
            ))
          ) : (
            <Animated.View
              style={[
                styles.mateLogAnimatedCardWrap,
                { transform: [{ scale: mateLogRevealScaleAnim }] },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.mateLogPlayerCard}
                onPress={mateLogRevealWord}
              >
                <Animated.View
                  style={{
                    transform: [{ translateY: mateLogHelicopterFloatAnim }],
                  }}
                >
                  <Image
                    source={require('../../elements/images/jokesocahell.png')}
                    style={styles.mateLogCardImage}
                  />
                </Animated.View>
                <Text style={styles.mateLogCardPlayerName}>
                  {mateLogCurrentCard?.mateLogPlayerName}
                </Text>
                {mateLogIsWordShown ? (
                  <Animated.Text
                    style={[
                      styles.mateLogCardWord,
                      {
                        opacity: mateLogWordFadeAnim,
                        transform: [{ translateY: mateLogWordTranslateAnim }],
                      },
                    ]}
                  >
                    {mateLogCurrentCard?.mateLogWord}
                  </Animated.Text>
                ) : (
                  <Text style={styles.mateLogCardWord}>???</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}

          {!mateLogIsGameEnded && !mateLogIsWordShown && (
            <Text style={styles.mateLogTapHint}>Tap to Show</Text>
          )}

          {!mateLogIsGameEnded && mateLogIsWordShown && (
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.mateLogBottomButtonWrap}
              onPress={mateLogGoNext}
            >
              <LinearGradient
                colors={['#0D7DFF', '#0062D6']}
                style={styles.mateLogBottomButton}
              >
                <Text style={styles.mateLogBottomButtonText}>
                  {mateLogIsLastPlayer ? 'Finish' : 'Next Player'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {mateLogIsGameEnded && (
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.mateLogBottomButtonWrap}
              onPress={() => navigation.navigate('Jokesonicemattbs')}
            >
              <LinearGradient
                colors={['#0D7DFF', '#0062D6']}
                style={styles.mateLogBottomButton}
              >
                <Text style={styles.mateLogBottomButtonText}>Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={mateLogIsPauseModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMateLogIsPauseModalOpen(false)}
      >
        {Platform.OS === 'ios' && (
          <BlurView
            style={styles.mateLogPauseBlurFill}
            blurAmount={1}
            blurType="light"
          />
        )}
        <View style={styles.mateLogPauseModalOverlay}>
          <View style={styles.mateLogPauseModalCard}>
            <Text style={styles.mateLogPauseModalTitle}>
              Take an ice break?
            </Text>
            <Text style={styles.mateLogPauseModalText}>
              No worries-your round will be waiting
            </Text>
            <View style={styles.mateLogPauseModalActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.mateLogPauseEndButton}
                onPress={() => {
                  setMateLogIsPauseModalOpen(false);
                  navigation.navigate('Jokesonicemattbs', {
                    screen: 'Jokesonicematequesint',
                  });
                }}
              >
                <Text style={styles.mateLogPauseActionText}>End Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.mateLogPauseResumeButtonWrap}
                onPress={() => setMateLogIsPauseModalOpen(false)}
              >
                <LinearGradient
                  colors={['#0D7DFF', '#0062D6']}
                  style={styles.mateLogPauseResumeButton}
                >
                  <Text style={styles.mateLogPauseActionText}>Resume</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mateLogScreen: { flex: 1, backgroundColor: '#A9C1F4' },
  mateLogContent: { flex: 1 },
  mateLogContentContainer: { paddingBottom: 40 },
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
    paddingHorizontal: 12,
    gap: 10,
  },
  mateLogHeaderRowCentered: { justifyContent: 'center' },
  mateLogPauseButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogPauseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  mateLogHeaderTitle: {
    color: '#032E60',
    fontSize: 20,
    fontWeight: '600',
  },
  mateLogHeaderBottomFade: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    position: 'absolute',
    bottom: -10,
  },
  mateLogBody: {
    paddingHorizontal: 24,
    paddingTop: 22,
    alignItems: 'center',
  },
  mateLogAnimatedCardWrap: { width: '100%' },
  mateLogPlayerCard: {
    width: '100%',
    minHeight: 470,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  mateLogPlayerCardCompact: { minHeight: 218 },
  mateLogCardImage: {
    width: 250,
    height: 210,
    resizeMode: 'contain',
  },
  mateLogCardImageSmall: {
    width: 200,
    height: 130,
    resizeMode: 'contain',
  },
  mateLogCardPlayerName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  mateLogCardWord: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 29,
  },
  mateLogTapHint: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginTop: 19,
  },
  mateLogBottomButtonWrap: { width: '100%', marginTop: 12 },
  mateLogBottomButton: {
    height: 51,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogBottomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogPauseModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 41, 84, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mateLogPauseBlurFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mateLogPauseModalCard: {
    borderRadius: 12,
    backgroundColor: '#032E60',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  mateLogPauseModalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  mateLogPauseModalText: {
    color: '#E7F0FF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 16,
  },
  mateLogPauseModalActions: {
    flexDirection: 'row',
    gap: 4,
  },
  mateLogPauseEndButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#C50000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogPauseResumeButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogPauseResumeButtonWrap: {
    flex: 1,
  },
  mateLogPauseActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

export default Jokesonicematequegame;
