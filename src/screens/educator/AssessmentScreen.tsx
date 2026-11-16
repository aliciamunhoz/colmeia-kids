import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Chip, Screen, ScreenHeader, TextField } from '@/components';
import { getDevelopmentReports } from '@/data';
import { colors, radius, spacing } from '@/theme';
import type { DevelopmentArea, DevelopmentLevel } from '@/types/models';
import { useRecordForm } from './useRecordForm';

const AREAS = ['Motor skills', 'Language', 'Cognitive', 'Social', 'Autonomy', 'Artistic expression'];
const LEVELS: DevelopmentLevel[] = [1, 2, 3, 4];
const CURRENT_TERM = 1;

export function AssessmentScreen() {
  const { child, user, data, actions, goBack } = useRecordForm<'Assessment'>();

  const existing = child ? getDevelopmentReports(data, child.id).find((r) => r.term === CURRENT_TERM) : undefined;
  const [levels, setLevels] = useState<Record<string, DevelopmentLevel>>(() =>
    Object.fromEntries(AREAS.map((name) => [name, existing?.areas.find((a) => a.name === name)?.level ?? 1])),
  );
  const [comment, setComment] = useState(existing?.comment ?? '');

  if (!child) return null;

  const save = () => {
    const areas: DevelopmentArea[] = AREAS.map((name) => ({ name, level: levels[name] }));
    actions.saveAssessment({
      id: existing?.id,
      childId: child.id,
      term: CURRENT_TERM,
      title: existing?.title ?? 'September assessment',
      recordedBy: user.id,
      areas,
      comment: comment.trim(),
    });
    goBack();
  };

  return (
    <Screen header={<ScreenHeader title="Assessment" subtitle={`${child.name} · Term ${CURRENT_TERM}`} />}>
      <View style={styles.scale}>
        <AppText variant="label">Scale</AppText>
        <Chip small label="1 Not observed" tone="neutral" />
        <Chip small label="4 Achieved" tone="green" />
      </View>

      {AREAS.map((area) => (
        <Card key={area} style={styles.area}>
          <AppText variant="bodyStrong" style={styles.flex}>{area}</AppText>
          <View style={styles.levels} accessibilityRole="radiogroup" accessibilityLabel={area}>
            {LEVELS.map((level) => {
              const filled = level <= levels[area];
              return (
                <Pressable
                  key={level}
                  onPress={() => setLevels((l) => ({ ...l, [area]: level }))}
                  accessibilityRole="radio"
                  accessibilityLabel={`${area} level ${level}`}
                  accessibilityState={{ checked: levels[area] === level }}
                  style={[styles.level, filled && styles.levelFilled]}
                >
                  <AppText variant="label" color={filled ? 'textOnPrimary' : 'textSecondary'}>{level}</AppText>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ))}

      <TextField label="General comment" value={comment} onChangeText={setComment} placeholder="Climbs stairs alternating feet…" multiline />
      <Button title="Save assessment" icon="check" fullWidth onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scale: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.infoSoft },
  area: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm },
  levels: { flexDirection: 'row', gap: 6 },
  level: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  levelFilled: { backgroundColor: colors.success },
});
