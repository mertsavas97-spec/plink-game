import React, { memo, useEffect, useMemo } from 'react';
import {
  AccessibilityInfo,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  Ellipse,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, type TileColorId } from '../theme/colors';

const SILHOUETTES: Array<{
  id: TileColorId;
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
}> = [
  { id: 'A', x: -0.08, y: 0.02, size: 170, rotate: -18, opacity: 0.11 },
  { id: 'C', x: 0.78, y: 0.04, size: 150, rotate: 14, opacity: 0.12 },
  { id: 'D', x: -0.12, y: 0.78, size: 190, rotate: 12, opacity: 0.1 },
  { id: 'B', x: 0.82, y: 0.74, size: 160, rotate: -22, opacity: 0.12 },
  { id: 'E', x: 0.05, y: 0.88, size: 130, rotate: 8, opacity: 0.11 },
  { id: 'A', x: 0.7, y: 0.9, size: 140, rotate: -10, opacity: 0.1 },
];

/** Kept: 3–5px motes @ 20–30% with soft glow */
const DUST: Array<{ x: number; y: number; size: number; delay: number; dur: number }> =
  [
    { x: 0.12, y: 0.2, size: 3, delay: 0, dur: 18000 },
    { x: 0.28, y: 0.35, size: 4, delay: 400, dur: 22000 },
    { x: 0.72, y: 0.18, size: 3, delay: 800, dur: 16000 },
    { x: 0.88, y: 0.4, size: 5, delay: 200, dur: 24000 },
    { x: 0.18, y: 0.62, size: 3, delay: 1200, dur: 20000 },
    { x: 0.42, y: 0.78, size: 4, delay: 600, dur: 19000 },
    { x: 0.65, y: 0.55, size: 3, delay: 1000, dur: 21000 },
    { x: 0.9, y: 0.68, size: 4, delay: 300, dur: 17000 },
    { x: 0.08, y: 0.48, size: 3, delay: 1500, dur: 23000 },
    { x: 0.55, y: 0.22, size: 5, delay: 700, dur: 15000 },
    { x: 0.33, y: 0.9, size: 3, delay: 900, dur: 25000 },
    { x: 0.78, y: 0.85, size: 4, delay: 1100, dur: 18000 },
  ];

function SoftGlow({
  cx,
  cy,
  radius,
  color,
  opacity,
}: {
  cx: number;
  cy: number;
  radius: number;
  color: string;
  opacity: number;
}) {
  const id = `gg-${color.replace('#', '')}-${Math.round(cx)}-${Math.round(cy)}-${Math.round(radius)}`;
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

function Drift({
  children,
  dx,
  dy,
  duration,
  reduceMotion,
}: {
  children: React.ReactNode;
  dx: number;
  dy: number;
  duration: number;
  reduceMotion: boolean;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) {
      t.value = 0;
      return;
    }
    t.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [t, duration, reduceMotion]);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: t.value * dx },
      { translateY: t.value * dy },
    ],
  }));
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      {children}
    </Animated.View>
  );
}

function DustDot({
  x,
  y,
  size,
  delay,
  dur,
  screenW,
  screenH,
  reduceMotion,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
  dur: number;
  screenW: number;
  screenH: number;
  reduceMotion: boolean;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) {
      t.value = 0.4;
      return;
    }
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: dur, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, [t, delay, dur, reduceMotion]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.2 + (1 - t.value) * 0.1,
    transform: [{ translateY: -t.value * 28 }],
  }));
  const glow = size + 6;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.dustWrap,
        {
          left: x * screenW - 3,
          top: y * screenH - 3,
          width: glow,
          height: glow,
        },
        style,
      ]}
    >
      <Svg width={glow} height={glow}>
        <Defs>
          <RadialGradient id={`dust-${size}-${delay}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.55} />
            <Stop offset="45%" stopColor="#FFFFFF" stopOpacity={0.22} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect
          x={(glow - size) / 2}
          y={(glow - size) / 2}
          width={size}
          height={size}
          rx={size / 2}
          fill={`url(#dust-${size}-${delay})`}
        />
      </Svg>
    </Animated.View>
  );
}

export interface ClearReaction {
  /** 0–1 animated strength on UI thread */
  strength: SharedValue<number>;
  /** Group hue hex for tint overlay */
  color: string;
}

interface Props {
  children?: React.ReactNode;
  reduceMotion?: boolean;
  clearReaction?: ClearReaction;
}

/**
 * Game-screen atmosphere only — static SVG/gradients + Reanimated transform/opacity.
 * No BlurView. Far silhouettes stay in top/bottom/edge bands (never behind board).
 */
