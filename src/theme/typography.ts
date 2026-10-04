/** Inter family loaded in App.tsx via @expo-google-fonts/inter */
export const fonts = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

export const text = {
  body: { fontFamily: fonts.regular },
  semibold: { fontFamily: fonts.semibold },
  bold: { fontFamily: fonts.bold },
  extrabold: { fontFamily: fonts.extrabold },
} as const;
