import type { ReactNode } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Card, Chip, Icon, IconButton, IconTile, Screen, ScreenHeader, type AvatarName, type IconName } from '@/components';
import {
  dateFromDateTime, daysBetweenDates, formatCurrency, formatDateTime, formatMonth, formatShortDate, getChild, getGuardians, getInvoiceStatus, getPaidAmount, getRoom, getUser, nowDateTime, TODAY, useData,
} from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import type { PaymentMethod } from '@/types/models';
import { invoiceStatusPill } from '../shared/presentation';

export const methodLabel: Record<PaymentMethod, string> = {
  mbway: 'MB Way', multibanco: 'Multibanco', transfer: 'Bank transfer', debit: 'Direct debit', card: 'Card', cash: 'Cash',
};

export function InvoiceDetailsScreen({ navigation, route }: AdminStackScreenProps<'InvoiceDetails'>) {
  const { data, actions } = useData();
  const invoice = data.invoices.find((i) => i.id === route.params.invoiceId);
  if (!invoice) return null;

  const child = getChild(data, invoice.childId);
  const parent = child ? getGuardians(data, child)[0] : undefined;
  const status = getInvoiceStatus(invoice);
  const pill = invoiceStatusPill[status];
  const due = invoice.amount - getPaidAmount(invoice);
  const days = daysBetweenDates(TODAY, invoice.dueDate);
  const issuer = invoice.issuedBy ? getUser(data, invoice.issuedBy) : undefined;
  const items = invoice.items ?? [{ label: invoice.description, detail: formatMonth(invoice.month), amount: invoice.amount }];

  const sendReminder = () => {
    if (!child) return;
    actions.updateInvoice({ ...invoice, reminders: [...(invoice.reminders ?? []), nowDateTime()] });
    actions.notify(child.guardianIds, 'invoice', 'Payment reminder', `${invoice.number} · ${formatCurrency(due)} due ${formatShortDate(invoice.dueDate)}`);
    navigation.navigate('Done', { kind: 'reminder', id: invoice.id });
  };

  const history: { icon: IconName; text: string; when: string }[] = [
    ...(invoice.issuedAt ? [{ icon: 'file' as const, text: `Created${issuer ? ` · ${issuer.name}` : ''}`, when: invoice.issuedAt }] : []),
    ...(invoice.reminders ?? []).map((r) => ({ icon: 'bell' as const, text: 'Reminder sent to parent', when: r })),
    ...invoice.payments.map((p) => ({ icon: 'euro' as const, text: `Payment ${formatCurrency(p.amount)} · ${methodLabel[p.method]}`, when: `${p.date}T00:00` })),
  ].sort((a, b) => a.when.localeCompare(b.when));

  return (
    <Screen
      header={
        <ScreenHeader
          title={invoice.number}
          subtitle={`Issued ${invoice.issuedAt ? formatShortDate(dateFromDateTime(invoice.issuedAt)) : '—'}${issuer ? ` · by ${issuer.name}` : ''}`}
          right={<IconButton icon="download" accessibilityLabel="Download PDF" onPress={() => Alert.alert('PDF', 'The PDF would be generated in the full app.')} />}
        />
      }
    >
      <View style={styles.due}>
        <View style={styles.between}>
          <AppText variant="overline" color="textOnPrimary">{status === 'paid' ? 'Paid' : 'Amount due'}</AppText>
          <Chip small label={pill.label} tone={pill.tone} />
        </View>
        <AppText variant="display" color="textOnPrimary">{formatCurrency(status === 'paid' ? invoice.amount : due)}</AppText>
        <AppText variant="small" color="textOnPrimary">
          Due date: <AppText variant="small" style={{ color: colors.accent }}>{formatShortDate(invoice.dueDate)}</AppText>
          {status !== 'paid' && ` · ${days >= 0 ? `in ${days} days` : `${-days} days late`}`}
        </AppText>
      </View>

      <Card>
        {parent && <Person avatar={parent.avatar} title={parent.name} subtitle={`${parent.email} · Parent`} />}
        {child && <Person avatar={child.avatar} title={child.name} subtitle={`${getRoom(data, child.roomId)?.name} · ${formatMonth(invoice.month)}`} />}
      </Card>

      <Card>
        <AppText variant="bodyStrong">Items</AppText>
        {items.map((item, i) => (
          <View key={i} style={styles.item}>
            <AppText variant="small" style={styles.flex}>{item.label} · {item.detail}</AppText>
            <AppText variant="bodyStrong">{formatCurrency(item.amount)}</AppText>
          </View>
        ))}
        <View style={styles.between}>
          <AppText variant="section">Total</AppText>
          <AppText variant="section">{formatCurrency(invoice.amount)}</AppText>
        </View>
      </Card>

      <View style={styles.row}>
        <IconTile icon="euro" tone="blue" size={40} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">{(invoice.methods ?? ['mbway', 'multibanco']).map((m) => methodLabel[m]).join(' / ')}</AppText>
          <AppText variant="small" color="textSecondary">Entity 21 234 · Ref. {invoice.number.replace(/\D/g, '').slice(0, 9)}</AppText>
        </View>
      </View>

      {history.length > 0 && (
        <Card>
          <AppText variant="bodyStrong">History</AppText>
          {history.map((h, i) => (
            <View key={i} style={styles.row}>
              <Icon name={h.icon} size={16} color={colors.textSecondary} />
              <AppText variant="small" color="textSecondary">{h.text} · {formatDateTime(h.when).replace(', 00:00', '')}</AppText>
            </View>
          ))}
        </Card>
      )}

      {status !== 'paid' && (
        <View style={styles.row}>
          <View style={styles.flex}><Button title="Send reminder" icon="bell" variant="secondary" fullWidth onPress={sendReminder} /></View>
          <View style={styles.flex}><Button title="Record payment" icon="check" fullWidth onPress={() => navigation.navigate('RecordPayment', { invoiceId: invoice.id })} /></View>
        </View>
      )}
    </Screen>
  );
}

function Person({ avatar, title, subtitle }: { avatar: AvatarName; title: string; subtitle: string }): ReactNode {
  return (
    <View style={styles.row}>
      <Avatar name={avatar} size={40} />
      <View style={styles.flex}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="small" color="textSecondary">{subtitle}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  due: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, gap: spacing.xxs },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
});
