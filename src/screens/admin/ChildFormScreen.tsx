import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Card, Chip, Icon, IconButton, IconTile, LinkText, OptionGroup, Screen, ScreenHeader, SectionHeader, SegmentedControl, Switch, TextField, type AvatarName, type IconName } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { formatCurrency, formatRelativeDay, getChild, getChildHistory, getRoomsForDaycare, getUsersForDaycare, isFutureDate, parseDisplayDate, TODAY, toDisplayDate, useData, type ChildHistoryItem } from '@/data';
import type { AdminStackScreenProps } from '@/navigation/types';
import { colors, radius, spacing, type Tone } from '@/theme';
import { describeRecord } from '../shared/presentation';

const AVATARS: AvatarName[] = ['child1', 'child2', 'child3', 'child4'];
const HISTORY_PAGE = 8;

function historyView(item: ChildHistoryItem): { icon: IconName; tone: Tone; title: string; subtitle?: string } {
  switch (item.kind) {
    case 'checkIn':
      return { icon: 'login', tone: 'green', title: 'Check-in', subtitle: `By ${item.byName}` };
    case 'checkOut':
      return { icon: 'logout', tone: 'blue', title: 'Check-out', subtitle: `By ${item.byName}` };
    case 'absence':
      return { icon: 'x', tone: 'red', title: 'Absent', subtitle: item.reason };
    case 'record': {
      const view = describeRecord(item.record);
      return { icon: view.icon, tone: view.tone, title: view.title, subtitle: view.subtitle };
    }
  }
}

