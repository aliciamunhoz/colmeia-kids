import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Chip, OptionGroup, Screen, ScreenHeader, TextField } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { getRoom, getUsersForDaycare, useData } from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { spacing, tones, type Tone } from '@/theme';

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
