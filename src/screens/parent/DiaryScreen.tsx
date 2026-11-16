import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, Chip, Icon, IconButton, IconTile, Screen, ScreenHeader, type IconName } from '@/components';
import {
  dayOfMonth,
  getActivitiesForChild,
  getAttendance,
  getRecordsForChild,
  getWeekdays,
  TODAY,
  useData,
  WEEKDAYS_SHORT,
  weekdayIndex,
} from '@/data';
import type { DiaryScreenProps } from '@/navigation/types';
import { colors, radius, spacing, type Tone } from '@/theme';
import type { DailyRecord } from '@/types/models';
import { describeRecord } from '../shared/presentation';
import { firstName, useSelectedChild } from './SelectedChildContext';

type Filter = 'all' | 'meal' | 'sleep' | 'hygiene';

const filters: { value: Filter; label: string; tone: Tone; icon?: IconName }[] = [
  { value: 'all', label: 'All', tone: 'blue' },
  { value: 'meal', label: 'Meals', tone: 'honey', icon: 'utensils' },
  { value: 'sleep', label: 'Sleep', tone: 'blue', icon: 'moon' },
  { value: 'hygiene', label: 'Hygiene', tone: 'blue', icon: 'droplet' },
];

type TimelineItem = {
  key: string;
  time: string;
  kind: Filter | 'other';
  icon: IconName;
  tone: Tone;
  title: string;
  subtitle?: string;
  pill?: { label: string; tone: Tone; icon?: IconName };
  onPress?: () => void;
};

export function DiaryScreen({ navigation, route }: DiaryScreenProps<'Diary'>) {
  const { data } = useData();
  const { child, room } = useSelectedChild();
  const [date, setDate] = useState(route.params?.date ?? TODAY);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (route.params?.date) setDate(route.params.date);
  }, [route.params?.date]);

  const attendance = getAttendance(data, child.id, date);
  const records = getRecordsForChild(data, child.id, date);
  const notes = records.filter((r): r is Extract<DailyRecord, { type: 'note' }> => r.type === 'note');

  const items: TimelineItem[] = [];
  if (attendance?.checkIn) {
    items.push({
      key: 'in', time: attendance.checkIn.time, kind: 'other', icon: 'qr', tone: 'purple', title: 'Check-in recorded',
      subtitle: `By ${attendance.checkIn.byName} · via ${attendance.checkIn.method === 'qr' ? 'QR code' : 'educator'}`,
    });
  }
  if (attendance?.checkOut) {
    items.push({
      key: 'out', time: attendance.checkOut.time, kind: 'other', icon: 'logout', tone: 'purple', title: 'Check-out recorded',
      subtitle: `By ${attendance.checkOut.byName}`,
    });
  }
  records
    .filter((r) => r.type !== 'note')
    .forEach((r) => {
      const view = describeRecord(r);
      items.push({ key: r.id, time: r.time, kind: r.type === 'meal' || r.type === 'sleep' || r.type === 'hygiene' ? r.type : 'other', ...view });
    });
  getActivitiesForChild(data, child.id)
    .filter((a) => a.date === date)
    .forEach((a) =>
      items.push({
        key: a.id, time: a.time, kind: 'other', icon: 'palette', tone: 'honey', title: a.title,
        subtitle: a.description.split('.')[0],
        pill: { label: 'View activity', tone: 'honey' },
        onPress: () => navigation.navigate('HomeTab', { screen: 'ActivityDetail', params: { activityId: a.id } }),
      }),
    );

  const visible = items
    .filter((i) => filter === 'all' || i.kind === filter)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Screen
      header={
        <ScreenHeader
          back={false}
          title="Diary"
          subtitle={`${firstName(child.name)} · ${room?.name} room`}
          right={<IconButton icon="calendar" accessibilityLabel="Open calendar" onPress={() => navigation.navigate('Calendar', { date })} />}
        />
      }
    >
      <View style={styles.week}>
        {getWeekdays(date).map((day) => {
          const selected = day === date;
          return (
            <Pressable
              key={day}
              onPress={() => setDate(day)}
              disabled={day > TODAY}
              accessibilityRole="tab"
              accessibilityState={{ selected, disabled: day > TODAY }}
              style={[styles.day, selected && styles.daySelected, day > TODAY && styles.dayFuture]}
            >
              <AppText variant="caption" color={selected ? 'textOnPrimary' : 'textSecondary'}>{WEEKDAYS_SHORT[weekdayIndex(day)]}</AppText>
              <AppText variant="highlight" color={selected ? 'textOnPrimary' : 'text'}>{dayOfMonth(day)}</AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.filters}>
        {filters.map((f) => (
          <Chip key={f.value} label={f.label} tone={f.tone} icon={f.icon} selected={filter === f.value} onPress={() => setFilter(f.value)} />
        ))}
      </View>

      {visible.length === 0 && (
        <AppText color="textSecondary" style={styles.empty}>No records for this day.</AppText>
      )}

      {visible.map((item) => (
        <View key={item.key} style={styles.timelineRow}>
          <AppText variant="label" color="textSecondary" style={styles.time}>{item.time}</AppText>
          <Card style={styles.item} onPress={item.onPress}>
            <View style={styles.itemRow}>
              <IconTile icon={item.icon} tone={item.tone} size={40} />
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{item.title}</AppText>
                {item.subtitle && <AppText variant="small" color="textSecondary">{item.subtitle}</AppText>}
              </View>
              {item.pill && <Chip small label={item.pill.label} tone={item.pill.tone} icon={item.pill.icon} />}
            </View>
          </Card>
        </View>
      ))}

      {filter === 'all' &&
        notes.map((n) => (
          <View key={n.id} style={styles.note}>
            <Icon name="moon" size={20} />
            <AppText style={styles.flex}>
              <AppText variant="bodyStrong">Educator's note: </AppText>
              {n.text}
            </AppText>
          </View>
        ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  week: { flexDirection: 'row', gap: spacing.xs },
  day: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  daySelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayFuture: { opacity: 0.4 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  empty: { textAlign: 'center', paddingVertical: spacing.xl },
  timelineRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  time: { width: 40, paddingTop: spacing.md },
  item: { flex: 1, padding: spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  note: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
  },
});
