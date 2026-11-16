import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, ChildSwitcher, Icon, IconTile, Screen, ScreenHeader, SegmentedControl } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { getAttendance, getAttendanceStatus, useData } from '@/data';
import { colors, radius, spacing } from '@/theme';
import { firstName, useSelectedChild } from './SelectedChildContext';

type Mode = 'checkin' | 'checkout';

export function CheckInScreen() {
  const { data, actions } = useData();
  const { user } = useCurrentUser();
  const { childrenList, child, selectChild } = useSelectedChild();

  const status = getAttendanceStatus(data, child.id);
  const attendance = getAttendance(data, child.id);
  const [mode, setMode] = useState<Mode>(status === 'present' ? 'checkout' : 'checkin');
  useEffect(() => setMode(status === 'present' ? 'checkout' : 'checkin'), [child.id, status]);

  const relation = child.authorisedPickups.find((p) => p.name === user.name)?.relation.toLowerCase() ?? 'guardian';
  const byName = `${user.name} (${relation})`;

  const canAct = (mode === 'checkin' && status === 'expected') || (mode === 'checkout' && status === 'present');
  const scan = () => {
    if (!canAct) return;
    if (mode === 'checkin') actions.checkIn(child.id, byName, 'qr');
    else actions.checkOut(child.id, byName, 'qr');
  };

  let card: { done: boolean; title: string; detail: string };
  if (mode === 'checkin') {
    card = attendance?.checkIn
      ? { done: true, title: "Today's check-in already recorded", detail: `${attendance.checkIn.time} · by ${attendance.checkIn.byName}` }
      : { done: false, title: `Ready to check in ${firstName(child.name)}`, detail: 'Tap the scanner to read the QR code at the entrance.' };
  } else {
    card = attendance?.checkOut
      ? { done: true, title: "Today's check-out already recorded", detail: `${attendance.checkOut.time} · by ${attendance.checkOut.byName}` }
      : status === 'present'
        ? { done: false, title: `Ready to check out ${firstName(child.name)}`, detail: 'Tap the scanner to read the QR code at the entrance.' }
        : { done: false, title: 'No check-in today', detail: 'Check-out is only possible after the check-in.' };
  }

  return (
    <Screen header={<ScreenHeader title="Check-in / Check-out" subtitle="Scan the QR code at the daycare entrance" />}>
      <ChildSwitcher items={childrenList} selectedId={child.id} onSelect={selectChild} />

      <Pressable
        onPress={scan}
        disabled={!canAct}
        accessibilityRole="button"
        accessibilityLabel={`Simulate QR scan for ${mode === 'checkin' ? 'check-in' : 'check-out'}`}
        style={({ pressed }) => [styles.scanner, pressed && { opacity: 0.9 }]}
      >
        <View style={styles.frame}>
          <View style={styles.qr}>
            <Icon name="qr" size={150} color={colors.primary} />
          </View>
          <View style={styles.scanLine} />
        </View>
        <AppText variant="label" color="textOnPrimary">
          {canAct ? 'Tap to simulate the scan' : 'Point the camera at the code'}
        </AppText>
      </Pressable>

      <SegmentedControl
        value={mode}
        onChange={setMode}
        options={[
          { value: 'checkin', label: 'Check-in' },
          { value: 'checkout', label: 'Check-out' },
        ]}
      />

      <Card>
        <View style={styles.cardRow}>
          <IconTile icon={card.done ? 'check' : 'clock'} tone={card.done ? 'green' : 'honey'} size={40} />
          <View style={styles.flex}>
            <AppText variant="bodyStrong">{card.title}</AppText>
            <AppText variant="small" color="textSecondary">{card.detail}</AppText>
          </View>
        </View>
        <AppText variant="caption" color="textSecondary">
          Only one check-in and one check-out per day. The check-out is recorded with the time and the guardian who made it.
        </AppText>
        {canAct && (
          <Button
            title={mode === 'checkin' ? 'Confirm check-in' : 'Confirm check-out'}
            icon={mode === 'checkin' ? 'login' : 'logout'}
            fullWidth
            onPress={scan}
          />
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scanner: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  frame: { padding: spacing.xs, borderWidth: 4, borderColor: colors.accent, borderRadius: radius.lg },
  qr: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md },
  scanLine: { position: 'absolute', left: -12, right: -12, top: '50%', height: 2, backgroundColor: colors.accent },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
