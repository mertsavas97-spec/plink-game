import {
  BOARD_PRESETS,
  BOARD_PRESET_ORDER,
  type BoardPreset,
} from '../engine/types';
import { layout } from './layout';

export interface BoardLayoutInput {
  screenW: number;
  screenH: number;
  cols: number;
  rows: number;
  topChrome: number;
  bottomChrome: number;
  boardPad?: number;
  screenMargin?: number;
  gapPx?: number;
  minTile?: number;
  maxTile?: number;
}

export interface BoardLayoutResult {
  tileSize: number;
  gap: number;
  panelWidth: number;
  panelHeight: number;
  fitsHorizontally: boolean;
  meetsMinTile: boolean;
}

/**
 * tile = floor(min(
 *   (screenW - 2*margin - 2*pad - (cols-1)*gap) / cols,
 *   (availH - 2*pad - (rows-1)*gap) / rows
 * ))
 * margin 16, pad 8, gap 2px. MIN_TILE = 30.
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
    screenMargin = layout.boardScreenMargin,
    gapPx = layout.tileGapPx,
    minTile = layout.minTile,
    maxTile = layout.maxTile,
  } = input;

  if (cols <= 0 || rows <= 0) {
    return {
      tileSize: layout.comfortTile,
      gap: gapPx,
      panelWidth: boardPad * 2,
      panelHeight: boardPad * 2,
      fitsHorizontally: true,
      meetsMinTile: true,
    };
  }

  const availH = Math.max(0, screenH - topChrome - bottomChrome);
  const byW = Math.floor(
    (screenW - screenMargin * 2 - boardPad * 2 - (cols - 1) * gapPx) / cols,
  );
  const byH = Math.floor(
    (availH - boardPad * 2 - (rows - 1) * gapPx) / rows,
  );
  let tileSize = Math.max(1, Math.min(maxTile, Math.min(byW, byH)));
  const gap = gapPx;

  // Shrink further if panel would overflow (safety)
  const maxInnerW = screenW - screenMargin * 2 - boardPad * 2;
  while (cols * tileSize + (cols - 1) * gap > maxInnerW && tileSize > 1) {
    tileSize -= 1;
  }

  const panelWidth = cols * tileSize + (cols - 1) * gap + boardPad * 2;
  const panelHeight = rows * tileSize + (rows - 1) * gap + boardPad * 2;

  return {
    tileSize,
    gap,
    panelWidth,
    panelHeight,
    fitsHorizontally: panelWidth <= screenW - screenMargin * 2 + 0.5,
    meetsMinTile: tileSize >= minTile,
  };
}

/**
 * If requested preset can't reach MIN_TILE, fall back to next smaller.
 * Returns the playable preset + layout math.
 */
export function resolvePlayablePreset(
  requested: BoardPreset,
  screenW: number,
  screenH: number,
  topChrome: number,
  bottomChrome: number,
): { preset: BoardPreset; layout: BoardLayoutResult; fellBack: boolean } {
  const startIdx = BOARD_PRESET_ORDER.indexOf(requested);
  const order =
    startIdx >= 0
      ? BOARD_PRESET_ORDER.slice(0, startIdx + 1).reverse()
      : [...BOARD_PRESET_ORDER].reverse();

  let last = {
    preset: requested,
    layout: computeBoardLayout({
      screenW,
      screenH,
      cols: BOARD_PRESETS[requested].cols,
      rows: BOARD_PRESETS[requested].rows,
      topChrome,
      bottomChrome,
    }),
    fellBack: false,
  };

  for (const preset of order) {
    const size = BOARD_PRESETS[preset];
    const result = computeBoardLayout({
      screenW,
      screenH,
      cols: size.cols,
      rows: size.rows,
      topChrome,
      bottomChrome,
    });
    if (result.meetsMinTile) {
      return {
        preset,
        layout: result,
        fellBack: preset !== requested,
      };
    }
    last = { preset, layout: result, fellBack: preset !== requested };
  }
  return last;
}
