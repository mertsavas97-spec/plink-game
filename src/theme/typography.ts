import { Platform } from 'react-native';

/** Fonts loaded in App.tsx + platform serif for tile letters */
export const fonts = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  /** Chunky slab/serif for tile letters (Georgia-style). */
  tileLetter: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    web: 'Georgia, "Times New Roman", serif',
    default: 'serif',
  }) as string,
} as const;

export const text = {
  body: { fontFamily: fonts.regular },
  semibold: { fontFamily: fonts.semibold },
  bold: { fontFamily: fonts.bold },
  extrabold: { fontFamily: fonts.extrabold },
  tileLetter: { fontFamily: fonts.tileLetter },
} as const;
