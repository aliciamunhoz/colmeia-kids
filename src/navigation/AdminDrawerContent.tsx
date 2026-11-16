import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

import { AppText, Avatar, Icon, type IconName } from '@/components';
import { useAuth, useCurrentUser } from '@/context/AuthContext';
import { colors, radius, spacing, touchTarget } from '@/theme';
import type { AdminDrawerParamList } from './types';

const menu: Record<keyof AdminDrawerParamList, { label: string; icon: IconName }> = {
  Dashboard: { label: 'Dashboard', icon: 'home' },
  Users: { label: 'Users and roles', icon: 'users' },
  Children: { label: 'Children', icon: 'heart' },
  Rooms: { label: 'Rooms', icon: 'door' },
  CheckIns: { label: 'Check-ins and check-outs', icon: 'qr' },
  MonthlyFees: { label: 'Monthly fees', icon: 'euro' },
  Invoices: { label: 'Invoices and payments', icon: 'file' },
  Announcements: { label: 'Announcements', icon: 'megaphone' },
};

export function AdminDrawerContent({ state, navigation }: DrawerContentComponentProps) {
  const { signOut, switchDaycare } = useAuth();
  const { user, daycare } = useCurrentUser();

  const nextDaycare = () => {
    const ids = user.daycareIds;
    switchDaycare(ids[(ids.indexOf(daycare.id) + 1) % ids.length]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brand}>
        <Avatar name="bee" size={44} />
        <AppText variant="highlight">
          Colmeia <AppText variant="highlight" style={{ color: colors.accent }}>Kids</AppText>
        </AppText>
      </View>

      <Pressable
        onPress={nextDaycare}
        disabled={user.daycareIds.length < 2}
        accessibilityRole="button"
        accessibilityLabel="Switch daycare"
        style={styles.daycare}
      >
        <View style={styles.daycareIcon}>
          <Icon name="building" size={20} color={colors.textOnPrimary} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color="textSecondary">Active daycare</AppText>
          <AppText variant="bodyStrong">{daycare.name} · {daycare.city}</AppText>
        </View>
        <Icon name="chevdown" size={20} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.menu}>
        {state.routes.map((route, index) => {
          const item = menu[route.name as keyof AdminDrawerParamList];
          const focused = state.index === index;
          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              style={[styles.menuItem, focused && styles.menuItemActive]}
            >
              <Icon name={item.icon} size={22} />
              <AppText variant="bodyStrong">{item.label}</AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Avatar name={user.avatar} size={40} />
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong">{user.name}</AppText>
          <AppText variant="caption" color="textSecondary">Administrator</AppText>
        </View>
        <Pressable onPress={signOut} accessibilityRole="button" accessibilityLabel="Sign out" style={styles.logout}>
          <Icon name="logout" size={20} color={colors.danger} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, paddingHorizontal: spacing.md },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md },
  daycare: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  daycareIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: { paddingVertical: spacing.xs, gap: spacing.xxs },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: touchTarget,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  menuItemActive: { backgroundColor: colors.accentSoft },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logout: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
