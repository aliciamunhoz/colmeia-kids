import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Card, ChildSwitcher, Icon, IconButton, IconTile, Screen, SectionHeader, type IconName } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import {
  formatDuration,
  formatLongDate,
  getAttendance,
  getAttendanceStatus,
  getDailySummary,
  getUnreadNotificationsCount,
  getUser,
  TODAY,
  useData,
} from '@/data';
import type { HomeScreenProps } from '@/navigation/types';
import { colors, radius, spacing, type Tone } from '@/theme';
import { moodLabel } from '../shared/presentation';
import { firstName, useSelectedChild } from './SelectedChildContext';

type NoParamsRoute = 'Notifications' | 'Activities' | 'Development' | 'Portfolio' | 'Payments' | 'Location';

const quickAccess: { label: string; icon: IconName; tone: Tone; to: NoParamsRoute }[] = [
  { label: 'Activities', icon: 'palette', tone: 'honey', to: 'Activities' },
  { label: 'Progress', icon: 'sprout', tone: 'green', to: 'Development' },
  { label: 'Portfolio', icon: 'image', tone: 'red', to: 'Portfolio' },
  { label: 'Payments', icon: 'card', tone: 'green', to: 'Payments' },
  { label: 'Location', icon: 'pin', tone: 'red', to: 'Location' },
  { label: 'Notices', icon: 'bell', tone: 'blue', to: 'Notifications' },
];

export function HomeScreen({ navigation }: HomeScreenProps<'Home'>) {
  const { data } = useData();
  const { user } = useCurrentUser();
  const { childrenList, child, room, selectChild } = useSelectedChild();

  const status = getAttendanceStatus(data, child.id);
  const attendance = getAttendance(data, child.id);
  const summary = getDailySummary(data, child.id);
  const unread = getUnreadNotificationsCount(data, user.id);
  const educator = room ? getUser(data, room.educatorIds[0]) : undefined;
  const name = firstName(child.name);

  const statusTitle = {
    present: `${name} is at daycare`,
    left: `${name} has gone home`,
    expected: `${name} hasn't arrived yet`,
  }[status];

  const byWho = (text?: string) => (text ? firstName(text) : '');

  return (
    <Screen>
      <View style={styles.greeting}>
        <Avatar name={user.avatar} size={52} />
        <View style={styles.flex}>
          <AppText variant="small" color="textSecondary">Hi,</AppText>
          <AppText variant="screenTitle">{user.name}</AppText>
        </View>
        <IconButton
          icon="bell"
          badge={unread > 0}
          accessibilityLabel={`Notifications, ${unread} unread`}
          onPress={() => navigation.navigate('Notifications')}
        />
      </View>

      <ChildSwitcher items={childrenList} selectedId={child.id} onSelect={selectChild} />

      <View style={styles.status}>
        <View style={styles.sun} pointerEvents="none">
          <Icon name="sun" size={84} color="rgba(255,255,255,0.6)" />
        </View>
        <AppText variant="overline" style={styles.statusDate}>
          Today · {formatLongDate(TODAY)}
        </AppText>
        <AppText variant="highlight">{statusTitle}</AppText>
        <View style={styles.statusPills}>
          <View style={[styles.pill, styles.pillWhite]}>
            <Icon name="login" size={16} />
            <AppText variant="label">
              {attendance?.checkIn ? `Check-in ${attendance.checkIn.time} · ${byWho(attendance.checkIn.byName)}` : 'Check-in —'}
            </AppText>
          </View>
          <View style={[styles.pill, styles.pillSoft]}>
            <Icon name="logout" size={16} />
            <AppText variant="label">
              {attendance?.checkOut ? `Check-out ${attendance.checkOut.time}` : 'Check-out —'}
            </AppText>
          </View>
        </View>
        <AppText variant="label">
          {room?.name} room{educator ? ` · Educator ${firstName(educator.name)}` : ''}
        </AppText>
      </View>

      <SectionHeader
        title="Today's summary"
        actionLabel="View diary"
        onAction={() => navigation.navigate('DiaryTab', { screen: 'Diary' })}
      />
      <View style={styles.grid2}>
        <SummaryCard icon="utensils" tone="green" label="Meals" value={`${summary.meals.count} of ${summary.meals.planned}`}
          detail={summary.meals.lunch ? `Lunch: ${summary.meals.lunch.amount === 'all' ? 'ate everything' : 'ate some'}` : 'No lunch yet'} />
        <SummaryCard icon="moon" tone="blue" label="Nap" value={summary.sleep.minutes ? formatDuration(summary.sleep.minutes) : '—'}
          detail={summary.sleep.last ? `${summary.sleep.last.start} – ${summary.sleep.last.end}` : 'No nap yet'} />
        <SummaryCard icon="droplet" tone="blue" label="Hygiene" value={`${summary.hygiene.count} records`}
          detail={summary.hygiene.lastTime ? `Last at ${summary.hygiene.lastTime}` : '—'} />
        <SummaryCard icon="palette" tone="honey" label="General mood" value={summary.mood ? moodLabel[summary.mood.mood] : '—'}
          detail={summary.mood?.note ?? 'Not recorded yet'} />
      </View>

      <SectionHeader title="Quick access" />
      <View style={styles.grid3}>
        {quickAccess.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => navigation.navigate({ name: item.to, params: undefined })}
            accessibilityRole="button"
            style={({ pressed }) => [styles.quick, pressed && { opacity: 0.8 }]}
          >
            <IconTile icon={item.icon} tone={item.tone} size={40} />
            <AppText variant="label">{item.label}</AppText>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

type SummaryCardProps = { icon: IconName; tone: Tone; label: string; value: string; detail: string };

function SummaryCard({ icon, tone, label, value, detail }: SummaryCardProps) {
  return (
    <Card style={styles.summary}>
      <View style={styles.summaryTop}>
        <IconTile icon={icon} tone={tone} size={36} />
        <View style={styles.flex}>
          <AppText variant="caption" color="textSecondary">{label}</AppText>
          <AppText variant="highlight" numberOfLines={1}>{value}</AppText>
        </View>
      </View>
      <AppText variant="caption" color="textSecondary" numberOfLines={1}>{detail}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xs },
  status: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
    overflow: 'hidden',
  },
  sun: { position: 'absolute', top: -10, right: -6 },
  statusDate: { color: colors.text },
  statusPills: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.sm, height: 32, borderRadius: radius.pill },
  pillWhite: { backgroundColor: colors.surface },
  pillSoft: { backgroundColor: colors.accentSoft },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  summary: { flexBasis: '47%', flexGrow: 1, gap: spacing.xs, padding: spacing.sm },
  summaryTop: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center' },
  grid3: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quick: {
    flexBasis: '30%',
    flexGrow: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
