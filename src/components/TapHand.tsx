import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { IconHand } from './Icons';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';

interface Props {
  /** Absolute position within the demo board wrapper */
  right?: number;
  bottom?: number;
}

/** Overlay hand cursor — never replaces tile letters. Looping tap + ripple. */
export function TapHand({ right = 10, bottom = 10 }: Props) {
  const scale = useSharedValue(1);
  const ripple = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 280, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 320, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
      false,
    );
    ripple.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }),
        withTiming(0.35, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, [scale, ripple]);

  const handStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: 0.35 * (1.1 - ripple.value),
    transform: [{ scale: 0.6 + ripple.value * 0.9 }],
  }));

  return (
    <View pointerEvents="none" style={[styles.wrap, { right, bottom }]}>
      <Animated.View style={[styles.ripple, rippleStyle]} />
      <Animated.View style={[styles.hand, handStyle]}>
        <IconHand size={layout.onboardingHand} color={colors.text} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: layout.onboardingHand + 16,
    height: layout.onboardingHand + 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  ripple: {
    position: 'absolute',
    width: layout.onboardingHand + 8,
    height: layout.onboardingHand + 8,
    borderRadius: (layout.onboardingHand + 8) / 2,
    borderWidth: 2,
    borderColor: colors.text,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  hand: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});
