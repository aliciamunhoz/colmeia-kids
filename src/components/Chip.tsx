import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, spacing, tones, type Tone } from '@/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon/Icon';

type ChipProps = {
  label: string;
  tone?: Tone | 'neutral';
  icon?: IconName;
  onPress?: () => void;
  selected?: boolean; 
  small?: boolean;
};

export function Chip({ label, tone = 'blue', icon, onPress, selected, small }: ChipProps) {
  const t = tone === 'neutral' ? { background: colors.background, foreground: colors.textSecondary } : tones[tone];
  const background = selected ? colors.primary : t.background;
  const foreground = selected ? colors.textOnPrimary : t.foreground;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={onPress ? { selected: !!selected } : undefined}
      style={[styles.chip, small && styles.small, { backgroundColor: background }]}
    >
      {icon && <Icon name={icon} size={small ? 14 : 16} color={foreground} />}
      <AppText variant={small ? 'caption' : 'label'} style={[{ color: foreground }, small && styles.smallText]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  small: { paddingHorizontal: spacing.xs, paddingVertical: 3, gap: 4 },
  smallText: { fontFamily: 'Nunito_700Bold' },
});
