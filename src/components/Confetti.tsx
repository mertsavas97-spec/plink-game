import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { TILE_COLOR_VALUES, TILE_LETTERS } from '../theme/colors';

function Piece({
  color,
  left,
  delay,
  size,
  spin,
}: {
  color: string;
  left: number;
  delay: number;
  size: number;
  spin: number;
}) {
  const y = useSharedValue(-40);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    y.value = withDelay(
      delay,
      withTiming(720, { duration: 2800 + delay, easing: Easing.in(Easing.quad) }),
    );
    rotate.value = withDelay(delay, withTiming(spin, { duration: 2800 + delay }));
  }, [delay, opacity, rotate, spin, y]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: y.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: `${left}%`,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: 3,
        },
        style,
      ]}
    />
  );
}

/** Falling colored squares for Board Cleared / Game Over. */
export function Confetti({ count = 28 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        color: TILE_COLOR_VALUES[TILE_LETTERS[i % TILE_LETTERS.length]],
        left: (i * 37) % 96,
        delay: (i % 8) * 80,
        size: 6 + (i % 5),
        spin: (i % 2 === 0 ? 1 : -1) * (120 + (i % 5) * 40),
      })),
    [count],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => (
        <Piece key={i} {...p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0 },
});
