import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { colors, fonts } from '@/theme';

export const stackHeaderOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTintColor: colors.text,
  headerTitleStyle: { fontFamily: fonts.displaySemiBold, fontSize: 18, color: colors.text },
  headerBackButtonDisplayMode: 'minimal',
  contentStyle: { backgroundColor: colors.background },
};
