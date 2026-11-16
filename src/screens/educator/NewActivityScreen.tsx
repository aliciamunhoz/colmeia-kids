import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Chip, CoverImage, Icon, LinkText, Screen, ScreenHeader, TextField } from '@/components';
import { isValidTime, nowTime, parseDisplayDate, TODAY, toDisplayDate, useData } from '@/data';
import type { EducatorTabScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import type { Cover } from '@/types/models';
import { Label } from './NewRecordScreen';
import { useEducatorRoom } from './useEducatorRoom';

const photoOptions: Cover[] = [
  { icon: 'sun', tone: 'blue' },
  { icon: 'smile', tone: 'honey' },
  { icon: 'palette', tone: 'red' },
  { icon: 'star', tone: 'green' },
];

export function NewActivityScreen({ navigation }: EducatorTabScreenProps<'NewActivity'>) {
  const { actions } = useData();
  const { user, room, children } = useEducatorRoom();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(toDisplayDate(TODAY));
  const [time, setTime] = useState(nowTime());
  const [objectives, setObjectives] = useState<string[]>(['Fine motor skills']);
  const [newObjective, setNewObjective] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Cover[]>([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!room) return null;

  const toggleChild = (id: string) =>
    setParticipants((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  const addObjective = () => {
    const value = newObjective.trim();
    if (value && !objectives.includes(value)) setObjectives([...objectives, value]);
    setNewObjective('');
  };

  const reset = () => {
    setTitle(''); setDescription(''); setObjectives(['Fine motor skills']); setParticipants([]); setPhotos([]); setNote('');
  };

  const publish = () => {
    const iso = parseDisplayDate(date);
    if (!title.trim()) return setError('Give the activity a name.');
    if (!iso || !isValidTime(time)) return setError('Check the date (DD/MM/YYYY) and time (HH:MM).');
    if (participants.length === 0) return setError('Choose at least one child.');

    actions.addActivity({
      roomId: room.id,
      educatorId: user.id,
      date: iso,
      time,
      title: title.trim(),
      category: 'art',
      description: description.trim(),
      objectives,
      photos: photos.length ? photos : [photoOptions[0]],
      childIds: participants,
      educatorNote: note.trim() || undefined,
    });
    const guardianIds = [...new Set(children.filter((c) => participants.includes(c.id)).flatMap((c) => c.guardianIds))];
    actions.notify(guardianIds, 'activity', 'New activity', title.trim());

    reset();
    navigation.navigate('RoomTab', { screen: 'Room' });
  };

  return (
    <Screen header={<ScreenHeader title="New activity" back={false} />}>
      <TextField label="Name" value={title} onChangeText={setTitle} placeholder="Finger painting" />
      <TextField label="Description" value={description} onChangeText={setDescription} multiline placeholder="Exploring primary colours…" />
      <View style={styles.row}>
        <View style={styles.flex}><TextField label="Date" icon="calendar" value={date} onChangeText={setDate} /></View>
        <View style={styles.flex}><TextField label="Time" icon="clock" value={time} onChangeText={setTime} /></View>
      </View>

      <Label text="Objectives" />
      <View style={styles.wrap}>
        {objectives.map((o) => (
          <Chip key={o} label={o} tone="honey" icon="x" onPress={() => setObjectives(objectives.filter((x) => x !== o))} />
        ))}
      </View>
      <View style={styles.row}>
        <View style={styles.flex}>
          <TextField value={newObjective} onChangeText={setNewObjective} placeholder="New objective" onSubmitEditing={addObjective} />
        </View>
        <Button title="Add" icon="plus" variant="secondary" onPress={addObjective} />
      </View>

      <View style={styles.between}>
        <Label text={`Participating children (${participants.length})`} />
        <LinkText label="Select all" onPress={() => setParticipants(children.map((c) => c.id))} />
      </View>
      <View style={styles.wrap}>
        {children.map((c) => {
          const selected = participants.includes(c.id);
          return (
            <Pressable
              key={c.id}
              onPress={() => toggleChild(c.id)}
              accessibilityRole="checkbox"
              accessibilityLabel={c.name}
              accessibilityState={{ checked: selected }}
              style={[styles.child, selected && styles.childSelected]}
            >
              <Avatar name={c.avatar} size={44} />
              {selected && (
                <View style={styles.check}>
                  <Icon name="check" size={12} color={colors.textOnPrimary} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Label text="Photos" />
      <View style={styles.wrap}>
        {photos.map((p, i) => (
          <Pressable key={i} onPress={() => setPhotos(photos.filter((_, j) => j !== i))} accessibilityLabel={`Remove photo ${i + 1}`}>
            <CoverImage cover={p} width={72} height={72} iconSize={28} />
          </Pressable>
        ))}
        {photos.length < 4 && (
          <Pressable
            onPress={() => setPhotos([...photos, photoOptions[photos.length]])}
            accessibilityRole="button"
            accessibilityLabel="Add photo"
            style={styles.addPhoto}
          >
            <Icon name="camera" size={20} />
            <AppText variant="caption">Add</AppText>
          </Pressable>
        )}
      </View>

      <TextField label="Notes" value={note} onChangeText={setNote} placeholder="Notes for families" multiline />

      {error && <AppText variant="small" color="danger">{error}</AppText>}
      <Button title="Publish activity" icon="send" fullWidth onPress={publish} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-end' },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  child: { borderRadius: radius.md, borderWidth: 2, borderColor: 'transparent', padding: 2 },
  childSelected: { borderColor: colors.success },
  check: {
    position: 'absolute', right: -2, bottom: -2, width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center',
  },
  addPhoto: {
    width: 72, height: 72, borderRadius: radius.md, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
});
