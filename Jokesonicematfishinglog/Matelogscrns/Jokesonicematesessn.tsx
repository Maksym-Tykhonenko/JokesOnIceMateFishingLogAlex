// Sessions

import {
  MateLogSession,
  mateLogDeleteSession,
  mateLogGetSessions,
} from '../utils/mateLogSessionsStorage';
import { BlurView } from '@react-native-community/blur';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
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
import LinearGradient from 'react-native-linear-gradient';

const Jokesonicematesessn = () => {
  const navigation = useNavigation<any>();
  const [mateLogSessions, setMateLogSessions] = useState<MateLogSession[]>([]);
  const [mateLogSessionToDelete, setMateLogSessionToDelete] =
    useState<MateLogSession | null>(null);

  const mateLogConfirmDeleteSession = async () => {
    if (!mateLogSessionToDelete) {
      return;
    }

    await mateLogDeleteSession(mateLogSessionToDelete.mateLogId);
    setMateLogSessions(prevMateLogSessions =>
      prevMateLogSessions.filter(
        mateLogSession =>
          mateLogSession.mateLogId !== mateLogSessionToDelete.mateLogId,
      ),
    );
    setMateLogSessionToDelete(null);
  };

  useFocusEffect(
    useCallback(() => {
      let mateLogIsActive = true;

      mateLogGetSessions().then(mateLogData => {
        if (mateLogIsActive) {
          setMateLogSessions(mateLogData);
        }
      });

      return () => {
        mateLogIsActive = false;
      };
    }, []),
  );

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
                <Text style={styles.mateLogHeaderTitle}>Sessions</Text>
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

        {mateLogSessions.length === 0 ? (
          <View style={styles.mateLogEmptyStateWrap}>
            <Image
              source={require('../../elements/images/jokesoempty.png')}
              style={styles.mateLogFishImage}
            />
            <Text style={styles.mateLogEmptyTitle}>No sessions yet</Text>
            <Text style={styles.mateLogEmptyDescription}>
              Start an ice session to save your spot, weather, mates, and every
              catch in one place
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.mateLogCreateButtonWrap}
              onPress={() => navigation.navigate('Jokesonicematecreatesessn')}
            >
              <LinearGradient
                colors={['#0D7DFF', '#0062D6']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.mateLogCreateButton}
              >
                <Text style={styles.mateLogCreateButtonText}>
                  Create Ice Session
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mateLogListStateWrap}>
            <View style={styles.mateLogSessionsList}>
              {mateLogSessions.map(mateLogSession => (
                <TouchableOpacity
                  key={mateLogSession.mateLogId}
                  style={styles.mateLogSessionCard}
                  activeOpacity={1}
                  delayLongPress={320}
                  onLongPress={() => setMateLogSessionToDelete(mateLogSession)}
                >
                  <View style={styles.mateLogCardHeaderRow}>
                    <Text style={styles.mateLogCardSessionName}>
                      {mateLogSession.mateLogSessionName}
                    </Text>
                    <Text style={styles.mateLogCardDate}>
                      {mateLogSession.mateLogDate}
                    </Text>
                  </View>

                  <View style={styles.mateLogPill}>
                    <Text style={styles.mateLogPillText}>
                      {mateLogSession.mateLogLocationName}
                    </Text>
                  </View>

                  <View style={styles.mateLogInfoRow}>
                    <View style={styles.mateLogPill}>
                      <Text style={styles.mateLogPillText}>
                        {`${mateLogSession.mateLogTemperature} °C`}
                      </Text>
                    </View>
                    <View style={styles.mateLogPill}>
                      <Text style={styles.mateLogPillText}>
                        {`${mateLogSession.mateLogWind} km/h`}
                      </Text>
                    </View>
                    <View style={styles.mateLogPill}>
                      <Text style={styles.mateLogPillText}>
                        {mateLogSession.mateLogClouds}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.mateLogActionRow}>
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
                    <TouchableOpacity
                      activeOpacity={0.88}
                      style={styles.mateLogEditButton}
                      onPress={() =>
                        navigation.navigate('Jokesonicematecreatesessn', {
                          mateLogSessionToEdit: mateLogSession,
                        })
                      }
                    >
                      <Image
                        source={require('../../elements/images/jokestmapedt.png')}
                      />
                      <Text style={styles.mateLogEditButtonText}>Edit</Text>
                    </TouchableOpacity>
                    {!mateLogSession.mateLogIsCompleted && (
                      <TouchableOpacity
                        activeOpacity={0.88}
                        style={styles.mateLogStartButton}
                        onPress={() =>
                          navigation.navigate('Jokesonicematesessnstart', {
                            mateLogSession,
                          })
                        }
                      >
                        <Text style={styles.mateLogStartButtonText}>Start</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {mateLogSession.mateLogIsCompleted && (
                    <TouchableOpacity
                      activeOpacity={0.88}
                      style={styles.mateLogViewButton}
                      onPress={() =>
                        navigation.navigate('Jokesonicematesessndetails', {
                          mateLogSession,
                        })
                      }
                    >
                      <Text style={styles.mateLogViewButtonText}>View</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.mateLogCreateButtonFilledWrap}
              onPress={() => navigation.navigate('Jokesonicematecreatesessn')}
            >
              <LinearGradient
                colors={['#0D7DFF', '#0062D6']}
                style={styles.mateLogCreateButton}
              >
                <Text style={styles.mateLogCreateButtonText}>
                  Start Ice Session
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={Boolean(mateLogSessionToDelete)}
        onRequestClose={() => setMateLogSessionToDelete(null)}
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
        <View style={styles.mateLogDeleteModalOverlay}>
          <View style={styles.mateLogDeleteModalCard}>
            <Text style={styles.mateLogDeleteModalTitle}>
              Delete this session?
            </Text>
            <Text style={styles.mateLogDeleteModalText}>
              This removes the session, its catches, mates, and notes
            </Text>
            <View style={styles.mateLogDeleteModalActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.mateLogDeleteCancelButton}
                onPress={() => setMateLogSessionToDelete(null)}
              >
                <Text style={styles.mateLogDeleteCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.mateLogDeleteConfirmButton}
                onPress={() => {
                  mateLogConfirmDeleteSession().catch(() => {});
                }}
              >
                <Text style={styles.mateLogDeleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    minHeight: '100%',
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
  mateLogHeaderBottomFade: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'absolute',
    bottom: -10,
  },
  mateLogEmptyStateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  mateLogFishImage: {
    width: 142,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  mateLogEmptyTitle: {
    color: '#032E60',
    fontSize: 29,
    lineHeight: 54,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  mateLogEmptyDescription: {
    color: '#163A67',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 340,
  },
  mateLogCreateButtonWrap: {
    width: '100%',
    marginTop: 24,
  },
  mateLogListStateWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    minHeight: 640,
    justifyContent: 'space-between',
  },
  mateLogSessionsList: {
    gap: 12,
  },
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
    fontWeight: '700',
  },
  mateLogCardDate: {
    color: '#E5EFFF',
    fontSize: 12,
    fontWeight: '500',
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
    fontWeight: '500',
  },
  mateLogInfoRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  mateLogActionRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
  },
  mateLogMapButton: {
    flex: 1,
    height: 33,
    borderRadius: 12,
    backgroundColor: '#F4B030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogMapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  mateLogEditButton: {
    flex: 1,
    height: 33,
    borderRadius: 12,
    backgroundColor: '#032E60',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  mateLogEditButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  mateLogStartButton: {
    flex: 1,
    height: 33,
    borderRadius: 12,
    backgroundColor: '#006FEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogStartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  mateLogViewButton: {
    marginTop: 8,
    height: 33,
    borderRadius: 12,
    backgroundColor: '#006FEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogViewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  mateLogCreateButtonFilledWrap: {
    width: '48%',
    alignSelf: 'flex-end',
    marginTop: 24,
    bottom: 25,
  },
  mateLogCreateButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogCreateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  mateLogDeleteModalOverlay: {
    flex: 1,
    backgroundColor:
      Platform.OS === 'ios' ? '#FFFFFF03' : 'rgba(0, 30, 67, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mateLogDeleteModalCard: {
    backgroundColor: '#032E60',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  mateLogDeleteModalTitle: {
    color: '#FFFFFF',
    fontSize: 20,

    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  mateLogDeleteModalText: {
    color: '#E7F0FF',
    fontSize: 16,

    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 16,
  },
  mateLogDeleteModalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  mateLogDeleteCancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogDeleteCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  mateLogDeleteConfirmButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#B00505',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogDeleteConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
});

export default Jokesonicematesessn;
