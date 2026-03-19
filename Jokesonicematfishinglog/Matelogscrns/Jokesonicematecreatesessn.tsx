import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import MapView, { Marker } from 'react-native-maps';
import {
  MateLogSession,
  mateLogAddSession,
  mateLogUpdateSession,
} from '../utils/mateLogSessionsStorage';
import { useMateLogStore } from '../Matelogstore/mateLogContxt';

const mateLogCloudOptions = ['Clear', 'Overcast', 'Snowing'];
const mateLogDefaultCoordinate = {
  latitude: 45.572,
  longitude: -73.479,
};
const Jokesonicematecreatesessn = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mateLogNotificationsEnabled } = useMateLogStore();
  const mateLogSessionToEdit = route.params?.mateLogSessionToEdit as
    | MateLogSession
    | undefined;
  const mateLogIsEditMode = Boolean(mateLogSessionToEdit);
  const [mateLogSessionName, setMateLogSessionName] = useState('');
  const [mateLogLocationName, setMateLogLocationName] = useState('');
  const [mateLogTemperature, setMateLogTemperature] = useState('');
  const [mateLogWind, setMateLogWind] = useState('');
  const [mateLogClouds, setMateLogClouds] = useState('');
  const [mateLogCloudsDropdownOpen, setMateLogCloudsDropdownOpen] =
    useState(false);
  const [mateLogDate, setMateLogDate] = useState('');
  const [mateLogMarkerCoordinate, setMateLogMarkerCoordinate] = useState(
    mateLogDefaultCoordinate,
  );
  const mateLogCreateShakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!mateLogSessionToEdit) {
      return;
    }

    setMateLogSessionName(mateLogSessionToEdit.mateLogSessionName);
    setMateLogLocationName(mateLogSessionToEdit.mateLogLocationName);
    setMateLogTemperature(mateLogSessionToEdit.mateLogTemperature);
    setMateLogWind(mateLogSessionToEdit.mateLogWind);
    setMateLogClouds(mateLogSessionToEdit.mateLogClouds);
    setMateLogDate(mateLogSessionToEdit.mateLogDate);
    setMateLogMarkerCoordinate({
      latitude:
        mateLogSessionToEdit.mateLogLatitude ??
        mateLogDefaultCoordinate.latitude,
      longitude:
        mateLogSessionToEdit.mateLogLongitude ??
        mateLogDefaultCoordinate.longitude,
    });
  }, [mateLogSessionToEdit]);

  const mateLogTriggerCreateShake = () => {
    Animated.sequence([
      Animated.timing(mateLogCreateShakeAnim, {
        toValue: -10,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogCreateShakeAnim, {
        toValue: 10,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogCreateShakeAnim, {
        toValue: -7,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogCreateShakeAnim, {
        toValue: 7,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(mateLogCreateShakeAnim, {
        toValue: 0,
        duration: 35,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const mateLogCreateSession = async () => {
    const mateLogHasMissingFields =
      !mateLogSessionName.trim() ||
      !mateLogLocationName.trim() ||
      !mateLogTemperature.trim() ||
      !mateLogWind.trim() ||
      !mateLogClouds.trim() ||
      !mateLogDate.trim();

    if (mateLogHasMissingFields) {
      mateLogTriggerCreateShake();
      return;
    }

    const mateLogPayload = {
      mateLogSessionName: mateLogSessionName.trim(),
      mateLogLocationName: mateLogLocationName.trim(),
      mateLogLatitude: mateLogMarkerCoordinate.latitude,
      mateLogLongitude: mateLogMarkerCoordinate.longitude,
      mateLogTemperature: mateLogTemperature.trim(),
      mateLogWind: mateLogWind.trim(),
      mateLogClouds: mateLogClouds.trim(),
      mateLogDate: mateLogDate.trim(),
    };

    if (mateLogSessionToEdit) {
      await mateLogUpdateSession(
        mateLogSessionToEdit.mateLogId,
        mateLogPayload,
      );
      if (mateLogNotificationsEnabled) {
        Toast.show({
          type: 'success',
          text1: 'Session updated successfully',
        });
      }
    } else {
      await mateLogAddSession(mateLogPayload);
      if (mateLogNotificationsEnabled) {
        Toast.show({
          type: 'success',
          text1: 'Session saved successfully',
        });
      }
    }

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
                  onPress={() => navigation.goBack()}
                >
                  <Image
                    source={require('../../elements/images/jokesonicbakc.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.mateLogHeaderTitle}>
                  {mateLogIsEditMode ? 'Edit Session' : 'Start Ice Session'}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
          <LinearGradient
            colors={['#AAC3FD00', '#AAC3FD']}
            style={styles.mateLogHeaderBottomFade}
          />
        </View>

        <View style={styles.mateLogFormWrap}>
          <View style={styles.mateLogInputBox}>
            <TextInput
              value={mateLogSessionName}
              onChangeText={setMateLogSessionName}
              placeholder="Session Name"
              placeholderTextColor="#FFFFFF80"
              style={styles.mateLogInput}
            />
          </View>

          <View style={styles.mateLogInputBox}>
            <TextInput
              value={mateLogLocationName}
              onChangeText={setMateLogLocationName}
              placeholder="Location Name"
              placeholderTextColor="#FFFFFF80"
              style={styles.mateLogInput}
            />
          </View>

          <View style={styles.mateLogMapWrap}>
            <MapView
              style={styles.mateLogMap}
              initialRegion={{
                latitude: mateLogMarkerCoordinate.latitude,
                longitude: mateLogMarkerCoordinate.longitude,
                latitudeDelta: 0.14,
                longitudeDelta: 0.12,
              }}
              onPress={event => {
                const { latitude, longitude } = event.nativeEvent.coordinate;
                setMateLogMarkerCoordinate({ latitude, longitude });
              }}
            >
              <Marker coordinate={mateLogMarkerCoordinate}>
                <Image
                  source={require('../../elements/images/jokestmapmark.png')}
                />
              </Marker>
            </MapView>
          </View>

          <View style={styles.mateLogInputBox}>
            <TextInput
              value={mateLogTemperature}
              onChangeText={setMateLogTemperature}
              placeholder="Temperature"
              placeholderTextColor="#FFFFFF80"
              keyboardType="numeric"
              style={styles.mateLogInput}
            />
            <Text style={styles.mateLogInputSuffix}>°C</Text>
          </View>

          <View style={styles.mateLogInputBox}>
            <TextInput
              value={mateLogWind}
              onChangeText={setMateLogWind}
              placeholder="Wind"
              placeholderTextColor="#FFFFFF80"
              keyboardType="numeric"
              style={styles.mateLogInput}
            />
            <Text style={styles.mateLogInputSuffix}>km/h</Text>
          </View>

          <View style={styles.mateLogDropdownWrap}>
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.mateLogInputBox}
              onPress={() =>
                setMateLogCloudsDropdownOpen(!mateLogCloudsDropdownOpen)
              }
            >
              <Text
                style={[
                  styles.mateLogInput,
                  !mateLogClouds && styles.mateLogInputPlaceholder,
                ]}
              >
                {mateLogClouds || 'Overcast'}
              </Text>
              <Image
                source={require('../../elements/images/jokestmapdown.png')}
              />
            </TouchableOpacity>

            {mateLogCloudsDropdownOpen && (
              <View style={styles.mateLogDropdownList}>
                {mateLogCloudOptions.map(mateLogCloudOption => (
                  <TouchableOpacity
                    key={mateLogCloudOption}
                    activeOpacity={0.85}
                    style={styles.mateLogDropdownItem}
                    onPress={() => {
                      setMateLogClouds(mateLogCloudOption);
                      setMateLogCloudsDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.mateLogDropdownItemText}>
                      {mateLogCloudOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.mateLogInputBox}>
            <TextInput
              value={mateLogDate}
              onChangeText={setMateLogDate}
              placeholder="Date"
              placeholderTextColor="#89A4CF"
              style={styles.mateLogInput}
            />
            <Image source={require('../../elements/images/jokesoddt.png')} />
          </View>

          <Animated.View
            style={[
              styles.mateLogCreateButtonWrap,
              { transform: [{ translateX: mateLogCreateShakeAnim }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={mateLogCreateSession}
            >
              <LinearGradient
                colors={['#0075FB', '#005CC5']}
                style={styles.mateLogCreateButton}
              >
                <Text style={styles.mateLogCreateButtonText}>
                  {mateLogIsEditMode ? 'Save Session' : 'Create Session'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
    paddingBottom: 36,
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
    fontSize: 20,
  },
  mateLogHeaderBottomFade: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'absolute',
    bottom: -10,
  },
  mateLogFormWrap: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 10,
  },
  mateLogInputBox: {
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: '#032E60',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mateLogInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 0,
    fontFamily: 'Poppins-Medium',
  },
  mateLogInputSuffix: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  mateLogInputPlaceholder: {
    color: '#89A4CF',
  },
  mateLogDropdownWrap: {
    gap: 8,
  },
  mateLogDropdownList: {
    borderRadius: 12,
    backgroundColor: '#032E60',
    paddingVertical: 4,
  },
  mateLogDropdownItem: {
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  mateLogDropdownItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  mateLogMapWrap: {
    height: 142,
    borderRadius: 18,
    overflow: 'hidden',
  },
  mateLogMap: {
    width: '100%',
    height: '100%',
  },
  mateLogCreateButton: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mateLogCreateButtonWrap: { width: '100%' },
  mateLogCreateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

export default Jokesonicematecreatesessn;
