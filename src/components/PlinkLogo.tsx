import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { LOGO_LETTERS, TILE_LETTERS, colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const LOGO_COLORS = TILE_LETTERS.map((id) => colors.tile[id]);

interface Props {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const SIZES = {
  sm: { tile: 30, font: 16, gap: 5, radius: 8 },
  md: { tile: 48, font: 24, gap: 7, radius: 12 },
  lg: { tile: 62, font: 32, gap: 8, radius: 14 },
} as const;

/** Moodboard tile-block PLINK mark with gloss + optional entrance motion. */
export function PlinkLogo({ size = 'lg', animated = false }: Props) {
  const s = SIZES[size];
  const scales = useRef(LOGO_LETTERS.map(() => new Animated.Value(animated ? 0.6 : 1))).current;
  const opacities = useRef(LOGO_LETTERS.map(() => new Animated.Value(animated ? 0 : 1))).current;

  useEffect(() => {
    if (!animated) return;
    const native = Platform.OS !== 'web';
    const anims = LOGO_LETTERS.map((_, i) =>
      Animated.parallel([
        Animated.timing(scales[i], {
          toValue: 1,
          duration: 420,
          delay: i * 70,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: native,
        }),
        Animated.timing(opacities[i], {
          toValue: 1,
          duration: 280,
          delay: i * 70,
          useNativeDriver: native,
        }),
      ]),
    );
    Animated.stagger(0, anims).start();
  }, [animated, opacities, scales]);

  return (
    <View style={[styles.row, { gap: s.gap }]} accessibilityRole="header" accessibilityLabel="PLINK">
      {LOGO_LETTERS.map((ch, i) => (
        <Animated.View
          key={`${ch}-${i}`}
          style={[
            styles.tile,
            {
              width: s.tile,
              height: s.tile,
              borderRadius: s.radius,
              backgroundColor: LOGO_COLORS[i],
              opacity: opacities[i],
              transform: [{ scale: scales[i] }],
            },
          ]}
        >
          <View style={[styles.gloss, { borderTopLeftRadius: s.radius, borderTopRightRadius: s.radius }]} />
          <View
            style={[
              styles.depth,
              { borderBottomLeftRadius: s.radius, borderBottomRightRadius: s.radius },
            ]}
          />
          <Text style={[styles.letter, { fontSize: s.font }]}>{ch}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  depth: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '28%',
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  letter: {
    fontFamily: fonts.extrabold,
    fontWeight: '800',
    color: '#FFFFFF',
    zIndex: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
