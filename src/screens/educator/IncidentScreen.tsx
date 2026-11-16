import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Icon, OptionGroup, Screen, ScreenHeader, TextField } from '@/components';
import { isFutureDate, isValidTime, nowTime, parseDisplayDate, TODAY, toDisplayDate } from '@/data';
import { colors, radius, spacing } from '@/theme';
import type { IncidentKind } from '@/types/models';
import { Label } from './NewRecordScreen';
import { useRecordForm } from './useRecordForm';

const kinds: { value: IncidentKind; label: string }[] = [
  { value: 'fall', label: 'Fall' },
  { value: 'bite', label: 'Bite' },
  { value: 'fever', label: 'Fever' },
  { value: 'scratch', label: 'Scratch' },
  { value: 'other', label: 'Other' },
];

export function IncidentScreen() {
  const { child, user, actions, goBack } = useRecordForm<'Incident'>();
  const [date, setDate] = useState(toDisplayDate(TODAY));
  const [time, setTime] = useState(nowTime());
  const [kind, setKind] = useState<IncidentKind>('fall');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ date?: string; time?: string; description?: string }>({});

  if (!child) return null;

  const save = () => {
    const iso = parseDisplayDate(date);
    const next = {
      date: !iso ? 'Use DD/MM/YYYY.' : isFutureDate(iso) ? 'The date cannot be in the future.' : undefined,
      time: isValidTime(time) ? undefined : 'Use HH:MM.',
      description: description.trim() ? undefined : 'Describe what happened.',
    };
    setErrors(next);
    if (next.date || next.time || next.description || !iso) return;

    actions.addRecord({
      type: 'incident', childId: child.id, createdBy: user.id, kind,
      description: description.trim(), notes: notes.trim() || undefined, date: iso, time,
    });
    actions.notify(child.guardianIds, 'notice', 'Incident recorded', `${child.name.split(' ')[0]}: ${kinds.find((k) => k.value === kind)?.label} at ${time}. ${description.trim()}`);
    goBack();
  };

  return (
    <Screen header={<ScreenHeader title="Record incident" subtitle={child.name} />}>
      <View style={styles.banner}>
        <Icon name="bell" size={20} color={colors.danger} />
        <AppText variant="label" style={styles.flex}>Parents get a notification as soon as the incident is saved.</AppText>
      </View>

      <View style={styles.row}>
        <View style={styles.flex}><TextField label="Date" icon="calendar" value={date} onChangeText={setDate} error={errors.date} /></View>
        <View style={styles.flex}><TextField label="Time" icon="clock" value={time} onChangeText={setTime} error={errors.time} /></View>
      </View>

      <Label text="Type" />
      <OptionGroup selectedStyle="navy" value={kind} onChange={setKind} options={kinds} />

      <TextField label="Description" value={description} onChangeText={setDescription} multiline
        placeholder="Tripped in the playground and hit his knee." error={errors.description} />
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline placeholder="Ice applied. He was fine." />

      <Button title="Save incident" icon="alert" variant="dangerSolid" fullWidth onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
  banner: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.dangerSoft },
});
