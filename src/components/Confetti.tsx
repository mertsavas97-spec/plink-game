import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
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
  duration,
  rounded,
  travel,
}: {
  color: string;
  left: number;
  delay: number;
  size: number;
  spin: number;
  duration: number;
  rounded: boolean;
  travel: number;
}) {
  // Start fully above the viewport — never overlaps title/score block
  const y = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(spin * 0.1);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.9, { duration: 180 }));
    y.value = withDelay(
      delay,
      withTiming(travel, { duration, easing: Easing.in(Easing.quad) }),
    );
    rotate.value = withDelay(delay, withTiming(spin, { duration }));
  }, [delay, duration, opacity, rotate, spin, travel, y]);

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
          height: rounded ? size * 0.7 : size,
          backgroundColor: color,
          borderRadius: rounded ? size * 0.35 : 2,
        },
        style,
      ]}
    />
  );
}

/** Falling tile-palette pieces — always behind result content (zIndex 0). */
export function Confetti({ count = 32 }: { count?: number }) {
  const { height } = useWindowDimensions();
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const speed = 0.7 + (i % 5) * 0.18;
        return {
          color: TILE_COLOR_VALUES[TILE_LETTERS[i % TILE_LETTERS.length]],
          left: (i * 41 + (i % 3) * 7) % 94,
          delay: (i % 10) * 70,
          size: 6 + (i % 7), // 6–12px
          spin: (i % 2 === 0 ? 1 : -1) * (90 + (i % 6) * 35),
          duration: Math.round((2600 + (i % 9) * 220) / speed),
          rounded: i % 3 !== 0,
          travel: height + 160,
        };
      }),
    [count, height],
  );

  return (
    <View pointerEvents="none" style={styles.layer}>
      {pieces.map((p, i) => (
        <Piece key={i} {...p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  piece: { position: 'absolute', top: -40 },
});
