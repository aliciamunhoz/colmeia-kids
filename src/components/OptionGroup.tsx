import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

type Option<T extends string> = { value: T; label: string };

type OptionGroupProps<T extends string> = {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  selectedStyle?: 'honey' | 'navy' | 'green';
  fill?: boolean;
};

export function OptionGroup<T extends string>({ options, value, onChange, selectedStyle = 'honey', fill }: OptionGroupProps<T>) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={[styles.option, fill && styles.fill, selected && selectedStyles[selectedStyle]]}
          >
            <AppText variant="label" color={selected && selectedStyle !== 'honey' ? 'textOnPrimary' : 'text'}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  option: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  fill: { flexGrow: 1, flexBasis: 0, paddingHorizontal: spacing.xs },
});

const selectedStyles = StyleSheet.create({
  honey: { backgroundColor: colors.accentSoft, borderColor: colors.accent, borderWidth: 2 },
  navy: { backgroundColor: colors.primary, borderColor: colors.primary },
  green: { backgroundColor: colors.success, borderColor: colors.success },
});
