import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, radius, spacing, touchTarget, typography } from '@/theme';
import { Icon, type IconName } from './Icon/Icon';

const variants = {
  primary: { background: colors.primary, text: colors.textOnPrimary, border: colors.primary },
  accent: { background: colors.accent, text: colors.text, border: colors.accent },
  secondary: { background: colors.surface, text: colors.text, border: colors.border },
  danger: { background: colors.dangerSoft, text: colors.danger, border: colors.dangerSoft },
  dangerSolid: { background: colors.danger, text: colors.textOnPrimary, border: colors.danger },
} as const;

export type ButtonVariant = keyof typeof variants;

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const v = variants[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.background, borderColor: v.border },
        fullWidth && styles.fullWidth,
        (pressed || disabled) && { opacity: disabled ? 0.5 : 0.8 },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && <Icon name={icon} size={20} color={v.text} />}
        <Text style={[typography.bodyStrong, { color: v.text }]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
