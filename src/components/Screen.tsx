import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  header?: ReactNode; 
  overlay?: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  background?: string;
};

export function Screen({ children, header, overlay, scroll = true, contentStyle, background = colors.background }: ScreenProps) {
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: background }]} edges={['top']}>
      {header}
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled" 
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, contentStyle]}>{children}</View>
      )}
      {overlay}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl * 2, gap: spacing.md },
  fill: { flex: 1 },
});
