import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Card, Chip, Icon, IconButton, IconTile, LinkText, Screen, type AvatarName, type IconName } from '@/components';
import { formatCurrency, formatMonth, getChild, getGuardians, getPaidAmount, getRoom, getUser, useData } from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { colors, spacing } from '@/theme';
import { roleView } from './UsersScreen';

const permissionNames = { diary: 'Diary', announcements: 'announcements', portfolio: 'portfolio', billing: 'billing' } as const;

export function DoneScreen({ navigation, route }: AdminStackScreenProps<'Done'>) {
  const { data } = useData();
  const { kind, id, created } = route.params;

  const backToList = (screen: 'Users' | 'Children' | 'Invoices') => navigation.popTo('AdminDrawer', { screen });

  let title = '';
  let message = '';
  let summary: ReactNode = null;
  let actions: ReactNode = null;

  if (kind === 'user') {
    const user = getUser(data, id);
    if (!user) return null;
    const room = data.rooms.find((r) => r.educatorIds.includes(user.id));
    title = 'User saved';
    message = created && user.invitedAt
      ? `${user.name} can now use Colmeia Kids. We sent an invitation to ${user.email} to set a password.`
      : `The changes to ${user.name} were saved.`;
    summary = (
      <Card>
        <Row avatar={user.avatar} title={user.name} subtitle={user.email} right={<Chip small label={roleView[user.role].label} tone={roleView[user.role].tone} />} />
        {room && <Row icon="door" title="Room" subtitle={room.name} />}
        {user.permissions && <Row icon="check" title="Permissions" subtitle={user.permissions.map((p) => permissionNames[p]).join(', ')} />}
        {created && user.invitedAt && <Row icon="mail" title="Invitation" subtitle="Sent just now · expires in 7 days" right={<Chip small label="Sent" tone="green" icon="check" />} />}
      </Card>
    );
    actions = (
      <>
        <Button title="View user" icon="user" fullWidth onPress={() => navigation.replace('UserForm', { userId: user.id })} />
        <Button title="Back to users" icon="back" variant="secondary" fullWidth onPress={() => backToList('Users')} />
        <LinkText label="+ Create another user" onPress={() => navigation.replace('UserForm', {})} center />
      </>
    );
  }

  if (kind === 'child') {
    const child = getChild(data, id);
    if (!child) return null;
    title = created ? 'Child enrolled' : 'Enrolment saved';
    message = `${child.name} is ${created ? 'now enrolled in' : 'in'} the ${getRoom(data, child.roomId)?.name} room.`;
    summary = (
      <Card>
        <Row avatar={child.avatar} title={child.name} subtitle={`${getRoom(data, child.roomId)?.name} room`} />
        <Row icon="users" title="Parents" subtitle={getGuardians(data, child).map((g) => g.name).join(', ') || 'No parent linked yet'} />
        <Row icon="euro" title="Monthly fee" subtitle={formatCurrency(child.monthlyFee)} />
      </Card>
    );
    actions = (
      <>
        <Button title="Back to children" icon="back" fullWidth onPress={() => backToList('Children')} />
        <LinkText label="+ Enrol another child" onPress={() => navigation.replace('ChildForm', {})} center />
      </>
    );
  }

  if (kind === 'invoice' || kind === 'payment' || kind === 'reminder') {
    const invoice = data.invoices.find((i) => i.id === id);
    if (!invoice) return null;
    const child = getChild(data, invoice.childId);
    const parent = child ? getGuardians(data, child)[0] : undefined;
    const last = invoice.payments.at(-1);
    title = { invoice: 'Invoice created', payment: 'Payment confirmed', reminder: 'Reminder sent' }[kind];
    message = {
      invoice: `${invoice.number} was created${parent ? ` and sent to ${parent.name}` : ''}.`,
      payment: `${formatCurrency(last?.amount ?? 0)} received for ${invoice.number}.${getPaidAmount(invoice) >= invoice.amount ? ' The invoice is now paid.' : ''}`,
      reminder: parent ? `${parent.name} got a payment reminder for ${invoice.number}.` : 'There is no parent linked to notify.',
    }[kind];
    summary = (
      <Card>
        <Row icon="file" title={`${invoice.number} · ${formatMonth(invoice.month)}`} subtitle={child?.name ?? ''} right={<AppText variant="bodyStrong">{formatCurrency(invoice.amount)}</AppText>} />
      </Card>
    );
    actions = (
      <>
        <Button title="View invoice" icon="file" fullWidth onPress={() => navigation.replace('InvoiceDetails', { invoiceId: invoice.id })} />
        <Button title="Back to invoices" icon="back" variant="secondary" fullWidth onPress={() => backToList('Invoices')} />
      </>
    );
  }

  return (
    <Screen>
      <View style={styles.close}>
        <IconButton icon="x" accessibilityLabel="Close" onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.hero}>
        <View style={styles.circle}>
          <View style={styles.inner}>
            <Icon name="check" size={36} color={colors.textOnPrimary} />
          </View>
        </View>
        <AppText variant="screenTitle" accessibilityRole="header">{title}</AppText>
        <AppText color="textSecondary" style={styles.center}>{message}</AppText>
      </View>
      {summary}
      <View style={styles.actions}>{actions}</View>
    </Screen>
  );
}

function Row({ title, subtitle, avatar, icon, right }: { title: string; subtitle: string; avatar?: AvatarName; icon?: IconName; right?: ReactNode }) {
  return (
    <View style={styles.row}>
      {avatar ? <Avatar name={avatar} size={44} /> : <IconTile icon={icon ?? 'check'} tone="blue" size={36} />}
      <View style={styles.flex}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="small" color="textSecondary">{subtitle}</AppText>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  close: { alignItems: 'flex-end', paddingTop: spacing.xs },
  hero: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md },
  circle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  inner: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  actions: { gap: spacing.sm, marginTop: spacing.md },
});
