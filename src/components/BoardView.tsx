import React, { useMemo, useCallback, memo } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient as SvgGrad,
  Pattern,
  Rect,
  Stop,
} from 'react-native-svg';
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
  /** Extra chrome reserved above (HUD) / below (dock) — overrides defaults */
  topChrome?: number;
  bottomChrome?: number;
}

function posKey(col: number, row: number) {
  return `${col},${row}`;
}

/** One SVG Pattern of cell sockets — static, stays after clears, under tiles. */
const SocketLayer = memo(function SocketLayer({
  cols,
  rows,
  tileSize,
  gap,
  radius,
}: {
  cols: number;
  rows: number;
  tileSize: number;
  gap: number;
  radius: number;
}) {
  const pitch = tileSize + gap;
  const width = cols * tileSize + (cols - 1) * gap;
  const height = rows * tileSize + (rows - 1) * gap;
  const patternId = `sock-${tileSize}-${gap}-${radius}`;

  return (
    <Svg
      width={width}
      height={height}
      style={styles.sockets}
      pointerEvents="none"
    >
      <Defs>
        <SvgGrad id={`${patternId}-fill`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#000000" stopOpacity={0.34} />
          <Stop offset="55%" stopColor="#000000" stopOpacity={0.28} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0.22} />
        </SvgGrad>
        <Pattern
          id={patternId}
          width={pitch}
          height={pitch}
          patternUnits="userSpaceOnUse"
        >
          <Rect
            x={0}
            y={0}
            width={tileSize}
            height={tileSize}
            rx={radius}
            ry={radius}
            fill={`url(#${patternId}-fill)`}
          />
          {/* Inner top darker band */}
          <Rect
            x={1}
            y={1}
            width={tileSize - 2}
            height={Math.max(3, tileSize * 0.18)}
            rx={radius * 0.45}
            fill="#000000"
            opacity={0.18}
          />
          {/* Light bottom edge ~white@5% */}
          <Rect
            x={2}
            y={tileSize - 3}
            width={tileSize - 4}
            height={2}
            rx={1}
            fill="#FFFFFF"
            opacity={0.05}
          />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#${patternId})`} />
    </Svg>
  );
});

/**
 * Responsive board tray — padding 8, radius 22, glass border + sockets.
 * Single container gesture resolves cell from (x,y) including gaps.
 */
export function BoardView({
  board,
  selected,
  showLetters,
  onTilePress,
  hintKeys,
  topChrome: topChromeProp,
  bottomChrome: bottomChromeProp,
}: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cols = board.length;
  const rows = board[0]?.length ?? 0;

  const { tileSize, gap, panelWidth, panelHeight } = useMemo(() => {
    const topChrome = topChromeProp ?? insets.top + layout.chromeTop;
    const bottomChrome = bottomChromeProp ?? insets.bottom + layout.chromeBottom;
    return computeBoardLayout({
      screenW,
      screenH,
      cols,
      rows,
      topChrome,
      bottomChrome,
    });
  }, [
    screenW,
    screenH,
    cols,
    rows,
    insets.top,
    insets.bottom,
    topChromeProp,
    bottomChromeProp,
  ]);

  const rowIndices = useMemo(
    () => Array.from({ length: rows }, (_, i) => rows - 1 - i),
    [rows],
  );

  const dense = cols >= 12;
  const pad = layout.boardPad;
  const pitch = tileSize + gap;
  const socketRadius = Math.max(5, Math.round(tileSize * layout.tileRadiusRatio));

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

  const radius = layout.boardRadius;

  return (
    <View style={styles.outer}>
      {/* Soft outer glow — blue TL / magenta BR */}
      <View
        pointerEvents="none"
        style={[
          styles.glowBlue,
          { width: panelWidth + 24, height: panelHeight + 24, borderRadius: radius + 8 },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glowMagenta,
          { width: panelWidth + 24, height: panelHeight + 24, borderRadius: radius + 8 },
        ]}
      />

      {/* Shadow plate */}
      <View
        style={[
          styles.shadow,
          {
            width: panelWidth,
            height: panelHeight,
            borderRadius: radius,
          },
        ]}
      >
        {/* Border shell: top brighter → bottom softer */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.18)',
            'rgba(255,255,255,0.08)',
            'rgba(255,255,255,0.04)',
          ]}
          locations={[0, 0.45, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.borderShell, { borderRadius: radius, padding: 1 }]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[
              styles.tray,
              {
                width: panelWidth - 2,
                height: panelHeight - 2,
                borderRadius: radius - 1,
                backgroundColor: '#0B1528',
              },
            ]}
          >
            <View
              style={{ flex: 1, padding: pad }}
              onStartShouldSetResponder={() => true}
              onResponderRelease={onTouch}
            >
              {/* Thin inner top highlight */}
              <View pointerEvents="none" style={styles.innerHighlight} />

              <View style={{ width: cols * tileSize + (cols - 1) * gap }}>
                <SocketLayer
                  cols={cols}
                  rows={rows}
                  tileSize={tileSize}
                  gap={gap}
                  radius={socketRadius}
                />
                <View style={styles.tileLayer}>
                  {rowIndices.map((row, ri) => (
                    <View
                      key={`r-${row}`}
                      style={[
                        styles.row,
                        ri < rows - 1 ? { marginBottom: gap } : null,
                      ]}
                    >
                      {Array.from({ length: cols }, (_, col) => {
                        const cell = board[col][row];
                        const cellStyle = {
                          width: tileSize,
                          height: tileSize,
                          marginRight: col < cols - 1 ? gap : 0,
                        };
                        if (cell == null) {
                          return (
                            <View key={`e-${col}-${row}`} style={cellStyle} />
                          );
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
            </View>
          </LinearGradient>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowBlue: {
    position: 'absolute',
    backgroundColor: 'rgba(45, 120, 240, 0.10)',
    ...Platform.select({
      ios: {
        shadowColor: colors.glowBlueHex,
        shadowOpacity: 0.55,
        shadowRadius: 28,
        shadowOffset: { width: -6, height: -6 },
      },
      default: {},
    }),
  },
  glowMagenta: {
    position: 'absolute',
    backgroundColor: 'rgba(226, 24, 192, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: colors.glowMagentaHex,
        shadowOpacity: 0.5,
        shadowRadius: 28,
        shadowOffset: { width: 6, height: 8 },
      },
      default: {},
    }),
  },
  shadow: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.45,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
      },
      android: { elevation: 12 },
      default: {
        shadowColor: '#000000',
        shadowOpacity: 0.45,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
      },
    }),
  },
  borderShell: {
    overflow: 'hidden',
  },
  tray: {
    overflow: 'hidden',
  },
  innerHighlight: {
    position: 'absolute',
    top: 1,
    left: 10,
    right: 10,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 1,
    zIndex: 3,
  },
  sockets: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0,
  },
  tileLayer: {
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});
