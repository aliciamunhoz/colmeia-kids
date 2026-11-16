import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { spacing } from '@/theme';
import { AppText } from './AppText';
import { IconButton } from './IconButton';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode; 
  back?: boolean; 
  left?: ReactNode;
};

export function ScreenHeader({ title, subtitle, right, back, left }: ScreenHeaderProps) {
  const navigation = useNavigation();
  const showBack = back ?? navigation.canGoBack();

  return (
    <View style={styles.header}>
      {left ?? (showBack && <IconButton icon="back" accessibilityLabel="Back" onPress={() => navigation.goBack()} />)}
      <View style={styles.titles}>
        <AppText variant="screenTitle" accessibilityRole="header" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="small" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </AppText>
        )}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  titles: { flex: 1 },
});
