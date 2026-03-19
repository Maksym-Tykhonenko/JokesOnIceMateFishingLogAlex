// Stats

import { CurveType, LineChart } from 'react-native-gifted-charts';
import {
  mateLogGetStatsPrefs,
  mateLogSetStatsPrefs,
} from '../utils/mateLogPreferencesStorage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  MateLogSession,
  mateLogGetSessions,
  mateLogSubscribeSessions,
} from '../utils/mateLogSessionsStorage';

const mateLogMonthLabels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const mateLogSampleWeekData = [20, 16, 7, 10, 3, 12, 10];
const mateLogSampleMonthData = [12, 9, 13, 7, 16, 11, 14];

const mateLogGetWeekLabelsFromToday = () => {
  const mateLogFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  });

  return Array.from({ length: 7 }, (_, mateLogIndex) => {
    const mateLogDate = new Date();
    mateLogDate.setDate(mateLogDate.getDate() + mateLogIndex);
    const mateLogWeekday = mateLogFormatter.format(mateLogDate);
    return mateLogWeekday.slice(0, 2);
  });
};

const mateLogGetSessionFishCount = (mateLogSession: MateLogSession) =>
  (mateLogSession.mateLogCatches || []).reduce(
    (mateLogSum, mateLogCatch) => mateLogSum + mateLogCatch.mateLogFishCount,
    0,
  );

const mateLogParseSessionDate = (mateLogDateText: string) => {
  const mateLogText = mateLogDateText.trim();
  if (!mateLogText) {
    return null;
  }

  const mateLogNativeParsed = new Date(mateLogText);
  if (!Number.isNaN(mateLogNativeParsed.getTime())) {
    return mateLogNativeParsed;
  }

  const mateLogMonthMap: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const mateLogMonthNameMatch = mateLogText.match(
    /^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/,
  );
  if (mateLogMonthNameMatch) {
    const mateLogDay = Number(mateLogMonthNameMatch[1]);
    const mateLogMonth =
      mateLogMonthMap[mateLogMonthNameMatch[2].slice(0, 3).toLowerCase()];
    const mateLogYear = Number(mateLogMonthNameMatch[3]);
    if (mateLogMonth !== undefined) {
      return new Date(mateLogYear, mateLogMonth, mateLogDay);
    }
  }

  const mateLogIsoMatch = mateLogText.match(
    /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/,
  );
  if (mateLogIsoMatch) {
    const mateLogYear = Number(mateLogIsoMatch[1]);
    const mateLogMonth = Number(mateLogIsoMatch[2]) - 1;
    const mateLogDay = Number(mateLogIsoMatch[3]);
    return new Date(mateLogYear, mateLogMonth, mateLogDay);
  }

  const mateLogDayFirstMatch = mateLogText.match(
    /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/,
  );
  if (mateLogDayFirstMatch) {
    const mateLogDay = Number(mateLogDayFirstMatch[1]);
    const mateLogMonth = Number(mateLogDayFirstMatch[2]) - 1;
    const mateLogRawYear = Number(mateLogDayFirstMatch[3]);
    const mateLogYear =
      mateLogDayFirstMatch[3].length === 2
        ? 2000 + mateLogRawYear
        : mateLogRawYear;
    return new Date(mateLogYear, mateLogMonth, mateLogDay);
  }

  return null;
};

const mateLogGetFallbackDateFromSessionId = (mateLogSessionId: string) => {
  const mateLogTimestamp = Number(mateLogSessionId.split('-')[0]);
  if (Number.isNaN(mateLogTimestamp)) {
    return null;
  }
  const mateLogParsedDate = new Date(mateLogTimestamp);
  return Number.isNaN(mateLogParsedDate.getTime()) ? null : mateLogParsedDate;
};

const mateLogResolveSessionDate = (mateLogSession: MateLogSession) => {
  const mateLogFromText = mateLogParseSessionDate(
    mateLogSession.mateLogDate || '',
  );
  if (mateLogFromText) {
    return mateLogFromText;
  }

  const mateLogFromId = mateLogGetFallbackDateFromSessionId(
    mateLogSession.mateLogId,
  );
  if (mateLogFromId) {
    return mateLogFromId;
  }

  return new Date();
};

