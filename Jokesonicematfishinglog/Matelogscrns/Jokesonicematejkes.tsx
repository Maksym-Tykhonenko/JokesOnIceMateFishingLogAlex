// jokes list screen

import {
  mateLogGetSavedJokes,
  mateLogSetSavedJokes,
} from '../utils/mateLogPreferencesStorage';
import { useMateLogStore } from '../Matelogstore/mateLogContxt';
import { useNavigation } from '@react-navigation/native';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Share,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

const mateLogJokesList = [
  'I went ice fishing for the peace and quiet. Turns out the quiet is free, but the peace costs feeling in your fingers. Still... fair trade.',
  "My mate said, \"Let's drill one more hole.\" That's the ice-fishing version of \"Just one more episode.\" Next thing you know it's dark and everyone's pretending they're still having fun.",
  'I set a bite timer for 15 minutes. When it went off, I checked the hole like a professional... and scared away the one fish that was considering it. Great teamwork, me.',
  'Ice fishing teaches patience. Mostly because leaving requires standing up, and standing up requires courage.',
  'I bought a fancy lure that "guarantees bites." It didn\'t say whose bites. The wind has been biting me all day.',
  "The fish aren't biting today, but my thermos is doing great. Honestly, it's carrying the whole team.",
  "I told myself I'd be positive. Then my hands went numb and my personality followed. Now I'm just a quiet statue with snacks.",
  'We made a rule: no complaining on the ice. So now we just stand in silence and communicate through facial expressions and aggressive sips of tea.',
  "I love ice fishing because it's simple. Sit down, stare at a hole, and rethink every decision that led you here. Minimalist lifestyle.",
  'I tried talking to the fish politely. I said, "Excuse me, do you mind biting?" They said nothing, which is very on brand for fish.',
  'The bite was so slow today we started timing jokes instead. Surprisingly, the jokes were still faster than the fish.',
  "I drilled a perfect hole, set everything up, and realized I left my bait in the car. That's not a mistake, that's a plot twist.",
  'My friend said he "knows a secret spot." It was secret because even the fish don\'t know it exists.',
  'I caught a tiny fish and released it. Not out of kindness - out of respect for its obvious better decision-making.',
  'I love winter fishing because the lake is calm. My mind, however, is screaming: "Why are we outside? Why is the floor slippery?"',
  'I asked my mate if he\'s having fun. He said, "Yeah." But the way he said it sounded like a hostage negotiation.',
  'I finally felt a strong bite. It was my glove catching on my jacket zipper. Nature really knows how to prank you.',
  'I brought hand warmers to stay comfortable. Now my hands are warm and everything else is a frozen regret.',
  'I\'ve learned the best fishing strategy is confidence. The second-best is snacks. The third-best is lying about how close you were to catching "a huge one."',
  'The lake was silent, the sky was gray, and we were all very serious. Then someone dropped a sandwich into the hole and the mood instantly improved.',
  'My mate asked, "What\'s your plan if the fish don\'t bite?" I said, "Same plan as always: pretend this is meditation."',
  'I posted a photo from the ice and someone replied, "Looks peaceful!" Yes. Peaceful like a freezer aisle at 3 AM.',
  "I told my phone it's too cold to unlock. It understood the assignment and refused to work. Honestly, relatable.",
  'I learned something important today: the fish can sense fear. And also excitement. And also hope. Basically any emotion is a dealbreaker.',
  "I tried to be quiet so I wouldn't scare the fish. Then my stomach growled loud enough to register on sonar.",
  'My friend said he can "read the ice." I watched him stare at the surface for a minute and go, "Yep... that\'s ice." Great analysis.',
  'I asked the weather app if it\'s safe. It said, "Feels like -12C." Thank you. That answered absolutely nothing and also everything.',
  'I brought a chair, a bucket, and a plan. I forgot the plan was supposed to include catching fish. Minor detail.',
  'Ice fishing is a team sport. One person drills, one person watches, and one person keeps saying, "Any bites yet?" every 30 seconds like a professional motivator.',
  'I caught my first fish of the day and felt proud. Then it slipped out of my glove and flopped back into the hole like, "Nice try, human."',
  'I told myself I\'d keep a detailed log: bait, depth, time, temperature. Then I got cold and my notes became: "WHY."',
  'I thought I heard the bite alarm. It was just the wind doing its little drama performance. Five stars, very convincing.',
  "We made a fire on the shore to warm up. It didn't warm us up. It just gave our hands something to believe in.",
  'The ice was thick, the air was sharp, and the vibe was strong. The fish, however, were in a meeting and could not be reached.',
  'My friend said, "Don\'t worry, we\'ll catch something." Technically we caught a lot of cold and a small existential crisis.',
  'I tried a new lure that "moves like real prey." It did move - straight into the snow when I dropped it. Very realistic behavior, honestly.',
  'Someone asked if ice fishing is hard. I said, "Not really." The hard part is explaining why it\'s fun while your eyelashes are freezing together.',
  'I bought a fish finder. Now I can confirm with technology that the fish are ignoring me. Progress.',
  'I told my mate I\'m going to start a "healthy winter hobby." Now I\'m sitting on ice eating cookies and calling it outdoor activity.',
  'I asked myself, "What would a wise person do right now?" Then I took another sip of hot tea and stayed exactly where I was. Wisdom is complicated.',
];

