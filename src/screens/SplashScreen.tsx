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
  { id: 'A', left: '8%', delay: 0, size: 36 },
  { id: 'B', left: '78%', delay: 120, size: 32 },
  { id: 'C', left: '18%', delay: 240, size: 28 },
  { id: 'D', left: '70%', delay: 80, size: 40 },
  { id: 'E', left: '88%', delay: 200, size: 30 },
  { id: 'A', left: '4%', delay: 300, size: 26 },
  { id: 'C', left: '60%', delay: 160, size: 34 },
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
  const y = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const native = Platform.OS !== 'web';
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.85,
            duration: 300,
            useNativeDriver: native,
          }),
          Animated.timing(y, {
            toValue: 520,
            duration: 2800,
            easing: Easing.in(Easing.quad),
            useNativeDriver: native,
          }),
        ]),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: native }),
        Animated.timing(y, { toValue: -40, duration: 0, useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, opacity, y]);

  return (
    <Animated.View
      style={[
        styles.fall,
        { left, opacity, transform: [{ translateY: y }] },
      ]}
      pointerEvents="none"
    >
      <Tile colorId={id} size={size} showLetter />
    </Animated.View>
  );
}

export function SplashScreen({ navigation }: Props) {
  const { onboardingDone } = useApp();
  const tiles = useMemo(() => FALLING, []);

  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace(onboardingDone ? 'MainMenu' : 'Onboarding');
    }, 1800);
    return () => clearTimeout(id);
  }, [navigation, onboardingDone]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.stage}>
        {tiles.map((t, i) => (
          <FallingTile key={`${t.id}-${i}`} {...t} />
        ))}
        <View style={styles.hero}>
          <PlinkLogo size="lg" />
          <Text style={styles.tagline}>SAME COLORS. BIGGER MOMENTS.</Text>
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
    gap: 16,
    zIndex: 2,
  },
  tagline: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 13,
    letterSpacing: 1.4,
    fontWeight: '600',
  },
  fall: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
});
