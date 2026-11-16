import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export function Switch({ value, onValueChange, disabled = false }: SwitchProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      hitSlop={8}
      style={[styles.track, value ? styles.trackOn : styles.trackOff, disabled && styles.disabled]}
    >
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 46, height: 28, borderRadius: 14, justifyContent: 'center' },
  trackOn: { backgroundColor: colors.success },
  trackOff: { backgroundColor: colors.border },
  thumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.surface },
  thumbOn: { alignSelf: 'flex-end', marginRight: 3 },
  thumbOff: { alignSelf: 'flex-start', marginLeft: 3 },
  disabled: { opacity: 0.5 },
});
