import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, ChildSwitcher, IconTile, Screen, ScreenHeader, SectionHeader } from '@/components';
import { getChild, getUser, TODAY, useData } from '@/data';
import type { RecordsScreenProps } from '@/navigation/types';
import { colors, spacing } from '@/theme';
import { firstName } from '../parent/SelectedChildContext';
import { describeRecord } from '../shared/presentation';
import { RecordTypeGrid, type RecordAction } from './RecordTypeGrid';
import { useEducatorRoom } from './useEducatorRoom';

export function RecordsScreen({ navigation }: RecordsScreenProps<'Records'>) {
  const { data, actions } = useData();
  const { user, room, children } = useEducatorRoom();
  const [childId, setChildId] = useState(children[0]?.id ?? '');

  if (!room || !childId) return null;

  const onRecord = (action: RecordAction) => {
    switch (action) {
      case 'meal':
      case 'sleep':
      case 'hygiene':
        return navigation.navigate('NewRecord', { childId, type: action });
      case 'mood':
        return navigation.navigate('Mood', { childId });
      case 'assessment':
        return navigation.navigate('Assessment', { childId });
      case 'incident':
        return navigation.navigate('Incident', { childId });
      case 'portfolio':
        return navigation.navigate('AddToPortfolio', { childId });
      case 'message': {
        const child = getChild(data, childId);
        const guardian = getUser(data, child?.guardianIds[0] ?? '');
        if (!guardian) return;
        return navigation.navigate('Chat', { conversationId: actions.startConversation(user.id, guardian.id, guardian.name, room.id) });
      }
    }
  };

  const roomChildIds = new Set(children.map((c) => c.id));
  const today = data.records
    .filter((r) => r.date === TODAY && roomChildIds.has(r.childId))
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 8);

  return (
    <Screen header={<ScreenHeader back={false} title="Records" subtitle={`${room.name} room · today`} />}>
      <ChildSwitcher items={children} selectedId={childId} onSelect={setChildId} />
      <RecordTypeGrid onSelect={onRecord} />

      <SectionHeader title="Today in the room" />
      <View>
        {today.map((r) => {
          const view = describeRecord(r);
          return (
            <View key={r.id} style={styles.row}>
              <IconTile icon={view.icon} tone={view.tone} size={40} />
              <View style={styles.flex}>
                <AppText variant="bodyStrong" numberOfLines={1}>{firstName(getChild(data, r.childId)?.name ?? '')} · {view.title}</AppText>
                <AppText variant="small" color="textSecondary" numberOfLines={1}>{r.time}{view.subtitle ? ` · ${view.subtitle}` : ''}</AppText>
              </View>
            </View>
          );
        })}
        {today.length === 0 && <AppText color="textSecondary">Nothing recorded today yet.</AppText>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
});
