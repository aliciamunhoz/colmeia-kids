import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Chip, IconTile, Screen, ScreenHeader } from '@/components';
import { formatCurrency, formatMonth, formatShortDate, getInvoiceStatus, getParentBilling, TODAY, useData } from '@/data';
import { colors, radius, spacing } from '@/theme';
import { invoiceStatusPill } from '../shared/presentation';
import { firstName, useSelectedChild } from './SelectedChildContext';

const mbReference = (invoiceNumber: string) => {
  const digits = invoiceNumber.replace(/\D/g, '').padEnd(9, '0').slice(0, 9);
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
};

export function PaymentsScreen() {
  const { data, actions } = useData();
  const { child } = useSelectedChild();
  const [showReference, setShowReference] = useState(false);

  const billing = getParentBilling(data, child);
  const next = billing.nextDue;

  const payNow = () => {
    if (!next) return;
    actions.recordPayment(next.id, next.amount, 'mbway');
    setShowReference(false);
  };

  return (
    <Screen header={<ScreenHeader title="Payments" subtitle={firstName(child.name)} />}>
      <View style={styles.due}>
        <View style={styles.dueTop}>
          <View style={styles.flex}>
            <AppText variant="overline" color="textOnPrimary">Amount due</AppText>
            <AppText variant="display" color="textOnPrimary">{formatCurrency(billing.due.total)}</AppText>
          </View>
          <IconTile icon="card" tone="green" size={44} />
        </View>

        {next ? (
          <>
            <AppText variant="bodyStrong" color="textOnPrimary">
              Payment due: <AppText variant="bodyStrong" style={{ color: colors.accent }}>{formatShortDate(next.dueDate)}</AppText>
              {getInvoiceStatus(next) === 'overdue' && ' (overdue)'}
            </AppText>
            <Button
              title={showReference ? 'Hide reference' : 'View invoice and reference'}
              icon="file"
              variant="accent"
              fullWidth
              onPress={() => setShowReference((v) => !v)}
            />
          </>
        ) : (
          <AppText variant="bodyStrong" color="textOnPrimary">Everything is paid. Thank you! 🎉</AppText>
        )}

        {showReference && next && (
          <View style={styles.reference}>
            <Row label="Invoice" value={next.number} />
            <Row label="Entity" value="21 234" />
            <Row label="Reference" value={mbReference(next.number)} />
            <Row label="Amount" value={formatCurrency(next.amount)} />
            <Button title="Pay now with MB Way (demo)" icon="check" fullWidth onPress={payNow} />
          </View>
        )}
      </View>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <AppText variant="caption" color="textSecondary">Paid in {TODAY.slice(0, 4)}</AppText>
          <AppText variant="highlight">{formatCurrency(billing.paidThisYear)}</AppText>
        </Card>
        <Card style={styles.stat}>
          <AppText variant="caption" color="textSecondary">Monthly fee</AppText>
          <AppText variant="highlight">{formatCurrency(child.monthlyFee)}</AppText>
        </Card>
      </View>

      <View>
        {billing.invoices.map((invoice) => {
          const pill = invoiceStatusPill[getInvoiceStatus(invoice)];
          return (
            <View key={invoice.id} style={styles.invoice}>
              <IconTile icon="file" tone="honey" size={44} />
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{formatMonth(invoice.month)}</AppText>
                <AppText variant="small" color="textSecondary">{invoice.description}</AppText>
              </View>
              <View style={styles.amount}>
                <AppText variant="bodyStrong">{formatCurrency(invoice.amount)}</AppText>
                <Chip small label={pill.label} tone={pill.tone} />
              </View>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.refRow}>
      <AppText variant="small" color="textSecondary">{label}</AppText>
      <AppText variant="bodyStrong">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  due: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  dueTop: { flexDirection: 'row', alignItems: 'flex-start' },
  reference: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs },
  refRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, gap: 2 },
  invoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  amount: { alignItems: 'flex-end', gap: 4 },
});
