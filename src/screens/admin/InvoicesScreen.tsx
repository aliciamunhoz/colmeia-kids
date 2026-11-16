import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Chip, IconButton, IconTile, Screen, SegmentedControl } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { formatCurrency, getChild, getInvoicesForDaycare, getInvoiceStatus, getPaidAmount, MONTHS, TODAY, useData } from '@/data';
import type { AdminDrawerScreenProps } from '@/navigation/types';
import { colors, radius, spacing, tones } from '@/theme';
import { invoiceStatusPill } from '../shared/presentation';
import { AdminHeader } from './AdminParts';

type Filter = 'all' | 'unpaid' | 'paid';

const shortMonth = (month: string) => MONTHS[Number(month.slice(5, 7)) - 1].slice(0, 3);

export function InvoicesScreen({ navigation }: AdminDrawerScreenProps<'Invoices'>) {
  const { data } = useData();
  const { daycare } = useCurrentUser();
  const [filter, setFilter] = useState<Filter>('all');

  const all = getInvoicesForDaycare(data, daycare.id);
  const list = all.filter((i) => {
    const s = getInvoiceStatus(i);
    return filter === 'all' || (filter === 'paid' ? s === 'paid' : s !== 'paid');
  });

  const month = all.reduce((m, i) => (i.month > m ? i.month : m), TODAY.slice(0, 7));
  const ofMonth = all.filter((i) => i.month === month);
  const open = all.filter((i) => getInvoiceStatus(i) !== 'paid');

  return (
    <Screen
      header={
        <AdminHeader
          title="Invoices"
          right={<IconButton icon="plus" accessibilityLabel="New invoice" onPress={() => navigation.navigate('NewInvoice')} />}
        />
      }
    >
      <View style={styles.stats}>
        <View style={[styles.stat, { backgroundColor: tones.blue.background }]}>
          <AppText variant="label" style={{ color: tones.blue.foreground }}>Invoiced {shortMonth(month)}</AppText>
          <AppText variant="screenTitle">{formatCurrency(ofMonth.reduce((s, i) => s + i.amount, 0))}</AppText>
          <AppText variant="caption" color="textSecondary">{ofMonth.length} invoices</AppText>
        </View>
        <View style={[styles.stat, { backgroundColor: tones.red.background }]}>
          <AppText variant="label" style={{ color: tones.red.foreground }}>Outstanding</AppText>
          <AppText variant="screenTitle">{formatCurrency(open.reduce((s, i) => s + i.amount - getPaidAmount(i), 0))}</AppText>
          <AppText variant="caption" color="textSecondary">{open.length} invoices</AppText>
        </View>
      </View>

      <SegmentedControl value={filter} onChange={setFilter} options={[
        { value: 'all', label: 'All' },
        { value: 'unpaid', label: 'Unpaid' },
        { value: 'paid', label: 'Paid' },
      ]} />

      <View>
        {list.map((invoice) => {
          const pill = invoiceStatusPill[getInvoiceStatus(invoice)];
          return (
            <Pressable
              key={invoice.id}
              onPress={() => navigation.navigate('InvoiceDetails', { invoiceId: invoice.id })}
              accessibilityRole="button"
              accessibilityLabel={`${invoice.number}, ${pill.label}`}
              style={styles.row}
            >
              <IconTile icon="file" tone="honey" size={44} />
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{getChild(data, invoice.childId)?.name}</AppText>
                <AppText variant="small" color="textSecondary">{invoice.number} · {shortMonth(invoice.month)}</AppText>
              </View>
              <View style={styles.amount}>
                <AppText variant="bodyStrong">{formatCurrency(invoice.amount)}</AppText>
                <Chip small label={pill.label} tone={pill.tone} />
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
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, padding: spacing.md, borderRadius: radius.lg, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  amount: { alignItems: 'flex-end', gap: 4 },
});
