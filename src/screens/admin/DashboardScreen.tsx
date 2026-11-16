import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, IconTile, ProgressBar, Screen, SectionHeader, type IconName } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { formatCurrency, getDaycareStats, useData } from '@/data';
import type { AdminDrawerParamList, AdminDrawerScreenProps } from '@/navigation/types';
import { colors, radius, spacing, tones, type Tone } from '@/theme';
import { AdminHeader, roomBarColor } from './AdminParts';

const management: { label: string; icon: IconName; tone: Tone; to: keyof AdminDrawerParamList }[] = [
  { label: 'Users', icon: 'user', tone: 'blue', to: 'Users' },
  { label: 'Children', icon: 'users', tone: 'blue', to: 'Children' },
  { label: 'Rooms', icon: 'home', tone: 'honey', to: 'Rooms' },
  { label: 'Attendance', icon: 'qr', tone: 'purple', to: 'CheckIns' },
  { label: 'Monthly fees', icon: 'card', tone: 'green', to: 'MonthlyFees' },
  { label: 'Invoices', icon: 'file', tone: 'honey', to: 'Invoices' },
];

export function DashboardScreen({ navigation }: AdminDrawerScreenProps<'Dashboard'>) {
  const { data } = useData();
  const { daycare } = useCurrentUser();
  const stats = getDaycareStats(data, daycare.id);

  return (
    <Screen header={<AdminHeader title="Dashboard" subtitle={`${daycare.name} · ${daycare.city}`} right={<View />} />}>
      <View style={styles.grid}>
        <StatCard tone="honey" label="Children" value={String(stats.children)} detail={`${stats.rooms} rooms`} onPress={() => navigation.navigate('Children')} />
        <StatCard tone="green" label="Present today" value={String(stats.present)} detail={`${stats.absent} absent`} onPress={() => navigation.navigate('AttendanceToday')} />
        <StatCard tone="red" label="Outstanding" value={formatCurrency(stats.outstanding.total).replace('.00', '')} detail={`${stats.outstanding.count} invoices`} onPress={() => navigation.navigate('Invoices')} />
        <StatCard tone="blue" label="Educators" value={String(stats.educators)} onPress={() => navigation.navigate('Users')} />
      </View>

      <SectionHeader title="Management" />
      <View style={styles.grid}>
        {management.map((m) => (
          <Pressable key={m.label} onPress={() => navigation.navigate(m.to)} accessibilityRole="button" style={styles.tile}>
            <IconTile icon={m.icon} tone={m.tone} size={40} />
            <AppText variant="label">{m.label}</AppText>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Attendance by room" />
      <Card>
        {stats.attendanceByRoom.map(({ room, present, total }) => (
          <View key={room.id} style={styles.roomRow}>
            <View style={styles.between}>
              <AppText variant="bodyStrong">{room.name}</AppText>
              <AppText variant="label" color="textSecondary">{present}/{total}</AppText>
            </View>
            <ProgressBar progress={total ? present / total : 0} color={roomBarColor(room)} />
          </View>
        ))}
      </Card>

      <Button title="Send announcement" icon="megaphone" variant="accent" fullWidth onPress={() => navigation.navigate('AnnouncementForm')} />
    </Screen>
  );
}

function StatCard({ tone, label, value, detail, onPress }: { tone: Tone; label: string; value: string; detail?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={[styles.stat, { backgroundColor: tones[tone].background }]}>
      <AppText variant="label" style={{ color: tones[tone].foreground }}>{label}</AppText>
      <AppText variant="display">{value}</AppText>
      {detail && <AppText variant="small" color="textSecondary">{detail}</AppText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stat: { flexBasis: '47%', flexGrow: 1, padding: spacing.md, borderRadius: radius.lg, gap: 2, minHeight: 120 },
  tile: {
    flexBasis: '30%', flexGrow: 1, alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
  },
  roomRow: { gap: 6 },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
});
