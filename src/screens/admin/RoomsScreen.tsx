import { StyleSheet, View } from 'react-native';

import { AppText, Avatar, Card, IconButton, IconTile, Screen } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { getChildrenInDaycare, getChildrenInRoom, getRoomsForDaycare, getUser, useData } from '@/data';
import type { AdminDrawerScreenProps } from '@/navigation/types';
import { spacing } from '@/theme';
import { AdminHeader, Fab } from './AdminParts';

export function RoomsScreen({ navigation }: AdminDrawerScreenProps<'Rooms'>) {
  const { data } = useData();
  const { daycare } = useCurrentUser();
  const rooms = getRoomsForDaycare(data, daycare.id);

  return (
    <Screen
      header={<AdminHeader title="Rooms" subtitle={`${rooms.length} rooms · ${getChildrenInDaycare(data, daycare.id).length} children`} />}
      overlay={<Fab label="New room" onPress={() => navigation.navigate('RoomForm', {})} />}
    >
      {rooms.map((room) => {
        const educators = room.educatorIds.map((id) => getUser(data, id)).filter((u) => u !== undefined);
        return (
          <Card key={room.id}>
            <View style={styles.row}>
              <IconTile icon="home" tone={room.tone} size={48} />
              <View style={styles.flex}>
                <AppText variant="section">{room.name}</AppText>
                <AppText variant="small" color="textSecondary">
                  {room.ageRange} · {getChildrenInRoom(data, room.id).length}/{room.capacity} children
                </AppText>
              </View>
              <IconButton icon="edit" accessibilityLabel={`Edit ${room.name}`} onPress={() => navigation.navigate('RoomForm', { roomId: room.id })} />
            </View>
            <View style={styles.row}>
              {educators.length ? (
                educators.map((e) => (
                  <View key={e.id} style={styles.row}>
                    <Avatar name={e.avatar} size={24} />
                    <AppText variant="label">Educator: {e.name}</AppText>
                  </View>
                ))
              ) : (
                <AppText variant="label" color="danger">No educator assigned</AppText>
              )}
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
});
