/** Moodboard palette for PLINK. */
export const colors = {
  bg: '#0A0E17',
  surface: '#1C222D',
  surfaceElevated: '#252C38',
  border: '#2E3644',
  text: '#FFFFFF',
  textMuted: '#9AA3B2',
  textDark: '#0A0E17',
  cream: '#F2E8D5',
  mint: '#7DFFB3',
  gold: '#E8C547',
  danger: '#F35A5A',
  selection: '#FFFFFF',
  overlay: 'rgba(6, 10, 18, 0.78)',
  /** Difficulty accent colors (moodboard Easy/Medium/Hard). */
  difficulty: {
    easy: '#3DDC97',
    medium: '#2DF3E5',
    hard: '#F35A5A',
  },
  tile: {
    A: '#2D7CF3',
    B: '#F32D5E',
    C: '#F32DC7',
    D: '#F3C72D',
    E: '#2DF3E5',
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