function GameBackgroundInner({
  children,
  reduceMotion: reduceMotionProp,
  clearReaction,
}: Props) {
  const { width: w, height: h } = useWindowDimensions();
  const [reduceMotion, setReduceMotion] = React.useState(!!reduceMotionProp);

  useEffect(() => {
    if (reduceMotionProp != null) {
      setReduceMotion(reduceMotionProp);
      return;
    }
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduceMotion(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, [reduceMotionProp]);

  const reactionStyle = useAnimatedStyle(() => {
    const s = clearReaction?.strength.value ?? 0;
    return { opacity: s };
  });

  const boardGlowBoost = useAnimatedStyle(() => {
    const s = clearReaction?.strength.value ?? 0;
    return { opacity: 0.16 + s * 0.5 };
  });

  const silhouettes = useMemo(
    () =>
      SILHOUETTES.map((s, i) => {
        const left = s.x * w;
        const top = s.y * h;
        const softId = `sil-soft-${i}`;
        return (
          <View
            key={`sil-${i}`}
            style={{
              position: 'absolute',
              left,
              top,
              width: s.size,
              height: s.size,
              transform: [{ rotate: `${s.rotate}deg` }],
              opacity: s.opacity,
            }}
          >
            <Svg width={s.size} height={s.size}>
              <Defs>
                <RadialGradient id={softId} cx="50%" cy="50%" rx="55%" ry="55%">
                  <Stop
                    offset="0%"
                    stopColor={colors.tile[s.id]}
                    stopOpacity={1}
                  />
                  <Stop
                    offset="70%"
                    stopColor={colors.tile[s.id]}
                    stopOpacity={0.35}
                  />
                  <Stop
                    offset="100%"
                    stopColor={colors.tile[s.id]}
                    stopOpacity={0}
                  />
                </RadialGradient>
              </Defs>
              <Rect
                x={s.size * 0.12}
                y={s.size * 0.12}
                width={s.size * 0.76}
                height={s.size * 0.76}
                rx={s.size * 0.18}
                fill={`url(#${softId})`}
              />
            </Svg>
          </View>
        );
      }),
    [w, h],
  );

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0A0F1C', '#0B1220', '#0A0E18']}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft vertical light beam behind score */}
      <Svg
        pointerEvents="none"
        width={w}
        height={h * 0.55}
        style={styles.beam}
      >
        <Defs>
          <RadialGradient id="beam" cx="50%" cy="0%" rx="40%" ry="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.09} />
            <Stop offset="55%" stopColor="#FFFFFF" stopOpacity={0.03} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse
          cx={w * 0.5}
          cy={0}
          rx={w * 0.35}
          ry={h * 0.5}
          fill="url(#beam)"
        />
      </Svg>

      {/* Board-area radial glows (~16%) — strength boosts on clear */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, boardGlowBoost]}
      >
        <SoftGlow
          cx={w * 0.28}
          cy={h * 0.42}
          radius={w * 0.55}
          color={colors.glowBlueHex}
          opacity={1}
        />
        <SoftGlow
          cx={w * 0.78}
          cy={h * 0.58}
          radius={w * 0.5}
          color={colors.glowMagentaHex}
          opacity={1}
        />
      </Animated.View>

      {/* Clear reaction tint (~40% hue blend via colored overlay) */}
      {clearReaction ? (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, reactionStyle]}
        >
          <SoftGlow
            cx={w * 0.5}
            cy={h * 0.48}
            radius={w * 0.62}
            color={clearReaction.color}
            opacity={0.4}
          />
        </Animated.View>
      ) : null}

      {/* Far-field silhouettes — edge bands only */}
      <Drift dx={14} dy={-10} duration={34000} reduceMotion={reduceMotion}>
        {silhouettes.slice(0, 3)}
      </Drift>
      <Drift dx={-12} dy={14} duration={38000} reduceMotion={reduceMotion}>
        {silhouettes.slice(3)}
      </Drift>

      {/* Dust motes */}
      {DUST.map((d, i) => (
        <DustDot
          key={`dust-${i}`}
          {...d}
          screenW={w}
          screenH={h}
          reduceMotion={reduceMotion}
        />
      ))}

      {/* Vignette */}
      <Svg
        pointerEvents="none"
        width={w}
        height={h}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <RadialGradient id="vignette" cx="50%" cy="48%" rx="58%" ry="52%">
            <Stop offset="0%" stopColor="#000000" stopOpacity={0} />
            <Stop offset="70%" stopColor="#000000" stopOpacity={0.12} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={0.35} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={w} height={h} fill="url(#vignette)" />
      </Svg>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

export const GameBackground = memo(GameBackgroundInner);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0E18', overflow: 'hidden' },
  content: { flex: 1, zIndex: 2 },
  beam: { position: 'absolute', top: 0, left: 0 },
  dustWrap: {
    position: 'absolute',
  },
});
