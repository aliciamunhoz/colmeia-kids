import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Chip, Icon, IconTile, Screen, ScreenHeader, Switch, TextField } from '@/components';
import { formatCurrency, formatMonth, formatShortDate, getChild, getGuardians, getInvoiceStatus, getPaidAmount, parseDisplayDate, TODAY, toDisplayDate, useData } from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { radius, spacing, tones } from '@/theme';
import type { PaymentMethod } from '@/types/models';
import { invoiceStatusPill } from '../shared/presentation';
import { methodLabel } from './InvoiceDetailsScreen';

const METHODS: PaymentMethod[] = ['mbway', 'multibanco', 'transfer', 'debit', 'cash'];

export function RecordPaymentScreen({ navigation, route }: AdminStackScreenProps<'RecordPayment'>) {
  const { data, actions } = useData();
  const invoice = data.invoices.find((i) => i.id === route.params.invoiceId);
  const due = invoice ? invoice.amount - getPaidAmount(invoice) : 0;

  const [amountText, setAmountText] = useState(due.toFixed(2));
  const [dateText, setDateText] = useState(toDisplayDate(TODAY));
  const [method, setMethod] = useState<PaymentMethod>('mbway');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!invoice) return null;
  const child = getChild(data, invoice.childId);
  const parent = child ? getGuardians(data, child)[0] : undefined;
  const pill = invoiceStatusPill[getInvoiceStatus(invoice)];

  const amount = Number(amountText.replace(',', '.'));
  const valid = Number.isFinite(amount) && amount > 0;
  const full = valid && amount >= due;

  const confirm = () => {
    const date = parseDisplayDate(dateText);
    if (!valid) return setError('Enter the amount received.');
    if (amount > due + 0.001) return setError(`The amount is higher than what is due (${formatCurrency(due)}).`);
    if (!date) return setError('Payment date must be DD/MM/YYYY.');
    actions.recordPayment(invoice.id, amount, method, { date, reference: reference.trim() || undefined, notes: notes.trim() || undefined });
    if (receipt && child) actions.notify(child.guardianIds, 'invoice', 'Payment received', `${invoice.number} · ${formatCurrency(amount)} · thank you!`);
    navigation.replace('Done', { kind: 'payment', id: invoice.id });
  };

  return (
    <Screen header={<ScreenHeader title="Record payment" subtitle={`${invoice.number} · ${child?.name ?? ''}`} />}>
      <Card>
        <View style={styles.row}>
          <IconTile icon="file" tone="honey" size={40} />
          <View style={styles.flex}>
            <AppText variant="bodyStrong">{invoice.number} · {formatMonth(invoice.month)}</AppText>
            <AppText variant="caption" color="textSecondary">{parent ? `Billed to ${parent.name} · ` : ''}due {formatShortDate(invoice.dueDate)}</AppText>
          </View>
          <View style={styles.right}>
            <AppText variant="bodyStrong">{formatCurrency(due)}</AppText>
            <Chip small label={pill.label} tone={pill.tone} />
          </View>
        </View>
      </Card>

      <View style={styles.row}>
        <View style={styles.flex}><TextField label="Amount received" icon="euro" value={amountText} onChangeText={(t) => { setAmountText(t); setError(null); }} keyboardType="decimal-pad" /></View>
        <View style={styles.flex}><TextField label="Payment date" icon="calendar" value={dateText} onChangeText={setDateText} /></View>
      </View>

      {valid && (
        <View style={[styles.info, { backgroundColor: full ? tones.green.background : tones.honey.background }]}>
          <Icon name={full ? 'check' : 'alert'} size={16} color={full ? tones.green.foreground : tones.honey.foreground} />
          <AppText variant="small">
            {full ? 'Full amount · invoice will be marked as paid' : `Partial payment · ${formatCurrency(due - amount)} will remain due`}
          </AppText>
        </View>
      )}

      <AppText variant="label" color="textSecondary">Payment method</AppText>
      <View style={styles.wrap}>
        {METHODS.map((m) => (
          <Chip key={m} label={methodLabel[m]} tone="blue" icon={method === m ? 'check' : undefined} selected={method === m} onPress={() => setMethod(m)} />
        ))}
      </View>

      <TextField label="Transaction reference" value={reference} onChangeText={setReference} placeholder="MBW 7F3K-29QL" autoCapitalize="characters" />
      <TextField label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="Paid by the mother through the app." />

      <View style={styles.row}>
        <IconTile icon="mail" tone="blue" size={40} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">Send receipt to parent</AppText>
          <AppText variant="small" color="textSecondary">PDF receipt by email and in the app</AppText>
        </View>
        <Switch value={receipt} onValueChange={setReceipt} />
      </View>

      {error && <AppText variant="small" color="danger">{error}</AppText>}
      <Button title="Confirm payment" icon="check" fullWidth onPress={confirm} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  right: { alignItems: 'flex-end', gap: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  info: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: spacing.sm, borderRadius: radius.sm },
});

