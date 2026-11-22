import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Chip, IconTile, OptionGroup, Screen, ScreenHeader, SegmentedControl, Switch, TextField, type AvatarName } from '@/components';
import { useAuth, useCurrentUser } from '@/context/AuthContext';
import { getChildrenInDaycare, getRoomsForDaycare, getUser, isEmailTaken, isValidEmail, normalizeEmail, nowDateTime, useData } from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { colors, spacing } from '@/theme';
import type { Permission, Role } from '@/types/models';

const permissionLabels: Record<Permission, string> = {
  diary: "Record children's diary",
  announcements: 'Send announcements to room',
  portfolio: 'Manage portfolio',
  billing: 'View billing',
};

const avatarFor: Record<Role, AvatarName> = { admin: 'admin', educator: 'educator', parent: 'parent' };

export function UserFormScreen({ navigation, route }: AdminStackScreenProps<'UserForm'>) {
  const { data, actions } = useData();
  const { daycare } = useCurrentUser();
  const { user: me } = useAuth();
  const existing = route.params.userId ? getUser(data, route.params.userId) : undefined;
  const rooms = getRoomsForDaycare(data, daycare.id);
  const children = getChildrenInDaycare(data, daycare.id);

  const [name, setName] = useState(existing?.name ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [role, setRole] = useState<Role>(existing?.role ?? 'educator');
  const [roomId, setRoomId] = useState(rooms.find((r) => existing && r.educatorIds.includes(existing.id))?.id ?? rooms[0]?.id ?? '');
  const [permissions, setPermissions] = useState<Permission[]>(existing?.permissions ?? ['diary', 'announcements', 'portfolio']);
  const [childIds, setChildIds] = useState<string[]>(existing ? children.filter((c) => c.guardianIds.includes(existing.id)).map((c) => c.id) : []);
  const [blocked, setBlocked] = useState(existing?.blocked ?? false);
  const [invite, setInvite] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [confirmRemove, setConfirmRemove] = useState(false);
  const canRemove = existing !== undefined && existing.id !== me?.id;

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

  const save = () => {
    const next = {
      name: name.trim().length < 3 ? 'Enter the full name.' : undefined,
      email: !isValidEmail(email) ? 'Enter a valid email.' : isEmailTaken(data.users, email, existing?.id) ? 'This email already has an account.' : undefined,
    };
    setErrors(next);
    if (next.name || next.email) return;

    const id = actions.saveUser({
      ...(existing ?? { password: 'colmeia123', daycareIds: [daycare.id], avatar: avatarFor[role] }),
      id: existing?.id,
      name: name.trim(),
      email: normalizeEmail(email),
      phone: phone.trim() || undefined,
      role,
      blocked,
      permissions: role === 'educator' ? permissions : undefined,
      invitedAt: !existing && invite ? nowDateTime() : existing?.invitedAt,
    });

    if (role === 'educator') {
      rooms.forEach((r) => {
        const has = r.educatorIds.includes(id);
        if (r.id === roomId && !has) actions.saveRoom({ ...r, educatorIds: [...r.educatorIds, id] });
        if (r.id !== roomId && has) actions.saveRoom({ ...r, educatorIds: r.educatorIds.filter((x) => x !== id) });
      });
    }
    if (role === 'parent') {
      children.forEach((c) => {
        const has = c.guardianIds.includes(id);
        const want = childIds.includes(c.id);
        if (want && !has) actions.saveChild({ ...c, guardianIds: [...c.guardianIds, id] });
        if (!want && has) actions.saveChild({ ...c, guardianIds: c.guardianIds.filter((x) => x !== id) });
      });
    }

    navigation.replace('Done', { kind: 'user', id, created: !existing });
  };

  const remove = () => {
    if (!existing) return;
    actions.removeUser(existing.id);
    navigation.goBack();
  };

  return (
    <Screen header={<ScreenHeader title={existing ? 'Edit user' : 'New user'} subtitle={existing ? existing.email : 'Create an account and send an invitation'} />}>
      <TextField label="Full name" value={name} onChangeText={setName} placeholder="Patrícia Gomes" error={errors.name} />
      <TextField label="Email" icon="mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="patricia.gomes@colmeia.pt" error={errors.email} />
      <TextField label="Mobile" icon="phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+351 915 678 901" />

      <AppText variant="label" color="textSecondary">Role</AppText>
      <SegmentedControl value={role} onChange={setRole} options={[
        { value: 'admin', label: 'Administrator' },
        { value: 'educator', label: 'Educator' },
        { value: 'parent', label: 'Parent' },
      ]} />

      {role === 'educator' && (
        <>
          <AppText variant="label" color="textSecondary">Assigned room</AppText>
          <OptionGroup value={roomId} onChange={setRoomId} options={rooms.map((r) => ({ value: r.id, label: r.name }))} />
          <Card>
            <AppText variant="bodyStrong">Permissions</AppText>
            {(Object.keys(permissionLabels) as Permission[]).map((p) => (
              <View key={p} style={styles.switchRow}>
                <AppText variant="small" style={styles.flex}>{permissionLabels[p]}</AppText>
                <Switch value={permissions.includes(p)} onValueChange={() => setPermissions(toggle(permissions, p))} />
              </View>
            ))}
          </Card>
        </>
      )}

      {role === 'parent' && (
        <>
          <AppText variant="label" color="textSecondary">Linked children</AppText>
          <View style={styles.wrap}>
            {children.map((c) => (
              <Chip key={c.id} label={c.name} tone="honey" selected={childIds.includes(c.id)} onPress={() => setChildIds(toggle(childIds, c.id))} />
            ))}
          </View>
        </>
      )}

      {existing ? (
        <View style={styles.switchRow}>
          <IconTile icon="lock" tone="red" size={40} />
          <View style={styles.flex}>
            <AppText variant="bodyStrong">Block account</AppText>
            <AppText variant="small" color="textSecondary">The user can no longer sign in</AppText>
          </View>
          <Switch value={blocked} onValueChange={setBlocked} disabled={existing.id === me?.id} />
        </View>
      ) : (
        <View style={styles.switchRow}>
          <IconTile icon="mail" tone="blue" size={40} />
          <View style={styles.flex}>
            <AppText variant="bodyStrong">Send invitation by email</AppText>
            <AppText variant="small" color="textSecondary">The user sets their own password</AppText>
          </View>
          <Switch value={invite} onValueChange={setInvite} />
        </View>
      )}

      <Button title={existing ? 'Save changes' : 'Create user'} icon={existing ? 'check' : 'plus'} fullWidth onPress={save} />

      {canRemove && !confirmRemove && (
        <Button title="Remove user" icon="trash" variant="danger" fullWidth onPress={() => setConfirmRemove(true)} />
      )}

      {canRemove && confirmRemove && (
        <Card style={styles.confirm}>
          <AppText variant="bodyStrong">Remove {existing.name}?</AppText>
          <AppText variant="small" color="textSecondary">
            The account is deleted and unlinked from rooms and children. This cannot be undone.
          </AppText>
          <View style={styles.confirmActions}>
            <Button title="Cancel" variant="secondary" onPress={() => setConfirmRemove(false)} style={styles.flex} />
            <Button title="Remove" icon="trash" variant="dangerSolid" onPress={remove} style={styles.flex} />
          </View>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxs },
  confirm: { borderColor: colors.danger },
  confirmActions: { flexDirection: 'row', gap: spacing.sm },
});
