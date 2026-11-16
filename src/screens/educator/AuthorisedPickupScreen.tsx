import { Linking, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Card, Chip, Icon, IconButton, Screen, ScreenHeader } from '@/components';
import { getChild, getRoom, toDisplayDate, useData } from '@/data';
import type { RoomScreenProps } from '@/navigation/types';
import { colors, radius, spacing, tones } from '@/theme';
import { firstName } from '../parent/SelectedChildContext';

const initials = (name: string) => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

export function AuthorisedPickupScreen({ route }: RoomScreenProps<'AuthorisedPickup'>) {
  const { data } = useData();
  const child = getChild(data, route.params.childId);
  if (!child) return null;
  const name = firstName(child.name);

  return (
    <Screen header={<ScreenHeader title="Authorised pick-up" subtitle={`${child.name} · ${getRoom(data, child.roomId)?.name} room`} />}>
      <View style={[styles.banner, { backgroundColor: colors.infoSoft }]}>
        <Icon name="shield" size={22} color={colors.info} />
        <AppText variant="small" style={styles.flex}>
          Only these people can check {name} out. Always confirm their identity at the door.
        </AppText>
      </View>

      {child.authorisedPickups.map((p) => (
        <Card key={p.name}>
          <View style={styles.row}>
            {p.avatar ? (
              <Avatar name={p.avatar} size={52} />
            ) : (
              <View style={styles.initials}>
                <AppText variant="highlight" style={{ color: tones.purple.foreground }}>{initials(p.name)}</AppText>
              </View>
            )}
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{p.name}</AppText>
              <AppText variant="small" color="textSecondary">
                {p.relation} · {p.mainContact || p.relation === 'Father' || p.relation === 'Mother' ? 'Parent / guardian' : 'Authorised by the parents'}
              </AppText>
            </View>
            <IconButton icon="phone" accessibilityLabel={`Call ${p.name}`} onPress={() => Linking.openURL(`tel:${p.phone.replace(/\s/g, '')}`)} />
          </View>
          <View style={styles.row}>
            <Icon name="phone" size={16} color={colors.textSecondary} />
            <AppText variant="small" color="textSecondary">{p.phone}</AppText>
          </View>
          <View style={styles.tags}>
            {p.mainContact && <Chip small label="Main contact" tone="honey" />}
            {p.until && <Chip small label={`Temporary · until ${toDisplayDate(p.until)}`} tone="purple" />}
            {p.idChecked && <Chip small label="ID checked" tone="green" />}
          </View>
        </Card>
      ))}

      <View style={[styles.banner, { backgroundColor: colors.dangerSoft }]}>
        <Icon name="alert" size={22} color={colors.danger} />
        <AppText variant="small" style={styles.flex}>
          Anyone else needs a written authorisation from the parents, managed by the administration.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  banner: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  initials: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: tones.purple.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tags: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
});
