import React from 'react';
import { StyleSheet, View } from 'react-native';
import { type TileColorId } from '../theme/colors';
import { Tile } from './Tile';

const DECOR: Array<{
  id: TileColorId;
  top: `${number}%`;
  left?: `${number}%`;
  right?: `${number}%`;
  size: number;
  rotate: string;
  opacity: number;
}> = [
  { id: 'A', top: '8%', left: '-6%', size: 44, rotate: '-18deg', opacity: 0.35 },
  { id: 'C', top: '22%', left: '-4%', size: 32, rotate: '12deg', opacity: 0.28 },
  { id: 'E', top: '58%', left: '-8%', size: 38, rotate: '-8deg', opacity: 0.3 },
  { id: 'B', top: '12%', right: '-7%', size: 40, rotate: '16deg', opacity: 0.32 },
  { id: 'D', top: '36%', right: '-5%', size: 34, rotate: '-14deg', opacity: 0.28 },
  { id: 'A', top: '68%', right: '-9%', size: 46, rotate: '10deg', opacity: 0.26 },
];

/** Ambient 3D tiles behind main menu content. */
export function FloatingDecorTiles() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {DECOR.map((d, i) => (
        <View
          key={`${d.id}-${i}`}
          style={[
            styles.item,
            {
              top: d.top,
              left: d.left,
              right: d.right,
              opacity: d.opacity,
              transform: [{ rotate: d.rotate }],
            },
          ]}
        >
          <Tile colorId={d.id} size={d.size} showLetter gap={0} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { position: 'absolute' },
});
