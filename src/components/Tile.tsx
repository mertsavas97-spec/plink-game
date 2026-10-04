import React, { memo, useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  colors,
  type TileColorId,
} from '../theme/colors';
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
  /** Soft colored glow behind tile (logo). */
  glow?: boolean;
  gap?: number;
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
}: Props) {
  const radius = Math.max(6, Math.round(size * layout.tileRadiusRatio));
  const letterSize = Math.max(12, Math.round(size * layout.letterScale));
  const bevelH = Math.min(
    layout.tileBevelMax,
    Math.max(layout.tileBevelMin, Math.round(size * 0.12)),
  );
  const resolvedGap =
    gap ?? Math.max(2, Math.round(size * layout.tileGapRatio));
  const halfGap = resolvedGap / 2;
  const displayLetter = letter ?? colorId;

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? layout.tileSelectedScale : 1, {
      damping: 14,
      stiffness: 220,
    });
  }, [selected, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
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
          borderWidth: 1,
          borderColor: dark,
          shadowColor: glow ? base : '#000000',
          shadowOpacity: glow ? 0.55 : layout.tileShadowOpacity,
          shadowRadius: glow ? 10 : layout.tileShadowRadius,
          shadowOffset: { width: 0, height: layout.tileShadowOffsetY },
          elevation: glow ? 8 : layout.tileElevation,
          zIndex: selected ? 3 : 1,
        },
        selected && styles.selectedRing,
      ]}
    >
      <LinearGradient
        colors={[light, base, dark]}
        locations={[0, 0.45, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.fill, { borderRadius: radius }]}
      >
        {/* Inner top highlight ~25% white on top 35% */}
        <LinearGradient
          colors={[`rgba(255,255,255,${layout.tileHighlightOpacity})`, 'rgba(255,255,255,0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.highlight,
            {
              height: size * layout.tileHighlightHeightRatio,
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
            },
          ]}
        />
        {/* Darker same-hue bottom bevel (soft fade, not a hard band) */}
        <LinearGradient
          colors={['transparent', dark]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.bevel,
            {
              height: bevelH + 2,
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
                lineHeight: letterSize * 1.1,
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
    left: 0,
    right: 0,
  },
  bevel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.85,
  },
  selectedRing: {
    borderWidth: 2.5,
    borderColor: colors.selection,
    shadowColor: colors.selection,
    shadowOpacity: 0.65,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  letter: {
    fontFamily: fonts.tileLetter,
    color: colors.text,
    fontWeight: '700',
    zIndex: 2,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
