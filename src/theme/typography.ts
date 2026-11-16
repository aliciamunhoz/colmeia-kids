import type { TextStyle } from 'react-native';

export const fonts = {
  displayBold: 'Fredoka_700Bold',
  displaySemiBold: 'Fredoka_600SemiBold',
  body: 'Nunito_400Regular',
  bodyBold: 'Nunito_700Bold',
  bodyExtraBold: 'Nunito_800ExtraBold',
} as const;

export const typography = {
  display: { fontFamily: fonts.displayBold, fontSize: 34, lineHeight: 40 },
  screenTitle: { fontFamily: fonts.displaySemiBold, fontSize: 22, lineHeight: 28 },
  highlight: { fontFamily: fonts.displaySemiBold, fontSize: 20, lineHeight: 26 },
  section: { fontFamily: fonts.displaySemiBold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21 },
  bodyStrong: { fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 21 },
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: fonts.bodyExtraBold,
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16 },
  tab: { fontFamily: fonts.bodyBold, fontSize: 11, lineHeight: 14 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
