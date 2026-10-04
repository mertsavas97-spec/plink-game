/** Shared layout / component size tokens — no magic numbers in screens. */
export const layout = {
  screenPad: 22,
  sectionGap: 14,
  minTile: 30,
  comfortTile: 40,
  maxTile: 68,
  /** Letter as fraction of tile edge (~55% per polish spec). */
  letterScale: 0.55,
  /** Gap as fraction of tile size (3–4%). */
  tileGapRatio: 0.035,
  boardPad: 8,
  boardRadius: 16,
  chromeTop: 52,
  chromeBottom: 80,
  /** Tile corner radius as fraction of size */
  tileRadiusRatio: 0.22,
  /** Bottom bevel height in px range (clamped in Tile) */
  tileBevelMin: 4,
  tileBevelMax: 6,
  tileHighlightOpacity: 0.25,
  tileHighlightHeightRatio: 0.35,
  tileSelectedScale: 1.04,
  tileShadowOpacity: 0.35,
  tileShadowRadius: 6,
  tileShadowOffsetY: 3,
  tileElevation: 5,
  /** Buttons — rounded rect, not pills */
  buttonHeight: 50,
  buttonRadius: 12,
  buttonPadH: 18,
  buttonIconGap: 12,
  buttonLabelSize: 16,
  listButtonHeight: 52,
  taglineSize: 12,
  taglineTracking: 1.8,
  logoTile: {
    sm: 34,
    md: 52,
    lg: 68,
  },
  logoGap: {
    sm: 6,
    md: 8,
    lg: 10,
  },
} as const;
