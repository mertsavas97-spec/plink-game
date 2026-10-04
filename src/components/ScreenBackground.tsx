import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, type TileColorId } from '../theme/colors';
import { Tile } from './Tile';

type DecorSpec = {
  id: TileColorId;
  top: number;
  left?: number;
  right?: number;
  size: number;
  rotate: number;
  opacity: number;
  drift: number;
  duration: number;
};

/** Seeded pseudo-random in [0,1). */
function seeded(n: number) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function buildDecor(seed = 42): DecorSpec[] {
  const letters: TileColorId[] = ['A', 'B', 'C', 'D', 'E', 'A', 'C'];
  return letters.map((id, i) => {
    const r = seeded(seed + i * 17);
    const r2 = seeded(seed + i * 31 + 3);
    const r3 = seeded(seed + i * 53 + 7);
    const leftSide = i % 2 === 0;
    return {
      id,
      top: 6 + r * 78,
      left: leftSide ? -12 + r2 * 8 : undefined,
      right: leftSide ? undefined : -12 + r2 * 8,
      size: 28 + Math.round(r3 * 22),
      rotate: -35 + r * 70,
      opacity: 0.1 + r2 * 0.15,
      drift: 4 + r3 * 2,
      duration: 4000 + r * 3000,
    };
  });
}

function DriftGlow({
  color,
  style,
  dx,
  dy,
}: {
  color: string;
  style: object;
  dx: number;
  dy: number;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 20000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [t]);
  const anim = useAnimatedStyle(() => ({
    transform: [
      { translateX: t.value * dx },
      { translateY: t.value * dy },
    ],
  }));
  return <Animated.View style={[styles.glow, style, { backgroundColor: color }, anim]} />;
}

function FloatingTile({ spec }: { spec: DecorSpec }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(
      withTiming(spec.drift, {
        duration: spec.duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [y, spec.drift, spec.duration]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value - spec.drift / 2 }, { rotate: `${spec.rotate}deg` }],
    opacity: spec.opacity,
  }));

  return (
    <Animated.View
      style={[
        styles.decorItem,
        {
          top: `${spec.top}%`,
          left: spec.left != null ? `${spec.left}%` : undefined,
          right: spec.right != null ? `${spec.right}%` : undefined,
        },
        anim,
      ]}
    >
      <Tile colorId={spec.id} size={spec.size} showLetter gap={0} />
    </Animated.View>
  );
}

interface Props {
  /** Decorative floating tiles (menu / onboarding / results). */
  showDecorTiles?: boolean;
  children?: React.ReactNode;
}

/** Shared atmospheric background — gradient + glows (+ optional decor tiles). */
export function ScreenBackground({ showDecorTiles = false, children }: Props) {
  const decor = useMemo(() => (showDecorTiles ? buildDecor(7) : []), [showDecorTiles]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[...colors.bgGradient]}
        locations={[0, 0.45, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <DriftGlow color={colors.glowBlue} style={styles.glowBlue} dx={28} dy={-18} />
      <DriftGlow color={colors.glowMagenta} style={styles.glowMagenta} dx={-22} dy={24} />
      {showDecorTiles ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {decor.map((d, i) => (
            <FloatingTile key={`${d.id}-${i}`} spec={d} />
          ))}
        </View>
      ) : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, zIndex: 1 },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  glowBlue: {
    top: -40,
    left: -80,
  },
  glowMagenta: {
    bottom: 40,
    right: -100,
  },
  decorItem: {
    position: 'absolute',
  },
});
