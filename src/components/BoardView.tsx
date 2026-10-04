import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Board, Position } from '../engine';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { Tile } from './Tile';

interface Props {
  board: Board;
  selected: Set<string>;
  showLetters: boolean;
  onTilePress: (pos: Position) => void;
  hintKeys?: Set<string>;
}

function posKey(col: number, row: number) {
  return `${col},${row}`;
}

/** Responsive board panel with moodboard tile chrome. */
export function BoardView({
  board,
  selected,
  showLetters,
  onTilePress,
  hintKeys,
}: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cols = board.length;
  const rows = board[0]?.length ?? 0;

  const { tileSize, gap } = useMemo(() => {
    if (cols === 0 || rows === 0) {
      return { tileSize: layout.comfortTile, gap: Math.round(layout.comfortTile * layout.tileGapRatio) };
    }

    const horizontalPad = layout.screenPad * 2 + layout.boardPad * 2;
    const verticalChrome =
      insets.top +
      insets.bottom +
      layout.chromeTop +
      layout.chromeBottom +
      56 +
      layout.boardPad * 2;

    const maxW = Math.max(160, screenW - horizontalPad);
    const maxH = Math.max(200, screenH - verticalChrome);

    // Estimate gap from tentative size, then resolve
    const approx = Math.min(maxW / cols, maxH / rows);
    const gap = Math.max(2, Math.round(approx * layout.tileGapRatio));
    const byW = Math.floor((maxW - gap) / cols) - gap;
    const byH = Math.floor((maxH - gap) / rows) - gap;
    const tileSize = Math.max(layout.minTile, Math.min(layout.maxTile, Math.min(byW, byH)));
    return { tileSize, gap: Math.max(2, Math.round(tileSize * layout.tileGapRatio)) };
  }, [screenW, screenH, cols, rows, insets.top, insets.bottom]);

  const rowIndices = useMemo(
    () => Array.from({ length: rows }, (_, i) => rows - 1 - i),
    [rows],
  );

  const cellPitch = tileSize + gap;

  return (
    <View style={styles.frame}>
      {rowIndices.map((row) => (
        <View key={`r-${row}`} style={styles.row}>
          {Array.from({ length: cols }, (_, col) => {
            const cell = board[col][row];
            if (cell == null) {
              return (
                <View
                  key={`e-${col}-${row}`}
                  style={{ width: cellPitch, height: cellPitch }}
                />
              );
            }
            const key = posKey(col, row);
            const isSelected = selected.has(key) || (hintKeys?.has(key) ?? false);
            return (
              <Tile
                key={key}
                colorId={cell}
                size={tileSize}
                gap={gap}
                selected={isSelected}
                showLetter={showLetters}
                onPress={() => onTilePress({ col, row })}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    padding: layout.boardPad,
    borderRadius: layout.boardRadius,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
  },
});
