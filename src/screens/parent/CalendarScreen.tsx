import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, Icon, IconButton, Screen, ScreenHeader } from '@/components';
import { dayOfMonth, formatMonth, getDaysWithRecords, getMonthGrid, shiftMonth, TODAY, useData, weekdayIndex } from '@/data';
import type { DiaryScreenProps } from '@/navigation/types';
import { colors, radius, spacing, tones } from '@/theme';
import type { ISODate } from '@/types/models';
import { firstName, useSelectedChild } from './SelectedChildContext';

// A creche fecha ao fim de semana e em agosto (ecrã "04.5 Calendar – August").
const isClosed = (day: ISODate) => [0, 6].includes(weekdayIndex(day)) || day.slice(5, 7) === '08';

export function CalendarScreen({ navigation, route }: DiaryScreenProps<'Calendar'>) {
  const { data } = useData();
  const { child, room } = useSelectedChild();
  const selected = route.params.date;
  const [month, setMonth] = useState(selected.slice(0, 7));

  const withRecords = getDaysWithRecords(data, child.id, month);
  const isAugust = month.endsWith('-08');

  const pick = (day: ISODate) => navigation.navigate('Diary', { date: day });

  return (
    <Screen header={<ScreenHeader title="Calendar" subtitle={`${firstName(child.name)} · ${room?.name} room`} />}>
      <Card style={styles.card}>
        <View style={styles.monthRow}>
          <IconButton icon="back" accessibilityLabel="Previous month" onPress={() => setMonth((m) => shiftMonth(m, -1))} />
          <AppText variant="section">{formatMonth(month)}</AppText>
          <IconButton
            icon="chevron"
            accessibilityLabel="Next month"
            onPress={() => setMonth((m) => shiftMonth(m, 1))}
          />
        </View>

        <View style={styles.week}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <AppText key={i} variant="label" color="textTertiary" style={styles.cellText}>{d}</AppText>
          ))}
        </View>

        {getMonthGrid(month).map((week, i) => (
          <View key={i} style={styles.week}>
            {week.map((day, j) => {
              if (!day) return <View key={j} style={styles.cell} />;
              const closed = isClosed(day);
              const future = day > TODAY;
              const isSelected = day === selected;
              const hasRecords = withRecords.has(day);
              return (
                <Pressable
                  key={day}
                  onPress={() => pick(day)}
                  disabled={closed || future}
                  accessibilityRole="button"
                  accessibilityLabel={`${day}${hasRecords ? ', has records' : ''}${closed ? ', closed' : ''}`}
                  style={[
                    styles.cell,
                    hasRecords && styles.cellRecords,
                    closed && !isAugust && styles.cellClosed,
                    isSelected && styles.cellSelected,
                  ]}
                >
                  <AppText
                    variant="bodyStrong"
                    color={isSelected ? 'textOnPrimary' : closed || future ? 'textTertiary' : 'text'}
                    style={styles.cellText}
                  >
                    {dayOfMonth(day)}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        ))}
      </Card>

      <View style={styles.legend}>
        <Legend color={colors.accent} label="Day with records" />
        <Legend color={colors.primary} label="Selected" />
        <Legend color={colors.dangerSoft} label="Closed" />
      </View>

      {isAugust && (
        <View style={styles.info}>
          <Icon name="sun" size={22} color={tones.honey.foreground} />
          <AppText style={{ flex: 1 }}>The daycare was closed in August for summer holidays. No records this month.</AppText>
        </View>
      )}
    </Screen>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <AppText variant="caption" color="textSecondary">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  week: { flexDirection: 'row' },
  cell: { flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, margin: 2 },
  cellText: { flex: 1, textAlign: 'center' },
  cellRecords: { backgroundColor: colors.accentSoft, borderWidth: 2, borderColor: colors.accent },
  cellClosed: { backgroundColor: colors.dangerSoft },
  cellSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  legend: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  info: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.accentSoft },
});
