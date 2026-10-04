import type { ColorCount } from './types';

/**
 * Same Game–inspired scoring (documented choice).
 *
 * Cluster points (only size > 2 score):
 *   points = (n - 2)² × colorMultiplier
 *
 * Color multipliers raise potential on harder boards (classic Same Game spirit):
 *   3 colors → 1.0
 *   4 colors → 1.5
 *   5 colors → 2.0
 *
 * Time bonus (applied once at game end if the board is fully cleared):
 *   baselineSeconds = rows × cols × 1.5
 *   timeBonus = max(0, floor((baselineSeconds - elapsedSeconds) × 10)) × colorMultiplier
 *
 * Clear-board bonus:
 *   clearBonus = 1000 × colorMultiplier
 *
 * Final score = Σ movePoints + timeBonus + clearBonus
 *
 * See also: internal/scoring-formula.md in the project store.
 */

export const COLOR_MULTIPLIER: Record<ColorCount, number> = {
  3: 1,
  4: 1.5,
  5: 2,
};

/** Points for clearing a cluster of size n. Size ≤ 2 yields 0. */
export function clusterScore(n: number, colorCount: ColorCount): number {
  if (n <= 2) return 0;
  const base = (n - 2) * (n - 2);
  return Math.round(base * COLOR_MULTIPLIER[colorCount]);
}

export function baselineSeconds(rows: number, cols: number): number {
  return rows * cols * 1.5;
}

export function timeBonus(
  rows: number,
  cols: number,
  elapsedSeconds: number,
  colorCount: ColorCount,
  boardCleared: boolean,
): number {
  if (!boardCleared) return 0;
  const remaining = baselineSeconds(rows, cols) - elapsedSeconds;
  const raw = Math.max(0, Math.floor(remaining * 10));
  return Math.round(raw * COLOR_MULTIPLIER[colorCount]);
}

export function clearBoardBonus(colorCount: ColorCount): number {
  return Math.round(1000 * COLOR_MULTIPLIER[colorCount]);
}
