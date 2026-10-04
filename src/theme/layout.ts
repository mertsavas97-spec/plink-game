/** Shared layout / component size tokens — 8pt grid. No magic numbers in screens. */
export const layout = {
  /** General screen horizontal padding (20–24) */
  screenPad: 20,
  /** Board panel must keep 16px horizontal screen margin */
  boardScreenMargin: 16,
  sectionGap: 16,
  minTile: 24,
  comfortTile: 40,
  maxTile: 72,
  /** Letter as fraction of tile edge */
  letterScale: 0.55,
  /** Gap as fraction of tile size (~6%) */
  tileGapRatio: 0.06,
  boardPad: 8,
  boardRadius: 16,
  chromeTop: 56,
  chromeBottom: 80,
  /** Tile corner radius as fraction of size */
  tileRadiusRatio: 0.22,
  /** Bottom bevel ~8% of tile */
  tileBevelRatio: 0.08,
  tileHighlightOpacity: 0.28,
  /** Soft glossy highlight occupies upper ~40% */
  tileHighlightHeightRatio: 0.4,
  tileSelectedScale: 1.04,
  tileSelectedPulseMs: 900,
  tileShadowOpacity: 0.35,
  tileShadowRadius: 8,
  tileShadowOffsetY: 4,
  tileElevation: 6,
  /** Buttons — rounded rect, not pills */
  buttonHeight: 52,
  buttonRadius: 12,
  buttonPadH: 20,
  buttonIconGap: 12,
  buttonLabelSize: 16,
  listButtonHeight: 52,
  iconBtn: 44,
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
  modalRadius: 16,
  modalMaxWidth: 300,
  modalPad: 24,
  controlLabelSize: 11,
  /** Onboarding fixed slots */
  onboardingDemoTile: 44,
  onboardingDemoCols: 4,
  onboardingDemoRows: 4,
  onboardingIllustrationH: 280,
  onboardingHand: 36,
  labelTracking: 1.8,
  titleTracking: -0.3,
} as const;