export function ChildFormScreen({ navigation, route }: AdminStackScreenProps<'ChildForm'>) {
  const { data, actions } = useData();
  const { daycare } = useCurrentUser();
  const existing = route.params.childId ? getChild(data, route.params.childId) : undefined;
  const rooms = getRoomsForDaycare(data, daycare.id);
  const parents = getUsersForDaycare(data, daycare.id).filter((u) => u.role === 'parent');
  const prices = daycare.prices;

  const [avatar, setAvatar] = useState<AvatarName>(existing?.avatar ?? 'child1');
  const [name, setName] = useState(existing?.name ?? '');
  const [birth, setBirth] = useState(existing ? toDisplayDate(existing.birthDate) : '');
  const [start, setStart] = useState(toDisplayDate(existing?.startDate ?? TODAY));
  const [roomId, setRoomId] = useState(existing?.roomId ?? rooms[0]?.id ?? '');
  const [guardianIds, setGuardianIds] = useState<string[]>(existing?.guardianIds ?? []);
  const [allergies, setAllergies] = useState(existing?.allergies.join(', ') ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [plan, setPlan] = useState<'fullTime' | 'halfDay'>(existing?.feePlan ?? 'fullTime');
  const [meals, setMeals] = useState(existing?.mealsIncluded ?? true);
  const [errors, setErrors] = useState<{ name?: string; birth?: string; start?: string }>({});
  const [historyLimit, setHistoryLimit] = useState(HISTORY_PAGE);
  const history = existing ? getChildHistory(data, existing.id) : [];

  const monthlyFee = (plan === 'fullTime' ? prices.fullTime : prices.halfDay) + (meals ? prices.meals : 0);

  const save = () => {
    const birthIso = parseDisplayDate(birth);
    const startIso = parseDisplayDate(start);
    const next = {
      name: name.trim().length < 3 ? 'Enter the full name.' : undefined,
      birth: !birthIso ? 'Use DD/MM/YYYY.' : isFutureDate(birthIso) ? 'Cannot be in the future.' : undefined,
      start: !startIso ? 'Use DD/MM/YYYY.' : undefined,
    };
    setErrors(next);
    if (next.name || next.birth || next.start || !birthIso || !startIso) return;

    const id = actions.saveChild({
      ...(existing ?? { authorisedPickups: [] }),
      id: existing?.id,
      name: name.trim(),
      avatar,
      birthDate: birthIso,
      startDate: startIso,
      roomId,
      guardianIds,
      allergies: allergies.split(',').map((a) => a.trim()).filter(Boolean),
      notes: notes.trim() || undefined,
      feePlan: plan,
      mealsIncluded: meals,
      monthlyFee,
    });
    navigation.replace('Done', { kind: 'child', id, created: !existing });
  };

  return (
    <Screen
      header={
        <ScreenHeader
          title={existing ? 'Enrolment form' : 'New child'}
          subtitle={existing ? `Enrolled since ${existing.startDate ? toDisplayDate(existing.startDate) : '—'}` : 'Enrolment form'}
          right={existing ? <IconButton icon="file" accessibilityLabel="Create invoice" onPress={() => navigation.navigate('NewInvoice', { childId: existing.id })} /> : undefined}
        />
      }
    >
      <Pressable
        onPress={() => setAvatar(AVATARS[(AVATARS.indexOf(avatar) + 1) % AVATARS.length])}
        accessibilityRole="button"
        accessibilityLabel="Change child photo"
        style={styles.photoRow}
      >
        <View style={styles.photo}>
          {existing || name ? <Avatar name={avatar} size={72} /> : <Icon name="camera" size={26} />}
        </View>
        <View style={styles.flex}>
          <AppText variant="bodyStrong">{existing?.name ?? 'Child photo'}</AppText>
          <AppText variant="caption" color="textSecondary">Tap to change · visible to the room educators</AppText>
        </View>
      </Pressable>

      <TextField label="Full name" value={name} onChangeText={setName} placeholder="Gabriel Sousa" error={errors.name} />
      <View style={styles.row}>
        <View style={styles.flex}><TextField label="Date of birth" icon="calendar" value={birth} onChangeText={setBirth} placeholder="DD/MM/YYYY" error={errors.birth} /></View>
        <View style={styles.flex}><TextField label="Start date" icon="calendar" value={start} onChangeText={setStart} placeholder="DD/MM/YYYY" error={errors.start} /></View>
      </View>

      <AppText variant="label" color="textSecondary">Room</AppText>
      <OptionGroup value={roomId} onChange={setRoomId} options={rooms.map((r) => ({ value: r.id, label: r.name }))} />

      <SectionHeader title="Linked parents" />
      <View style={styles.wrap}>
        {parents.map((p) => (
          <Chip
            key={p.id}
            label={p.name}
            tone="honey"
            icon="user"
            selected={guardianIds.includes(p.id)}
            onPress={() => setGuardianIds((ids) => (ids.includes(p.id) ? ids.filter((x) => x !== p.id) : [...ids, p.id]))}
          />
        ))}
      </View>

      <TextField label="Allergies (comma separated)" value={allergies} onChangeText={setAllergies} placeholder="lactose, nuts" />
      <TextField label="Health information" value={notes} onChangeText={setNotes} placeholder="Sleeps with a dummy." multiline />

      <AppText variant="label" color="textSecondary">Fee plan</AppText>
      <SegmentedControl value={plan} onChange={setPlan} options={[
        { value: 'fullTime', label: `Full-time · ${formatCurrency(prices.fullTime)}` },
        { value: 'halfDay', label: `Half-day · ${formatCurrency(prices.halfDay)}` },
      ]} />
      <View style={styles.row}>
        <IconTile icon="utensils" tone="green" size={40} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">Meals included</AppText>
          <AppText variant="small" color="textSecondary">+ {formatCurrency(prices.meals)} per month</AppText>
        </View>
        <Switch value={meals} onValueChange={setMeals} />
      </View>
      <AppText variant="bodyStrong">Monthly fee: {formatCurrency(monthlyFee)}</AppText>

      <Button title={existing ? 'Save form' : 'Enrol child'} icon="check" fullWidth onPress={save} />

      {existing && (
        <>
          <SectionHeader title={`History (${history.length})`} />
          {history.length === 0 ? (
            <AppText color="textSecondary">No records yet.</AppText>
          ) : (
            <Card>
              {history.slice(0, historyLimit).map((item) => {
                const view = historyView(item);
                return (
                  <View key={item.key} style={styles.row}>
                    <IconTile icon={view.icon} tone={view.tone} size={36} />
                    <View style={styles.flex}>
                      <AppText variant="bodyStrong">{view.title}</AppText>
                      {view.subtitle ? (
                        <AppText variant="small" color="textSecondary" numberOfLines={1}>{view.subtitle}</AppText>
                      ) : null}
                    </View>
                    <AppText variant="caption" color="textSecondary">
                      {formatRelativeDay(item.date)}{item.time ? `, ${item.time}` : ''}
                    </AppText>
                  </View>
                );
              })}
              {history.length > historyLimit && (
                <LinkText label="Show more" onPress={() => setHistoryLimit((n) => n + HISTORY_PAGE)} center />
              )}
            </Card>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  photo: {
    width: 80, height: 80, borderRadius: radius.lg, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
});
