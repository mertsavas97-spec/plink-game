/** Shared layout / component size tokens — 8pt grid. No magic numbers in screens. */
export const layout = {
  /** General screen horizontal padding */
  screenPad: 20,
  /** Board panel horizontal screen margin */
  boardScreenMargin: 16,
  /** Content inset used by logo (full width − 32) */
  contentInset: 16,
  sectionGap: 16,
  minTile: 24,
  comfortTile: 40,
  maxTile: 72,
  /** Letter as fraction of tile edge (~58%) */
  letterScale: 0.58,
  /** Slightly smaller letters on dense (12+ col) boards */
  letterScaleDense: 0.52,
  /** Gap as fraction of tile size (~6%) */
  tileGapRatio: 0.06,
  boardPad: 8,
  boardRadius: 16,
  chromeTop: 56,
  chromeBottom: 80,
  /** Tile corner radius as fraction of size */
  tileRadiusRatio: 0.22,
  /** Bottom bevel ~8% of tile, never below 2px */
  tileBevelRatio: 0.08,
  tileBevelMin: 2,
  tileHighlightOpacity: 0.28,
  /** Soft glossy highlight occupies upper ~40% */
  tileHighlightHeightRatio: 0.4,
  tileSelectedScale: 1.04,
  tileSelectedPulseMs: 900,
  tileShadowOpacity: 0.35,
  tileShadowRadius: 8,
  tileShadowOffsetY: 4,
  tileElevation: 6,
  /** Buttons — rounded rect */
  buttonHeight: 52,
  buttonRadius: 12,
  buttonPadH: 20,
  buttonIconGap: 12,
  buttonLabelSize: 16,
  listButtonHeight: 52,
  listButtonGap: 12,
  iconBtn: 44,
  taglineSize: 12,
  taglineTracking: 1.8,
  /** Logo: computed to fill width − 32; fallback tokens */
  logoTile: {
    sm: 34,
    md: 52,
    lg: 72,
  },
  logoGap: {
    sm: 6,
    md: 8,
    lg: 10,
  },
  logoGapLg: 10,
  highScoreGap: 16,
  modalRadius: 16,
  modalMaxWidth: 300,
  modalPad: 24,
  controlLabelSize: 11,
  /** Onboarding — illustration ~75% screen width */
  onboardingIllustrationWidthRatio: 0.75,
  onboardingDemoCols: 4,
  onboardingDemoRows: 4,
  onboardingHand: 36,
  onboardingTopPad: 28,
  labelTracking: 1.8,
  titleTracking: -0.3,
  /** Decorative ambient tiles */
  decorTileMin: 56,
  decorTileMax: 96,
  decorOpacityMin: 0.35,
  decorOpacityMax: 0.6,
  /** Soft radial glow center opacity */
  glowCenterOpacity: 0.14,
} as const;
