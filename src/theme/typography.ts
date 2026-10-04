/**
 * Typography tokens.
 * Display / tile letters: Alfa Slab One (chunky slab closest to moodboard).
 * UI: Inter.
 */
export const fonts = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  /** Bundled slab — never system serif */
  display: 'AlfaSlabOne_400Regular',
  tileLetter: 'AlfaSlabOne_400Regular',
} as const;

/** Type scale — use these instead of raw fontSize in screens. */
export const typeScale = {
  display: {
    fontFamily: fonts.extrabold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.4,
    fontWeight: '800' as const,
  },
  title: {
    fontFamily: fonts.extrabold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.3,
    fontWeight: '800' as const,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.8,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
  },
  score: {
    fontFamily: fonts.extrabold,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.5,
    fontWeight: '800' as const,
    fontVariant: ['tabular-nums'] as ('tabular-nums')[],
  },
  scoreLarge: {
    fontFamily: fonts.extrabold,
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -1,
    fontWeight: '800' as const,
    fontVariant: ['tabular-nums'] as ('tabular-nums')[],
  },
} as const;

export const text = {
  body: { fontFamily: fonts.regular },
  semibold: { fontFamily: fonts.semibold },
  bold: { fontFamily: fonts.bold },
  extrabold: { fontFamily: fonts.extrabold },
  display: { fontFamily: fonts.display },
  tileLetter: { fontFamily: fonts.tileLetter },
} as const;
