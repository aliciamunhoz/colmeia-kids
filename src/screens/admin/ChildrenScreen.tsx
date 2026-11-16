import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Chip, Icon, Screen, TextField } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { getChildrenInDaycare, getParentNames, getRoom, getRoomsForDaycare, useData } from '@/data';
import type { AdminDrawerScreenProps } from '@/navigation/types';
import { colors, spacing } from '@/theme';
import { AdminHeader, Fab, RoomPill } from './AdminParts';

export function ChildrenScreen({ navigation }: AdminDrawerScreenProps<'Children'>) {
  const { data } = useData();
  const { daycare } = useCurrentUser();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const rooms = getRoomsForDaycare(data, daycare.id);
  const all = getChildrenInDaycare(data, daycare.id);
  const q = query.trim().toLowerCase();
  const list = all
    .filter((c) => !roomId || c.roomId === roomId)
    .filter((c) => !q || [c.name, getRoom(data, c.roomId)?.name, getParentNames(data, c)].some((t) => t?.toLowerCase().includes(q)));

  return (
    <Screen
      header={<AdminHeader title="Children" subtitle={`${all.length} enrolled`} />}
      overlay={<Fab label="Enrol a child" onPress={() => navigation.navigate('ChildForm', {})} />}
    >
      <TextField icon="search" placeholder="Name, room or parent" value={query} onChangeText={setQuery} />
      <View style={styles.filters}>
        <Chip label="All rooms" tone="blue" selected={roomId === null} onPress={() => setRoomId(null)} />
        {rooms.map((r) => (
          <Chip key={r.id} label={r.name} tone={r.tone} selected={roomId === r.id} onPress={() => setRoomId(r.id)} />
        ))}
      </View>

      <View>
        {list.map((c) => (
          <Pressable key={c.id} onPress={() => navigation.navigate('ChildForm', { childId: c.id })} accessibilityRole="button" accessibilityLabel={c.name} style={styles.row}>
            <Avatar name={c.avatar} size={44} />
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{c.name}</AppText>
              <AppText variant="small" color="textSecondary" numberOfLines={1}>Parents: {getParentNames(data, c)}</AppText>
            </View>
            <RoomPill room={getRoom(data, c.roomId)} />
            <Icon name="chevron" size={18} />
          </Pressable>
        ))}
        {list.length === 0 && <AppText color="textSecondary" style={styles.empty}>No children found.</AppText>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  empty: { textAlign: 'center', paddingVertical: spacing.lg },
});
