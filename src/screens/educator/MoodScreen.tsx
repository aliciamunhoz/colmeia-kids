import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText, Button, Icon, OptionGroup, Screen, ScreenHeader, TextField } from '@/components';
import type { RecordFormsParamList } from '@/navigation/types';
import { colors, radius, spacing, tones, type Tone } from '@/theme';
import type { Behaviour, Mood, Wellbeing } from '@/types/models';
import { Label } from './NewRecordScreen';
import { useRecordForm } from './useRecordForm';

const moods: { value: Mood; label: string; tone: Tone }[] = [
  { value: 'happy', label: 'Happy', tone: 'honey' },
  { value: 'calm', label: 'Calm', tone: 'honey' },
  { value: 'sad', label: 'Sad', tone: 'blue' },
  { value: 'grumpy', label: 'Grumpy', tone: 'red' },
  { value: 'tired', label: 'Tired', tone: 'purple' },
];

export function MoodScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RecordFormsParamList>>();
  const { child, user, actions, goBack } = useRecordForm<'Mood'>();
  const [mood, setMood] = useState<Mood>('happy');
  const [behaviour, setBehaviour] = useState<Behaviour>('engaged');
  const [wellbeing, setWellbeing] = useState<Wellbeing>('well');
  const [note, setNote] = useState('');

  if (!child) return null;

  const save = () => {
    actions.addRecord({ type: 'mood', childId: child.id, createdBy: user.id, mood, behaviour, wellbeing, note: note.trim() || undefined });
    goBack();
  };

  return (
    <Screen header={<ScreenHeader title="Mood and well-being" subtitle={`${child.name} · today`} />}>
      <Label text="Mood" />
      <View style={styles.moods} accessibilityRole="radiogroup">
        {moods.map((m) => {
          const selected = m.value === mood;
          return (
            <Pressable
              key={m.value}
              onPress={() => setMood(m.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[styles.mood, selected && styles.moodSelected]}
            >
              <View style={[styles.face, { backgroundColor: tones[m.tone].background }]}>
                <Icon name="smile" size={22} color={tones[m.tone].foreground} />
              </View>
              <AppText variant="label">{m.label}</AppText>
            </Pressable>
          );
        })}
      </View>

      <Label text="Behaviour" />
      <OptionGroup fill value={behaviour} onChange={setBehaviour} options={[
        { value: 'calm', label: 'Calm' },
        { value: 'restless', label: 'Restless' },
        { value: 'engaged', label: 'Engaged' },
      ]} />

      <Label text="Well-being" />
      <OptionGroup fill value={wellbeing} onChange={setWellbeing} options={[
        { value: 'well', label: 'Well' },
        { value: 'feverish', label: 'Feverish' },
        { value: 'discomfort', label: 'Discomfort' },
      ]} />

      <TextField label="General notes" value={note} onChangeText={setNote} placeholder="Played a lot outside with Leonor." multiline />

      <Pressable
        onPress={() => navigation.navigate('Incident', { childId: child.id })}
        accessibilityRole="button"
        style={styles.incident}
      >
        <Icon name="alert" size={22} color={colors.danger} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">Did an incident happen?</AppText>
          <AppText variant="small" color="textSecondary">Record an incident with date, time and type.</AppText>
        </View>
        <Icon name="chevron" size={20} color={colors.danger} />
      </Pressable>

      <Button title="Save" icon="check" fullWidth onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  moods: { flexDirection: 'row', gap: spacing.xs },
  mood: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  moodSelected: { borderWidth: 2, borderColor: colors.accent, backgroundColor: colors.accentSoft },
  face: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  incident: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.dangerSoft },
});
