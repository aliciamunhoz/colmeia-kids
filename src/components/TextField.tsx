import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon/Icon';

type TextFieldProps = TextInputProps & {
  label?: string;
  icon?: IconName;
  error?: string;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  rightIconLabel?: string;
};

export function TextField({
  label,
  icon,
  error,
  rightIcon,
  onRightIconPress,
  rightIconLabel,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={styles.container}>
      {label && (
        <AppText variant="label" color="textSecondary">
          {label}
        </AppText>
      )}

      <View style={[styles.inputBox, { borderColor }]}>
        {icon && <Icon name={icon} size={22} color={colors.textTertiary} />}
        <TextInput
          {...inputProps}
          style={[typography.body, styles.input, style]}
          placeholderTextColor={colors.textTertiary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} accessibilityRole="button" accessibilityLabel={rightIconLabel} hitSlop={10}>
            <Icon name={rightIcon} size={22} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      {error && (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs, alignSelf: 'stretch' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 54,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  input: { flex: 1, color: colors.text, paddingVertical: 0, outlineWidth: 0 },
});
