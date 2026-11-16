import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';

type SectionHeaderProps = { title: string; actionLabel?: string; onAction?: () => void };

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <AppText variant="section" accessibilityRole="header">{title}</AppText>
      {actionLabel && (
        <Pressable onPress={onAction} accessibilityRole="link" hitSlop={10}>
          <AppText variant="label" color="info">{actionLabel}</AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
