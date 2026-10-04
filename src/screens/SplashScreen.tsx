import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlinkLogo } from '../components/PlinkLogo';
import { Tile } from '../components/Tile';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, type TileColorId } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const FALLING: Array<{ id: TileColorId; left: `${number}%`; delay: number; size: number }> = [
  { id: 'A', left: '6%', delay: 0, size: 40 },
  { id: 'B', left: '76%', delay: 140, size: 34 },
  { id: 'C', left: '16%', delay: 260, size: 30 },
  { id: 'D', left: '68%', delay: 90, size: 42 },
  { id: 'E', left: '86%', delay: 210, size: 32 },
  { id: 'A', left: '3%', delay: 320, size: 28 },
  { id: 'C', left: '58%', delay: 180, size: 36 },
];

function FallingTile({
  id,
  left,
  delay,
  size,
}: {
  id: TileColorId;
  left: `${number}%`;
  delay: number;
  size: number;
}) {
  const y = useRef(new Animated.Value(-48)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const native = Platform.OS !== 'web';
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.9,
            duration: 320,
            useNativeDriver: native,
          }),
          Animated.timing(y, {
            toValue: 560,
            duration: 3000,
            easing: Easing.in(Easing.quad),
            useNativeDriver: native,
          }),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: native,
          }),
        ]),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: native }),
        Animated.timing(y, { toValue: -48, duration: 0, useNativeDriver: native }),
        Animated.timing(rotate, { toValue: 0, duration: 0, useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, opacity, rotate, y]);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '12deg'] });

  return (
    <Animated.View
      style={[styles.fall, { left, opacity, transform: [{ translateY: y }, { rotate: spin }] }]}
      pointerEvents="none"
    >
      <Tile colorId={id} size={size} showLetter />
    </Animated.View>
  );
}

export function SplashScreen({ navigation }: Props) {
  const { onboardingDone } = useApp();
  const tiles = useMemo(() => FALLING, []);
  const tagOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const native = Platform.OS !== 'web';
    Animated.timing(tagOpacity, {
      toValue: 1,
      duration: 500,
      delay: 420,
      useNativeDriver: native,
    }).start();
  }, [tagOpacity]);

  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace(onboardingDone ? 'MainMenu' : 'Onboarding');
    }, 2000);
    return () => clearTimeout(id);
  }, [navigation, onboardingDone]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.stage}>
        {tiles.map((t, i) => (
          <FallingTile key={`${t.id}-${i}`} {...t} />
        ))}
        <View style={styles.hero}>
          <PlinkLogo size="lg" animated />
          <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
            SAME COLORS. BIGGER MOMENTS.
          </Animated.Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  stage: { flex: 1, overflow: 'hidden' },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    zIndex: 2,
  },
  tagline: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 13,
    letterSpacing: 1.6,
    fontWeight: '600',
  },
  fall: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
});
