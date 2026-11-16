import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Card, Icon, IconButton, Screen, SegmentedControl, TextField } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { ageFrom, formatLongDate, getAttendance, getAttendanceStatus, getRoomAttendanceSummary, TODAY, useData } from '@/data';
import type { RoomScreenProps } from '@/navigation/types';
import { colors, radius, spacing, tones } from '@/theme';
import type { Child } from '@/types/models';
import { firstName } from '../parent/SelectedChildContext';
import { useEducatorRoom } from './useEducatorRoom';

type Filter = 'all' | 'present' | 'absent';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning,' : h < 19 ? 'Good afternoon,' : 'Good evening,';
};

export const allergiesText = (child: Child) =>
  child.allergies.length === 0 ? 'allergies: none' : `allerg${child.allergies.length > 1 ? 'ies' : 'y'}: ${child.allergies.join(', ')}`;

export function RoomScreen({ navigation }: RoomScreenProps<'Room'>) {
  const { data, actions } = useData();
  const { signOut } = useAuth();
  const { user, room, children } = useEducatorRoom();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  if (!room) {
    return <Screen><AppText>No room assigned to this educator yet.</AppText></Screen>;
  }

  const summary = getRoomAttendanceSummary(data, room.id);
  const educatorName = `Educator ${firstName(user.name)}`;

  const visible = children
    .filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
    .filter((c) => {
      const s = getAttendanceStatus(data, c.id);
      return filter === 'all' || (filter === 'present' ? s === 'present' : s !== 'present');
    });

  return (
    <Screen>
      <View style={styles.greeting}>
        <Avatar name={user.avatar} size={52} />
        <View style={styles.flex}>
          <AppText variant="small" color="textSecondary">{greeting()}</AppText>
          <AppText variant="screenTitle">{educatorName}</AppText>
        </View>
        <IconButton icon="logout" accessibilityLabel="Sign out" onPress={signOut} />
      </View>

      <View style={styles.roomCard}>
        <Icon name="users" size={36} color={colors.info} />
        <View>
          <AppText variant="highlight">{room.name} room</AppText>
          <AppText variant="small" color="textSecondary">{formatLongDate(TODAY)} · {children.length} children</AppText>
        </View>
      </View>

      <View style={styles.stats}>
        <Stat label="Present" value={summary.present} />
        <Stat label="Expected" value={summary.expected} />
        <Stat label="Left" value={summary.left} />
      </View>

      <TextField icon="search" placeholder="Child's name" value={query} onChangeText={setQuery} />
      <SegmentedControl
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'present', label: 'Present' },
          { value: 'absent', label: 'Absent' },
        ]}
      />

      <View>
        {visible.map((child) => {
          const status = getAttendanceStatus(data, child.id);
          const att = getAttendance(data, child.id);
          const age = ageFrom(child.birthDate);

          return (
            <View key={child.id} style={styles.row}>
              <Pressable
                onPress={() => navigation.navigate('ChildProfile', { childId: child.id })}
                accessibilityRole="button"
                accessibilityLabel={`${child.name}, ${status}`}
                style={styles.rowMain}
              >
                <Avatar name={child.avatar} size={44} />
                <View style={styles.flex}>
                  <AppText variant="bodyStrong">{child.name}</AppText>
                  <AppText variant="small" color="textSecondary">{age.years} years · {allergiesText(child)}</AppText>
                </View>
              </Pressable>
              {status === 'present' && (
                <View style={[styles.pill, { backgroundColor: tones.green.background }]}>
                  <Icon name="login" size={16} color={tones.green.foreground} />
                  <AppText variant="label" style={{ color: tones.green.foreground }}>In {att?.checkIn?.time}</AppText>
                </View>
              )}
              {status === 'left' && (
                <View style={styles.pill}>
                  <Icon name="logout" size={16} color={colors.textSecondary} />
                  <AppText variant="label" color="textSecondary">Out {att?.checkOut?.time}</AppText>
                </View>
              )}
              {status === 'expected' && (
                <Pressable
                  onPress={() => actions.checkIn(child.id, educatorName, 'manual')}
                  accessibilityRole="button"
                  accessibilityLabel={`Check in ${child.name}`}
                  style={[styles.pill, styles.checkInButton]}
                >
                  <Icon name="check" size={16} />
                  <AppText variant="label">Check in</AppText>
                </Pressable>
              )}
            </View>
          );
        })}
        {visible.length === 0 && <AppText color="textSecondary" style={styles.empty}>No children match.</AppText>}
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card style={styles.stat}>
      <AppText variant="caption" color="textSecondary">{label}</AppText>
      <AppText variant="screenTitle">{value}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xs },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.successSoft,
  },
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, gap: 2, padding: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.sm, height: 32, borderRadius: radius.pill },
  checkInButton: { backgroundColor: colors.accent, borderRadius: radius.sm },
  empty: { textAlign: 'center', paddingVertical: spacing.lg },
});
