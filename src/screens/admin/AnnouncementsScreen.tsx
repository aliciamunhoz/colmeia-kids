import { StyleSheet, View } from 'react-native';

import { AppText, Card, Chip, Screen } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { formatShortDate, getRoom, getUser, useData } from '@/data';
import type { AdminDrawerScreenProps } from '@/navigation/types';
import { AdminHeader, Fab } from './AdminParts';

export function AnnouncementsScreen({ navigation }: AdminDrawerScreenProps<'Announcements'>) {
  const { data } = useData();
  const { daycare } = useCurrentUser();
  const list = data.announcements.filter((a) => a.daycareId === daycare.id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Screen
      header={<AdminHeader title="Announcements" subtitle={`${list.length} sent`} />}
      overlay={<Fab label="New announcement" onPress={() => navigation.navigate('AnnouncementForm')} />}
    >
      {list.map((a) => (
        <Card key={a.id}>
          <View style={styles.row}>
            <Chip small label={a.roomId ? `${getRoom(data, a.roomId)?.name} room` : 'All parents'} tone={a.roomId ? 'honey' : 'blue'} />
            <AppText variant="caption" color="textSecondary">{formatShortDate(a.date)}</AppText>
          </View>
          <AppText variant="section">{a.title}</AppText>
          <AppText variant="small" color="textSecondary">{a.body}</AppText>
          <AppText variant="caption" color="textTertiary">by {getUser(data, a.authorId)?.name}</AppText>
        </Card>
      ))}
      {list.length === 0 && <AppText color="textSecondary">No announcements yet.</AppText>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
