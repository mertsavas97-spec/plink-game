import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import type { Board, Position } from '../engine';
import { colors } from '../theme/colors';
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

export function BoardView({
  board,
  selected,
  showLetters,
  onTilePress,
  hintKeys,
}: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const cols = board.length;
  const rows = board[0]?.length ?? 0;
  const hasSelection = selected.size > 0 || (hintKeys != null && hintKeys.size > 0);

  const tileSize = useMemo(() => {
    const maxW = screenW - 32;
    const maxH = screenH * 0.58;
    if (cols === 0 || rows === 0) return 24;
    const byW = Math.floor(maxW / cols);
    const byH = Math.floor(maxH / rows);
    return Math.max(14, Math.min(byW, byH) - 2);
  }, [screenW, screenH, cols, rows]);

  // Render top-down: highest row index at top of screen
  const rowIndices = useMemo(
    () => Array.from({ length: rows }, (_, i) => rows - 1 - i),
    [rows],
  );

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
                  style={{ width: tileSize + 2, height: tileSize + 2 }}
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
                selected={isSelected}
                contourEdge={isSelected}
                dimmed={hasSelection && !isSelected}
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
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
  },
});
