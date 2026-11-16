const palette = {
  navy: '#18235A',
  honey: '#FFC21A',
  honeySoft: '#FFF3CC',
  honeyDark: '#8A5A00',
  blue: '#2459C4',
  blueSoft: '#E2EDFF',
  green: '#1B7A43',
  greenSoft: '#DCF4E4',
  red: '#C22F2F',
  redSoft: '#FFE2E2',
  purple: '#5B3BC4',
  purpleSoft: '#ECE5FF',
  gray600: '#4A5275',
  gray400: '#8A90A8',
  gray200: '#E4E7F0',
  gray50: '#F6F7FB',
  white: '#FFFFFF',
} as const;

export const colors = {
  primary: palette.navy,
  accent: palette.honey,
  accentSoft: palette.honeySoft,

  background: palette.gray50,
  surface: palette.white,
  border: palette.gray200,

  text: palette.navy,
  textSecondary: palette.gray600,
  textTertiary: palette.gray400,
  textOnPrimary: palette.white,

  info: palette.blue,
  infoSoft: palette.blueSoft,
  success: palette.green,
  successSoft: palette.greenSoft,
  danger: palette.red,
  dangerSoft: palette.redSoft,
  highlight: palette.purple,
  highlightSoft: palette.purpleSoft,
} as const;

export type ColorName = keyof typeof colors;

export const tones = {
  honey: { background: palette.honeySoft, foreground: palette.honeyDark },
  blue: { background: palette.blueSoft, foreground: palette.blue },
  green: { background: palette.greenSoft, foreground: palette.green },
  red: { background: palette.redSoft, foreground: palette.red },
  purple: { background: palette.purpleSoft, foreground: palette.purple },
} as const;

export type Tone = keyof typeof tones;
