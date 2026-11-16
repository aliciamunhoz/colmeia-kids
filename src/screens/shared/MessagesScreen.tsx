import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText, Avatar, IconButton, Screen, ScreenHeader, SegmentedControl, TextField, type AvatarName } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { formatWhen, getConversationsForUser, getRoom, getUser, useData } from '@/data';
import { colors, radius, spacing } from '@/theme';
import type { Conversation } from '@/types/models';
import { conversationTitle } from './presentation';

type Filter = 'all' | 'direct' | 'daycare';

const filtersByRole = {
  parent: [
    { value: 'all', label: 'All' },
    { value: 'direct', label: 'Educator' },
    { value: 'daycare', label: 'Daycare' },
  ],
  educator: [
    { value: 'direct', label: 'Parents' },
    { value: 'daycare', label: 'Daycare' },
  ],
} satisfies Record<'parent' | 'educator', { value: Filter; label: string }[]>;

export function MessagesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<{ Chat: { conversationId: string } }>>();
  const { data } = useData();
  const { user } = useCurrentUser();
  const filters = user.role === 'educator' ? filtersByRole.educator : filtersByRole.parent;
  const [filter, setFilter] = useState<Filter>(filters[0].value);
  const [query, setQuery] = useState('');

  const conversations = getConversationsForUser(data, user.id)
    .filter(({ conversation: c }) => filter === 'all' || (filter === 'direct' ? c.type === 'direct' : c.type !== 'direct'))
    .filter(({ conversation: c, lastMessage }) => {
      const q = query.trim().toLowerCase();
      return !q || c.title.toLowerCase().includes(q) || lastMessage?.text.toLowerCase().includes(q);
    });

  const describe = (c: Conversation): { avatar: AvatarName; context: string } => {
    const other = getUser(data, c.participantIds.find((id) => id !== user.id) ?? '');
    if (c.type === 'room') return { avatar: 'educator', context: 'Announcement' };
    if (c.type === 'daycare') return { avatar: other?.avatar ?? 'admin', context: 'Daycare' };
    if (other?.role === 'parent') {
      const child = data.children.find((ch) => ch.guardianIds.includes(other.id));
      const relation = child?.authorisedPickups.find((p) => p.name === other.name)?.relation.toLowerCase() ?? 'parent';
      return { avatar: other.avatar, context: child ? `${child.name.split(' ')[0]}'s ${relation}` : 'Parent' };
    }
    return { avatar: other?.avatar ?? 'educator', context: `${getRoom(data, c.roomId ?? '')?.name ?? ''} room` };
  };

  const compose = () => {
    const first = getConversationsForUser(data, user.id).find((c) => c.conversation.type === 'direct');
    if (first) navigation.navigate('Chat', { conversationId: first.conversation.id });
  };

  return (
    <Screen header={<ScreenHeader back={false} title="Messages" right={<IconButton icon="edit" accessibilityLabel="New message" onPress={compose} />} />}>
      <TextField icon="search" placeholder="Search conversations" value={query} onChangeText={setQuery} />
      <SegmentedControl value={filter} onChange={setFilter} options={filters} />

      <View>
        {conversations.map(({ conversation, lastMessage, unread }) => {
          const { avatar, context } = describe(conversation);
          return (
            <Pressable
              key={conversation.id}
              onPress={() => navigation.navigate('Chat', { conversationId: conversation.id })}
              accessibilityRole="button"
              accessibilityLabel={`${conversationTitle(conversation, user.id, data.users)}${unread ? `, ${unread} unread` : ''}`}
              style={styles.row}
            >
              <Avatar name={avatar} size={48} />
              <View style={styles.flex}>
                <AppText numberOfLines={1}>
                  <AppText variant="bodyStrong">{conversationTitle(conversation, user.id, data.users)}</AppText>
                  <AppText variant="caption" color="textSecondary"> · {context}</AppText>
                </AppText>
                <AppText variant="small" color="textSecondary" numberOfLines={1}>
                  {lastMessage?.attachment ? '📷 Photo' : lastMessage?.text}
                </AppText>
              </View>
              <View style={styles.meta}>
                <AppText variant="label">{lastMessage ? formatWhen(lastMessage.sentAt) : ''}</AppText>
                {unread > 0 && (
                  <View style={styles.badge}>
                    <AppText variant="caption">{unread}</AppText>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
        {conversations.length === 0 && <AppText color="textSecondary" style={styles.empty}>No conversations found.</AppText>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  meta: { alignItems: 'flex-end', gap: 6 },
  badge: { minWidth: 22, height: 22, paddingHorizontal: 6, borderRadius: radius.pill, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', paddingVertical: spacing.xl },
});