const Jokesonicematestats = () => {
  const navigation = useNavigation<any>();
  const [mateLogSessions, setMateLogSessions] = useState<MateLogSession[]>([]);
  const [mateLogRangeTab, setMateLogRangeTab] = useState<'week' | 'month'>(
    'week',
  );
  const [mateLogUseSample, setMateLogUseSample] = useState(true);
  const [mateLogDemoNumbers] = useState(() => {
    const mateLogRandomTotalFish = Math.floor(Math.random() * 36) + 5;
    const mateLogRandomAvg = (Math.random() * 7 + 2).toFixed(1);
    return {
      mateLogRandomTotalFish,
      mateLogRandomAvg,
    };
  });

  const mateLogLoadSessions = useCallback(() => {
    let mateLogIsActive = true;
    mateLogGetSessions().then(mateLogData => {
      if (mateLogIsActive) {
        setMateLogSessions(mateLogData);
      }
    });

    return () => {
      mateLogIsActive = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => mateLogLoadSessions(), [mateLogLoadSessions]),
  );

  useEffect(() => {
    const mateLogUnsubscribe = mateLogSubscribeSessions(() => {
      mateLogGetSessions().then(mateLogData => {
        setMateLogSessions(mateLogData);
      });
    });

    return mateLogUnsubscribe;
  }, []);

  useEffect(() => {
    mateLogGetStatsPrefs()
      .then(mateLogPrefs => {
        if (!mateLogPrefs) {
          return;
        }
        setMateLogUseSample(mateLogPrefs.mateLogUseSample);
        setMateLogRangeTab(mateLogPrefs.mateLogRangeTab);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    mateLogSetStatsPrefs({
      mateLogUseSample,
      mateLogRangeTab,
    }).catch(() => {});
  }, [mateLogRangeTab, mateLogUseSample]);

  const mateLogStats = useMemo(() => {
    const mateLogTotalFish = mateLogSessions.reduce(
      (mateLogSessionSum, mateLogSession) => {
        const mateLogSessionFish = (mateLogSession.mateLogCatches || []).reduce(
          (mateLogCatchSum, mateLogCatch) =>
            mateLogCatchSum + mateLogCatch.mateLogFishCount,
          0,
        );
        return mateLogSessionSum + mateLogSessionFish;
      },
      0,
    );

    const mateLogCompletedSessions = mateLogSessions.filter(
      mateLogSession => mateLogSession.mateLogIsCompleted,
    );

    const mateLogBestSession = [...mateLogCompletedSessions].sort(
      (mateLogA, mateLogB) => {
        const mateLogAFish = (mateLogA.mateLogCatches || []).reduce(
          (sum, catchItem) => sum + catchItem.mateLogFishCount,
          0,
        );
        const mateLogBFish = (mateLogB.mateLogCatches || []).reduce(
          (sum, catchItem) => sum + catchItem.mateLogFishCount,
          0,
        );
        return mateLogBFish - mateLogAFish;
      },
    )[0];

    const mateLogFishMap = new Map<string, number>();
    mateLogSessions.forEach(mateLogSession => {
      (mateLogSession.mateLogCatches || []).forEach(mateLogCatch => {
        const mateLogPrevCount =
          mateLogFishMap.get(mateLogCatch.mateLogFishName) || 0;
        mateLogFishMap.set(
          mateLogCatch.mateLogFishName,
          mateLogPrevCount + mateLogCatch.mateLogFishCount,
        );
      });
    });
    const mateLogTopFish =
      [...mateLogFishMap.entries()].sort(
        (mateLogA, mateLogB) => mateLogB[1] - mateLogA[1],
      )[0]?.[0] || 'Perch';

    const mateLogAvgPerSession = mateLogCompletedSessions.length
      ? (mateLogTotalFish / mateLogCompletedSessions.length).toFixed(1)
      : '0.0';

    return {
      mateLogTotalFish,
      mateLogBestSession: mateLogBestSession?.mateLogLocationName || '-',
      mateLogTopFish,
      mateLogAvgPerSession,
    };
  }, [mateLogSessions]);

  const mateLogChartLabels =
    mateLogRangeTab === 'week'
      ? mateLogGetWeekLabelsFromToday()
      : mateLogMonthLabels;

  const mateLogLiveWeekData = useMemo(() => {
    return Array.from({ length: 7 }, (_, mateLogOffset) => {
      const mateLogTargetDate = new Date();
      mateLogTargetDate.setDate(mateLogTargetDate.getDate() + mateLogOffset);
      mateLogTargetDate.setHours(0, 0, 0, 0);
      const mateLogTargetTime = mateLogTargetDate.getTime();

      return mateLogSessions.reduce((mateLogDaySum, mateLogSession) => {
        const mateLogSessionDate = mateLogResolveSessionDate(mateLogSession);
        mateLogSessionDate.setHours(0, 0, 0, 0);
        if (mateLogSessionDate.getTime() !== mateLogTargetTime) {
          return mateLogDaySum;
        }
        return mateLogDaySum + mateLogGetSessionFishCount(mateLogSession);
      }, 0);
    });
  }, [mateLogSessions]);

  const mateLogLiveMonthData = useMemo(() => {
    const mateLogMonthOrder = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const mateLogMonthMap = new Map<string, number>(
      mateLogMonthOrder.map(mateLogMonth => [mateLogMonth, 0]),
    );

    mateLogSessions.forEach(mateLogSession => {
      const mateLogSessionDate = mateLogResolveSessionDate(mateLogSession);
      const mateLogMonth = new Intl.DateTimeFormat('en-US', {
        month: 'short',
      }).format(mateLogSessionDate);
      if (!mateLogMonthMap.has(mateLogMonth)) {
        return;
      }
      mateLogMonthMap.set(
        mateLogMonth,
        (mateLogMonthMap.get(mateLogMonth) || 0) +
          mateLogGetSessionFishCount(mateLogSession),
      );
    });

    return mateLogMonthOrder.map(
      mateLogMonth => mateLogMonthMap.get(mateLogMonth) || 0,
    );
  }, [mateLogSessions]);

  const mateLogHasRealStats = mateLogStats.mateLogTotalFish > 0;
  const mateLogShowDemo = !mateLogHasRealStats && mateLogUseSample;

  const mateLogChartData = mateLogHasRealStats
    ? mateLogRangeTab === 'week'
      ? mateLogLiveWeekData
      : mateLogLiveMonthData
    : mateLogUseSample
    ? mateLogRangeTab === 'week'
      ? mateLogSampleWeekData
      : mateLogSampleMonthData
    : [0, 0, 0, 0, 0, 0, 0];

  const mateLogChartGiftedData = mateLogChartData.map(
    (mateLogValue, mateLogIndex) => ({
      value: mateLogValue,
      label: mateLogChartLabels[mateLogIndex],
    }),
  );

  const mateLogChartMax = Math.max(10, ...mateLogChartData) + 2;

  const mateLogTotalFishDisplay = mateLogShowDemo
    ? mateLogDemoNumbers.mateLogRandomTotalFish
    : mateLogHasRealStats
    ? mateLogStats.mateLogTotalFish
    : '-';

  const mateLogBestSessionDisplay = mateLogShowDemo
    ? 'North Bay Hole'
    : mateLogHasRealStats
    ? mateLogStats.mateLogBestSession
    : '-';

  const mateLogTopFishDisplay = mateLogShowDemo
    ? mateLogStats.mateLogTopFish
    : mateLogHasRealStats
    ? mateLogStats.mateLogTopFish
    : '-';

  const mateLogAvgPerSessionDisplay = mateLogShowDemo
    ? mateLogDemoNumbers.mateLogRandomAvg
    : mateLogHasRealStats
    ? mateLogStats.mateLogAvgPerSession
    : '-';

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
                <Text style={styles.mateLogHeaderTitle}>Stats</Text>
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
          <View style={styles.mateLogDemoBanner}>
            <Text style={styles.mateLogDemoText}>
              {mateLogShowDemo ? 'Sample stats - Demo week' : 'Live stats'}
            </Text>
            {mateLogShowDemo ? (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.mateLogDemoClearButton}
                onPress={() => setMateLogUseSample(false)}
              >
                <Text style={styles.mateLogDemoClearText}>Clear demo data</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>

          <View style={styles.mateLogStatsGrid}>
            <View style={styles.mateLogStatCard}>
              <Text style={styles.mateLogStatLabel}>Total Fish</Text>
              <Text style={styles.mateLogStatValue}>
                {mateLogTotalFishDisplay}
              </Text>
            </View>
            <View style={styles.mateLogStatCard}>
              <Text style={styles.mateLogStatLabel}>Best Session</Text>
              <Text style={styles.mateLogStatSubValue}>
                {mateLogBestSessionDisplay}
              </Text>
            </View>
            <View style={styles.mateLogStatCard}>
              <Text style={styles.mateLogStatLabel}>Top Fish</Text>
              <Text style={styles.mateLogStatValue}>
                {mateLogTopFishDisplay}
              </Text>
            </View>
            <View style={styles.mateLogStatCard}>
              <Text style={styles.mateLogStatLabel}>Avg per Session</Text>
              <Text style={styles.mateLogStatValue}>
                {mateLogAvgPerSessionDisplay}
              </Text>
            </View>
          </View>

          <View style={styles.mateLogRangeTabs}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.mateLogRangeTabButton,
                mateLogRangeTab === 'week' &&
                  styles.mateLogRangeTabButtonActive,
              ]}
              onPress={() => setMateLogRangeTab('week')}
            >
              <Text style={styles.mateLogRangeTabText}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.mateLogRangeTabButton,
                mateLogRangeTab === 'month' &&
                  styles.mateLogRangeTabButtonActive,
              ]}
              onPress={() => setMateLogRangeTab('month')}
            >
              <Text style={styles.mateLogRangeTabText}>Month</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mateLogChartCard}>
            <Text style={styles.mateLogChartTitle}>Catch History</Text>
            <Text style={styles.mateLogChartDateLabel}>March 2026</Text>
            <LineChart
              data={mateLogChartGiftedData}
              areaChart={false}
              curved
              curveType={CurveType.QUADRATIC}
              curvature={0.12}
              color="#F4B030"
              thickness={2}
              dataPointsColor="#F4B030"
              dataPointsRadius={3}
              hideRules={false}
              rulesColor="#83A4E7"
              rulesType="solid"
              yAxisColor="transparent"
              xAxisColor="transparent"
              yAxisTextStyle={styles.mateLogChartAxisText}
              xAxisLabelTextStyle={styles.mateLogChartAxisText}
              yAxisLabelWidth={38}
              noOfSections={4}
              maxValue={mateLogChartMax}
              height={165}
              adjustToWidth
              initialSpacing={14}
              endSpacing={30}
            />
          </View>
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
  mateLogHeaderTitle: { color: '#032E60', fontWeight: '600', fontSize: 20 },
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
  mateLogBody: { paddingHorizontal: 20, marginTop: -8, gap: 10 },
  mateLogDemoBanner: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F5E99A',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -12,
  },
  mateLogDemoText: {
    color: '#032E60',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  mateLogDemoClearButton: {
    borderWidth: 1,
    borderColor: '#032E60',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  mateLogDemoClearText: {
    color: '#032E60',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  mateLogStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  mateLogStatCard: {
    width: '48%',
    minHeight: 86,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  mateLogStatLabel: {
    color: '#032E60',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginBottom: 3,
  },
  mateLogStatValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
  },
  mateLogStatSubValue: {
    color: '#FFFFFFCC',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  mateLogRangeTabs: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#7198F2',
    padding: 4,
    flexDirection: 'row',
    marginTop: 10,
  },
  mateLogRangeTabButton: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogRangeTabButtonActive: { backgroundColor: '#F4B030' },
  mateLogRangeTabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mateLogChartCard: {
    borderRadius: 12,
    backgroundColor: '#7198F2',
    paddingHorizontal: 14,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  mateLogChartTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    left: 8,
  },
  mateLogChartDateLabel: {
    color: '#D5E3FF',
    fontSize: 12,
    fontWeight: '300',
    marginBottom: 8,
    left: 8,
  },
  mateLogChartAxisText: {
    color: '#DCE7FF',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
});

export default Jokesonicematestats;
