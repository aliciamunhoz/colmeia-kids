import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Chip, Icon, IconTile, OptionGroup, Screen, ScreenHeader, Switch, TextField, type IconName } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { getChildrenInDaycare, getRoomsForDaycare, getUsersForDaycare, useData } from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import type { NotificationKind } from '@/types/models';

type Audience = 'all' | 'room' | 'specific' | 'educators';

const audiences: { value: Audience; label: string; icon: IconName }[] = [
  { value: 'all', label: 'All parents', icon: 'users' },
  { value: 'room', label: 'One room', icon: 'door' },
  { value: 'specific', label: 'Specific parents', icon: 'user' },
  { value: 'educators', label: 'Educators', icon: 'heart' },
];

const categories: { value: NotificationKind; label: string }[] = [
  { value: 'notice', label: 'Daycare notice' },
  { value: 'event', label: 'Event' },
  { value: 'schedule', label: 'Schedule change' },
];

export function AnnouncementFormScreen({ navigation }: AdminStackScreenProps<'AnnouncementForm'>) {
  const { data, actions } = useData();
  const { daycare, user } = useCurrentUser();
  const rooms = getRoomsForDaycare(data, daycare.id);
  const users = getUsersForDaycare(data, daycare.id);
  const parents = users.filter((u) => u.role === 'parent');

  const [audience, setAudience] = useState<Audience>('all');
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');
  const [picked, setPicked] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<NotificationKind>('notice');
  const [push, setPush] = useState(true);

  const recipients: string[] = (() => {
    switch (audience) {
      case 'all':
        return parents.map((p) => p.id);
      case 'room':
        return [...new Set(getChildrenInDaycare(data, daycare.id).filter((c) => c.roomId === roomId).flatMap((c) => c.guardianIds))];
      case 'specific':
        return picked;
      case 'educators':
        return users.filter((u) => u.role === 'educator').map((u) => u.id);
    }
  })();
  const noun = audience === 'educators' ? 'educators' : 'families';
  const canSend = subject.trim() && message.trim() && recipients.length > 0;

  const send = () => {
    actions.addAnnouncement({
      daycareId: daycare.id,
      roomId: audience === 'room' ? roomId : undefined,
      authorId: user.id,
      title: subject.trim(),
      body: message.trim(),
    });
    if (push) actions.notify(recipients, category, subject.trim(), message.trim());
    navigation.goBack();
  };

  return (
    <Screen header={<ScreenHeader title="Announcement" />}>
      <AppText variant="label" color="textSecondary">Send to</AppText>
      <View style={styles.grid}>
        {audiences.map((a) => {
          const selected = a.value === audience;
          return (
            <Pressable
              key={a.value}
              onPress={() => setAudience(a.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[styles.audience, selected && styles.audienceSelected]}
            >
              <Icon name={a.icon} size={20} />
              <AppText variant="label">{a.label}</AppText>
            </Pressable>
          );
        })}
      </View>

      {audience === 'room' && (
        <OptionGroup value={roomId} onChange={setRoomId} options={rooms.map((r) => ({ value: r.id, label: r.name }))} />
      )}
      {audience === 'specific' && (
        <View style={styles.wrap}>
          {parents.map((p) => (
            <Chip
              key={p.id}
              label={p.name}
              tone="honey"
              selected={picked.includes(p.id)}
              onPress={() => setPicked((ids) => (ids.includes(p.id) ? ids.filter((x) => x !== p.id) : [...ids, p.id]))}
            />
          ))}
        </View>
      )}

      <TextField label="Subject" value={subject} onChangeText={setSubject} placeholder="Closed on 5 October" />
      <TextField label="Message" value={message} onChangeText={setMessage} multiline placeholder="Please note the daycare will be closed…" />

      <AppText variant="label" color="textSecondary">Category</AppText>
      <OptionGroup value={category} onChange={setCategory} options={categories} />

      <View style={styles.row}>
        <IconTile icon="bell" tone="blue" size={40} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">Push notification</AppText>
          <AppText variant="small" color="textSecondary">{recipients.length} {noun} will receive it</AppText>
        </View>
        <Switch value={push} onValueChange={setPush} />
      </View>

      <Button title={`Send to ${recipients.length} ${noun}`} icon="send" fullWidth disabled={!canSend} onPress={send} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  audience: {
    flexBasis: '48%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: spacing.md,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  audienceSelected: { borderWidth: 2, borderColor: colors.accent, backgroundColor: colors.accentSoft },
});
