import React, { memo, useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, type TileColorId } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';

interface Props {
  colorId: TileColorId;
  size: number;
  selected?: boolean;
  showLetter?: boolean;
  onPress?: () => void;
  /** Optional letter override (logo uses P–K). */
  letter?: string;
  /** Soft colored glow behind tile (logo / decor). */
  glow?: boolean;
  gap?: number;
  /** Dense boards (12+ cols): slightly smaller letters for breathing room. */
  dense?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TileInner({
  colorId,
  size,
  selected = false,
  showLetter = true,
  onPress,
  letter,
  glow = false,
  gap,
  dense = false,
}: Props) {
  const radius = Math.max(5, Math.round(size * layout.tileRadiusRatio));
  const scaleRatio = dense ? layout.letterScaleDense : layout.letterScale;
  const letterSize = Math.max(10, Math.round(size * scaleRatio));
  const bevelH = Math.max(
    layout.tileBevelMin,
    Math.round(size * layout.tileBevelRatio),
  );
  const highlightH = Math.max(4, Math.round(size * layout.tileHighlightHeightRatio));
  const resolvedGap =
    gap ?? Math.max(2, Math.round(size * layout.tileGapRatio));
  const halfGap = resolvedGap / 2;
  const displayLetter = letter ?? colorId;

  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? layout.tileSelectedScale : 1, {
      damping: 14,
      stiffness: 220,
    });
  }, [selected, scale]);

  useEffect(() => {
    if (selected) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: layout.tileSelectedPulseMs / 2,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(0.6, {
            duration: layout.tileSelectedPulseMs / 2,
            easing: Easing.inOut(Easing.quad),
          }),
        ),
        -1,
        false,
      );
    } else {
      pulse.value = withTiming(0, { duration: 160 });
    }
  }, [selected, pulse]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  const base = colors.tile[colorId];
  const light = colors.tileLight[colorId];
  const dark = colors.tileDark[colorId];

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.outer,
        animStyle,
        {
          width: size,
          height: size,
          margin: halfGap,
          borderRadius: radius,
          shadowColor: base,
          shadowOpacity: glow ? 0.5 : layout.tileShadowOpacity,
          shadowRadius: glow ? 14 : layout.tileShadowRadius,
          shadowOffset: { width: 0, height: layout.tileShadowOffsetY },
          elevation: glow ? 8 : layout.tileElevation,
          zIndex: selected ? 3 : 1,
        },
      ]}
    >
      {selected ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.selectedGlow,
            glowStyle,
            {
              borderRadius: radius + 6,
              borderColor: base,
              shadowColor: base,
              backgroundColor: `${base}55`,
            },
          ]}
        />
      ) : null}
      <LinearGradient
        colors={[light, base, dark]}
        locations={[0, 0.48, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.fill,
          {
            borderRadius: radius,
            borderWidth: selected ? 2 : 1,
            borderColor: selected ? colors.selection : 'rgba(255,255,255,0.18)',
          },
        ]}
      >
        <LinearGradient
          colors={[
            `rgba(255,255,255,${layout.tileHighlightOpacity})`,
            'rgba(255,255,255,0.08)',
            'rgba(255,255,255,0)',
          ]}
          locations={[0, 0.55, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.highlight,
            {
              height: highlightH,
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
              left: Math.max(2, size * 0.08),
              right: Math.max(2, size * 0.08),
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.innerEdge,
            { borderRadius: Math.max(3, radius - 1) },
          ]}
        />
        <LinearGradient
          colors={['transparent', dark]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.bevel,
            {
              height: bevelH,
              borderBottomLeftRadius: radius,
              borderBottomRightRadius: radius,
            },
          ]}
        />
        {showLetter ? (
          <Text
            allowFontScaling={false}
            style={[
              styles.letter,
              {
                fontSize: letterSize,
                lineHeight: letterSize * 1.05,
                ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
              },
            ]}
          >
            {displayLetter}
          </Text>
        ) : null}
      </LinearGradient>
    </AnimatedPressable>
  );
}

export const Tile = memo(TileInner);

const styles = StyleSheet.create({
  outer: {
    overflow: 'visible',
  },
  selectedGlow: {
    ...StyleSheet.absoluteFill,
    margin: -5,
    borderWidth: 2,
    shadowOpacity: 0.9,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  highlight: {
    position: 'absolute',
    top: 0,
  },
  innerEdge: {
    ...StyleSheet.absoluteFill,
    margin: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  bevel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.92,
  },
  letter: {
    fontFamily: fonts.tileLetter,
    color: colors.text,
    fontWeight: '400',
    zIndex: 2,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
});
