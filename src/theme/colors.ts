/** Moodboard palette + UI tokens for PLINK. All screens should import from here. */
export const colors = {
  bg: '#0A0E17',
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
    easy: '#2DB8C8', // blue/teal
    medium: '#2DF3E5', // cyan
    hard: '#F35A5A', // red
  },
  /** Tile base hues (P/L/I/N/K logo maps to A–E) */
  tile: {
    A: '#2D7CF3', // blue — P
    B: '#F32D5E', // red — L
    C: '#E91EC8', // pink — I
    D: '#F3C72D', // yellow — N
    E: '#2DF3E5', // cyan — K
  },
  /** Lighter top stops for vertical gradients */
  tileLight: {
    A: '#5BA0FF',
    B: '#FF5A82',
    C: '#FF4ADB',
    D: '#FFDB5A',
    E: '#6AFFF3',
  },
  /** Deeper bottom stops / bevel */
  tileDark: {
    A: '#1A4FA8',
    B: '#B01A3F',
    C: '#A0128A',
    D: '#B08A12',
    E: '#12998E',
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
