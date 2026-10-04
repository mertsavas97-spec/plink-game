import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors, type TileColorId } from '../theme/colors';
import { Tile } from './Tile';

export type DecorPreset = 'menu' | 'onboarding' | 'result';

type Spec = {
  id: TileColorId;
  /** Absolute left (px) relative to screen; computed from safe slot */
  left: number;
  top: number;
  size: number;
  rotate: number;
  dim: number;
};

type Slot = {
  /** Allowed rectangle for tile origin (top-left) */
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  id: TileColorId;
  size: number;
  rotate: number;
  dim: number;
};

/**
 * Bounded allowed rectangles — never overlap interactive chrome.
 * Menu: max 4; top corners above logo OR band between tagline and Play.
 * Onboarding: between board bottom and dots; 24px clearance from dots.
 * Result: top corners + empty band between score and buttons; 16px clearance.
 */
function buildSlots(
  preset: DecorPreset,
  w: number,
  h: number,
): Slot[] {
  if (preset === 'menu') {
    // Logo ~y 0.18–0.38, tagline ~0.40, Play ~0.52, Themes/Daily ~0.62–0.78
    return [
      { x0: -8, y0: 8, x1: 40, y1: h * 0.12, id: 'A', size: 58, rotate: -22, dim: 0.28 },
      // Keep clear of top-right Settings gear (~44px)
      { x0: w - 96, y0: 56, x1: w - 48, y1: h * 0.14, id: 'C', size: 48, rotate: 18, dim: 0.3 },
      { x0: -10, y0: h * 0.42, x1: 36, y1: h * 0.48, id: 'E', size: 56, rotate: -12, dim: 0.26 },
      { x0: w - 52, y0: h * 0.42, x1: w - 8, y1: h * 0.48, id: 'B', size: 48, rotate: 14, dim: 0.28 },
    ];
  }
  if (preset === 'onboarding') {
    // Board ends ~0.62–0.68; dots near bottom ~0.92. Decor only in mid-band.
    const dotsY = h * 0.9;
    const bandTop = h * 0.68;
    const bandBottom = dotsY - 24 - 56; // 24px clearance from dots + tile size room
    return [
      {
        x0: -6,
        y0: bandTop,
        x1: 40,
        y1: Math.max(bandTop + 8, bandBottom),
        id: 'A',
        size: 52,
        rotate: -18,
        dim: 0.28,
      },
      {
        x0: w - 56,
        y0: bandTop,
        x1: w - 4,
        y1: Math.max(bandTop + 8, bandBottom),
        id: 'D',
        size: 56,
        rotate: 16,
        dim: 0.26,
      },
    ];
  }
  // result — top corners + empty band under score (~0.55) above buttons (~0.72)
  return [
    { x0: -8, y0: 8, x1: 40, y1: h * 0.12, id: 'B', size: 56, rotate: -20, dim: 0.28 },
    { x0: w - 52, y0: 10, x1: w - 4, y1: h * 0.12, id: 'E', size: 52, rotate: 14, dim: 0.3 },
    { x0: -10, y0: h * 0.56, x1: 36, y1: h * 0.66, id: 'A', size: 60, rotate: 12, dim: 0.26 },
    { x0: w - 52, y0: h * 0.56, x1: w - 4, y1: h * 0.66, id: 'D', size: 48, rotate: -14, dim: 0.3 },
  ];
}

function placeInSlot(slot: Slot): Spec {
  const left = Math.min(slot.x0, slot.x1);
  const top = Math.min(slot.y0, slot.y1);
  return {
    id: slot.id,
    left,
    top,
    size: slot.size,
    rotate: slot.rotate,
    dim: slot.dim,
  };
}

function assertNoOverlap(
  specs: Spec[],
  forbidden: Array<{ x: number; y: number; w: number; h: number; label: string }>,
  clearance: number,
) {
  if (typeof __DEV__ === 'undefined' || !__DEV__) return;
  for (const s of specs) {
    const ax0 = s.left - clearance;
    const ay0 = s.top - clearance;
    const ax1 = s.left + s.size + clearance;
    const ay1 = s.top + s.size + clearance;
    for (const f of forbidden) {
      const overlap =
        ax0 < f.x + f.w && ax1 > f.x && ay0 < f.y + f.h && ay1 > f.y;
      if (overlap) {
        console.warn(
          `[DecorTiles] overlap with ${f.label}: tile@(${s.left},${s.top}) size=${s.size}`,
        );
      }
    }
  }
}

export function DecorTiles({ preset }: { preset: DecorPreset }) {
  const { width: w, height: h } = useWindowDimensions();

  const specs = useMemo(() => {
    const slots = buildSlots(preset, w, h);
    const placed = slots.map(placeInSlot);

    if (preset === 'menu') {
      // Logo center, Play button, Themes card — approximate forbidden zones
      assertNoOverlap(
        placed,
        [
          { x: w * 0.12, y: h * 0.16, w: w * 0.76, h: h * 0.22, label: 'logo' },
          { x: w * 0.1, y: h * 0.5, w: w * 0.8, h: 56, label: 'play' },
          { x: w * 0.1, y: h * 0.6, w: w * 0.8, h: h * 0.22, label: 'menu-cards' },
        ],
        16,
      );
    } else if (preset === 'onboarding') {
      assertNoOverlap(
        placed,
        [{ x: 0, y: h * 0.9 - 24, w, h: 48, label: 'dots' }],
        24,
      );
    } else if (preset === 'result') {
      assertNoOverlap(
        placed,
        [
          { x: w * 0.15, y: h * 0.2, w: w * 0.7, h: h * 0.3, label: 'score' },
          { x: w * 0.1, y: h * 0.7, w: w * 0.8, h: 120, label: 'play-again' },
        ],
        16,
      );
    }

    return placed;
  }, [preset, w, h]);

  return (
    <View pointerEvents="none" style={styles.layer}>
      {specs.map((s, i) => (
        <View
          key={`${preset}-${s.id}-${i}`}
          style={[
            styles.item,
            {
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              transform: [{ rotate: `${s.rotate}deg` }],
            },
          ]}
        >
          <Tile
            colorId={s.id}
            size={s.size}
            showLetter
            gap={0}
            decorDim={s.dim}
          />
        </View>
      ))}
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