const mateLogFishIcons: ImageSourcePropType[] = [
  require('../../elements/images/jokesonicfish1.png'),
  require('../../elements/images/jokesonicfish2.png'),
  require('../../elements/images/jokesonicfish3.png'),
];

const mateLogRandomFishSet = () =>
  Array.from({ length: 3 }, () => {
    const mateLogRandomIndex = Math.floor(
      Math.random() * mateLogFishIcons.length,
    );
    return mateLogFishIcons[mateLogRandomIndex];
  });

type MateLogAnimatedButtonProps = {
  children: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  mateLogScaleTo?: number;
};

const MateLogAnimatedButton = ({
  children,
  onPress,
  style,
  disabled,
  mateLogScaleTo = 0.95,
}: MateLogAnimatedButtonProps) => {
  const mateLogScaleValue = useRef(new Animated.Value(1)).current;

  const mateLogPressIn = () => {
    Animated.spring(mateLogScaleValue, {
      toValue: mateLogScaleTo,
      useNativeDriver: true,
      speed: 25,
      bounciness: 0,
    }).start();
  };

  const mateLogPressOut = () => {
    Animated.spring(mateLogScaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      style={style}
      onPress={onPress}
      disabled={disabled}
      onPressIn={mateLogPressIn}
      onPressOut={mateLogPressOut}
    >
      <Animated.View
        style={[
          styles.mateLogAnimatedButtonInner,
          { transform: [{ scale: mateLogScaleValue }] },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

const Jokesonicematejkes = () => {
  const navigation = useNavigation<any>();
  const { mateLogNotificationsEnabled } = useMateLogStore();
  const [mateLogActiveTab, setMateLogActiveTab] = useState<'all' | 'saved'>(
    'all',
  );
  const [mateLogSavedJokes, setMateLogSavedJokes] = useState<Set<number>>(
    new Set(),
  );

  const mateLogFishByJoke = useMemo(
    () => mateLogJokesList.map(() => mateLogRandomFishSet()),
    [],
  );

  const mateLogVisibleJokes = useMemo(() => {
    if (mateLogActiveTab === 'saved') {
      return mateLogJokesList
        .map((mateLogJoke, mateLogIndex) => ({ mateLogJoke, mateLogIndex }))
        .filter(item => mateLogSavedJokes.has(item.mateLogIndex));
    }

    return mateLogJokesList.map((mateLogJoke, mateLogIndex) => ({
      mateLogJoke,
      mateLogIndex,
    }));
  }, [mateLogActiveTab, mateLogSavedJokes]);

  const mateLogToggleSave = (mateLogIndex: number) => {
    const mateLogIsAlreadySaved = mateLogSavedJokes.has(mateLogIndex);

    setMateLogSavedJokes(prevMateLogSaved => {
      const mateLogUpdated = new Set(prevMateLogSaved);

      if (mateLogUpdated.has(mateLogIndex)) {
        mateLogUpdated.delete(mateLogIndex);
      } else {
        mateLogUpdated.add(mateLogIndex);
      }

      return mateLogUpdated;
    });

    if (mateLogNotificationsEnabled && !mateLogIsAlreadySaved) {
      Toast.show({
        type: 'success',
        text1: 'Joke saved successfully',
      });
    }
  };

  useEffect(() => {
    mateLogGetSavedJokes()
      .then(mateLogSavedIndexes => {
        setMateLogSavedJokes(new Set(mateLogSavedIndexes));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    mateLogSetSavedJokes(Array.from(mateLogSavedJokes)).catch(() => {});
  }, [mateLogSavedJokes]);

  const mateLogShareJoke = async (mateLogJoke: string) => {
    await Share.share({
      message: mateLogJoke,
    });
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
                <Text style={styles.mateLogHeaderTitle}>Jokes on Ice</Text>
                <MateLogAnimatedButton
                  style={styles.mateLogSettingsButton}
                  onPress={() => navigation.navigate('Jokesonicematesetup')}
                >
                  <Image
                    source={require('../../elements/images/jokesonicsett.png')}
                  />
                </MateLogAnimatedButton>
              </View>
            </LinearGradient>
          </ImageBackground>
          <LinearGradient
            colors={['#AAC3FD00', '#AAC3FD']}
            style={styles.mateLogHeaderBottomFade}
          />
        </View>

        <View style={styles.mateLogTabsWrap}>
          <View style={styles.mateLogTabsInner}>
            <MateLogAnimatedButton
              style={[
                styles.mateLogTabButton,
                mateLogActiveTab === 'all' && styles.mateLogTabButtonActive,
              ]}
              onPress={() => setMateLogActiveTab('all')}
            >
              <Text
                style={[
                  styles.mateLogTabText,
                  mateLogActiveTab === 'all' && styles.mateLogTabTextActive,
                ]}
              >
                All
              </Text>
            </MateLogAnimatedButton>
            <MateLogAnimatedButton
              style={[
                styles.mateLogTabButton,
                mateLogActiveTab === 'saved' && styles.mateLogTabButtonActive,
              ]}
              onPress={() => setMateLogActiveTab('saved')}
            >
              <Text
                style={[
                  styles.mateLogTabText,
                  mateLogActiveTab === 'saved' && styles.mateLogTabTextActive,
                ]}
              >
                Saved
              </Text>
            </MateLogAnimatedButton>
          </View>
        </View>

        <View style={styles.mateLogJokesWrap}>
          {mateLogVisibleJokes.length === 0 && (
            <View style={styles.mateLogEmptyCard}>
              <Text style={styles.mateLogEmptyText}>
                No saved jokes yet. Tap bookmark to save.
              </Text>
            </View>
          )}

          {mateLogVisibleJokes.map(({ mateLogJoke, mateLogIndex }) => {
            const mateLogIsSaved = mateLogSavedJokes.has(mateLogIndex);

            return (
              <View
                key={`${mateLogIndex}-${mateLogJoke.slice(0, 10)}`}
                style={styles.mateLogJokeCard}
              >
                <View style={styles.mateLogJokeTopRow}>
                  <View style={styles.mateLogFishRow}>
                    {mateLogFishByJoke[mateLogIndex].map(
                      (mateLogFishIcon, mateLogFishIndex) => (
                        <Image
                          key={`${mateLogIndex}-fish-${mateLogFishIndex}`}
                          source={mateLogFishIcon}
                          style={styles.mateLogFishIcon}
                        />
                      ),
                    )}
                  </View>

                  <View style={styles.mateLogActionsRow}>
                    <MateLogAnimatedButton
                      style={styles.mateLogShareButton}
                      onPress={() => {
                        mateLogShareJoke(mateLogJoke).catch(() => {});
                      }}
                      mateLogScaleTo={0.9}
                    >
                      <Image
                        source={require('../../elements/images/jokesonicshr.png')}
                      />
                    </MateLogAnimatedButton>
                    <MateLogAnimatedButton
                      style={[
                        styles.mateLogSaveButton,
                        mateLogIsSaved && styles.mateLogSaveButtonActive,
                      ]}
                      onPress={() => mateLogToggleSave(mateLogIndex)}
                      mateLogScaleTo={0.9}
                    >
                      <Image
                        source={require('../../elements/images/jokesonsv.png')}
                      />
                    </MateLogAnimatedButton>
                  </View>
                </View>

                <Text style={styles.mateLogJokeText} numberOfLines={3}>
                  {mateLogJoke}
                </Text>
              </View>
            );
          })}
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
  mateLogContent: {
    flex: 1,
  },
  mateLogContentContainer: {
    paddingBottom: 120,
  },
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
  mateLogAnimatedButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogHeaderBottomFade: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'absolute',
    bottom: -10,
  },
  mateLogTabsWrap: {
    paddingHorizontal: 20,
    marginTop: -8,
    marginBottom: 15,
  },
  mateLogTabsInner: {
    height: 49,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    padding: 5,
    flexDirection: 'row',
  },
  mateLogTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  mateLogTabButtonActive: {
    backgroundColor: '#F4B030',
  },
  mateLogTabText: {
    color: '#EFF5FF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  mateLogTabTextActive: {
    color: '#FFFFFF',
  },
  mateLogJokesWrap: {
    paddingHorizontal: 20,
    gap: 12,
  },
  mateLogJokeCard: {
    borderRadius: 12,
    backgroundColor: '#7198F2',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mateLogJokeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mateLogFishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mateLogFishIcon: {
    width: 64,
    height: 38,
    resizeMode: 'contain',
  },
  mateLogActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mateLogShareButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0B32F',
  },
  mateLogSaveButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A7BCE9',
  },
  mateLogSaveButtonActive: {
    backgroundColor: '#00E222',
  },
  mateLogActionIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  mateLogJokeText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Poppins-Medium',
  },
  mateLogEmptyCard: {
    borderRadius: 12,
    backgroundColor: '#7198F2',
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  mateLogEmptyText: {
    color: '#EAF2FF',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
});

export default Jokesonicematejkes;
