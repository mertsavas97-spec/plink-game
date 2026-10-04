import React, { useEffect } from 'react';
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
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { DecorTiles, type DecorPreset } from './DecorTiles';

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
      style={{ position: 'absolute', left: cx - radius, top: cy - radius }}
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
    transform: [{ translateX: t.value * dx }, { translateY: t.value * dy }],
  }));
  return <Animated.View style={[StyleSheet.absoluteFill, anim]}>{children}</Animated.View>;
}

interface Props {
  /** Screen-specific decorative tiles (menu / onboarding / result only). */
  decorPreset?: DecorPreset;
  showLogoGlow?: boolean;
  children?: React.ReactNode;
}

export function ScreenBackground({
  decorPreset,
  showLogoGlow = false,
  children,
}: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
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
      {decorPreset ? <DecorTiles preset={decorPreset} /> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  content: { flex: 1, zIndex: 2 },
});
