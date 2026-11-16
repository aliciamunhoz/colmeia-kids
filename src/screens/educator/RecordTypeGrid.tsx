import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, IconTile, type IconName } from '@/components';
import { colors, radius, spacing, type Tone } from '@/theme';

export type RecordAction = 'meal' | 'sleep' | 'hygiene' | 'mood' | 'portfolio' | 'assessment' | 'incident' | 'message';

const items: { action: RecordAction; label: string; icon: IconName; tone: Tone }[] = [
  { action: 'meal', label: 'Meal', icon: 'utensils', tone: 'green' },
  { action: 'sleep', label: 'Sleep', icon: 'moon', tone: 'blue' },
  { action: 'hygiene', label: 'Hygiene', icon: 'droplet', tone: 'blue' },
  { action: 'mood', label: 'Mood', icon: 'palette', tone: 'honey' },
  { action: 'portfolio', label: 'Portfolio', icon: 'image', tone: 'red' },
  { action: 'assessment', label: 'Assessment', icon: 'sprout', tone: 'green' },
  { action: 'incident', label: 'Incident', icon: 'bell', tone: 'red' },
  { action: 'message', label: 'Message', icon: 'chat', tone: 'blue' },
];

export function RecordTypeGrid({ onSelect }: { onSelect: (action: RecordAction) => void }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <Pressable
          key={item.action}
          onPress={() => onSelect(item.action)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.item, pressed && { opacity: 0.8 }]}
        >
          <IconTile icon={item.icon} tone={item.tone} size={36} />
          <AppText variant="label">{item.label}</AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  item: {
    width: '23.5%',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
