import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, TILE_LETTERS } from '../theme/colors';
import { fonts } from '../theme/typography';

const LOGO_COLORS = TILE_LETTERS.map((id) => colors.tile[id]);

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

export function PlinkLogo({ size = 'lg' }: Props) {
  const fontSize = size === 'lg' ? 64 : size === 'md' ? 44 : 28;
  return (
    <View style={styles.row} accessibilityRole="header">
      {'PLINK'.split('').map((ch, i) => (
        <Text
          key={`${ch}-${i}`}
          style={[
            styles.letter,
            {
              fontSize,
              color: LOGO_COLORS[i % LOGO_COLORS.length],
              lineHeight: fontSize * 1.1,
            },
          ]}
        >
          {ch}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  letter: {
    fontFamily: fonts.extrabold,
    fontWeight: '900',
    letterSpacing: -1,
  },
});
