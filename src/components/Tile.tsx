import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TILE_COLOR_VALUES, colors, type TileColorId } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';

interface Props {
  colorId: TileColorId;
  size: number;
  selected?: boolean;
  showLetter?: boolean;
  onPress?: () => void;
  dimmed?: boolean;
  gap?: number;
}

export function Tile({
  colorId,
  size,
  selected,
  showLetter = true,
  onPress,
  dimmed,
  gap = layout.tileGap,
}: Props) {
  const radius = Math.max(6, Math.round(size * 0.22));
  const letterSize = Math.max(16, Math.round(size * layout.letterScale));
  const halfGap = gap / 2;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          margin: halfGap,
          borderRadius: radius,
          backgroundColor: TILE_COLOR_VALUES[colorId],
          opacity: dimmed ? 0.28 : 1,
        },
        selected && styles.selected,
      ]}
    >
      {/* Top gloss band */}
      <View
        style={[
          styles.glossTop,
          {
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            height: size * 0.42,
          },
        ]}
      />
      {/* Soft specular highlight */}
      <View
        style={[
          styles.specular,
          {
            width: size * 0.55,
            height: size * 0.22,
            borderRadius: size,
            top: size * 0.08,
          },
        ]}
      />
      {/* Bottom depth shade */}
      <View
        style={[
          styles.depth,
          {
            borderBottomLeftRadius: radius,
            borderBottomRightRadius: radius,
            height: size * 0.28,
          },
        ]}
      />
      {/* Inner bevel ring */}
      <View
        pointerEvents="none"
        style={[
          styles.bevel,
          {
            borderRadius: Math.max(4, radius - 1),
            borderColor: selected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.22)',
            borderWidth: selected ? 2.5 : StyleSheet.hairlineWidth,
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
              lineHeight: letterSize,
              // Nudge optical center; Inter caps sit slightly high in the em box
              transform: [{ translateY: Math.max(0.5, size * 0.02) }, { scale: 1.08 }],
            },
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
    overflow: 'hidden',
  },
  selected: {
    zIndex: 3,
    transform: [{ scale: 1.05 }],
    elevation: 8,
  },
  glossTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  specular: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  depth: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  bevel: {
    ...StyleSheet.absoluteFill,
    margin: 1.5,
  },
  letter: {
    fontFamily: fonts.extrabold,
    color: '#FFFFFF',
    fontWeight: '800',
    zIndex: 2,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
