import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme, type LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { ComingSoonScreen } from '../screens/ComingSoonScreen';
import { GameOverScreen } from '../screens/GameOverScreen';
import { GameScreen } from '../screens/GameScreen';
import { MainMenuScreen } from '../screens/MainMenuScreen';
import { NewGameScreen } from '../screens/NewGameScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.cream,
  },
};

/** Deep links used for polish screenshots / demos. */
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['http://localhost:8081', 'plink://'],
  config: {
    screens: {
      Splash: '',
      Onboarding: 'onboarding',
      MainMenu: 'menu',
      NewGame: 'new',
      Game: {
        path: 'game/:colorCount/:boardPreset',
        parse: {
          colorCount: Number,
        },
      },
      GameOver: {
        path: 'gameover',
        parse: {
          score: Number,
          best: Number,
          isNewHigh: (v: string) => v === '1' || v === 'true',
          won: (v: string) => v === '1' || v === 'true',
          colorCount: Number,
        },
      },
      Settings: 'settings',
      ComingSoon: 'soon/:feature',
    },
  },
};

export function AppNavigator() {
  const { ready } = useApp();

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.cream} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="NewGame" component={NewGameScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="GameOver" component={GameOverScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
