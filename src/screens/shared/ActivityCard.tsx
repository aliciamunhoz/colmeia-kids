import { StyleSheet, View } from 'react-native';

import { AppText, Card, Chip, CoverImage } from '@/components';
import { formatRelativeDay } from '@/data';
import { spacing } from '@/theme';
import type { Activity } from '@/types/models';
import { activityCategoryLabel } from './presentation';

export function ActivityCard({ activity, onPress }: { activity: Activity; onPress?: () => void }) {
  return (
    <Card onPress={onPress}>
      <CoverImage cover={activity.photos[0]} badge={`${activity.photos.length} photos`} />
      <View style={styles.meta}>
        <Chip small label={activityCategoryLabel[activity.category]} tone="honey" icon="palette" />
        <AppText variant="label" color="textSecondary">{formatRelativeDay(activity.date)}, {activity.time}</AppText>
      </View>
      <AppText variant="section">{activity.title}</AppText>
      <AppText variant="small" color="textSecondary">{activity.description}</AppText>
      <View style={styles.tags}>
        {activity.objectives.slice(0, 2).map((o) => <Chip key={o} small label={o} tone="neutral" />)}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tags: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
});
