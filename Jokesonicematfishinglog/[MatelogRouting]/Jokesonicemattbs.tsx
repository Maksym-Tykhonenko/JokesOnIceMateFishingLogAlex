import { useRef } from 'react';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Jokesonicematehome from '../Matelogscrns/Jokesonicematehome';
import Jokesonicematesessn from '../Matelogscrns/Jokesonicematesessn';
import Jokesonicematestats from '../Matelogscrns/Jokesonicematestats';
import Jokesonicematejkes from '../Matelogscrns/Jokesonicematejkes';
import Jokesonicematequesint from '../Matelogscrns/Jokesonicematequesint';

const mateLogTab = createBottomTabNavigator();

const MateLogAnimatedTabButton = ({
  children,
  onPress,
  onLongPress,
  style,
  accessibilityState,
  accessibilityLabel,
  testID,
}: BottomTabBarButtonProps) => {
  const mateLogScaleValue = useRef(new Animated.Value(1)).current;

  const mateLogPressIn = () => {
    Animated.spring(mateLogScaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const mateLogPressOut = () => {
    Animated.spring(mateLogScaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={mateLogPressIn}
      onPressOut={mateLogPressOut}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[styles.mateLogTabButtonPressable, style]}
    >
      <Animated.View
        style={[
          styles.mateLogTabButtonInner,
          { transform: [{ scale: mateLogScaleValue }] },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

const mateLogHomeTabIcon = ({ color }: { color: string }) => (
  <Image
    source={require('../../elements/images/jokesonicebottomtabs1.png')}
    style={[styles.mateLogTabIcon, { tintColor: color }]}
  />
);

const mateLogSessionTabIcon = ({ color }: { color: string }) => (
  <Image
    source={require('../../elements/images/jokesonicebottomtabs2.png')}
    style={[styles.mateLogTabIcon, { tintColor: color }]}
  />
);

const mateLogStatsTabIcon = ({ color }: { color: string }) => (
  <Image
    source={require('../../elements/images/jokesonicebottomtabs3.png')}
    style={[styles.mateLogTabIcon, { tintColor: color }]}
  />
);

const mateLogJokesTabIcon = ({ color }: { color: string }) => (
  <Image
    source={require('../../elements/images/jokesonicebottomtabs4.png')}
    style={[styles.mateLogTabIcon, { tintColor: color }]}
  />
);

const mateLogWhoAmITabIcon = ({ color }: { color: string }) => (
  <Image
    source={require('../../elements/images/jokesonicebottomtabs5.png')}
    style={[styles.mateLogTabIcon, { tintColor: color }]}
  />
);

const Jokesonicemattbs = () => {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  return (
    <mateLogTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.mateLogBottomTabBar,
        tabBarActiveTintColor: '#FFC227',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarLabelStyle: [
          styles.mateLogTabLabel,
          { left: isLandscape ? 3 : 0 },
        ],
        tabBarItemStyle: styles.mateLogTabItem,
        tabBarButton: MateLogAnimatedTabButton,
      }}
    >
      <mateLogTab.Screen
        name="Jokesonicematehome"
        component={Jokesonicematehome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: mateLogHomeTabIcon,
        }}
      />
      <mateLogTab.Screen
        name="Jokesonicematesessn"
        component={Jokesonicematesessn}
        options={{
          tabBarLabel: 'Session',
          tabBarIcon: mateLogSessionTabIcon,
        }}
      />
      <mateLogTab.Screen
        name="Jokesonicematestats"
        component={Jokesonicematestats}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: mateLogStatsTabIcon,
        }}
      />
      <mateLogTab.Screen
        name="Jokesonicematejkes"
        component={Jokesonicematejkes}
        options={{
          tabBarLabel: 'Jokes',
          tabBarIcon: mateLogJokesTabIcon,
        }}
      />
      <mateLogTab.Screen
        name="Jokesonicematequesint"
        component={Jokesonicematequesint}
        options={{
          tabBarLabel: 'Who Am I?',
          tabBarIcon: mateLogWhoAmITabIcon,
        }}
      />
    </mateLogTab.Navigator>
  );
};

const styles = StyleSheet.create({
  mateLogBottomTabBar: {
    elevation: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: 'transparent',
    backgroundColor: '#032E60',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 100,
    paddingBottom: 17,
  },
  mateLogTabItem: {
    paddingTop: 6,
  },
  mateLogTabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    fontFamily: 'Poppins-Medium',
  },
  mateLogTabIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  mateLogTabButtonPressable: {
    flex: 1,
  },
  mateLogTabButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Jokesonicemattbs;
