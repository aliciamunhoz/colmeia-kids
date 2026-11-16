import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Card, IconButton, IconTile, Screen, TextField } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { formatCurrency, formatMonth, getChildrenInDaycare, getInvoicesForDaycare, shiftMonth, TODAY, useData } from '@/data';
import { colors, spacing } from '@/theme';
import type { Child } from '@/types/models';
import { AdminHeader } from './AdminParts';

const planText = (c: Child) =>
  `${c.feePlan === 'halfDay' ? 'Half-day' : 'Full-time'}${c.mealsIncluded ? ' + meals' : ''}`;

export function MonthlyFeesScreen() {
  const { data, actions } = useData();
  const { daycare } = useCurrentUser();
  const [query, setQuery] = useState('');
  const [editingPrices, setEditingPrices] = useState(false);
  const [prices, setPrices] = useState({ ...daycare.prices });
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [feeText, setFeeText] = useState('');
  const [generated, setGenerated] = useState<string | null>(null);

  const children = getChildrenInDaycare(data, daycare.id).filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const nextMonth = shiftMonth(TODAY.slice(0, 7), 1);
  const monthName = formatMonth(nextMonth).split(' ')[0];

  const savePrices = () => {
    actions.saveDaycare({ ...daycare, prices });
    setEditingPrices(false);
  };

  const saveFee = (child: Child) => {
    const value = Number(feeText.replace(',', '.'));
    if (Number.isFinite(value) && value >= 0) actions.saveChild({ ...child, monthlyFee: value });
    setEditingChild(null);
  };

  const generate = () => {
    const existing = new Set(getInvoicesForDaycare(data, daycare.id).filter((i) => i.month === nextMonth).map((i) => i.childId));
    const lastNumber = Math.max(...data.invoices.map((i) => Number(i.number.split('/')[1]) || 0));
    let n = lastNumber;
    let count = 0;
    getChildrenInDaycare(data, daycare.id)
      .filter((c) => !existing.has(c.id))
      .forEach((c) => {
        n += 1;
        count += 1;
        actions.createInvoice({
          number: `FT ${nextMonth.slice(0, 4)}/${String(n).padStart(4, '0')}`,
          childId: c.id,
          month: nextMonth,
          description: planText(c),
          amount: c.monthlyFee,
          dueDate: `${nextMonth}-08`,
          issuedAt: `${TODAY}T09:00`,
          methods: ['mbway', 'multibanco'],
        });
        actions.notify(c.guardianIds, 'invoice', 'New invoice', `${monthName} fee · ${formatCurrency(c.monthlyFee)}`);
      });
    setGenerated(count ? `${count} invoices created for ${monthName}.` : `All ${monthName} invoices already exist.`);
  };

  return (
    <Screen header={<AdminHeader title="Monthly fees" subtitle="Fees per child" />}>
      <Card>
        <View style={styles.row}>
          <IconTile icon="card" tone="green" size={40} />
          <View style={styles.flex}>
            <AppText variant="bodyStrong">Price list</AppText>
            <AppText variant="small" color="textSecondary">
              Full-time {formatCurrency(daycare.prices.fullTime)} · Half-day {formatCurrency(daycare.prices.halfDay)} · Meals {formatCurrency(daycare.prices.meals)}
            </AppText>
          </View>
        </View>
        {editingPrices ? (
          <>
            <View style={styles.row}>
              {(['fullTime', 'halfDay', 'meals'] as const).map((k) => (
                <View key={k} style={styles.flex}>
                  <TextField
                    label={{ fullTime: 'Full-time', halfDay: 'Half-day', meals: 'Meals' }[k]}
                    value={String(prices[k])}
                    onChangeText={(t) => setPrices({ ...prices, [k]: Number(t) || 0 })}
                    keyboardType="number-pad"
                  />
                </View>
              ))}
            </View>
            <Button title="Save price list" icon="check" fullWidth onPress={savePrices} />
          </>
        ) : (
          <Button title="Edit price list" icon="edit" variant="secondary" fullWidth onPress={() => setEditingPrices(true)} />
        )}
      </Card>

      <TextField label="Search" icon="search" value={query} onChangeText={setQuery} placeholder="Child's name" />

      <View>
        {children.map((c) => (
          <View key={c.id} style={styles.childRow}>
            <Avatar name={c.avatar} size={44} />
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{c.name}</AppText>
              <AppText variant="small" color="textSecondary">{planText(c)}</AppText>
            </View>
            {editingChild === c.id ? (
              <View style={styles.feeEdit}>
                <TextField value={feeText} onChangeText={setFeeText} keyboardType="decimal-pad" autoFocus onSubmitEditing={() => saveFee(c)} />
                <IconButton icon="check" accessibilityLabel="Save fee" onPress={() => saveFee(c)} />
              </View>
            ) : (
              <>
                <AppText variant="bodyStrong">{formatCurrency(c.monthlyFee)}</AppText>
                <IconButton icon="edit" accessibilityLabel={`Edit ${c.name} fee`} onPress={() => { setEditingChild(c.id); setFeeText(String(c.monthlyFee)); }} />
              </>
            )}
          </View>
        ))}
      </View>

      <Button title={`Generate ${monthName} invoices`} icon="file" variant="accent" fullWidth onPress={generate} />
      {generated && <AppText variant="small" color="success">{generated}</AppText>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  childRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  feeEdit: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, width: 150 },
});
