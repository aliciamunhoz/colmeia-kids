import { Pressable, StyleSheet } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

import { Chip, Icon, IconButton, ScreenHeader } from '@/components';
import type { AdminDrawerParamList, AdminStackParamList } from '@/navigation/types';
import { colors, spacing, tones } from '@/theme';
import type { Room } from '@/types/models';

export function AdminHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  const navigation = useNavigation<DrawerNavigationProp<AdminDrawerParamList>>();
  const stack = navigation.getParent<NavigationProp<AdminStackParamList>>();
  return (
    <ScreenHeader
      title={title}
      subtitle={subtitle}
      left={<IconButton icon="menu" accessibilityLabel="Open menu" onPress={() => navigation.openDrawer()} />}
      right={right ?? <IconButton icon="search" accessibilityLabel="Search" onPress={() => stack?.navigate('Search')} />}
    />
  );
}

export function Fab({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}>
      <Icon name="plus" size={26} />
    </Pressable>
  );
}

export const roomBarColor = (room: Room) => (room.tone === 'honey' ? colors.accent : tones[room.tone].foreground);

export function RoomPill({ room }: { room?: Room }) {
  if (!room) return null;
  return <Chip small label={room.name} tone={room.tone} />;
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 6px 14px 0px rgba(255, 194, 26, 0.45)',
  },
});
