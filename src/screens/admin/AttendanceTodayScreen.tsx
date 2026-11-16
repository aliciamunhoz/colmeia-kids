import { Alert, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Card, Chip, IconButton, LinkText, ProgressBar, Screen, ScreenHeader, SectionHeader } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import {
  formatLongDate, getAttendance, getAttendanceStatus, getChildrenInDaycare, getDaycareStats, getRoom, nowDateTime, TODAY, useData,
} from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { radius, spacing, tones, type Tone } from '@/theme';
import { roomBarColor } from './AdminParts';
import type { Child } from '@/types/models';

export function AttendanceTodayScreen({ navigation }: AdminStackScreenProps<'AttendanceToday'>) {
  const { data, actions } = useData();
  const { daycare } = useCurrentUser();
  const stats = getDaycareStats(data, daycare.id);
  const children = getChildrenInDaycare(data, daycare.id);
  const left = children.filter((c) => getAttendanceStatus(data, c.id) === 'left').length;
  const notArrived = children.filter((c) => getAttendanceStatus(data, c.id) === 'expected');

  const notify = (child: Child) => {
    const att = getAttendance(data, child.id);
    actions.notify(child.guardianIds, 'notice', 'Check-in missing', `${child.name.split(' ')[0]} hasn't arrived at the daycare yet today.`);
    actions.saveAttendance({ ...(att ?? { childId: child.id, date: TODAY }), parentsNotifiedAt: nowDateTime() });
  };
  const pending = notArrived.filter((c) => {
    const att = getAttendance(data, c.id);
    return !att?.absence && !att?.parentsNotifiedAt;
  });

  return (
    <Screen
      header={
        <ScreenHeader
          title="Attendance"
          subtitle={`Today · ${formatLongDate(TODAY)}`}
          right={<IconButton icon="calendar" accessibilityLabel="Check-ins by date" onPress={() => navigation.navigate('AdminDrawer', { screen: 'CheckIns' })} />}
        />
      }
    >
      <View style={styles.stats}>
        <Stat tone="green" label="Present" value={stats.present} />
        <Stat tone="red" label="Absent" value={stats.absent - left} />
        <Stat tone="blue" label="Left" value={left} />
      </View>

      <SectionHeader
        title="By room"
        actionLabel="Export"
        onAction={() => Alert.alert('Export', 'A CSV/PDF export would be generated in the full app.')}
      />
      <Card>
        {stats.attendanceByRoom.map(({ room, present, total }) => (
          <View key={room.id} style={styles.roomRow}>
            <View style={styles.between}>
              <AppText variant="bodyStrong">{room.name}</AppText>
              <AppText variant="caption" color="textSecondary">{present}/{total} · {total - present} absent</AppText>
            </View>
            <ProgressBar progress={total ? present / total : 0} color={roomBarColor(room)} />
          </View>
        ))}
      </Card>

      <SectionHeader
        title="Not checked in"
        actionLabel={pending.length ? 'Notify all' : undefined}
        onAction={() => pending.forEach(notify)}
      />
      {notArrived.map((child) => {
        const att = getAttendance(data, child.id);
        return (
          <View key={child.id} style={styles.row}>
            <Avatar name={child.avatar} size={44} />
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{child.name}</AppText>
              <AppText variant="small" color="textSecondary">
                {getRoom(data, child.roomId)?.name} · {att?.absence ? `${att.absence.reason} (notified)` : 'No notice from parents'}
              </AppText>
            </View>
            {att?.absence ? (
              <Chip small label="Justified" tone="green" icon="check" />
            ) : att?.parentsNotifiedAt ? (
              <Chip small label="Notified" tone="neutral" />
            ) : (
              <Chip small label="Notify" tone="honey" icon="bell" onPress={() => notify(child)} />
            )}
          </View>
        );
      })}
      {notArrived.length === 0 && <AppText color="textSecondary">Everyone has arrived 🎉</AppText>}
      <LinkText label="See all check-ins and check-outs" onPress={() => navigation.navigate('AdminDrawer', { screen: 'CheckIns' })} center />
    </Screen>
  );
}

function Stat({ tone, label, value }: { tone: Tone; label: string; value: number }) {
  return (
    <View style={[styles.stat, { backgroundColor: tones[tone].background }]}>
      <AppText variant="label" style={{ color: tones[tone].foreground }}>{label}</AppText>
      <AppText variant="screenTitle">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, padding: spacing.sm, borderRadius: radius.md },
  roomRow: { gap: 6 },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
});
