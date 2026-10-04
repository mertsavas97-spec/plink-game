import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { LOGO_COLOR_IDS, LOGO_LETTERS, colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';
import { Tile } from './Tile';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showTagline?: boolean;
}

function LogoTile({
  index,
  letter,
  colorId,
  tileSize,
  animated,
}: {
  index: number;
  letter: string;
  colorId: (typeof LOGO_COLOR_IDS)[number];
  tileSize: number;
  animated: boolean;
}) {
  const scale = useSharedValue(animated ? 0.55 : 1);
  const opacity = useSharedValue(animated ? 0 : 1);

  useEffect(() => {
    if (!animated) return;
    scale.value = withDelay(
      index * 70,
      withSpring(1, { damping: 12, stiffness: 180 }),
    );
    opacity.value = withDelay(
      index * 70,
      withSpring(1, { damping: 16, stiffness: 160 }),
    );
  }, [animated, index, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <Tile
        colorId={colorId}
        size={tileSize}
        letter={letter}
        showLetter
        glow
        gap={0}
      />
    </Animated.View>
  );
}

/** Moodboard tile-block PLINK mark using shared Tile styling. */
export function PlinkLogo({
  size = 'lg',
  animated = false,
  showTagline = false,
}: Props) {
  const tileSize = layout.logoTile[size];
  const gap = layout.logoGap[size];

  return (
    <View style={styles.wrap} accessibilityRole="header" accessibilityLabel="PLINK">
      <View style={[styles.row, { gap }]}>
        {LOGO_LETTERS.map((ch, i) => (
          <LogoTile
            key={`${ch}-${i}`}
            index={i}
            letter={ch}
            colorId={LOGO_COLOR_IDS[i]}
            tileSize={tileSize}
            animated={animated}
          />
        ))}
      </View>
      {showTagline ? (
        <Text style={styles.tagline}>SAME COLORS. BIGGER MOMENTS.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center' },
  tagline: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: layout.taglineSize,
    fontWeight: '600',
    letterSpacing: layout.taglineTracking,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
