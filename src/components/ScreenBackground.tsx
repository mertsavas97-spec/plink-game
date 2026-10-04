import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, type TileColorId } from '../theme/colors';
import { layout } from '../theme/layout';
import { Tile } from './Tile';

type DecorSpec = {
  id: TileColorId;
  /** Absolute px from top-left of screen */
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
  drift: number;
  duration: number;
  /** Soft blur feel via slight scale-down for “far” tiles */
  far: boolean;
};

function seeded(n: number) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Fixed seeded composition: 7 tiles, 56–96px, ~60–70% visible,
 * clear center content band.
 */
function buildDecor(screenW: number, screenH: number, seed = 11): DecorSpec[] {
  const letters: TileColorId[] = ['A', 'C', 'E', 'B', 'D', 'A', 'C'];
  // Anchor slots near edges so center stays clear (menu logo/buttons)
  const slots: Array<{ xRatio: number; yRatio: number }> = [
    { xRatio: -0.08, yRatio: 0.1 },
    { xRatio: 0.78, yRatio: 0.08 },
    { xRatio: -0.1, yRatio: 0.42 },
    { xRatio: 0.82, yRatio: 0.38 },
    { xRatio: -0.06, yRatio: 0.72 },
    { xRatio: 0.76, yRatio: 0.68 },
    { xRatio: 0.86, yRatio: 0.88 },
  ];

  return letters.map((id, i) => {
    const r = seeded(seed + i * 17);
    const r2 = seeded(seed + i * 31 + 3);
    const r3 = seeded(seed + i * 53 + 7);
    const size =
      layout.decorTileMin +
      Math.round(r * (layout.decorTileMax - layout.decorTileMin));
    const slot = slots[i];
    const x = slot.xRatio * screenW + (r2 - 0.5) * 12;
    const y = slot.yRatio * screenH + (r3 - 0.5) * 16;
    return {
      id,
      x,
      y,
      size,
      rotate: -30 + r * 60,
      opacity:
        layout.decorOpacityMin +
        r2 * (layout.decorOpacityMax - layout.decorOpacityMin),
      drift: 4 + r3 * 3,
      duration: 4500 + r * 2500,
      far: size < 70 || r3 > 0.55,
    };
  });
}

function SoftGlow({
  cx,
  cy,
  radius,
  color,
  opacity = layout.glowCenterOpacity,
}: {
  cx: number;
  cy: number;
  radius: number;
  color: string;
  opacity?: number;
}) {
  const id = `glow-${color.replace('#', '')}-${Math.round(cx)}-${Math.round(cy)}`;
  const size = radius * 2;
  return (
    <Svg
      width={size}
      height={size}
      style={{
        position: 'absolute',
        left: cx - radius,
        top: cy - radius,
      }}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <Stop offset="55%" stopColor={color} stopOpacity={opacity * 0.35} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={size} height={size} fill={`url(#${id})`} />
    </Svg>
  );
}

function DriftLayer({
  children,
  dx,
  dy,
}: {
  children: React.ReactNode;
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
  return <Animated.View style={[StyleSheet.absoluteFill, anim]}>{children}</Animated.View>;
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
    transform: [
      { translateY: y.value - spec.drift / 2 },
      { rotate: `${spec.rotate}deg` },
      { scale: spec.far ? 0.92 : 1 },
    ],
    opacity: spec.far ? spec.opacity * 0.85 : spec.opacity,
  }));

  return (
    <Animated.View
      style={[
        styles.decorItem,
        { left: spec.x, top: spec.y, width: spec.size, height: spec.size },
        anim,
      ]}
    >
      <Tile colorId={spec.id} size={spec.size} showLetter gap={0} glow />
    </Animated.View>
  );
}

interface Props {
  /** Decorative floating tiles (menu / onboarding / results). */
  showDecorTiles?: boolean;
  /** Faint cyan glow behind logo area (main menu). */
  showLogoGlow?: boolean;
  children?: React.ReactNode;
}

/** Shared atmospheric background — gradient + soft SVG glows (+ optional decor). */
export function ScreenBackground({
  showDecorTiles = false,
  showLogoGlow = false,
  children,
}: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const decor = useMemo(
    () => (showDecorTiles ? buildDecor(screenW, screenH) : []),
    [showDecorTiles, screenW, screenH],
  );

  const glowR = screenW * 0.7;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[...colors.bgGradient]}
        locations={[0, 0.45, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <DriftLayer dx={22} dy={-14}>
        <SoftGlow
          cx={screenW * 0.08}
          cy={screenH * 0.12}
          radius={glowR}
          color={colors.glowBlueHex}
          opacity={0.16}
        />
      </DriftLayer>
      <DriftLayer dx={-18} dy={20}>
        <SoftGlow
          cx={screenW * 0.92}
          cy={screenH * 0.82}
          radius={glowR * 0.95}
          color={colors.glowMagentaHex}
          opacity={0.14}
        />
      </DriftLayer>
      {showLogoGlow ? (
        <SoftGlow
          cx={screenW * 0.5}
          cy={screenH * 0.22}
          radius={screenW * 0.55}
          color={colors.glowCyanHex}
          opacity={0.12}
        />
      ) : null}

      {showDecorTiles ? (
        <View pointerEvents="none" style={styles.decorLayer}>
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
  root: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  content: { flex: 1, zIndex: 2 },
  decorLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  decorItem: {
    position: 'absolute',
  },
});
