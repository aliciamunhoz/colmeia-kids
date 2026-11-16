import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Card, Chip, IconButton, Screen, TextField } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { getAttendanceForDaycare, getChild, getChildrenInDaycare, getRoom, getRoomsForDaycare, parseDisplayDate, TODAY, toDisplayDate, useData } from '@/data';
import { spacing } from '@/theme';
import { AdminHeader } from './AdminParts';

const shortName = (full: string) => {
  const [first, last] = full.replace(/\s*\(.*\)/, '').split(' ');
  return last ? `${first} ${last[0]}.` : first;
};

export function CheckInsScreen() {
  const { data } = useData();
  const { daycare } = useCurrentUser();
  const [dateText, setDateText] = useState(toDisplayDate(TODAY));
  const [roomId, setRoomId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const date = parseDisplayDate(dateText);
  const rooms = getRoomsForDaycare(data, daycare.id);
  const total = getChildrenInDaycare(data, daycare.id).length;
  const q = query.trim().toLowerCase();

  const records = date
    ? getAttendanceForDaycare(data, daycare.id, date)
        .filter((a) => !roomId || getChild(data, a.childId)?.roomId === roomId)
        .filter((a) => !q || getChild(data, a.childId)?.name.toLowerCase().includes(q))
        .sort((a, b) => (a.checkIn?.time ?? '').localeCompare(b.checkIn?.time ?? ''))
    : [];
  const activeFilters = [roomId, q].filter(Boolean).length;

  return (
    <Screen
      header={
        <AdminHeader
          title="Check-ins and check-outs"
          right={<IconButton icon="file" accessibilityLabel="Export" onPress={() => Alert.alert('Export', 'A CSV/PDF export would be generated in the full app.')} />}
        />
      }
    >
      <TextField label="Date" icon="calendar" value={dateText} onChangeText={setDateText} placeholder="DD/MM/YYYY" error={date ? undefined : 'Use DD/MM/YYYY.'} />
      <AppText variant="label" color="textSecondary">Room</AppText>
      <View style={styles.wrap}>
        <Chip label="All" tone="blue" selected={!roomId} onPress={() => setRoomId(null)} />
        {rooms.map((r) => <Chip key={r.id} label={r.name} tone={r.tone} selected={roomId === r.id} onPress={() => setRoomId(r.id)} />)}
      </View>
      <TextField label="Child" icon="search" value={query} onChangeText={setQuery} placeholder="Filter by child" />

      <View style={styles.between}>
        <AppText variant="small" color="textSecondary">{records.length} of {total} records</AppText>
        {activeFilters > 0 && <Chip small label={`Active filters: ${activeFilters}`} tone="blue" icon="filter" />}
      </View>

      {records.map((a) => {
        const child = getChild(data, a.childId);
        if (!child) return null;
        return (
          <Card key={a.id}>
            <View style={styles.row}>
              <Avatar name={child.avatar} size={44} />
              <View>
                <AppText variant="bodyStrong">{child.name}</AppText>
                <AppText variant="small" color="textSecondary">{getRoom(data, child.roomId)?.name}</AppText>
              </View>
            </View>
            <View style={styles.wrap}>
              {a.checkIn && <Chip small label={`In ${a.checkIn.time} · ${shortName(a.checkIn.byName)}`} tone="green" icon="login" />}
              {a.checkOut
                ? <Chip small label={`Out ${a.checkOut.time} · ${shortName(a.checkOut.byName)}`} tone="neutral" />
                : <Chip small label={date === TODAY ? 'Still at daycare' : 'No check-out'} tone="honey" />}
            </View>
          </Card>
        );
      })}
      {date && records.length === 0 && <AppText color="textSecondary">No check-ins for this day.</AppText>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
