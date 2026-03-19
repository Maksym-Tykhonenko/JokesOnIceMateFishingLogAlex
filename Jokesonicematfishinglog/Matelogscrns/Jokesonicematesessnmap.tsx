import MapView, { Marker } from 'react-native-maps';
import { MateLogSession } from '../utils/mateLogSessionsStorage';
import { useCallback } from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';

const Jokesonicematesessnmap = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mateLogSession = route.params?.mateLogSession as
    | MateLogSession
    | undefined;
  const mateLogLatitude = mateLogSession?.mateLogLatitude ?? 45.572;
  const mateLogLongitude = mateLogSession?.mateLogLongitude ?? -73.479;

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToPortrait();

      return () => {
        Orientation.unlockAllOrientations();
      };
    }, []),
  );

  return (
    <View style={styles.mateLogScreen}>
      <View style={styles.mateLogHeaderContainer}>
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
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <MapView
        style={styles.mateLogMap}
        initialRegion={{
          latitude: mateLogLatitude,
          longitude: mateLogLongitude,
          latitudeDelta: 0.7,
          longitudeDelta: 0.5,
        }}
      >
        <Marker
          coordinate={{
            latitude: mateLogLatitude,
            longitude: mateLogLongitude,
          }}
        >
          <Image source={require('../../elements/images/jokestmapmark.png')} />
        </Marker>
      </MapView>

      <View style={styles.mateLogSessionInfoCard}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mateLogScreen: {
    flex: 1,
    backgroundColor: '#A9C1F4',
  },
  mateLogHeaderContainer: {
    zIndex: 10,
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
    paddingHorizontal: 12,
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
    fontWeight: '600',
    fontSize: 33,
  },
  mateLogMap: {
    ...StyleSheet.absoluteFillObject,
  },
  mateLogSessionInfoCard: {
    position: 'absolute',
    top: 190,
    left: 20,
    right: 20,
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
});

export default Jokesonicematesessnmap;
