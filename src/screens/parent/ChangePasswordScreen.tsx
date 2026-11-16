import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Icon, LinkText, Screen, ScreenHeader, TextField } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { TODAY, useData } from '@/data';
import type { ProfileScreenProps } from '@/navigation/types';
import { colors, radius, spacing, tones } from '@/theme';

const rules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'Passwords match', test: (p: string, confirm: string) => p.length > 0 && p === confirm },
];

export function ChangePasswordScreen({ navigation }: ProfileScreenProps<'ChangePassword'>) {
  const { actions } = useData();
  const { user } = useCurrentUser();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const results = rules.map((r) => r.test(next, confirm));
  const allOk = results.every(Boolean) && current.length > 0;

  const toggle = (field: keyof typeof visible) => () => setVisible((v) => ({ ...v, [field]: !v[field] }));

  const submit = () => {
    if (current !== user.password) return setError('The current password is not correct.');
    if (next === current) return setError('The new password must be different from the current one.');
    actions.saveUser({ ...user, password: next, passwordChangedAt: TODAY });
    navigation.goBack();
  };

  return (
    <Screen header={<ScreenHeader title="Change password" subtitle={`${user.name} · ${user.email}`} />}>
      <View style={styles.info}>
        <Icon name="shield" size={22} color={tones.purple.foreground} />
        <AppText variant="small" style={styles.flex}>For your security, enter your current password before choosing a new one.</AppText>
      </View>

      <TextField
        label="Current password"
        icon="lock"
        value={current}
        onChangeText={(t) => {
          setCurrent(t);
          setError(null);
        }}
        secureTextEntry={!visible.current}
        rightIcon="eye"
        rightIconLabel="Show current password"
        onRightIconPress={toggle('current')}
        error={error ?? undefined}
      />
      <TextField
        label="New password"
        icon="lock"
        value={next}
        onChangeText={setNext}
        secureTextEntry={!visible.next}
        rightIcon="eye"
        rightIconLabel="Show new password"
        onRightIconPress={toggle('next')}
      />
      <TextField
        label="Confirm new password"
        icon="lock"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry={!visible.confirm}
        rightIcon="eye"
        rightIconLabel="Show password confirmation"
        onRightIconPress={toggle('confirm')}
      />

      <Card>
        <AppText variant="label">Your new password must have</AppText>
        {rules.map((rule, i) => (
          <View key={rule.label} style={styles.rule}>
            <View style={[styles.check, results[i] && styles.checkOk]}>
              <Icon name="check" size={14} color={results[i] ? colors.success : colors.textTertiary} />
            </View>
            <AppText variant="small" color={results[i] ? 'text' : 'textSecondary'}>{rule.label}</AppText>
          </View>
        ))}
      </Card>

      <Button title="Update password" icon="check" fullWidth disabled={!allOk} onPress={submit} />
      <LinkText label="Forgot your current password?" onPress={() => setShowHint(true)} center />
      {showHint && (
        <AppText variant="small" color="textSecondary" style={styles.center}>
          Sign out and use “Forgot password?” on the sign-in screen to get a recovery link.
        </AppText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  info: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.highlightSoft },
  rule: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  check: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  checkOk: { backgroundColor: colors.successSoft },
});
