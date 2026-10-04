import type { TileColorId } from '../theme/colors';

export type ColorCount = 3 | 4 | 5;

/** Board presets: cols × rows (Small / Medium / Large). */
export type BoardPreset = '8x12' | '10x14' | '10x16';

export interface BoardSize {
  rows: number;
  cols: number;
  preset: BoardPreset;
  label: string;
  tileCount: number;
  /** Display name for New Game / Settings */
  name: string;
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
  '8x12': {
    rows: 12,
    cols: 8,
    preset: '8x12',
    label: '8 × 12',
    name: 'Small',
    tileCount: 96,
  },
  '10x14': {
    rows: 14,
    cols: 10,
    preset: '10x14',
    label: '10 × 14',
    name: 'Medium',
    tileCount: 140,
  },
  '10x16': {
    rows: 16,
    cols: 10,
    preset: '10x16',
    label: '10 × 16',
    name: 'Large',
    tileCount: 160,
  },
};

/** Ordered smallest → largest for fallback. */
export const BOARD_PRESET_ORDER: BoardPreset[] = ['8x12', '10x14', '10x16'];

export const DEFAULT_BOARD_PRESET: BoardPreset = '10x14';

export const COLOR_COUNT_LABELS: Record<ColorCount, string> = {
  3: 'Easy',
  4: 'Medium',
  5: 'Hard',
};
