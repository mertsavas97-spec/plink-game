import type { TileColorId } from '../theme/colors';

export type ColorCount = 3 | 4 | 5;
export type BoardPreset = '10x10' | '12x14' | '16x18';

export interface BoardSize {
  rows: number;
  cols: number;
  preset: BoardPreset;
  label: string;
  tileCount: number;
}

/** Cell value: color id or null when empty. */
export type Cell = TileColorId | null;

/** Column-major board: board[col][row], row 0 at bottom (gravity direction). */
export type Board = Cell[][];

export interface Position {
  col: number;
  row: number;
}

export interface GameConfig {
  colorCount: ColorCount;
  boardSize: BoardSize;
  seed?: number;
}

export interface MoveResult {
  cleared: Position[];
  points: number;
  board: Board;
}

export interface GameSnapshot {
  board: Board;
  score: number;
  moves: number;
  startedAtMs: number;
  elapsedMs: number;
  config: GameConfig;
  status: GameStatus;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export const BOARD_PRESETS: Record<BoardPreset, BoardSize> = {
  '10x10': { rows: 10, cols: 10, preset: '10x10', label: '10 × 10', tileCount: 100 },
  '12x14': { rows: 14, cols: 12, preset: '12x14', label: '12 × 14', tileCount: 168 },
  '16x18': { rows: 18, cols: 16, preset: '16x18', label: '16 × 18', tileCount: 288 },
};

export const COLOR_COUNT_LABELS: Record<ColorCount, string> = {
  3: 'Easy',
  4: 'Medium',
  5: 'Hard',
};
