/** Shared layout tokens for premium spacing + responsive board. */
export const layout = {
  screenPad: 22,
  sectionGap: 22,
  /** Minimum touch-friendly tile edge (px). */
  minTile: 30,
  /** Prefer tiles at least this large when possible. */
  comfortTile: 40,
  /** Letter as fraction of tile size — sized for visual fill (Inter caps read smaller than fontSize). */
  letterScale: 0.86,
  /** Gap between tiles — dense but not overlapping. */
  tileGap: 1.5,
  boardPad: 6,
  chromeTop: 52,
  chromeBottom: 80,
} as const;
