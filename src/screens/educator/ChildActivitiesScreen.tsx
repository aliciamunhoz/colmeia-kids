import { AppText, Button, Screen, ScreenHeader } from '@/components';
import { getActivitiesForChild, getChild, useData } from '@/data';
import type { RoomScreenProps } from '@/navigation/types';
import { ActivityCard } from '../shared/ActivityCard';
import { firstName } from '../parent/SelectedChildContext';

export function ChildActivitiesScreen({ navigation, route }: RoomScreenProps<'ChildActivities'>) {
  const { data } = useData();
  const child = getChild(data, route.params.childId);
  if (!child) return null;
  const list = getActivitiesForChild(data, child.id);

  return (
    <Screen header={<ScreenHeader title="Activities" subtitle={`${firstName(child.name)} · ${list.length} activities`} />}>
      <Button title="New activity" icon="plus" fullWidth onPress={() => navigation.navigate('NewActivity')} />
      {list.map((a) => <ActivityCard key={a.id} activity={a} />)}
      {list.length === 0 && <AppText color="textSecondary">No activities yet.</AppText>}
    </Screen>
  );
}
