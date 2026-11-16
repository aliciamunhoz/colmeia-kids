import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type ProgressBarProps = { progress: number; color?: string; height?: number };

export function ProgressBar({ progress, color = colors.success, height = 8 }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View
      style={[styles.track, { height, borderRadius: height / 2 }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}
    >
      <View style={{ width: `${pct}%`, height, borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.background, overflow: 'hidden' },
});
