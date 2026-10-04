import { TILE_LETTERS, type TileColorId } from '../theme/colors';
import type { Board, Cell, ColorCount, GameConfig, Position } from './types';

/** Simple seeded PRNG (mulberry32) for reproducible boards when seed is set. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function createEmptyBoard(cols: number, rows: number): Board {
  return Array.from({ length: cols }, () => Array<Cell>(rows).fill(null));
}

export function cloneBoard(board: Board): Board {
  return board.map((col) => col.slice());
}

export function paletteFor(colorCount: ColorCount): TileColorId[] {
  return TILE_LETTERS.slice(0, colorCount);
}

export function createBoard(config: GameConfig): Board {
  const { cols, rows } = config.boardSize;
  const palette = paletteFor(config.colorCount);
  const rand = config.seed != null ? mulberry32(config.seed) : Math.random;
  const board = createEmptyBoard(cols, rows);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      board[c][r] = palette[Math.floor(rand() * palette.length)];
    }
  }
  return board;
}

export function inBounds(board: Board, col: number, row: number): boolean {
  return col >= 0 && col < board.length && row >= 0 && row < (board[0]?.length ?? 0);
}

export function getCell(board: Board, pos: Position): Cell {
  if (!inBounds(board, pos.col, pos.row)) return null;
  return board[pos.col][pos.row];
}

/** Apply gravity within each column (tiles fall toward row 0). */
export function applyGravity(board: Board): Board {
  const next = cloneBoard(board);
  const rows = next[0]?.length ?? 0;
  for (let c = 0; c < next.length; c++) {
    const packed: Cell[] = [];
    for (let r = 0; r < rows; r++) {
      if (next[c][r] != null) packed.push(next[c][r]);
    }
    for (let r = 0; r < rows; r++) {
      next[c][r] = packed[r] ?? null;
    }
  }
  return next;
}

/** Collapse empty columns leftward. */
export function collapseColumns(board: Board): Board {
  const rows = board[0]?.length ?? 0;
  const nonEmpty = board.filter((col) => col.some((cell) => cell != null));
  while (nonEmpty.length < board.length) {
    nonEmpty.push(Array<Cell>(rows).fill(null));
  }
  return nonEmpty;
}

export function clearPositions(board: Board, positions: Position[]): Board {
  const next = cloneBoard(board);
  for (const { col, row } of positions) {
    if (inBounds(next, col, row)) next[col][row] = null;
  }
  return collapseColumns(applyGravity(next));
}

export function countTiles(board: Board): number {
  let n = 0;
  for (const col of board) {
    for (const cell of col) {
      if (cell != null) n++;
    }
  }
  return n;
}

export function isBoardEmpty(board: Board): boolean {
  return countTiles(board) === 0;
}
