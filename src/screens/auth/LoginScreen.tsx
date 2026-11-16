import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Avatar, Button, Chip, LinkText, TextField } from '@/components';
import { useAuth } from '@/context/AuthContext';
import type { AuthScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';

export function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const { signIn, signInAs } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSignIn = () => {
    setError(signIn(email, password));
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <SafeAreaView edges={['top']} style={styles.hero}>
          <Avatar name="bee" size={130} />
          <AppText variant="display">
            Colmeia <AppText variant="display" style={{ color: colors.accent }}>Kids</AppText>
          </AppText>
          <AppText color="textSecondary">Care, follow and connect.</AppText>
        </SafeAreaView>

        <View style={styles.form}>
          <AppText variant="screenTitle">Welcome back</AppText>

          <TextField
            label="Email"
            icon="mail"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError(null);
            }}
            placeholder="ana.ferreira@email.pt"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <TextField
            label="Password"
            icon="lock"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError(null);
            }}
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            rightIcon="eye"
            rightIconLabel={showPassword ? 'Hide password' : 'Show password'}
            onRightIconPress={() => setShowPassword((v) => !v)}
            onSubmitEditing={canSubmit ? handleSignIn : undefined}
            error={error ?? undefined}
          />

          <View style={styles.forgot}>
            <LinkText label="Forgot password?" onPress={() => navigation.navigate('PasswordRecovery', { email })} />
          </View>

          <Button title="Sign in" icon="login" fullWidth disabled={!canSubmit} onPress={handleSignIn} />

          <View style={styles.shortcuts}>
            <Chip label="Parent" tone="honey" icon="user" onPress={() => signInAs('parent')} />
            <Chip label="Educator" tone="green" icon="users" onPress={() => signInAs('educator')} />
            <Chip label="Administration" tone="blue" icon="settings" onPress={() => signInAs('admin')} />
          </View>
          <AppText variant="caption" color="textSecondary" style={styles.center}>
            The profile is detected from the account. Shortcuts above are for the prototype only.
            {'\n'}Demo password: colmeia123
          </AppText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },
  hero: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingBottom: spacing.xl,
    paddingTop: spacing.xl,
    backgroundColor: colors.accentSoft,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  form: { padding: spacing.lg, gap: spacing.md },
  forgot: { alignItems: 'flex-end', marginTop: -spacing.xs },
  shortcuts: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: spacing.xs },
  center: { textAlign: 'center' },
});
