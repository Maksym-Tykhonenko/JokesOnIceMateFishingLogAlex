// Question Setup

import LinearGradient from 'react-native-linear-gradient';
import { mateLogWhoAmICategories } from '../utils/mateLogWhoAmIData';
import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const MATE_LOG_MAX_PLAYERS = 3;

const Jokesonicematequesetup = () => {
  const navigation = useNavigation<any>();
  const [mateLogCategoryOpen, setMateLogCategoryOpen] = useState(false);
  const [mateLogSelectedCategory, setMateLogSelectedCategory] = useState(
    mateLogWhoAmICategories[0].mateLogTitle,
  );
  const [mateLogPlayers, setMateLogPlayers] = useState(['', '']);
  const mateLogStartShakeAnim = useRef(new Animated.Value(0)).current;

  const mateLogCanAddPlayer = mateLogPlayers.length < MATE_LOG_MAX_PLAYERS;

  const mateLogAddPlayer = () => {
    if (!mateLogCanAddPlayer) {
      return;
    }
    setMateLogPlayers(prev => [...prev, `Player ${prev.length + 1}`]);
  };

  const mateLogRemovePlayer = (mateLogIndex: number) => {
    setMateLogPlayers(prev =>
      prev.filter(
        (_, mateLogPlayerIndex) => mateLogPlayerIndex !== mateLogIndex,
      ),
    );
  };

  const mateLogSetPlayerName = (mateLogIndex: number, mateLogValue: string) => {
    setMateLogPlayers(prev =>
      prev.map((mateLogPlayer, mateLogPlayerIndex) =>
        mateLogPlayerIndex === mateLogIndex ? mateLogValue : mateLogPlayer,
      ),
    );
  };

  const mateLogTriggerStartShake = () => {
    Animated.sequence([
      Animated.timing(mateLogStartShakeAnim, {
        toValue: -10,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogStartShakeAnim, {
        toValue: 10,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogStartShakeAnim, {
        toValue: -7,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogStartShakeAnim, {
        toValue: 7,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogStartShakeAnim, {
        toValue: 0,
        duration: 35,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const mateLogStartGame = () => {
    const mateLogPreparedPlayers = mateLogPlayers.map(mateLogPlayer =>
      mateLogPlayer.trim(),
    );
    const mateLogHasEmptyInput = mateLogPreparedPlayers.some(
      mateLogPlayer => !mateLogPlayer,
    );

    if (mateLogHasEmptyInput) {
      mateLogTriggerStartShake();
      return;
    }

    navigation.navigate('Jokesonicematequegame', {
      mateLogCategoryTitle: mateLogSelectedCategory,
      mateLogPlayers: mateLogPreparedPlayers,
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
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.mateLogBackButton}
                  onPress={() => navigation.goBack()}
                >
                  <Image
                    source={require('../../elements/images/jokesonicbakc.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.mateLogHeaderTitle}>Set Up</Text>
                <View style={styles.mateLogHeaderRightSpacer} />
              </View>
            </LinearGradient>
          </ImageBackground>
          <LinearGradient
            colors={['#AAC3FD00', '#AAC3FD']}
            style={styles.mateLogHeaderBottomFade}
          />
        </View>

        <View style={styles.mateLogBody}>
          <View style={styles.mateLogDropdownWrap}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.mateLogDropdownTrigger}
              onPress={() => setMateLogCategoryOpen(prev => !prev)}
            >
              <Text style={styles.mateLogDropdownTriggerText}>
                {mateLogSelectedCategory}
              </Text>
              <Image
                source={require('../../elements/images/jokestmapdown.png')}
              />
            </TouchableOpacity>

            {mateLogCategoryOpen && (
              <View style={styles.mateLogDropdownList}>
                {mateLogWhoAmICategories.map(mateLogCategory => (
                  <Pressable
                    key={mateLogCategory.mateLogTitle}
                    style={styles.mateLogDropdownItem}
                    onPress={() => {
                      setMateLogSelectedCategory(mateLogCategory.mateLogTitle);
                      setMateLogCategoryOpen(false);
                    }}
                  >
                    <Text style={styles.mateLogDropdownItemText}>
                      {mateLogCategory.mateLogTitle}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {mateLogPlayers.map((mateLogPlayer, mateLogPlayerIndex) => (
            <View
              key={`mateLog-player-${mateLogPlayerIndex}`}
              style={styles.mateLogPlayerInputWrap}
            >
              <TextInput
                value={mateLogPlayer}
                onChangeText={mateLogValue =>
                  mateLogSetPlayerName(mateLogPlayerIndex, mateLogValue)
                }
                style={styles.mateLogPlayerInput}
                placeholder={`Player ${mateLogPlayerIndex + 1}`}
                placeholderTextColor="#84A3D2"
              />
              {mateLogPlayers.length > 2 && mateLogPlayerIndex === 2 && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.mateLogRemovePlayerButton}
                  onPress={() => mateLogRemovePlayer(mateLogPlayerIndex)}
                >
                  <Image
                    source={require('../../elements/images/jokesocadel.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {mateLogCanAddPlayer && (
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.mateLogAddPlayerButton}
              onPress={mateLogAddPlayer}
            >
              <Image
                source={require('../../elements/images/jokesocaplus.png')}
              />
            </TouchableOpacity>
          )}

          <View style={styles.mateLogStartFooter}>
            <Animated.View
              style={[
                styles.mateLogStartShakeWrap,
                { transform: [{ translateX: mateLogStartShakeAnim }] },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.mateLogStartButtonHit}
                onPress={mateLogStartGame}
              >
                <LinearGradient
                  colors={['#0D7DFF', '#0062D6']}
                  style={styles.mateLogStartButton}
                >
                  <Text style={styles.mateLogStartButtonText}>Start</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mateLogScreen: { flex: 1, backgroundColor: '#A9C1F4' },
  mateLogContent: { flex: 1 },
  mateLogContentContainer: { paddingBottom: 40, flexGrow: 1 },
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
  },
  mateLogBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  mateLogHeaderTitle: {
    color: '#032E60',
    fontSize: 20,
    fontWeight: '600',
  },
  mateLogHeaderRightSpacer: { flex: 1 },
  mateLogHeaderBottomFade: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    position: 'absolute',
    bottom: -10,
  },
  mateLogBody: {
    paddingHorizontal: 24,
    paddingTop: 14,
    flex: 1,
  },
  mateLogDropdownWrap: { zIndex: 3, marginBottom: 12 },
  mateLogDropdownTrigger: {
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mateLogDropdownTriggerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogDropdownList: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#032E60',
    paddingVertical: 4,
  },
  mateLogDropdownItem: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  mateLogDropdownItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogPlayerInputWrap: {
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: '#032E60',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  mateLogPlayerInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogRemovePlayerButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogRemovePlayerText: {
    color: '#FFFFFF',
    fontSize: 40,
    lineHeight: 40,
    fontFamily: 'Poppins-Medium',
  },
  mateLogAddPlayerButton: {
    marginTop: 12,
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#032E60',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogAddPlayerButtonText: {
    color: '#FFFFFF',
    fontSize: 43,
    lineHeight: 44,
    fontFamily: 'Poppins-Medium',
  },
  mateLogWordsCountText: {
    marginTop: 14,
    color: '#032E60',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  mateLogStartFooter: { flex: 1, justifyContent: 'flex-end', marginTop: 20 },
  mateLogStartShakeWrap: { width: '100%' },
  mateLogStartButtonHit: { width: '100%' },
  mateLogStartButtonWrap: {
    marginBottom: 8,
  },
  mateLogStartButton: {
    height: 51,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogStartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

export default Jokesonicematequesetup;
