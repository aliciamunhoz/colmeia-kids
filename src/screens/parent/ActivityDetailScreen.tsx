import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Chip, CoverImage, IconButton, Screen, ScreenHeader } from '@/components';
import { formatRelativeDay, getActivity, getChild, getRoom, getUser, useData } from '@/data';
import type { HomeScreenProps } from '@/navigation/types';
import { colors, radius, spacing, tones } from '@/theme';
import { activityCategoryLabel } from '../shared/presentation';
import { firstName } from './SelectedChildContext';

export function ActivityDetailScreen({ route }: HomeScreenProps<'ActivityDetail'>) {
  const { data } = useData();
  const activity = getActivity(data, route.params.activityId);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!activity) {
    return <Screen header={<ScreenHeader title="Activity" />}><AppText>Activity not found.</AppText></Screen>;
  }

  const educator = getUser(data, activity.educatorId);
  const participants = activity.childIds.map((id) => getChild(data, id)).filter((c) => c !== undefined);

  return (
    <Screen
      header={
        <ScreenHeader
          title={activity.title}
          subtitle={`${formatRelativeDay(activity.date)}, ${activity.time} · ${getRoom(data, activity.roomId)?.name} room`}
          right={
            <IconButton
              icon="download"
              accessibilityLabel="Download photos"
              onPress={() => Alert.alert('Download', 'Photos would be saved to the gallery in the full app.')}
            />
          }
        />
      }
    >
      <CoverImage
        cover={activity.photos[photoIndex]}
        height={180}
        iconSize={72}
        rounded={radius.lg}
        badge={`${photoIndex + 1} / ${activity.photos.length}`}
      />

      <View style={styles.thumbs}>
        {activity.photos.map((photo, i) => (
          <Pressable
            key={i}
            onPress={() => setPhotoIndex(i)}
            accessibilityRole="button"
            accessibilityLabel={`Photo ${i + 1}`}
            accessibilityState={{ selected: i === photoIndex }}
            style={[styles.thumb, i === photoIndex && styles.thumbSelected]}
          >
            <CoverImage cover={photo} height={60} iconSize={24} rounded={radius.sm} />
          </Pressable>
        ))}
      </View>

      <View style={styles.row}>
        <Chip label={activityCategoryLabel[activity.category]} tone="honey" icon="palette" />
        {educator && <AppText variant="label" color="textSecondary">Educator {firstName(educator.name)}</AppText>}
      </View>

      <View style={styles.section}>
        <AppText variant="label">Description</AppText>
        <AppText>{activity.description}</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="label">Objectives</AppText>
        <View style={styles.wrap}>
          {activity.objectives.map((o) => <Chip key={o} small label={o} tone="green" icon="check" />)}
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="label">Participating children ({participants.length})</AppText>
        <View style={styles.wrap}>
          {participants.map((c) => (
            <View key={c.id} accessibilityLabel={c.name}>
              <Avatar name={c.avatar} size={44} />
            </View>
          ))}
        </View>
      </View>

      {activity.educatorNote && (
        <View style={styles.note}>
          {educator && <Avatar name={educator.avatar} size={36} />}
          <View style={styles.flex}>
            <AppText variant="label" style={{ color: tones.honey.foreground }}>Educator's note</AppText>
            <AppText>{activity.educatorNote}</AppText>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  thumbs: { flexDirection: 'row', gap: spacing.xs },
  thumb: { flex: 1, borderRadius: radius.sm + 2, borderWidth: 2, borderColor: 'transparent' },
  thumbSelected: { borderColor: colors.primary },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { gap: spacing.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  note: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.accentSoft },
});
