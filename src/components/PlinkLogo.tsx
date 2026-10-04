import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LOGO_LETTERS, TILE_LETTERS, colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const LOGO_COLORS = TILE_LETTERS.map((id) => colors.tile[id]);

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { tile: 28, font: 14, gap: 4, radius: 7 },
  md: { tile: 44, font: 22, gap: 6, radius: 10 },
  lg: { tile: 58, font: 28, gap: 8, radius: 13 },
} as const;

/** Moodboard tile-block PLINK mark (rounded colored squares with letters). */
export function PlinkLogo({ size = 'lg' }: Props) {
  const s = SIZES[size];
  return (
    <View style={[styles.row, { gap: s.gap }]} accessibilityRole="header" accessibilityLabel="PLINK">
      {LOGO_LETTERS.map((ch, i) => (
        <View
          key={`${ch}-${i}`}
          style={[
            styles.tile,
            {
              width: s.tile,
              height: s.tile,
              borderRadius: s.radius,
              backgroundColor: LOGO_COLORS[i],
            },
          ]}
        >
          <View style={[styles.gloss, { borderTopLeftRadius: s.radius, borderTopRightRadius: s.radius }]} />
          <Text style={[styles.letter, { fontSize: s.font }]}>{ch}</Text>
        </View>
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
    height: '38%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  letter: {
    fontFamily: fonts.extrabold,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.95)',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
