import type { TileColorId } from '../theme/colors';

export type ColorCount = 3 | 4 | 5;

/**
 * Phone-first board presets (touch-friendly tiles + large letters).
 * Replaces prior 10×10 / 12×14 / 16×18 which cramped small screens.
 */
export type BoardPreset = '8x8' | '10x10' | '12x12';

export interface BoardSize {
  rows: number;
  cols: number;
  preset: BoardPreset;
  label: string;
  tileCount: number;
  /** Short marketing label under the size control. */
  blurb: string;
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
  '8x8': {
    rows: 8,
    cols: 8,
    preset: '8x8',
    label: '8 × 8',
    tileCount: 64,
    blurb: 'Compact',
  },
  '10x10': {
    rows: 10,
    cols: 10,
    preset: '10x10',
    label: '10 × 10',
    tileCount: 100,
    blurb: 'Classic',
  },
  '12x12': {
    rows: 12,
    cols: 12,
    preset: '12x12',
    label: '12 × 12',
    tileCount: 144,
    blurb: 'Wide',
  },
};

/** Default New Game / Settings grid — largest readable tiles on phones. */
export const DEFAULT_BOARD_PRESET: BoardPreset = '8x8';

export const COLOR_COUNT_LABELS: Record<ColorCount, string> = {
  3: 'Easy',
  4: 'Medium',
  5: 'Hard',
};
