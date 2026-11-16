import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Chip, Icon, IconTile, Screen, ScreenHeader, TextField, type AvatarName, type IconName } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { getAttendanceForDaycare, getChild, getChildrenInDaycare, getInvoicesForDaycare, getRoom, getUsersForDaycare, TODAY, toDisplayDate, useData } from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { colors, spacing, type Tone } from '@/theme';

type Filter = 'all' | 'children' | 'parents' | 'educators' | 'records';

type Result = { key: string; title: string; subtitle: string; avatar?: AvatarName; icon?: IconName; tone?: Tone; onPress: () => void };

export function SearchScreen({ navigation }: AdminStackScreenProps<'Search'>) {
  const { data } = useData();
  const { daycare } = useCurrentUser();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const q = query.trim().toLowerCase();
  const match = (...texts: (string | undefined)[]) => texts.some((t) => t?.toLowerCase().includes(q));

  const users = getUsersForDaycare(data, daycare.id);
  const childCount = (userId: string) => data.children.filter((c) => c.guardianIds.includes(userId)).length;

  const groups: { id: Filter; title: string; results: Result[] }[] = q.length < 2 ? [] : [
    {
      id: 'children', title: 'Children',
      results: getChildrenInDaycare(data, daycare.id).filter((c) => match(c.name)).map((c) => ({
        key: c.id, title: c.name, subtitle: `${getRoom(data, c.roomId)?.name} room`, avatar: c.avatar,
        onPress: () => navigation.navigate('ChildForm', { childId: c.id }),
      })),
    },
    {
      id: 'parents', title: 'Parents',
      results: users.filter((u) => u.role === 'parent' && match(u.name, u.email)).map((u) => ({
        key: u.id, title: u.name, subtitle: `Parent · ${childCount(u.id)} ${childCount(u.id) === 1 ? 'child' : 'children'}`, avatar: u.avatar,
        onPress: () => navigation.navigate('UserForm', { userId: u.id }),
      })),
    },
    {
      id: 'educators', title: 'Educators',
      results: users.filter((u) => u.role === 'educator' && match(u.name, u.email)).map((u) => ({
        key: u.id, title: u.name, subtitle: 'Educator', avatar: u.avatar,
        onPress: () => navigation.navigate('UserForm', { userId: u.id }),
      })),
    },
    {
      id: 'records', title: 'Records',
      results: [
        ...getInvoicesForDaycare(data, daycare.id)
          .filter((i) => match(i.number, getChild(data, i.childId)?.name))
          .map((i) => ({
            key: i.id, title: i.number, subtitle: `Invoice · ${getChild(data, i.childId)?.name}`, icon: 'file' as const, tone: 'honey' as const,
            onPress: () => navigation.navigate('InvoiceDetails', { invoiceId: i.id }),
          })),
        ...getAttendanceForDaycare(data, daycare.id, TODAY)
          .filter((a) => match(getChild(data, a.childId)?.name))
          .map((a) => ({
            key: a.id, title: `Check-in ${toDisplayDate(a.date).slice(0, 5)} · ${a.checkIn?.time}`,
            subtitle: `${getChild(data, a.childId)?.name} · by ${a.checkIn?.byName}`, icon: 'qr' as const, tone: 'purple' as const,
            onPress: () => navigation.navigate('AdminDrawer', { screen: 'CheckIns' }),
          })),
      ],
    },
  ];

  const visible = groups.filter((g) => (filter === 'all' || g.id === filter) && g.results.length > 0);

  return (
    <Screen header={<ScreenHeader title="Search" />}>
      <TextField
        label="Search"
        icon="search"
        value={query}
        onChangeText={setQuery}
        placeholder="Name, email, invoice number…"
        autoFocus
        rightIcon={query ? 'x' : undefined}
        rightIconLabel="Clear search"
        onRightIconPress={() => setQuery('')}
      />
      <View style={styles.filters}>
        {(['all', 'children', 'parents', 'educators', 'records'] as Filter[]).map((f, i) => (
          <Chip
            key={f}
            label={f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
            tone={(['blue', 'honey', 'honey', 'green', 'blue'] as Tone[])[i]}
            selected={filter === f}
            onPress={() => setFilter(f)}
          />
        ))}
      </View>

      {q.length < 2 && <AppText color="textSecondary">Type at least 2 letters.</AppText>}
      {q.length >= 2 && visible.length === 0 && <AppText color="textSecondary">No results for “{query}”.</AppText>}

      {visible.map((group) => (
        <View key={group.id}>
          <AppText variant="section">{group.title} ({group.results.length})</AppText>
          {group.results.map((r) => (
            <Pressable key={r.key} onPress={r.onPress} accessibilityRole="button" style={styles.row}>
              {r.avatar ? <Avatar name={r.avatar} size={44} /> : <IconTile icon={r.icon ?? 'file'} tone={r.tone ?? 'blue'} size={44} />}
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{r.title}</AppText>
                <AppText variant="small" color="textSecondary" numberOfLines={1}>{r.subtitle}</AppText>
              </View>
              <Icon name="chevron" size={18} />
            </Pressable>
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
});
