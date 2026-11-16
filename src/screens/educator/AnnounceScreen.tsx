import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText, Button, IconTile, Screen, ScreenHeader, SectionHeader, Switch, TextField } from '@/components';
import { formatShortDate, useData } from '@/data';
import { colors, spacing } from '@/theme';
import { useEducatorRoom } from './useEducatorRoom';

export function AnnounceScreen() {
  const { data, actions } = useData();
  const { user, room, children } = useEducatorRoom();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [push, setPush] = useState(true);
  const [sent, setSent] = useState<string | null>(null);

  if (!room) return null;

  const canSend = subject.trim().length > 0 && message.trim().length > 0;

  const send = () => {
    actions.addAnnouncement({ daycareId: room.daycareId, roomId: room.id, authorId: user.id, title: subject.trim(), body: message.trim() });
    if (push) {
      const guardians = [...new Set(children.flatMap((c) => c.guardianIds))];
      actions.notify(guardians, 'notice', `${room.name}: ${subject.trim()}`, message.trim());
    }
    setSent(subject.trim());
    setSubject('');
    setMessage('');
  };

  const recent = data.announcements.filter((a) => a.authorId === user.id).slice(0, 5);

  return (
    <Screen header={<ScreenHeader back={false} title="Announce to room" subtitle={`${room.name} room · ${children.length} families`} />}>
      <TextField label="Subject" value={subject} onChangeText={(t) => { setSubject(t); setSent(null); }} placeholder="Trip to the park" />
      <TextField label="Message" value={message} onChangeText={setMessage} multiline placeholder="On Friday, 2 October, we're going to the park…" />
      <Button
        title="Attach file"
        icon="clip"
        variant="secondary"
        fullWidth
        onPress={() => Alert.alert('Attach file', 'Choosing files is not part of this prototype.')}
      />

      <View style={styles.row}>
        <IconTile icon="bell" tone="blue" size={40} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">Send push notification</AppText>
          <AppText variant="small" color="textSecondary">Parents get an alert</AppText>
        </View>
        <Switch value={push} onValueChange={setPush} />
      </View>

      <Button title="Send announcement" icon="send" fullWidth disabled={!canSend} onPress={send} />
      {sent && <AppText variant="small" color="success">“{sent}” was sent to the {room.name} families ✓</AppText>}

      <SectionHeader title="Recently sent" />
      {recent.map((a) => (
        <View key={a.id} style={styles.recent}>
          <IconTile icon="calendar" tone="red" size={40} />
          <View style={styles.flex}>
            <AppText variant="bodyStrong">{a.title}</AppText>
            <AppText variant="small" color="textSecondary" numberOfLines={1}>{formatShortDate(a.date)} · {a.body}</AppText>
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  recent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
});
