import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';

interface Props {
  right?: number;
  bottom?: number;
}

/** Transparent SVG hand — shadowColor only, no yellow square / elevation plate. */
function HandSvg({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.5 11V6.5a1.5 1.5 0 0 1 3 0V11M11.5 10.5V5a1.5 1.5 0 0 1 3 0v6.5M14.5 11V6.75a1.5 1.5 0 0 1 3 0V14c0 3.5-2 5.5-5.5 5.5S6.5 17.5 6.5 14v-2.25a1.5 1.5 0 0 1 3 0V14"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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
    opacity: 0.3 * (1.1 - ripple.value),
    transform: [{ scale: 0.6 + ripple.value * 0.9 }],
  }));

  return (
    <View pointerEvents="none" style={[styles.wrap, { right, bottom }]}>
      <Animated.View style={[styles.ripple, rippleStyle]} />
      <Animated.View style={[styles.hand, handStyle]}>
        <HandSvg size={layout.onboardingHand} color={colors.text} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: layout.onboardingHand + 12,
    height: layout.onboardingHand + 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    backgroundColor: 'transparent',
  },
  ripple: {
    position: 'absolute',
    width: layout.onboardingHand + 6,
    height: layout.onboardingHand + 6,
    borderRadius: (layout.onboardingHand + 6) / 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'transparent',
  },
  hand: {
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    // no elevation — avoids yellow/grey Android plate
  },
});
