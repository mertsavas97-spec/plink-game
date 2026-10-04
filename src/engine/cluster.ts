import { getCell, inBounds } from './board';
import type { Board, Position } from './types';

const ORTHO: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

/**
 * Find the orthogonally connected same-color cluster containing `origin`.
 * Returns empty array if the cell is empty.
 */
export function findCluster(board: Board, origin: Position): Position[] {
  const color = getCell(board, origin);
  if (color == null) return [];

  const key = (c: number, r: number) => `${c},${r}`;
  const visited = new Set<string>();
  const stack: Position[] = [origin];
  const cluster: Position[] = [];

  while (stack.length > 0) {
    const pos = stack.pop()!;
    const k = key(pos.col, pos.row);
    if (visited.has(k)) continue;
    visited.add(k);
    if (getCell(board, pos) !== color) continue;
    cluster.push(pos);
    for (const [dc, dr] of ORTHO) {
      const next = { col: pos.col + dc, row: pos.row + dr };
      if (inBounds(board, next.col, next.row) && !visited.has(key(next.col, next.row))) {
        stack.push(next);
      }
    }
  }

  return cluster;
}

/** Valid selectable cluster: size ≥ 2. */
export function isSelectableCluster(cluster: Position[]): boolean {
  return cluster.length >= 2;
}

/** All positions that belong to any selectable (≥2) cluster. */
export function findAllSelectableClusters(board: Board): Position[][] {
  const seen = new Set<string>();
  const clusters: Position[][] = [];
  const key = (c: number, r: number) => `${c},${r}`;

  for (let c = 0; c < board.length; c++) {
    for (let r = 0; r < (board[0]?.length ?? 0); r++) {
      if (board[c][r] == null || seen.has(key(c, r))) continue;
      const cluster = findCluster(board, { col: c, row: r });
      for (const p of cluster) seen.add(key(p.col, p.row));
      if (isSelectableCluster(cluster)) clusters.push(cluster);
    }
  }
  return clusters;
}

export function hasValidMoves(board: Board): boolean {
  return findAllSelectableClusters(board).length > 0;
}

/** Hint: largest selectable cluster (ties → first found). */
export function hintCluster(board: Board): Position[] | null {
  const clusters = findAllSelectableClusters(board);
  if (clusters.length === 0) return null;
  let best = clusters[0];
  for (const c of clusters) {
    if (c.length > best.length) best = c;
  }
  return best;
}
