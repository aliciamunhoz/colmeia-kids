import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Card, Chip, Icon, IconTile, LinkText, Screen, ScreenHeader, Switch, TextField } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import {
  formatCurrency, formatMonth, getChildrenInDaycare, getGuardians, getRoom, nowDateTime, parseDisplayDate, shiftMonth, TODAY, toDisplayDate, useData,
} from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import type { Child, InvoiceItem, PaymentMethod } from '@/types/models';

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'mbway', label: 'MB Way' },
  { value: 'transfer', label: 'Bank transfer' },
  { value: 'debit', label: 'Direct debit' },
];

function defaultItems(child: Child, prices: { fullTime: number; halfDay: number; meals: number }): InvoiceItem[] {
  const items: InvoiceItem[] = [
    { label: 'Monthly fee', detail: child.feePlan === 'halfDay' ? 'Half-day' : 'Full-time', amount: child.feePlan === 'halfDay' ? prices.halfDay : prices.fullTime },
  ];
  if (child.mealsIncluded) items.push({ label: 'Meals', detail: 'Lunch and snacks', amount: prices.meals });
  return items;
}

export function NewInvoiceScreen({ navigation, route }: AdminStackScreenProps<'NewInvoice'>) {
  const { data, actions } = useData();
  const { daycare, user } = useCurrentUser();
  const children = getChildrenInDaycare(data, daycare.id);
  const month = shiftMonth(TODAY.slice(0, 7), 1);

  const [childId, setChildId] = useState(route.params?.childId ?? children[0]?.id);
  const [picking, setPicking] = useState(false);
  const child = children.find((c) => c.id === childId);
  const [items, setItems] = useState<InvoiceItem[]>(() => (child ? defaultItems(child, daycare.prices) : []));
  const [due, setDue] = useState(toDisplayDate(`${month}-08`));
  const [methods, setMethods] = useState<PaymentMethod[]>(['mbway', 'transfer']);
  const [sendNow, setSendNow] = useState(true);
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!child) return null;
  const parent = getGuardians(data, child)[0];
  const total = items.reduce((s, i) => s + i.amount, 0);

  const pickChild = (c: Child) => {
    setChildId(c.id);
    setItems(defaultItems(c, daycare.prices));
    setPicking(false);
  };

  const addItem = () => {
    const amount = Number(newAmount.replace(',', '.'));
    if (!newLabel.trim() || !Number.isFinite(amount) || amount <= 0) return setError('Item needs a name and a positive amount.');
    setItems([...items, { label: newLabel.trim(), detail: 'Extra', amount }]);
    setNewLabel('');
    setNewAmount('');
    setError(null);
  };

  const create = () => {
    const dueIso = parseDisplayDate(due);
    if (!dueIso) return setError('Due date must be DD/MM/YYYY.');
    if (items.length === 0) return setError('Add at least one item.');
    if (methods.length === 0) return setError('Choose at least one payment method.');
    const last = Math.max(...data.invoices.map((i) => Number(i.number.split('/')[1]) || 0));
    const id = actions.createInvoice({
      number: `FT ${month.slice(0, 4)}/${String(last + 1).padStart(4, '0')}`,
      childId: child.id,
      month,
      description: items.map((i) => i.label).join(' + '),
      amount: total,
      dueDate: dueIso,
      items,
      issuedAt: nowDateTime(),
      issuedBy: user.id,
      methods,
    });
    if (sendNow) actions.notify(child.guardianIds, 'invoice', 'New invoice', `${formatMonth(month).split(' ')[0]} fee · ${formatCurrency(total)}`);
    navigation.replace('Done', { kind: 'invoice', id });
  };

  return (
    <Screen header={<ScreenHeader title="New invoice" subtitle={`${formatMonth(month)} · ${daycare.name}`} />}>
      <AppText variant="label" color="textSecondary">Child</AppText>
      <Pressable onPress={() => setPicking((v) => !v)} accessibilityRole="button" accessibilityLabel="Choose child" style={styles.picker}>
        <Avatar name={child.avatar} size={40} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">{child.name}</AppText>
          <AppText variant="caption" color="textSecondary">{getRoom(data, child.roomId)?.name}{parent ? ` · billed to ${parent.name}` : ''}</AppText>
        </View>
        <Icon name="chevdown" size={20} />
      </Pressable>
      {picking && (
        <Card style={styles.list}>
          {children.map((c) => (
            <Pressable key={c.id} onPress={() => pickChild(c)} accessibilityRole="button" style={styles.option}>
              <Avatar name={c.avatar} size={28} />
              <AppText variant={c.id === child.id ? 'bodyStrong' : 'body'}>{c.name}</AppText>
            </Pressable>
          ))}
        </Card>
      )}

      <View style={styles.row}>
        <View style={styles.flex}><TextField label="Period" icon="calendar" value={formatMonth(month)} editable={false} /></View>
        <View style={styles.flex}><TextField label="Due date" icon="clock" value={due} onChangeText={setDue} /></View>
      </View>

      <Card>
        <AppText variant="bodyStrong">Items</AppText>
        {items.map((item, i) => (
          <View key={`${item.label}-${i}`} style={styles.item}>
            <View style={styles.flex}>
              <AppText>{item.label}</AppText>
              <AppText variant="caption" color="textSecondary">{item.detail}</AppText>
            </View>
            <AppText variant="bodyStrong">{formatCurrency(item.amount)}</AppText>
            <Pressable onPress={() => setItems(items.filter((_, j) => j !== i))} accessibilityLabel={`Remove ${item.label}`} hitSlop={8}>
              <Icon name="x" size={16} color={colors.textTertiary} />
            </Pressable>
          </View>
        ))}
        <View style={styles.row}>
          <View style={styles.flex}><TextField value={newLabel} onChangeText={setNewLabel} placeholder="Enrolment fee" /></View>
          <View style={styles.amountField}><TextField value={newAmount} onChangeText={setNewAmount} placeholder="€" keyboardType="decimal-pad" /></View>
        </View>
        <LinkText label="+ Add item" onPress={addItem} />
        <View style={[styles.item, styles.total]}>
          <AppText variant="section" style={styles.flex}>Total</AppText>
          <AppText variant="section">{formatCurrency(total)}</AppText>
        </View>
      </Card>

      <AppText variant="label" color="textSecondary">Payment methods</AppText>
      <View style={styles.wrap}>
        {METHODS.map((m) => (
          <Chip
            key={m.value}
            label={m.label}
            tone="blue"
            icon={methods.includes(m.value) ? 'check' : undefined}
            selected={methods.includes(m.value)}
            onPress={() => setMethods((ms) => (ms.includes(m.value) ? ms.filter((x) => x !== m.value) : [...ms, m.value]))}
          />
        ))}
      </View>

      <View style={styles.row}>
        <IconTile icon="bell" tone="blue" size={40} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">Send to parent now</AppText>
          <AppText variant="small" color="textSecondary">{parent ? `${parent.name} gets a "New invoice" notification` : 'No parent linked to this child'}</AppText>
        </View>
        <Switch value={sendNow} onValueChange={setSendNow} />
      </View>

      {error && <AppText variant="small" color="danger">{error}</AppText>}
      <Button title="Create invoice" icon="file" fullWidth onPress={create} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  picker: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  list: { gap: 0, padding: spacing.xs },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.xs },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
  total: { borderBottomWidth: 0 },
  amountField: { width: 90 },
});
