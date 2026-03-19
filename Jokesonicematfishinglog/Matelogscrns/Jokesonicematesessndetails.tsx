import LinearGradient from 'react-native-linear-gradient';
import { MateLogSession } from '../utils/mateLogSessionsStorage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Jokesonicematesessndetails = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mateLogSession = route.params?.mateLogSession as
    | MateLogSession
    | undefined;
  const [mateLogCatchTab, setMateLogCatchTab] = useState<'my' | 'mate'>('my');
  const mateLogVisibleCatches = (mateLogSession?.mateLogCatches || []).filter(
    mateLogCatch => mateLogCatch.mateLogType === mateLogCatchTab,
  );

  const mateLogShareSession = async () => {
    const mateLogAllCatches = mateLogSession?.mateLogCatches || [];
    const mateLogCatchesText =
      mateLogAllCatches.length === 0
        ? 'No catches yet'
        : mateLogAllCatches
            .map(
              mateLogCatch => {
                const mateLogWeightText = mateLogCatch.mateLogWeightKg.trim()
                  ? `, ${mateLogCatch.mateLogWeightKg} kg`
                  : '';
                return `- ${mateLogCatch.mateLogName}: ${mateLogCatch.mateLogFishCount} fish${mateLogWeightText} (${mateLogCatch.mateLogType})`;
              },
            )
            .join('\n');

    const mateLogShareMessage = [
      `Session: ${mateLogSession?.mateLogSessionName || 'Session Name'}`,
      `Date: ${mateLogSession?.mateLogDate || '-'}`,
      `Location: ${mateLogSession?.mateLogLocationName || '-'}`,
      `Weather: ${mateLogSession?.mateLogTemperature || '-'} °C, ${
        mateLogSession?.mateLogWind || '-'
      } km/h, ${mateLogSession?.mateLogClouds || '-'}`,
      '',
      'Notes:',
      mateLogSession?.mateLogSessionNotes || 'No notes',
      '',
      'Catches:',
      mateLogCatchesText,
    ].join('\n');

    await Share.share({ message: mateLogShareMessage });
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
                <Text style={styles.mateLogHeaderTitle}>
                  {mateLogSession?.mateLogSessionName || 'Session Name'}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.mateLogShareButton}
                  onPress={() => {
                    mateLogShareSession().catch(() => {});
                  }}
                >
                  <Image
                    source={require('../../elements/images/jokesonicshr.png')}
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
                <Text style={styles.mateLogPillText}>
                  {`${mateLogSession?.mateLogTemperature || '-2'} °C`}
                </Text>
              </View>
              <View style={styles.mateLogPill}>
                <Text style={styles.mateLogPillText}>
                  {`${mateLogSession?.mateLogWind || '8'} km/h`}
                </Text>
              </View>
              <View style={styles.mateLogPill}>
                <Text style={styles.mateLogPillText}>
                  {mateLogSession?.mateLogClouds || 'Overcast'}
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
            </View>
          </View>

          <View style={styles.mateLogNotesBox}>
            <Text style={styles.mateLogNotesText}>
              {mateLogSession?.mateLogSessionNotes || 'No notes yet'}
            </Text>
          </View>

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

          {mateLogVisibleCatches.length === 0 ? (
            <View style={styles.mateLogEmptyCatchCard}>
              <Text style={styles.mateLogEmptyCatchText}>No catches saved</Text>
            </View>
          ) : (
            mateLogVisibleCatches.map(mateLogCatch => (
              <View
                key={mateLogCatch.mateLogId}
                style={styles.mateLogCatchCard}
              >
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
                      <Text style={styles.mateLogSmallPillText}>
                        {mateLogCatch.mateLogWeightKg.trim()
                          ? `${mateLogCatch.mateLogWeightKg} kg`
                          : 'No weight'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  mateLogHeaderTitle: {
    flex: 1,
    color: '#032E60',
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 10,
  },
  mateLogShareButton: {
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
  mateLogCardSessionName: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  mateLogCardDate: { color: '#E5EFFF', fontSize: 12, fontWeight: '500' },
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
    fontFamily: 'Poppins-Medium',
  },
  mateLogInfoRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  mateLogActionRow: { flexDirection: 'row', gap: 4, marginTop: 10 },
  mateLogMapButton: {
    flex: 1,
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
  mateLogEditButton: {
    flex: 1,
    height: 36,
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
    fontFamily: 'Poppins-Medium',
  },
  mateLogNotesBox: {
    minHeight: 62,
    borderRadius: 12,
    backgroundColor: '#032E60',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  mateLogNotesText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
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
  mateLogEmptyCatchCard: {
    minHeight: 78,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogEmptyCatchText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
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
});

export default Jokesonicematesessndetails;
