import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { AppText, Button, Icon, IconButton, IconTile } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { colors, radius, spacing } from '@/theme';

export function LocationScreen() {
  const navigation = useNavigation();
  const { daycare } = useCurrentUser();

  const openMaps = () =>
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${daycare.name}, ${daycare.address}`)}`);

  return (
    <View style={styles.screen}>
      <View style={styles.map} accessibilityLabel={`Map showing ${daycare.name}`}>
        <View style={[styles.park, { top: 20, left: 20, width: 120, height: 110 }]} />
        <View style={[styles.park, { top: 330, right: 0, width: 140, height: 120 }]} />
        <View style={[styles.road, { top: 170, left: -40, right: -40, height: 26, transform: [{ rotate: '-6deg' }] }]} />
        <View style={[styles.road, { top: -20, bottom: -20, left: '45%', width: 22 }]} />
        <View style={[styles.road, { top: 260, left: -60, right: -60, height: 22, transform: [{ rotate: '-28deg' }] }]} />
        <View style={styles.river} />
        <View style={styles.pin}>
          <View style={styles.pinLabel}>
            <AppText variant="caption" color="textOnPrimary">{daycare.name}</AppText>
          </View>
          <Icon name="pin" size={40} color={colors.danger} />
        </View>
      </View>

      <SafeAreaView edges={['top']} style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <IconButton icon="back" accessibilityLabel="Back" onPress={() => navigation.goBack()} />
          <View style={styles.titleBox}>
            <AppText variant="bodyStrong">Location</AppText>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <InfoRow icon="home" tone="honey" title={daycare.name} detail={`${daycare.address}`} />
        <InfoRow icon="clock" tone="blue" title="Opening hours" detail={daycare.openingHours} />
        <View style={styles.divider} />
        <Pressable onPress={() => Linking.openURL(`tel:${daycare.phone.replace(/\s/g, '')}`)} accessibilityRole="button">
          <InfoRow icon="phone" tone="green" title="Contact" detail={daycare.phone} />
        </Pressable>
        <Button title="Open in Google Maps" icon="nav" fullWidth onPress={openMaps} />
      </View>
    </View>
  );
}

function InfoRow({ icon, tone, title, detail }: { icon: 'home' | 'clock' | 'phone'; tone: 'honey' | 'blue' | 'green'; title: string; detail: string }) {
  return (
    <View style={styles.infoRow}>
      <IconTile icon={icon} tone={tone} size={36} />
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="small" color="textSecondary">{detail}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1, backgroundColor: '#EEF2EC', overflow: 'hidden' },
  park: { position: 'absolute', backgroundColor: colors.successSoft, borderRadius: 4 },
  road: { position: 'absolute', backgroundColor: colors.surface },
  river: {
    position: 'absolute',
    left: -80,
    top: 220,
    width: 260,
    height: 400,
    borderRadius: 200,
    borderWidth: 14,
    borderColor: colors.infoSoft,
  },
  pin: { position: 'absolute', top: 110, left: '38%', alignItems: 'center', gap: 4 },
  pinLabel: { backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  topBar: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  titleBox: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    marginTop: -radius.xl,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border },
});
