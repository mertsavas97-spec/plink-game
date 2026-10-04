import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors, type TileColorId } from '../theme/colors';
import { Tile } from './Tile';

export type DecorPreset = 'menu' | 'onboarding' | 'result';

type Spec = {
  id: TileColorId;
  /** 0–1 of screen */
  x: number;
  y: number;
  size: number;
  rotate: number;
  /** Dark overlay strength on body (letters stay white) */
  dim: number;
  far?: boolean;
};

/** Hand-placed per screen — outer ~20% / empty bands; never over content. */
const PRESETS: Record<DecorPreset, Spec[]> = {
  menu: [
    { id: 'A', x: -0.06, y: 0.12, size: 72, rotate: -22, dim: 0.25 },
    { id: 'C', x: 0.82, y: 0.1, size: 64, rotate: 18, dim: 0.28, far: true },
    { id: 'E', x: -0.08, y: 0.55, size: 80, rotate: -12, dim: 0.22 },
    { id: 'B', x: 0.84, y: 0.48, size: 68, rotate: 14, dim: 0.26, far: true },
    { id: 'D', x: 0.78, y: 0.78, size: 56, rotate: -16, dim: 0.3, far: true },
  ],
  onboarding: [
    // Below the board band only
    { id: 'A', x: -0.05, y: 0.72, size: 64, rotate: -18, dim: 0.25 },
    { id: 'D', x: 0.78, y: 0.7, size: 72, rotate: 16, dim: 0.22 },
    { id: 'C', x: 0.42, y: 0.86, size: 56, rotate: -10, dim: 0.3, far: true },
  ],
  result: [
    { id: 'B', x: -0.06, y: 0.04, size: 68, rotate: -20, dim: 0.26 },
    { id: 'E', x: 0.82, y: 0.06, size: 60, rotate: 14, dim: 0.28, far: true },
    { id: 'A', x: -0.08, y: 0.82, size: 72, rotate: 12, dim: 0.24 },
    { id: 'D', x: 0.8, y: 0.84, size: 56, rotate: -14, dim: 0.3, far: true },
  ],
};

/**
 * Decorative tiles — NEVER opacity on whole tile (greys letters).
 * Dim via dark overlay on body; white letters stay crisp.
 */
export function DecorTiles({ preset }: { preset: DecorPreset }) {
  const { width: w, height: h } = useWindowDimensions();
  const specs = PRESETS[preset];

  return (
    <View pointerEvents="none" style={styles.layer}>
      {specs.map((s, i) => {
        const size = s.far ? Math.round(s.size * 0.92) : s.size;
        return (
          <View
            key={`${preset}-${s.id}-${i}`}
            style={[
              styles.item,
              {
                left: s.x * w,
                top: s.y * h,
                width: size,
                height: size,
                transform: [{ rotate: `${s.rotate}deg` }, { scale: s.far ? 0.94 : 1 }],
              },
            ]}
          >
            <Tile
              colorId={s.id}
              size={size}
              showLetter
              gap={0}
              decorDim={s.dim}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  item: {
    position: 'absolute',
  },
});

void colors;
