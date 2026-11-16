import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Icon, OptionGroup, Screen, ScreenHeader, TextField, type IconName } from '@/components';
import { formatDuration, isValidTime, minutesBetween, nowTime } from '@/data';
import { colors, radius, spacing, tones } from '@/theme';
import type { MealAmount } from '@/types/models';
import { useRecordForm } from './useRecordForm';

type Kind = 'meal' | 'sleep' | 'hygiene';
type Meal = 'breakfast' | 'lunch' | 'snack';

const kinds: { value: Kind; label: string; icon: IconName }[] = [
  { value: 'meal', label: 'Meal', icon: 'utensils' },
  { value: 'sleep', label: 'Sleep', icon: 'moon' },
  { value: 'hygiene', label: 'Hygiene', icon: 'droplet' },
];

export function NewRecordScreen() {
  const { params, child, user, actions, goBack } = useRecordForm<'NewRecord'>();

  const [kind, setKind] = useState<Kind>(params.type ?? 'meal');
  const [meal, setMeal] = useState<Meal>('lunch');
  const [time, setTime] = useState(nowTime());
  const [amount, setAmount] = useState<MealAmount>('all');
  const [notes, setNotes] = useState('');
  const [start, setStart] = useState('12:50');
  const [end, setEnd] = useState('14:15');
  const [hygiene, setHygiene] = useState('Nappy change');
  const [error, setError] = useState<string | null>(null);

  if (!child) return null;

  const duration = isValidTime(start) && isValidTime(end) ? minutesBetween(start, end) : -1;

  const save = () => {
    const base = { childId: child.id, createdBy: user.id };
    if (kind === 'meal') {
      if (!isValidTime(time)) return setError('Use the format HH:MM (e.g. 12:00).');
      const description = notes.trim() || `${meal[0].toUpperCase()}${meal.slice(1)}`;
      actions.addRecord({ ...base, type: 'meal', meal, amount, description, time });
    } else if (kind === 'sleep') {
      if (duration <= 0) return setError('The end must be after the start (HH:MM).');
      actions.addRecord({ ...base, type: 'sleep', start, end, note: notes.trim() || undefined, time: start });
    } else {
      if (!isValidTime(time)) return setError('Use the format HH:MM (e.g. 15:10).');
      const description = notes.trim() ? `${hygiene} · ${notes.trim()}` : hygiene;
      actions.addRecord({ ...base, type: 'hygiene', description, time });
    }
    goBack();
  };

  return (
    <Screen header={<ScreenHeader title="New record" subtitle={child.name} />}>
      <View style={styles.kinds}>
        {kinds.map((k) => {
          const selected = k.value === kind;
          return (
            <Pressable
              key={k.value}
              onPress={() => {
                setKind(k.value);
                setError(null);
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[styles.kind, selected && styles.kindSelected]}
            >
              <Icon name={k.icon} size={26} color={selected ? tones.green.foreground : colors.text} />
              <AppText variant="label">{k.label}</AppText>
            </Pressable>
          );
        })}
      </View>

      {kind === 'meal' && (
        <>
          <Label text="Meal type" />
          <OptionGroup
            fill
            value={meal}
            onChange={setMeal}
            options={[
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'lunch', label: 'Lunch' },
              { value: 'snack', label: 'Snack' },
            ]}
          />
          <TextField label="Time" icon="clock" value={time} onChangeText={setTime} placeholder="HH:MM" />
          <Label text="Amount eaten" />
          <OptionGroup
            fill
            selectedStyle="green"
            value={amount}
            onChange={setAmount}
            options={[
              { value: 'none', label: 'None' },
              { value: 'little', label: 'A little' },
              { value: 'half', label: 'Half' },
              { value: 'almostAll', label: 'Almost all' },
              { value: 'all', label: 'All' },
            ]}
          />
          <TextField label="Notes" value={notes} onChangeText={setNotes} placeholder="Had seconds of soup." multiline />
        </>
      )}

      {kind === 'sleep' && (
        <Card>
          <View style={styles.row}>
            <Icon name="moon" size={22} color={colors.info} />
            <View>
              <AppText variant="bodyStrong">Sleep</AppText>
              <AppText variant="caption" color="textSecondary">Start, end and duration calculated automatically.</AppText>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.flex}><TextField label="Start" icon="clock" value={start} onChangeText={setStart} /></View>
            <View style={styles.flex}><TextField label="End" icon="clock" value={end} onChangeText={setEnd} /></View>
          </View>
          <View style={styles.duration}>
            <Icon name="moon" size={16} color={colors.info} />
            <AppText variant="label" color="info">Duration: {duration > 0 ? formatDuration(duration) : '—'}</AppText>
          </View>
          <TextField label="Notes" value={notes} onChangeText={setNotes} placeholder="Fell asleep easily" />
        </Card>
      )}

      {kind === 'hygiene' && (
        <>
          <Label text="Type" />
          <OptionGroup
            value={hygiene}
            onChange={setHygiene}
            options={['Nappy change', 'Hand washing', 'Toilet', 'Teeth brushing'].map((v) => ({ value: v, label: v }))}
          />
          <TextField label="Time" icon="clock" value={time} onChangeText={setTime} placeholder="HH:MM" />
          <TextField label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional" />
        </>
      )}

      {error && <AppText variant="small" color="danger">{error}</AppText>}
      <Button title="Save record" icon="check" fullWidth onPress={save} />
    </Screen>
  );
}

export const Label = ({ text }: { text: string }) => <AppText variant="label" color="textSecondary">{text}</AppText>;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  kinds: { flexDirection: 'row', gap: spacing.xs },
  kind: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  kindSelected: { borderWidth: 2, borderColor: colors.success, backgroundColor: colors.successSoft },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.infoSoft,
  },
});
