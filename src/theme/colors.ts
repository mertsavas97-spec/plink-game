/** Moodboard palette + UI tokens for PLINK. All screens should import from here. */
export const colors = {
  /** Flat fallback; prefer ScreenBackground gradient */
  bg: '#0A0E18',
  bgGradient: ['#0A0F1C', '#0B1220', '#0A0E18'] as const,
  /** Solid hues for SVG RadialGradient stops (opacity applied in stops) */
  glowBlueHex: '#2D78F0',
  glowMagentaHex: '#E218C0',
  glowCyanHex: '#5BC4E8',
  glowBlue: 'rgba(45, 120, 240, 0.14)',
  glowMagenta: 'rgba(226, 24, 192, 0.12)',
  glowCyan: 'rgba(91, 196, 232, 0.12)',
  /** Board panel / secondary button fill */
  surface: '#111B2E',
  surfaceElevated: '#182338',
  border: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.16)',
  text: '#FFFFFF',
  textMuted: '#8B93A7',
  textDark: '#141820',
  /** Primary CTA beige */
  cream: '#E9E2D6',
  creamPressed: '#DDD5C6',
  accent: '#7DFFB3',
  gold: '#E8C547',
  danger: '#F35A5A',
  selection: '#FFFFFF',
  overlay: 'rgba(6, 10, 18, 0.82)',
  difficulty: {
    easy: '#2DB8C8',
    medium: '#5BC4E8',
    hard: '#E83356',
  },
  /**
   * Tile hues eyedropped toward moodboard:
   * royal blue / scarlet / magenta / amber / sky-cyan (not neon mint).
   */
  tile: {
    A: '#2F78F0',
    B: '#E83356',
    C: '#E218C0',
    D: '#F0C12E',
    E: '#5BC4E8',
  },
  tileLight: {
    A: '#5A9BFF',
    B: '#FF5F7E',
    C: '#FF4AD8',
    D: '#FFE066',
    E: '#8DD9F2',
  },
  tileDark: {
    A: '#1A4DB5',
    B: '#A81F3A',
    C: '#9A0F82',
    D: '#B08912',
    E: '#2E8AAD',
  },
} as const;

export type TileColorId = keyof typeof colors.tile;

export const TILE_LETTERS: TileColorId[] = ['A', 'B', 'C', 'D', 'E'];

export const TILE_COLOR_VALUES: Record<TileColorId, string> = {
  A: colors.tile.A,
  B: colors.tile.B,
  C: colors.tile.C,
  D: colors.tile.D,
  E: colors.tile.E,
};

export const LOGO_LETTERS = ['P', 'L', 'I', 'N', 'K'] as const;

/** Logo letter → tile color id */
export const LOGO_COLOR_IDS: TileColorId[] = ['A', 'B', 'C', 'D', 'E'];
