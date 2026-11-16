import { Pressable, ScrollView, StyleSheet } from 'react-native';

import type { Child } from '@/types/models';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Avatar } from './Avatar/Avatar';

type ChildSwitcherProps = {
  items: Child[];
  selectedId: string;
  onSelect: (childId: string) => void;
};

export function ChildSwitcher({ items, selectedId, onSelect }: ChildSwitcherProps) {
  if (items.length < 2) return null; 

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((child) => {
        const selected = child.id === selectedId;
        return (
          <Pressable
            key={child.id}
            onPress={() => onSelect(child.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Avatar name={child.avatar} size={28} />
            <AppText variant="label" color={selected ? 'textOnPrimary' : 'text'}>
              {child.name.split(' ')[0]}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: 4,
    paddingRight: spacing.md,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
});
