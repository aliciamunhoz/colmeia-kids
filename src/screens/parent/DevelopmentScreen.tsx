import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, Icon, IconTile, ProgressBar, Screen, ScreenHeader, SectionHeader, SegmentedControl } from '@/components';
import { ageFrom, formatShortDate, getDevelopmentReports, getMilestones, getUser, useData } from '@/data';
import { colors, radius, spacing } from '@/theme';
import { firstName, useSelectedChild } from './SelectedChildContext';

const areaColors = [colors.success, colors.info, colors.highlight, colors.success, '#B7791F', colors.danger];

type Term = '1' | '2' | '3';

export function DevelopmentScreen() {
  const { data } = useData();
  const { child } = useSelectedChild();
  const [term, setTerm] = useState<Term>('1');

  const reports = getDevelopmentReports(data, child.id);
  const report = reports.find((r) => String(r.term) === term);
  const milestones = getMilestones(data, child.id);
  const age = ageFrom(child.birthDate);

  return (
    <Screen
      header={
        <ScreenHeader
          title="Development"
          subtitle={`${firstName(child.name)} · ${age.years} years and ${age.months} months`}
        />
      }
    >
      <SegmentedControl
        value={term}
        onChange={setTerm}
        options={[
          { value: '1', label: 'Term 1' },
          { value: '2', label: 'Term 2' },
          { value: '3', label: 'Term 3' },
        ]}
      />

      {!report ? (
        <AppText color="textSecondary">No assessment for this term yet.</AppText>
      ) : (
        <>
          <Card>
            <View style={styles.titleRow}>
              <Icon name="sprout" size={26} color={colors.success} />
              <View style={styles.flex}>
                <AppText variant="section">{report.title}</AppText>
                <AppText variant="caption" color="textSecondary">
                  Recorded by Educator {firstName(getUser(data, report.recordedBy)?.name ?? '')} · {formatShortDate(report.date)}
                </AppText>
              </View>
            </View>
            {report.areas.map((area, i) => (
              <View key={area.name} style={styles.area}>
                <View style={styles.areaRow}>
                  <AppText variant="bodyStrong">{area.name}</AppText>
                  <AppText variant="caption" color="textSecondary">{area.level >= 3 ? 'Achieved' : 'In progress'}</AppText>
                </View>
                <ProgressBar progress={area.level / 4} color={areaColors[i % areaColors.length]} />
              </View>
            ))}
          </Card>

          <View style={styles.comment}>
            <AppText variant="bodyStrong">Educator's comment</AppText>
            <AppText color="textSecondary">{report.comment}</AppText>
          </View>
        </>
      )}

      <SectionHeader title="Progress records" />
      <View>
        {milestones.map((m) => (
          <View key={m.id} style={styles.milestone}>
            <IconTile icon={m.cover.icon} tone={m.cover.tone} size={44} />
            <View>
              <AppText variant="bodyStrong">{m.title}</AppText>
              <AppText variant="small" color="textSecondary">{formatShortDate(m.date)} · {m.area}</AppText>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  area: { gap: 6 },
  areaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  comment: { padding: spacing.md, gap: spacing.xxs, borderRadius: radius.md, backgroundColor: colors.successSoft },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
