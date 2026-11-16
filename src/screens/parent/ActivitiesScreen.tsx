import { useState } from 'react';

import { AppText, Screen, ScreenHeader, SegmentedControl } from '@/components';
import { getActivitiesForChild, getActivitiesForRoom, useData } from '@/data';
import type { HomeScreenProps } from '@/navigation/types';
import { ActivityCard } from '../shared/ActivityCard';
import { firstName, useSelectedChild } from './SelectedChildContext';

type Scope = 'child' | 'room';

export function ActivitiesScreen({ navigation }: HomeScreenProps<'Activities'>) {
  const { data } = useData();
  const { child, room } = useSelectedChild();
  const [scope, setScope] = useState<Scope>('child');
  const name = firstName(child.name);

  const list = scope === 'child' ? getActivitiesForChild(data, child.id) : getActivitiesForRoom(data, child.roomId);

  return (
    <Screen header={<ScreenHeader title="Activities" subtitle={`${name} and the ${room?.name} room`} />}>
      <SegmentedControl
        value={scope}
        onChange={setScope}
        options={[
          { value: 'child', label: `${name}'s` },
          { value: 'room', label: 'Room' },
        ]}
      />

      {list.length === 0 && <AppText color="textSecondary">No activities yet.</AppText>}

      {list.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onPress={() => navigation.navigate('ActivityDetail', { activityId: activity.id })}
        />
      ))}
    </Screen>
  );
}
