import { layout } from './layout';

export interface BoardLayoutInput {
  screenW: number;
  screenH: number;
  cols: number;
  rows: number;
  /** Top chrome (safe area + score bar) */
  topChrome: number;
  /** Bottom chrome (safe area + controls) */
  bottomChrome: number;
  boardPad?: number;
  gapRatio?: number;
  screenMargin?: number;
  minTile?: number;
  maxTile?: number;
}

export interface BoardLayoutResult {
  tileSize: number;
  gap: number;
  panelWidth: number;
  panelHeight: number;
  /** True when panel fits within screenW - 2*margin */
  fitsHorizontally: boolean;
}

/**
 * Moodboard board sizing:
 * tile = floor(min(
 *   (screenW - 32 - panelPad*2) / (cols * (1 + gapRatio)),
 *   availableH / (rows * (1 + gapRatio))
 * ))
 *
 * Horizontal panel margin is always 16px each side.
 */
export function computeBoardLayout(input: BoardLayoutInput): BoardLayoutResult {
  const {
    screenW,
    screenH,
    cols,
    rows,
    topChrome,
    bottomChrome,
    boardPad = layout.boardPad,
    gapRatio = layout.tileGapRatio,
    screenMargin = layout.boardScreenMargin,
    minTile = layout.minTile,
    maxTile = layout.maxTile,
  } = input;

  if (cols <= 0 || rows <= 0) {
    const tileSize = layout.comfortTile;
    const gap = Math.round(tileSize * gapRatio);
    return {
      tileSize,
      gap,
      panelWidth: boardPad * 2,
      panelHeight: boardPad * 2,
      fitsHorizontally: true,
    };
  }

  const availW = Math.max(0, screenW - screenMargin * 2 - boardPad * 2);
  const availH = Math.max(
    0,
    screenH - topChrome - bottomChrome - boardPad * 2,
  );

  const pitchFactor = 1 + gapRatio;
  const byW = Math.floor(availW / (cols * pitchFactor));
  const byH = Math.floor(availH / (rows * pitchFactor));
  // Prefer comfort min, but always shrink further if needed to keep 16px margins
  let tileSize = Math.min(maxTile, Math.min(byW, byH));
  if (tileSize >= minTile) {
    // ok
  } else {
    tileSize = Math.max(16, tileSize);
  }
  let gap = Math.max(1, Math.round(tileSize * gapRatio));

  // Ensure final panel width never exceeds screen - margins
  const maxPanelInner = screenW - screenMargin * 2 - boardPad * 2;
  while (cols * (tileSize + gap) > maxPanelInner && tileSize > 16) {
    tileSize -= 1;
    gap = Math.max(1, Math.round(tileSize * gapRatio));
  }

  const panelWidth = cols * (tileSize + gap) + boardPad * 2;
  const panelHeight = rows * (tileSize + gap) + boardPad * 2;
  const fitsHorizontally = panelWidth <= screenW - screenMargin * 2 + 0.5;

  return { tileSize, gap, panelWidth, panelHeight, fitsHorizontally };
}
