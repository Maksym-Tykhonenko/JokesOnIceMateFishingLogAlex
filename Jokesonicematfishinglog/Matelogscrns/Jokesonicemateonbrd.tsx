// introduce

import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';

const mateLogOnbrdImages = [
  require('../../elements/images/jokesoniceon1.png'),
  require('../../elements/images/jokesoniceon2.png'),
  require('../../elements/images/jokesoniceon3.png'),
];

const Jokesonicemateonbrd = () => {
  const navigation = useNavigation();
  const [mateLogCurrIndx, setMateLogCurrIndx] = useState(0);

  const mateLogNextPress = () => {
    setMateLogCurrIndx(mateLogCurrIndx + 1);
    if (mateLogCurrIndx === 2) {
      navigation.replace('Jokesonicemattbs');
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#AAC3FD',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 63,
        }}
      >
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
        >
          <View>
            <Image
              source={mateLogOnbrdImages[mateLogCurrIndx]}
              style={{ width: 415 }}
            />

            <LinearGradient
              colors={['#AAC3FD00', '#AAC3FD']}
              style={{
                width: '100%',
                height: 100,
                position: 'absolute',
                bottom: 0,
              }}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
              flex: 1,
            }}
          >
            <Text style={styles.mateLogTitle}>
              {mateLogCurrIndx === 0
                ? 'Log the Ice Session'
                : mateLogCurrIndx === 1
                ? 'Fish With Your Mates'
                : 'Stats, Jokes, and Who Am I?'}
            </Text>
            <Text style={styles.mateLogDescription}>
              {mateLogCurrIndx === 0
                ? 'Save your spot, time, and conditions in one clean session. Run the Bite Timer, add catches in seconds, and keep every trip organized—no frozen notes, no guessing'
                : mateLogCurrIndx === 1
                ? 'Add your friends to the session and log everyone’s catch. One trip, one shared story—who landed what, when it happened, and which mate is still “just warming up.”'
                : 'Turn your log into trends—totals, best sessions, and temperature insights. When the bite goes quiet, switch to jokes or play Who Am I? together and keep the ice time fun'}
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {[1, 2, 3].map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: '#fff',
                      borderRadius: 100,
                    }}
                  >
                    {index === mateLogCurrIndx && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          backgroundColor: '#032E60',
                          borderRadius: 100,
                        }}
                      />
                    )}
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={{ width: '90%' }}
              onPress={mateLogNextPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#0075FB', '#005CC5']}
                style={{
                  height: 50,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    fontFamily: 'Poppins-Medium',
                  }}
                >
                  {mateLogCurrIndx === 0
                    ? 'Next'
                    : mateLogCurrIndx === 1
                    ? 'Next'
                    : 'Start'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mateLogTitle: {
    fontSize: 29,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#032E60',
    marginTop: 60,
    paddingHorizontal: 35,
  },
  mateLogDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#032E60',
    paddingHorizontal: 30,
  },
});

export default Jokesonicemateonbrd;
