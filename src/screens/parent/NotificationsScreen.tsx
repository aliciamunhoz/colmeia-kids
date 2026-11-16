import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, IconTile, LinkText, Screen, ScreenHeader, SegmentedControl } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { formatWhen, getConversationsForUser, getNotifications, useData } from '@/data';
import type { HomeScreenProps } from '@/navigation/types';
import { colors, spacing } from '@/theme';
import type { AppNotification } from '@/types/models';
import { notificationView } from '../shared/presentation';

type Filter = 'all' | 'unread';

export function NotificationsScreen({ navigation }: HomeScreenProps<'Notifications'>) {
  const { data, actions } = useData();
  const { user } = useCurrentUser();
  const [filter, setFilter] = useState<Filter>('all');

  const all = getNotifications(data, user.id);
  const unreadCount = all.filter((n) => !n.read).length;
  const list = filter === 'unread' ? all.filter((n) => !n.read) : all;

  const open = (n: AppNotification) => {
    actions.markNotificationRead(n.id);
    switch (n.kind) {
      case 'message': {
        const direct = getConversationsForUser(data, user.id).find((c) => c.conversation.type === 'direct');
        return direct ? navigation.navigate('Chat', { conversationId: direct.conversation.id }) : navigation.navigate('ParentTabs', { screen: 'Messages' });
      }
      case 'photo':
        return navigation.navigate('Portfolio');
      case 'activity':
        return navigation.navigate('Activities');
      case 'invoice':
        return navigation.navigate('Payments');
      default:
        return;
    }
  };

  return (
    <Screen
      header={
        <ScreenHeader
          title="Notifications"
          right={unreadCount > 0 ? <LinkText label="Mark all read" onPress={() => actions.markAllNotificationsRead(user.id)} /> : undefined}
        />
      }
    >
      <SegmentedControl
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'unread', label: `Unread (${unreadCount})` },
        ]}
      />

      {list.length === 0 && (
        <AppText color="textSecondary" style={styles.empty}>You're all caught up 🎉</AppText>
      )}

      <View>
        {list.map((n) => {
          const view = notificationView[n.kind];
          return (
            <Pressable key={n.id} onPress={() => open(n)} accessibilityRole="button" style={styles.row}>
              <IconTile icon={view.icon} tone={view.tone} size={44} />
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{n.title}</AppText>
                <AppText variant="small" color="textSecondary" numberOfLines={1}>{n.body}</AppText>
              </View>
              <View style={styles.meta}>
                <AppText variant="caption" color="textSecondary">{formatWhen(n.date)}</AppText>
                {!n.read && <View style={styles.dot} accessibilityLabel="Unread" />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  empty: { textAlign: 'center', paddingVertical: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  meta: { alignItems: 'flex-end', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.info },
});
