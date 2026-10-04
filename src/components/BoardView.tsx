import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Board, Position } from '../engine';
import { computeBoardLayout } from '../theme/boardLayout';
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

/** Responsive board panel — 16px screen margins, centered H+V. */
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
    const topChrome = insets.top + layout.chromeTop;
    const bottomChrome = insets.bottom + layout.chromeBottom;
    return computeBoardLayout({
      screenW,
      screenH,
      cols,
      rows,
      topChrome,
      bottomChrome,
    });
  }, [screenW, screenH, cols, rows, insets.top, insets.bottom]);

  const rowIndices = useMemo(
    () => Array.from({ length: rows }, (_, i) => rows - 1 - i),
    [rows],
  );

  const cellPitch = tileSize + gap;

  return (
    <View style={styles.outer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    paddingHorizontal: layout.boardScreenMargin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    padding: layout.boardPad,
    borderRadius: layout.boardRadius,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '100%',
  },
  row: {
    flexDirection: 'row',
  },
});
