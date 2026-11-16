import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Icon, LinkText, Screen, ScreenHeader, TextField } from '@/components';
import { isEmailTaken, isValidEmail, useData } from '@/data';
import type { AuthScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';

export function PasswordRecoveryScreen({ navigation, route }: AuthScreenProps<'PasswordRecovery'>) {
  const { data } = useData();
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    if (!isValidEmail(email)) return setError('Enter a valid email address.');
    if (!isEmailTaken(data.users, email)) return setError('There is no account with this email.');
    setError(null);
    setSentTo(email.trim());
  };

  return (
    <Screen header={<ScreenHeader title="Recover access" />}>
      <View style={styles.intro}>
        <Icon name="send" size={64} color={colors.info} />
        <AppText variant="screenTitle">Forgot your password?</AppText>
        <AppText color="textSecondary" style={styles.center}>
          Enter the email linked to your account. We'll send you a link to set a new password.
        </AppText>
      </View>

      <TextField
        label="Email"
        icon="mail"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          setError(null);
          setSentTo(null);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        error={error ?? undefined}
      />
      <Button title="Send recovery link" icon="send" fullWidth onPress={handleSend} />

      {sentTo && (
        <View style={styles.success} accessibilityLiveRegion="polite">
          <Icon name="check" size={20} color={colors.success} />
          <View style={styles.flex}>
            <AppText variant="bodyStrong">Email sent</AppText>
            <AppText variant="small" color="textSecondary">
              Check the inbox for {sentTo}. The link expires in 60 minutes.
            </AppText>
          </View>
        </View>
      )}

      <LinkText label="Back to sign in" onPress={() => navigation.goBack()} center />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md },
  center: { textAlign: 'center' },
  flex: { flex: 1 },
  success: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
  },
});
