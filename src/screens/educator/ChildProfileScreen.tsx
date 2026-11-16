import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Card, Chip, Icon, IconButton, IconTile, LinkText, Screen, ScreenHeader, SectionHeader } from '@/components';
import { ageFrom, formatRelativeDay, getAttendance, getAttendanceStatus, getChild, getRecentRecords, getRoom, getUser, useData } from '@/data';
import type { RoomScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { firstName } from '../parent/SelectedChildContext';
import { describeRecord } from '../shared/presentation';
import { RecordTypeGrid, type RecordAction } from './RecordTypeGrid';
import { useEducatorRoom } from './useEducatorRoom';

export function ChildProfileScreen({ navigation, route }: RoomScreenProps<'ChildProfile'>) {
  const { data, actions } = useData();
  const { user } = useEducatorRoom();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const child = getChild(data, route.params.childId);
  if (!child) return <Screen header={<ScreenHeader title="Child profile" />}><AppText>Child not found.</AppText></Screen>;

  const childId = child.id;
  const status = getAttendanceStatus(data, childId);
  const att = getAttendance(data, childId);
  const age = ageFrom(child.birthDate);
  const history = getRecentRecords(data, childId, showAll ? 20 : 4);
  const educatorName = `Educator ${firstName(user.name)}`;

  const info = [
    child.allergies.length ? `Allergies: ${child.allergies.join(', ')}.` : 'No known allergies.',
    child.notes,
  ].filter(Boolean).join(' ');

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
        const guardian = getUser(data, child.guardianIds[0] ?? '');
        if (!guardian) return;
        const id = actions.startConversation(user.id, guardian.id, guardian.name, child.roomId);
        return navigation.navigate('Chat', { conversationId: id });
      }
    }
  };

  return (
    <Screen
      header={
        <ScreenHeader
          title="Child profile"
          right={<IconButton icon="more" accessibilityLabel="More options" onPress={() => setMenuOpen((v) => !v)} />}
        />
      }
    >
      {menuOpen && (
        <Card style={styles.menu}>
          <LinkText label={`${firstName(child.name)}'s portfolio`} onPress={() => navigation.navigate('ChildPortfolio', { childId })} />
          <LinkText label={`${firstName(child.name)}'s activities`} onPress={() => navigation.navigate('ChildActivities', { childId })} />
        </Card>
      )}

      <Card>
        <View style={styles.identity}>
          <Avatar name={child.avatar} size={72} />
          <View style={styles.flex}>
            <AppText variant="highlight">{child.name}</AppText>
            <AppText variant="small" color="textSecondary">
              {age.years} years and {age.months} months · {getRoom(data, child.roomId)?.name} room
            </AppText>
            <View style={styles.pills}>
              {status === 'present' && <Chip small label="Present" tone="green" icon="check" />}
              {status === 'left' && <Chip small label="Gone home" tone="neutral" />}
              {status === 'expected' && <Chip small label="Not arrived" tone="honey" />}
              {att?.checkIn && <Chip small label={`In ${att.checkIn.time}`} tone="neutral" />}
              {att?.checkOut && <Chip small label={`Out ${att.checkOut.time}`} tone="neutral" />}
            </View>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.row}>
          <IconTile icon="alert" tone="red" size={32} />
          <AppText variant="bodyStrong">Important information</AppText>
        </View>
        <AppText variant="small" color="textSecondary">{info}</AppText>
        <Pressable
          onPress={() => navigation.navigate('AuthorisedPickup', { childId })}
          accessibilityRole="button"
          style={styles.pickup}
        >
          <Icon name="users" size={20} color={colors.info} />
          <AppText variant="label" style={styles.flex}>Authorised pick-up · {child.authorisedPickups.length} people</AppText>
          <Icon name="chevron" size={18} />
        </Pressable>
      </Card>

      <SectionHeader title="Record" />
      <RecordTypeGrid onSelect={onRecord} />

      {status === 'present' && (
        <Button title="Check out" icon="logout" variant="accent" fullWidth onPress={() => actions.checkOut(childId, educatorName)} />
      )}
      {status === 'expected' && (
        <Button title="Check in" icon="login" variant="accent" fullWidth onPress={() => actions.checkIn(childId, educatorName)} />
      )}

      <SectionHeader title="History" actionLabel={showAll ? 'Show less' : 'See all'} onAction={() => setShowAll((v) => !v)} />
      <View>
        {history.map((r) => {
          const view = describeRecord(r);
          return (
            <View key={r.id} style={styles.historyRow}>
              <IconTile icon={view.icon} tone={view.tone} size={40} />
              <View style={styles.flex}>
                <AppText variant="bodyStrong" numberOfLines={1}>
                  {view.title}{r.type === 'meal' && view.pill ? ` · ${view.pill.label.toLowerCase()}` : ''}
                </AppText>
                <AppText variant="small" color="textSecondary">{formatRelativeDay(r.date)}, {r.time}</AppText>
              </View>
            </View>
          );
        })}
        {history.length === 0 && <AppText color="textSecondary">No records yet.</AppText>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  menu: { gap: spacing.sm },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pills: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xxs, flexWrap: 'wrap' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pickup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
