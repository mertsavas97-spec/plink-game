import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TILE_COLOR_VALUES, colors, type TileColorId } from '../theme/colors';
import { fonts } from '../theme/typography';

interface Props {
  colorId: TileColorId;
  size: number;
  selected?: boolean;
  showLetter?: boolean;
  onPress?: () => void;
  dimmed?: boolean;
  /** Soften neighbors when a cluster is selected elsewhere. */
  contourEdge?: boolean;
}

export function Tile({
  colorId,
  size,
  selected,
  showLetter = true,
  onPress,
  dimmed,
  contourEdge,
}: Props) {
  const radius = Math.max(4, Math.round(size * 0.18));
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: TILE_COLOR_VALUES[colorId],
          opacity: dimmed ? 0.32 : 1,
        },
        selected && styles.selected,
        contourEdge && styles.contour,
      ]}
    >
      <View
        style={[
          styles.gloss,
          { borderTopLeftRadius: radius, borderTopRightRadius: radius },
        ]}
      />
      {showLetter ? (
        <Text
          style={[
            styles.letter,
            { fontSize: Math.max(10, Math.round(size * 0.42)) },
          ]}
        >
          {colorId}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    overflow: 'hidden',
  },
  selected: {
    borderWidth: 3,
    borderColor: colors.selection,
    zIndex: 2,
    transform: [{ scale: 1.04 }],
    elevation: 6,
  },
  contour: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '38%',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  letter: {
    fontFamily: fonts.extrabold,
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
