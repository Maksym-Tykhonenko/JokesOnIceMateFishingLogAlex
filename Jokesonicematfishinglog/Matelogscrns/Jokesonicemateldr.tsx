// loader

import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const mateLogScreenHeight = Dimensions.get('window').height;

type MateLogSnowItem = {
  left: `${number}%`;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
};

const mateLogSnowConfig: MateLogSnowItem[] = [
  { left: '8%', size: 5, opacity: 0.5, duration: 5200, delay: 0 },
  { left: '18%', size: 4, opacity: 0.4, duration: 5900, delay: 600 },
  { left: '30%', size: 6, opacity: 0.45, duration: 5400, delay: 1200 },
  { left: '42%', size: 4, opacity: 0.35, duration: 6100, delay: 900 },
  { left: '56%', size: 5, opacity: 0.45, duration: 5600, delay: 1400 },
  { left: '68%', size: 3, opacity: 0.3, duration: 6400, delay: 300 },
  { left: '80%', size: 5, opacity: 0.4, duration: 5800, delay: 1000 },
  { left: '90%', size: 4, opacity: 0.35, duration: 6200, delay: 1700 },
];

const Jokesonicemateldr = ({ navigation }: any) => {
  const mateLogSnowAnimations = useRef(
    mateLogSnowConfig.map(() => new Animated.Value(-20)),
  ).current;

  useEffect(() => {
    //const mateLogLoaderTimeout = setTimeout(() => {
    //  navigation.replace('Jokesonicemateonbrd');
    //}, 5000);

    const mateLogSnowLoops = mateLogSnowAnimations.map(
      (mateLogSnowAnim, mateLogIndex) => {
        const mateLogItem = mateLogSnowConfig[mateLogIndex];

        return Animated.loop(
          Animated.sequence([
            Animated.timing(mateLogSnowAnim, {
              toValue: mateLogScreenHeight + 20,
              duration: mateLogItem.duration,
              delay: mateLogItem.delay,
              useNativeDriver: true,
            }),
            Animated.timing(mateLogSnowAnim, {
              toValue: -20,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        );
      },
    );

    mateLogSnowLoops.forEach(mateLogLoop => mateLogLoop.start());

    return () => {
      //clearTimeout(mateLogLoaderTimeout);
      mateLogSnowLoops.forEach(mateLogLoop => mateLogLoop.stop());
    };
  }, [navigation, mateLogSnowAnimations]);

  return (
    <ImageBackground
      source={require('../../elements/images/jokesonicebogldr.png')}
      style={styles.mateLogLoaderBackground}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View pointerEvents="none" style={styles.mateLogSnowLayer}>
          {mateLogSnowConfig.map((mateLogFlake, mateLogIndex) => (
            <Animated.View
              key={`mateLogSnowFlake-${mateLogIndex}`}
              style={[
                styles.mateLogSnowflake,
                {
                  left: mateLogFlake.left,
                  width: mateLogFlake.size,
                  height: mateLogFlake.size,
                  borderRadius: mateLogFlake.size / 2,
                  opacity: mateLogFlake.opacity,
                  transform: [
                    { translateY: mateLogSnowAnimations[mateLogIndex] },
                  ],
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.mateLogLoaderContent}>
          <Image
            source={require('../../elements/images/jokesoniceldrim.png')}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mateLogLoaderBackground: {
    flex: 1,
  },
  mateLogLoaderContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mateLogSnowLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  mateLogSnowflake: {
    position: 'absolute',
    top: -20,
    backgroundColor: '#FFFFFF',
  },
});

export default Jokesonicemateldr;
