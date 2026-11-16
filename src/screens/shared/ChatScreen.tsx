import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Linking, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { AppText, Avatar, CoverImage, Icon, IconButton } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { dateFromDateTime, formatRelativeDay, getMessages, getRoom, getUser, timeFromDateTime, useData } from '@/data';
import { colors, radius, spacing, typography } from '@/theme';
import { conversationTitle } from './presentation';

type ChatScreenProps = { route: { params: { conversationId: string } } };

export function ChatScreen({ route }: ChatScreenProps) {
  const navigation = useNavigation();
  const { data, actions } = useData();
  const { user } = useCurrentUser();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const { conversationId } = route.params;
  const conversation = data.conversations.find((c) => c.id === conversationId);
  const messages = getMessages(data, conversationId);
  const other = getUser(data, conversation?.participantIds.find((id) => id !== user.id) ?? '');

  useEffect(() => {
    actions.markConversationRead(conversationId, user.id);
  }, [actions, conversationId, user.id, messages.length]);

  if (!conversation) return null;

  const send = () => {
    if (!text.trim()) return;
    actions.sendMessage(conversationId, user.id, text);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const subtitle =
    conversation.type === 'direct'
      ? other?.role === 'educator'
        ? `${getRoom(data, conversation.roomId ?? '')?.name} room educator`
        : 'Parent'
      : conversation.type === 'room'
        ? 'Room announcements'
        : 'Daycare';

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon="back" accessibilityLabel="Back" onPress={() => navigation.goBack()} />
        <Avatar name={other?.avatar ?? 'admin'} size={40} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong" numberOfLines={1}>{conversationTitle(conversation, user.id, data.users)}</AppText>
          <AppText variant="caption" color="textSecondary">{subtitle}</AppText>
        </View>
        {other?.phone && (
          <IconButton icon="phone" accessibilityLabel={`Call ${other.name}`} onPress={() => Linking.openURL(`tel:${other.phone}`)} />
        )}
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item, index }) => {
            const mine = item.senderId === user.id;
            const day = dateFromDateTime(item.sentAt);
            const showDay = index === 0 || dateFromDateTime(messages[index - 1].sentAt) !== day;
            return (
              <View>
                {showDay && (
                  <View style={styles.dayChip}>
                    <AppText variant="caption" color="textSecondary">{formatRelativeDay(day)}</AppText>
                  </View>
                )}
                {item.attachment ? (
                  <View style={[styles.photo, mine && styles.alignEnd]}>
                    <CoverImage cover={item.attachment.cover} width={200} height={130} iconSize={44} badge="Photo" rounded={radius.lg} />
                  </View>
                ) : (
                  <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                    <AppText color={mine ? 'textOnPrimary' : 'text'}>{item.text}</AppText>
                    <AppText variant="caption" color={mine ? 'textOnPrimary' : 'textSecondary'} style={styles.time}>
                      {timeFromDateTime(item.sentAt)}
                    </AppText>
                  </View>
                )}
              </View>
            );
          }}
        />

        <View style={styles.composer}>
          <Pressable
            onPress={() => Alert.alert('Attachments', 'Sending photos needs the camera/gallery — not part of this prototype.')}
            accessibilityRole="button"
            accessibilityLabel="Attach file"
            style={styles.round}
          >
            <Icon name="clip" size={20} />
          </Pressable>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Write a message..."
            placeholderTextColor={colors.textTertiary}
            style={[typography.body, styles.input]}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Pressable
            onPress={send}
            disabled={!text.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send"
            style={[styles.round, styles.send, !text.trim() && { opacity: 0.5 }]}
          >
            <Icon name="send" size={20} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  list: { padding: spacing.md, gap: spacing.sm },
  dayChip: {
    alignSelf: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  bubble: { maxWidth: '80%', padding: spacing.sm, borderRadius: radius.md, gap: 2 },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  time: { alignSelf: 'flex-end', opacity: 0.8 },
  photo: { alignSelf: 'flex-start' },
  alignEnd: { alignSelf: 'flex-end' },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    color: colors.text,
    outlineWidth: 0,
  },
  round: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  send: { backgroundColor: colors.accent, borderColor: colors.accent },
});
