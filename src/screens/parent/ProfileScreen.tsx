import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Card, Chip, Icon, IconTile, LinkText, Screen, ScreenHeader, SectionHeader, Switch, TextField } from '@/components';
import { useAuth, useCurrentUser } from '@/context/AuthContext';
import { getRoom, isEmailTaken, isValidEmail, normalizeEmail, useData } from '@/data';
import type { ProfileScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { firstName, useSelectedChild } from './SelectedChildContext';

export function ProfileScreen({ navigation }: ProfileScreenProps<'Profile'>) {
  const { data, actions } = useData();
  const { user } = useCurrentUser();
  const { signOut } = useAuth();
  const { childrenList } = useSelectedChild();

  const [form, setForm] = useState({ address: user.address ?? '', phone: user.phone ?? '', email: user.email });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const dirty = form.address !== (user.address ?? '') || form.phone !== (user.phone ?? '') || form.email !== user.email;

  const update = (field: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
    setError(null);
  };

  const save = () => {
    if (!isValidEmail(form.email)) return setError('Enter a valid email address.');
    if (isEmailTaken(data.users, form.email, user.id)) return setError('This email is already used by another account.');
    actions.saveUser({ ...user, address: form.address.trim(), phone: form.phone.trim(), email: normalizeEmail(form.email) });
    setSaved(true);
  };

  return (
    <Screen header={<ScreenHeader back={false} title="Profile" />}>
      <View style={styles.identity}>
        <View>
          <Avatar name={user.avatar} size={96} />
          <View style={styles.camera}>
            <Icon name="camera" size={14} />
          </View>
        </View>
        <AppText variant="highlight">{user.name}</AppText>
        <View>
          <Chip small label="Parent / guardian" tone="honey" />
        </View>
      </View>

      <SectionHeader title="Children" />
      <View style={styles.children}>
        {childrenList.map((c) => (
          <Card key={c.id} style={styles.child}>
            <View style={styles.childRow}>
              <Avatar name={c.avatar} size={40} />
              <View>
                <AppText variant="bodyStrong">{firstName(c.name)}</AppText>
                <AppText variant="caption" color="textSecondary">{getRoom(data, c.roomId)?.name} room</AppText>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <SectionHeader title="Personal details" actionLabel={dirty ? 'Save' : undefined} onAction={save} />
      <TextField label="Address" icon="pin" value={form.address} onChangeText={update('address')} placeholder="Street, number, postcode" />
      <TextField label="Mobile" icon="phone" value={form.phone} onChangeText={update('phone')} keyboardType="phone-pad" />
      <TextField
        label="Email"
        icon="mail"
        value={form.email}
        onChangeText={update('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        error={error ?? undefined}
      />
      {dirty && <Button title="Save changes" icon="check" fullWidth onPress={save} />}
      {saved && !dirty && <AppText variant="small" color="success">Details saved ✓</AppText>}

      <Pressable onPress={() => navigation.navigate('ChangePassword')} accessibilityRole="button" style={styles.settingRow}>
        <IconTile icon="lock" tone="purple" size={40} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">Change password</AppText>
          <AppText variant="small" color="textSecondary">
            {user.passwordChangedAt ? `Last changed on ${user.passwordChangedAt}` : 'Never changed'}
          </AppText>
        </View>
        <Icon name="chevron" size={20} />
      </Pressable>

      <View style={styles.settingRow}>
        <IconTile icon="bell" tone="blue" size={40} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">Push notifications</AppText>
          <AppText variant="small" color="textSecondary">Messages, photos, invoices and notices</AppText>
        </View>
        <Switch
          value={user.pushNotifications ?? true}
          onValueChange={(value) => actions.saveUser({ ...user, pushNotifications: value })}
        />
      </View>

      <Button title="Sign out" icon="logout" variant="danger" fullWidth onPress={signOut} />
      <LinkText label="Reset demo data" onPress={actions.resetDemo} center />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  identity: { alignItems: 'center', gap: spacing.xs },
  camera: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  children: { flexDirection: 'row', gap: spacing.sm },
  child: { flex: 1, padding: spacing.sm },
  childRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderRadius: radius.sm,
  },
});
