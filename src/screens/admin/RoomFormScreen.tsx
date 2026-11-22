import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Chip, OptionGroup, Screen, ScreenHeader, TextField } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { getChildrenInRoom, getRoom, getUsersForDaycare, useData } from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { colors, spacing, tones, type Tone } from '@/theme';

const TONES = Object.keys(tones) as Tone[];

export function RoomFormScreen({ navigation, route }: AdminStackScreenProps<'RoomForm'>) {
  const { data, actions } = useData();
  const { daycare } = useCurrentUser();
  const existing = route.params.roomId ? getRoom(data, route.params.roomId) : undefined;
  const educators = getUsersForDaycare(data, daycare.id).filter((u) => u.role === 'educator');

  const [name, setName] = useState(existing?.name ?? '');
  const [ageRange, setAgeRange] = useState(existing?.ageRange ?? '1–2 years');
  const [capacity, setCapacity] = useState(String(existing?.capacity ?? 15));
  const [educatorId, setEducatorId] = useState<string | null>(existing?.educatorIds[0] ?? null);
  const [tone, setTone] = useState<Tone>(existing?.tone ?? 'honey');
  const [error, setError] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const childrenInRoom = existing ? getChildrenInRoom(data, existing.id).length : 0;

  const save = () => {
    const cap = Number(capacity);
    if (name.trim().length < 2) return setError('Enter the room name.');
    if (!Number.isInteger(cap) || cap < 1) return setError('Capacity must be a whole number.');
    actions.saveRoom({
      id: existing?.id,
      daycareId: daycare.id,
      name: name.trim(),
      ageRange: ageRange.trim(),
      capacity: cap,
      educatorIds: educatorId ? [educatorId] : [],
      tone,
    });
    navigation.goBack();
  };

  const remove = () => {
    if (!existing || childrenInRoom > 0) return;
    actions.removeRoom(existing.id);
    navigation.goBack();
  };

  return (
    <Screen header={<ScreenHeader title={existing ? `Edit ${existing.name}` : 'New room'} subtitle={`${daycare.name} · ${daycare.city}`} />}>
      <TextField label="Room name" value={name} onChangeText={setName} placeholder="Little Bees" />
      <View style={styles.row}>
        <View style={styles.flex}><TextField label="Age range" value={ageRange} onChangeText={setAgeRange} /></View>
        <View style={styles.flex}><TextField label="Capacity" value={capacity} onChangeText={setCapacity} keyboardType="number-pad" /></View>
      </View>
      <AppText variant="label" color="textSecondary">Educator</AppText>
      <OptionGroup value={educatorId} onChange={setEducatorId} options={educators.map((e) => ({ value: e.id, label: e.name }))} />
      <AppText variant="label" color="textSecondary">Colour</AppText>
      <View style={styles.wrap}>
        {TONES.map((t) => <Chip key={t} label={t} tone={t} selected={tone === t} onPress={() => setTone(t)} />)}
      </View>
      {error && <AppText variant="small" color="danger">{error}</AppText>}
      <Button title="Save room" icon="check" fullWidth onPress={save} />

      {existing && childrenInRoom > 0 && (
        <AppText variant="small" color="textSecondary">
          To delete this room, first move its {childrenInRoom} {childrenInRoom === 1 ? 'child' : 'children'} to another room.
        </AppText>
      )}

      {existing && childrenInRoom === 0 && !confirmRemove && (
        <Button title="Delete room" icon="trash" variant="danger" fullWidth onPress={() => setConfirmRemove(true)} />
      )}

      {existing && childrenInRoom === 0 && confirmRemove && (
        <Card style={styles.confirm}>
          <AppText variant="bodyStrong">Delete {existing.name}?</AppText>
          <AppText variant="small" color="textSecondary">
            The room and its activities, announcements and group chat are deleted. This cannot be undone.
          </AppText>
          <View style={styles.row}>
            <Button title="Cancel" variant="secondary" onPress={() => setConfirmRemove(false)} style={styles.flex} />
            <Button title="Delete" icon="trash" variant="dangerSolid" onPress={remove} style={styles.flex} />
          </View>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  confirm: { borderColor: colors.danger },
});
