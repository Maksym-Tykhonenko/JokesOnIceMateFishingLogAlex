// Session Start

import {
  MateLogCatch,
  MateLogSession,
  mateLogSaveSessionRuntimeData,
  mateLogSetSessionCompleted,
} from '../utils/mateLogSessionsStorage';
import Sound from 'react-native-sound';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';

import { useMateLogStore } from '../Matelogstore/mateLogContxt';
import { BlurView } from '@react-native-community/blur';

const MATE_LOG_MAX_FISH_COUNT_PER_CATCH = 10;

const Jokesonicematesessnstart = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mateLogSoundEnabled } = useMateLogStore();
  const mateLogSession = route.params?.mateLogSession as
    | MateLogSession
    | undefined;

  const [mateLogTimerSeconds, setMateLogTimerSeconds] = useState(600);
  const [mateLogTimerRunning, setMateLogTimerRunning] = useState(false);
  const [mateLogCatchTab, setMateLogCatchTab] = useState<'my' | 'mate'>('my');
  const [mateLogAddCatchModalOpen, setMateLogAddCatchModalOpen] =
    useState(false);
  const [mateLogLeaveSessionModalOpen, setMateLogLeaveSessionModalOpen] =
    useState(false);
  const [mateLogSessionNotes, setMateLogSessionNotes] = useState(
    mateLogSession?.mateLogSessionNotes || '',
  );
  const [mateLogCatches, setMateLogCatches] = useState<MateLogCatch[]>(
    mateLogSession?.mateLogCatches || [],
  );
  const [mateLogCatchName, setMateLogCatchName] = useState('');
  const [mateLogCatchFishName, setMateLogCatchFishName] = useState('');
  const [mateLogCatchWeight, setMateLogCatchWeight] = useState('');
  const [mateLogCatchCount, setMateLogCatchCount] = useState(1);
  const [mateLogCatchImageUri, setMateLogCatchImageUri] = useState('');
  const [mateLogTimerSoundReady, setMateLogTimerSoundReady] = useState(false);
  const mateLogSaveShakeAnim = useRef(new Animated.Value(0)).current;
  const mateLogTimerSoundRef = useRef<Sound | null>(null);
  const mateLogTimerSoundReadyRef = useRef(false);

  const mateLogFormattedTimer = useMemo(() => {
    const mateLogMinutes = Math.floor(mateLogTimerSeconds / 60);
    const mateLogSeconds = mateLogTimerSeconds % 60;
    return `${String(mateLogMinutes).padStart(2, '0')}:${String(
      mateLogSeconds,
    ).padStart(2, '0')}`;
  }, [mateLogTimerSeconds]);

  const mateLogVisibleCatches = useMemo(
    () =>
      mateLogCatches.filter(mateLogCatch =>
        mateLogCatchTab === 'my'
          ? mateLogCatch.mateLogType === 'my'
          : mateLogCatch.mateLogType === 'mate',
      ),
    [mateLogCatchTab, mateLogCatches],
  );

  useEffect(() => {
    if (!mateLogTimerRunning) {
      return;
    }

    const mateLogTimerInterval = setInterval(() => {
      setMateLogTimerSeconds(prevMateLogSeconds => {
        if (prevMateLogSeconds <= 1) {
          setMateLogTimerRunning(false);
          return 0;
        }

        return prevMateLogSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(mateLogTimerInterval);
    };
  }, [mateLogTimerRunning]);

  useEffect(() => {
    Sound.setCategory('Playback');
    const mateLogTimerSound = new Sound(
      'timersound.wav',
      Sound.MAIN_BUNDLE,
      mateLogError => {
        if (mateLogError) {
          mateLogTimerSoundReadyRef.current = false;
          setMateLogTimerSoundReady(false);
          return;
        }
        mateLogTimerSoundReadyRef.current = true;
        setMateLogTimerSoundReady(true);
        mateLogTimerSound.setNumberOfLoops(-1);
      },
    );

    mateLogTimerSoundRef.current = mateLogTimerSound;

    return () => {
      mateLogTimerSoundRef.current?.stop(() => {
        mateLogTimerSoundRef.current?.release();
        mateLogTimerSoundRef.current = null;
        mateLogTimerSoundReadyRef.current = false;
        setMateLogTimerSoundReady(false);
      });
    };
  }, []);

  useEffect(() => {
    const mateLogTimerSound = mateLogTimerSoundRef.current;
    if (
      !mateLogTimerSound ||
      !mateLogTimerSoundReadyRef.current ||
      !mateLogTimerSoundReady
    ) {
      return;
    }

    if (mateLogTimerRunning && mateLogSoundEnabled) {
      if (!mateLogTimerSound.isPlaying()) {
        mateLogTimerSound.play(() => {});
      }
      return;
    }

    if (mateLogTimerSound.isPlaying()) {
      mateLogTimerSound.stop(() => {});
    }
  }, [mateLogSoundEnabled, mateLogTimerRunning, mateLogTimerSoundReady]);

  useEffect(() => {
    if (!mateLogSession?.mateLogId) {
      return;
    }

    mateLogSaveSessionRuntimeData(
      mateLogSession.mateLogId,
      mateLogSessionNotes,
      mateLogCatches,
    ).catch(() => {});
  }, [mateLogCatches, mateLogSession?.mateLogId, mateLogSessionNotes]);

  const mateLogTriggerSaveShake = () => {
    Animated.sequence([
      Animated.timing(mateLogSaveShakeAnim, {
        toValue: -10,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogSaveShakeAnim, {
        toValue: 10,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogSaveShakeAnim, {
        toValue: -8,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogSaveShakeAnim, {
        toValue: 8,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogSaveShakeAnim, {
        toValue: 0,
        duration: 35,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const mateLogSaveCatch = () => {
    const mateLogHasMissingFields =
      !mateLogCatchName.trim() ||
      !mateLogCatchFishName.trim();

    if (mateLogHasMissingFields) {
      mateLogTriggerSaveShake();
      return;
    }

    const mateLogNewCatch: MateLogCatch = {
      mateLogId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mateLogName: mateLogCatchName.trim(),
      mateLogType: mateLogCatchTab,
      mateLogFishName: mateLogCatchFishName.trim(),
      mateLogFishCount: Math.min(
        MATE_LOG_MAX_FISH_COUNT_PER_CATCH,
        mateLogCatchCount,
      ),
      mateLogWeightKg: mateLogCatchWeight.trim(),
      mateLogImageUri: mateLogCatchImageUri || undefined,
    };

    setMateLogCatches(prev => [...prev, mateLogNewCatch]);
    setMateLogCatchName('');
    setMateLogCatchFishName('');
    setMateLogCatchWeight('');
    setMateLogCatchCount(1);
    setMateLogCatchImageUri('');
    setMateLogAddCatchModalOpen(false);
  };

  const mateLogPickCatchImage = async () => {
    const mateLogResult = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
      includeBase64: true,
      maxWidth: 900,
      maxHeight: 900,
    });

    const mateLogSelectedAsset = mateLogResult.assets?.[0];
    if (!mateLogSelectedAsset) {
      return;
    }

    if (mateLogSelectedAsset.base64) {
      const mateLogMimeType = mateLogSelectedAsset.type || 'image/jpeg';
      setMateLogCatchImageUri(
        `data:${mateLogMimeType};base64,${mateLogSelectedAsset.base64}`,
      );
      return;
    }

    if (mateLogSelectedAsset.uri) {
      setMateLogCatchImageUri(mateLogSelectedAsset.uri);
    }
  };

  const mateLogLeaveSession = async () => {
    if (!mateLogSession?.mateLogId) {
      setMateLogLeaveSessionModalOpen(false);
      navigation.goBack();
      return;
    }

    await mateLogSaveSessionRuntimeData(
      mateLogSession.mateLogId,
      mateLogSessionNotes,
      mateLogCatches,
    );
    await mateLogSetSessionCompleted(mateLogSession.mateLogId, true);
    setMateLogLeaveSessionModalOpen(false);
    navigation.goBack();
  };

  const mateLogSaveProgressAndBack = async () => {
    if (!mateLogSession?.mateLogId) {
      setMateLogLeaveSessionModalOpen(false);
      navigation.goBack();
      return;
    }

    await mateLogSaveSessionRuntimeData(
      mateLogSession.mateLogId,
      mateLogSessionNotes,
      mateLogCatches,
    );
    setMateLogLeaveSessionModalOpen(false);
    navigation.goBack();
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
                  onPress={() => setMateLogLeaveSessionModalOpen(true)}
                >
                  <Image
                    source={require('../../elements/images/jokesonicbakc.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.mateLogEndSessionButton}
                  onPress={() => {
                    mateLogLeaveSession().catch(() => {});
                  }}
                >
                  <Text style={styles.mateLogEndSessionText}>End Session</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
          <LinearGradient
            colors={['#AAC3FD00', '#AAC3FD']}
            style={styles.mateLogHeaderBottomFade}
          />
        </View>

        <View style={styles.mateLogSectionPad}>
          <View style={styles.mateLogSessionCard}>
            <View style={styles.mateLogCardHeaderRow}>
              <Text style={styles.mateLogCardSessionName}>
                {mateLogSession?.mateLogSessionName || 'Session Name'}
              </Text>
              <Text style={styles.mateLogCardDate}>
                {mateLogSession?.mateLogDate || '16 Oct 2025'}
              </Text>
            </View>
            <View style={styles.mateLogPill}>
              <Text style={styles.mateLogPillText}>
                {mateLogSession?.mateLogLocationName || 'Location Name'}
              </Text>
            </View>
            <View style={styles.mateLogInfoRow}>
              <View style={styles.mateLogPill}>
                <Text style={styles.mateLogPillText}>{`${
                  mateLogSession?.mateLogTemperature || '-2'
                } °C`}</Text>
              </View>
              <View style={styles.mateLogPill}>
                <Text style={styles.mateLogPillText}>{`${
                  mateLogSession?.mateLogWind || '8'
                } km/h`}</Text>
              </View>
              <View style={styles.mateLogPill}>
                <Text style={styles.mateLogPillText}>
                  {mateLogSession?.mateLogClouds || 'Overcast'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.mateLogMapButton}
              onPress={() =>
                navigation.navigate('Jokesonicematesessnmap', {
                  mateLogSession,
                })
              }
            >
              <Text style={styles.mateLogMapButtonText}>Map</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mateLogNotesBox}>
            <TextInput
              value={mateLogSessionNotes}
              onChangeText={setMateLogSessionNotes}
              placeholder="Session Notes"
              placeholderTextColor="#89A4CF"
              style={styles.mateLogNotesInput}
              multiline
            />
          </View>

          <Text style={styles.mateLogBiteTitle}>Bite Timer</Text>
          {!mateLogTimerRunning ? (
            <>
              <View style={styles.mateLogTimerRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.mateLogTimerStepButton}
                  onPress={() =>
                    setMateLogTimerSeconds(prev => Math.max(60, prev - 60))
                  }
                >
                  <Image
                    source={require('../../elements/images/jokesocamin.png')}
                  />
                </TouchableOpacity>
                <View style={styles.mateLogTimerValueBox}>
                  <Text style={styles.mateLogTimerValueText}>
                    {mateLogFormattedTimer}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.mateLogTimerStepButton}
                  onPress={() => setMateLogTimerSeconds(prev => prev + 60)}
                >
                  <Image
                    source={require('../../elements/images/jokesocaplus.png')}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => setMateLogTimerRunning(true)}
              >
                <LinearGradient
                  colors={['#0D7DFF', '#0062D6']}
                  style={styles.mateLogPrimaryButton}
                >
                  <Text style={styles.mateLogPrimaryButtonText}>
                    Start Timer
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.mateLogTimerValueBoxCenter}>
                <Text style={styles.mateLogTimerValueText}>
                  {mateLogFormattedTimer}
                </Text>
              </View>
              <View style={styles.mateLogRunningButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.mateLogPauseButton}
                  onPress={() => setMateLogTimerRunning(false)}
                >
                  <Text style={styles.mateLogPrimaryButtonText}>Pause</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.mateLogMarkButton}
                  onPress={() => setMateLogAddCatchModalOpen(true)}
                >
                  <Text style={styles.mateLogPrimaryButtonText}>Mark Bite</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.mateLogCatchTabs}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.mateLogCatchTabButton,
                mateLogCatchTab === 'my' && styles.mateLogCatchTabButtonActive,
              ]}
              onPress={() => setMateLogCatchTab('my')}
            >
              <Text style={styles.mateLogCatchTabText}>My Catch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.mateLogCatchTabButton,
                mateLogCatchTab === 'mate' &&
                  styles.mateLogCatchTabButtonActive,
              ]}
              onPress={() => setMateLogCatchTab('mate')}
            >
              <Text style={styles.mateLogCatchTabText}>Mate&apos;s Catch</Text>
            </TouchableOpacity>
          </View>

          {mateLogVisibleCatches.map(mateLogCatch => (
            <View key={mateLogCatch.mateLogId} style={styles.mateLogCatchCard}>
              {(() => {
                const mateLogCatchImageSource: ImageSourcePropType =
                  mateLogCatch.mateLogImageUri
                    ? { uri: mateLogCatch.mateLogImageUri }
                    : require('../../elements/images/jokesonicfish3.png');

                return (
                  <Image
                    source={mateLogCatchImageSource}
                    style={styles.mateLogCatchFish}
                  />
                );
              })()}
              <View style={styles.mateLogCatchInfoWrap}>
                <Text style={styles.mateLogCatchName}>
                  {mateLogCatch.mateLogName}
                </Text>
                <View style={styles.mateLogCatchBadges}>
                  <View style={styles.mateLogSmallPill}>
                    <Text style={styles.mateLogSmallPillText}>
                      {mateLogCatch.mateLogFishName || 'Fish'}
                    </Text>
                  </View>
                  <View style={styles.mateLogSmallPill}>
                    <Text style={styles.mateLogSmallPillText}>
                      {mateLogCatch.mateLogFishCount}
                    </Text>
                  </View>
                  <View style={styles.mateLogSmallPill}>
                    <Text
                      style={styles.mateLogSmallPillText}
                    >
                      {mateLogCatch.mateLogWeightKg.trim()
                        ? `${mateLogCatch.mateLogWeightKg} kg`
                        : 'No weight'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.mateLogAddCatchButton}
            onPress={() => setMateLogAddCatchModalOpen(true)}
          >
            <Image source={require('../../elements/images/jokesocaplus.png')} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={mateLogLeaveSessionModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMateLogLeaveSessionModalOpen(false)}
      >
        {Platform.OS === 'ios' && (
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            blurAmount={1}
            blurType="light"
          />
        )}
        <View style={styles.mateLogLeaveModalOverlay}>
          <View style={styles.mateLogLeaveModalCard}>
            <Text style={styles.mateLogLeaveModalTitle}>
              Leave this session?
            </Text>
            <Text style={styles.mateLogLeaveModalText}>
              Everything stays saved. You can come back anytime
            </Text>
            <View style={styles.mateLogLeaveModalActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.mateLogLeaveCancelBtn}
                onPress={() => setMateLogLeaveSessionModalOpen(false)}
              >
                <Text style={styles.mateLogLeaveCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.mateLogLeaveConfirmBtn}
                onPress={() => {
                  mateLogSaveProgressAndBack().catch(() => {});
                }}
              >
                <Text style={styles.mateLogLeaveConfirmText}>Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={mateLogAddCatchModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMateLogAddCatchModalOpen(false)}
      >
        {Platform.OS === 'ios' && (
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            blurAmount={1}
            blurType="light"
          />
        )}
        <View style={styles.mateLogModalOverlay}>
          <View style={styles.mateLogModalCard}>
            <Text style={styles.mateLogModalTitle}>Add Catch</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.mateLogPhotoPlaceholder}
              onPress={() => {
                mateLogPickCatchImage().catch(() => {});
              }}
            >
              {mateLogCatchImageUri ? (
                <Image
                  source={{ uri: mateLogCatchImageUri }}
                  style={styles.mateLogPhotoSelected}
                />
              ) : (
                <Image
                  source={require('../../elements/images/jokesocamra.png')}
                />
              )}
            </TouchableOpacity>

            <View style={styles.mateLogCatchTabs}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.mateLogCatchTabButton,
                  mateLogCatchTab === 'my' &&
                    styles.mateLogCatchTabButtonActive,
                ]}
                onPress={() => setMateLogCatchTab('my')}
              >
                <Text style={styles.mateLogCatchTabText}>My Catch</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.mateLogCatchTabButton,
                  mateLogCatchTab === 'mate' &&
                    styles.mateLogCatchTabButtonActive,
                ]}
                onPress={() => setMateLogCatchTab('mate')}
              >
                <Text style={styles.mateLogCatchTabText}>
                  Mate&apos;s Catch
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mateLogModalInputBox}>
              <TextInput
                value={mateLogCatchName}
                onChangeText={setMateLogCatchName}
                placeholder="Name"
                placeholderTextColor="#AFC2E6"
                style={styles.mateLogModalInput}
              />
            </View>
            <View style={styles.mateLogFishCountRow}>
              <View
                style={[
                  styles.mateLogModalInputBox,
                  styles.mateLogFishInputGrow,
                ]}
              >
                <TextInput
                  value={mateLogCatchFishName}
                  onChangeText={setMateLogCatchFishName}
                  placeholder="Fish"
                  placeholderTextColor="#AFC2E6"
                  style={styles.mateLogModalInput}
                />
              </View>
              <View style={styles.mateLogFishCountBox}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    setMateLogCatchCount(prev => Math.max(1, prev - 1))
                  }
                >
                  <Image
                    source={require('../../elements/images/jokesocamin.png')}
                    style={styles.mateLogCountIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.mateLogFishCountValue}>
                  {mateLogCatchCount}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    setMateLogCatchCount(prev =>
                      Math.min(MATE_LOG_MAX_FISH_COUNT_PER_CATCH, prev + 1),
                    )
                  }
                >
                  <Image
                    source={require('../../elements/images/jokesocaplus.png')}
                    style={styles.mateLogCountIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.mateLogModalInputBox}>
              <TextInput
                value={mateLogCatchWeight}
                onChangeText={setMateLogCatchWeight}
                placeholder="Weight (optional)"
                placeholderTextColor="#AFC2E6"
                style={styles.mateLogModalInput}
              />
              <Text style={styles.mateLogWeightSuffix}>kg</Text>
            </View>

            <View style={styles.mateLogModalActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.mateLogModalCancelBtn}
                onPress={() => setMateLogAddCatchModalOpen(false)}
              >
                <Text style={styles.mateLogModalActionText}>Cancel</Text>
              </TouchableOpacity>
              <Animated.View
                style={[
                  styles.mateLogModalSaveButtonWrap,
                  { transform: [{ translateX: mateLogSaveShakeAnim }] },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={mateLogSaveCatch}
                >
                  <LinearGradient
                    colors={['#0075FB', '#005CC5']}
                    style={styles.mateLogModalSaveBtn}
                  >
                    <Text style={styles.mateLogModalActionText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  mateLogBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogEndSessionButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#00A120',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogEndSessionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogHeaderBottomFade: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    position: 'absolute',
    bottom: -10,
  },
  mateLogSectionPad: { paddingHorizontal: 20, gap: 12, marginTop: 10 },
  mateLogSessionCard: {
    backgroundColor: '#7198F2',
    borderRadius: 12,
    padding: 14,
  },
  mateLogCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mateLogCardSessionName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  mateLogCardDate: {
    color: '#E5EFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  mateLogPill: {
    backgroundColor: '#97B6F4',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  mateLogPillText: {
    color: '#F0F6FF',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  mateLogInfoRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  mateLogMapButton: {
    marginTop: 10,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F4B030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogMapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogNotesBox: {
    minHeight: 92,
    borderRadius: 12,
    backgroundColor: '#032E60',
    paddingHorizontal: 12,
    paddingTop: 10,
    marginTop: 10,
  },
  mateLogNotesInput: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogBiteTitle: { color: '#032E60', fontSize: 20, fontWeight: '700' },
  mateLogTimerRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  mateLogTimerStepButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogTimerStepText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '500',
  },
  mateLogTimerValueBox: {
    flex: 1,
    height: 66,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogTimerValueBoxCenter: {
    height: 66,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 80,
  },
  mateLogTimerValueText: {
    color: '#FFFFFF',
    fontSize: 29,
    fontFamily: 'Poppins-Medium',
  },
  mateLogPrimaryButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  mateLogPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogRunningButtonsRow: { flexDirection: 'row', gap: 4 },
  mateLogPauseButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogMarkButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#006FEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogCatchTabs: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    padding: 4,
    flexDirection: 'row',
  },
  mateLogCatchTabButton: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogCatchTabButtonActive: { backgroundColor: '#F4B030' },
  mateLogCatchTabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogCatchCard: {
    minHeight: 78,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mateLogCatchFish: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  mateLogCatchInfoWrap: { flex: 1 },
  mateLogCatchName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogCatchBadges: { flexDirection: 'row', gap: 4, marginTop: 4 },
  mateLogSmallPill: {
    borderRadius: 30,
    backgroundColor: '#8FB2F2',
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  mateLogSmallPillText: {
    color: '#EAF2FF',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  mateLogAddCatchButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogAddCatchButtonText: {
    color: '#FFFFFF',
    fontSize: 40,
    lineHeight: 42,
    fontFamily: 'Poppins-Medium',
  },
  mateLogModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 41, 84, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mateLogModalCard: {
    borderRadius: 12,
    backgroundColor: '#032E60',
    padding: 20,
    paddingHorizontal: 24,
  },
  mateLogModalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
  },
  mateLogPhotoPlaceholder: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  mateLogPhotoSelected: {
    width: '100%',
    height: '100%',
  },
  mateLogModalInputBox: {
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  mateLogModalInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogFishCountRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  mateLogFishInputGrow: { flex: 1, marginTop: 0 },
  mateLogFishCountBox: {
    width: 84,
    borderRadius: 12,
    backgroundColor: '#F4B030',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  mateLogFishCountAction: {
    color: '#032E60',
    fontSize: 29,
    fontFamily: 'Poppins-Medium',
  },
  mateLogFishCountValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogCountIcon: { tintColor: '#032E60' },
  mateLogWeightSuffix: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogModalActions: { flexDirection: 'row', gap: 4, marginTop: 12 },
  mateLogModalSaveButtonWrap: { flex: 1 },
  mateLogModalCancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogModalSaveBtn: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogModalActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogLeaveModalOverlay: {
    flex: 1,
    backgroundColor:
      Platform.OS === 'ios' ? '#FFFFFF03' : 'rgba(0, 30, 67, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mateLogLeaveModalCard: {
    borderRadius: 12,
    backgroundColor: '#032E60',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  mateLogLeaveModalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  mateLogLeaveModalText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 16,
  },
  mateLogLeaveModalActions: {
    flexDirection: 'row',
    gap: 4,
  },
  mateLogLeaveCancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogLeaveCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogLeaveConfirmBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#B00505',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogLeaveConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

export default Jokesonicematesessnstart;
