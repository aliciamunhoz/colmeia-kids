import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Chip, Icon, Screen, TextField } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { getUsersForDaycare, useData } from '@/data';
import type { AdminDrawerScreenProps } from '@/navigation/types';
import { colors, spacing, type Tone } from '@/theme';
import type { Role, User } from '@/types/models';
import { AdminHeader, Fab } from './AdminParts';

type Filter = 'all' | Role | 'blocked';

export const roleView: Record<Role, { label: string; tone: Tone }> = {
  admin: { label: 'Administrator', tone: 'blue' },
  educator: { label: 'Educator', tone: 'green' },
  parent: { label: 'Parent', tone: 'honey' },
};

const roleWord: Record<Role, string> = { admin: 'administrator', educator: 'educator', parent: 'parent' };

export function UsersScreen({ navigation }: AdminDrawerScreenProps<'Users'>) {
  const { data } = useData();
  const { daycare } = useCurrentUser();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const all = getUsersForDaycare(data, daycare.id);
  const q = query.trim().toLowerCase();
  const list = all
    .filter((u: User) => (filter === 'all' ? true : filter === 'blocked' ? u.blocked : u.role === filter && !u.blocked))
    .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));

  const filters: { value: Filter; label: string; tone: Tone; icon?: 'x' }[] = [
    { value: 'all', label: 'All', tone: 'blue' },
    { value: 'admin', label: 'Admins', tone: 'blue' },
    { value: 'educator', label: 'Educators', tone: 'green' },
    { value: 'parent', label: 'Parents', tone: 'honey' },
    { value: 'blocked', label: 'Blocked', tone: 'red', icon: 'x' },
  ];

  return (
    <Screen
      header={<AdminHeader title="Users" subtitle={`${all.length} accounts`} />}
      overlay={<Fab label="New user" onPress={() => navigation.navigate('UserForm', {})} />}
    >
      <TextField icon="search" placeholder="Name or email" value={query} onChangeText={setQuery} autoCapitalize="none" />
      <View style={styles.filters}>
        {filters.map((f) => (
          <Chip key={f.value} label={f.label} tone={f.tone} icon={f.icon} selected={filter === f.value} onPress={() => setFilter(f.value)} />
        ))}
      </View>

      <View>
        {list.map((u) => (
          <Pressable key={u.id} onPress={() => navigation.navigate('UserForm', { userId: u.id })} accessibilityRole="button" accessibilityLabel={u.name} style={styles.row}>
            <Avatar name={u.avatar} size={44} />
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{u.name}</AppText>
              <AppText variant="small" color="textSecondary">{roleWord[u.role]} · {u.blocked ? 'blocked' : 'active'}</AppText>
            </View>
            {u.blocked ? <Chip small label="Blocked" tone="red" icon="x" /> : <Chip small label={roleView[u.role].label} tone={roleView[u.role].tone} />}
            <Icon name="chevron" size={18} />
          </Pressable>
        ))}
        {list.length === 0 && <AppText color="textSecondary" style={styles.empty}>No users found.</AppText>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  empty: { textAlign: 'center', paddingVertical: spacing.lg },
});
