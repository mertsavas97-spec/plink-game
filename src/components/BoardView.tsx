import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, useWindowDimensions, type GestureResponderEvent } from 'react-native';
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

/**
 * Responsive board — margin 8, pad 6, gap 2.
 * Single container gesture resolves cell from (x,y) including gaps (no dead zones).
 */
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

  const { tileSize, gap, panelWidth, panelHeight } = useMemo(() => {
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

  const dense = cols >= 12;
  const pad = layout.boardPad;
  const pitch = tileSize + gap;

  const resolvePos = useCallback(
    (x: number, y: number): Position | null => {
      const localX = x - pad;
      const localY = y - pad;
      if (localX < 0 || localY < 0) return null;
      const col = Math.floor(localX / pitch);
      const displayRow = Math.floor(localY / pitch);
      if (col < 0 || col >= cols || displayRow < 0 || displayRow >= rows) {
        return null;
      }
      const row = rows - 1 - displayRow;
      if (board[col][row] == null) return null;
      return { col, row };
    },
    [board, cols, rows, pad, pitch],
  );

  const onTouch = useCallback(
    (e: GestureResponderEvent) => {
      const { locationX, locationY } = e.nativeEvent;
      const pos = resolvePos(locationX, locationY);
      if (pos) onTilePress(pos);
    },
    [resolvePos, onTilePress],
  );

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.frame,
          { width: panelWidth, height: panelHeight, padding: pad },
        ]}
        onStartShouldSetResponder={() => true}
        onResponderRelease={onTouch}
      >
        {rowIndices.map((row, ri) => (
          <View
            key={`r-${row}`}
            style={[styles.row, ri < rows - 1 ? { marginBottom: gap } : null]}
          >
            {Array.from({ length: cols }, (_, col) => {
              const cell = board[col][row];
              const cellStyle = {
                width: tileSize,
                height: tileSize,
                marginRight: col < cols - 1 ? gap : 0,
              };
              if (cell == null) {
                return <View key={`e-${col}-${row}`} style={cellStyle} />;
              }
              const key = posKey(col, row);
              const isSelected =
                selected.has(key) || (hintKeys?.has(key) ?? false);
              return (
                <View key={key} style={cellStyle}>
                  <Tile
                    colorId={cell}
                    size={tileSize}
                    gap={0}
                    dense={dense}
                    selected={isSelected}
                    showLetter={showLetters}
                  />
                </View>
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
    flex: 1,
  },
  frame: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: layout.boardRadius,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});
