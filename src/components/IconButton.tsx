import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, touchTarget } from '@/theme';
import { Icon, type IconName } from './Icon/Icon';

type IconButtonProps = {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string; 
  badge?: boolean;
  variant?: 'outline' | 'accent';
};

export function IconButton({ icon, onPress, accessibilityLabel, badge, variant = 'outline' }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.button, variant === 'accent' && styles.accent, pressed && { opacity: 0.7 }]}
    >
      <Icon name={icon} size={22} />
      {badge && <View style={styles.badge} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accent: { backgroundColor: colors.accent, borderColor: colors.accent, borderRadius: radius.pill },
  badge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});
