import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { AppText, Button, GoogleMap, IconButton, IconTile } from '@/components';
import { useCurrentUser } from '@/context/AuthContext';
import { colors, radius, spacing } from '@/theme';

export function LocationScreen() {
  const navigation = useNavigation();
  const { daycare } = useCurrentUser();

  const place = daycare.coordinates
    ? `${daycare.coordinates.latitude},${daycare.coordinates.longitude}`
    : daycare.address;

  const openMaps = () =>
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`);

  return (
    <View style={styles.screen}>
      <View style={styles.map}>
        <GoogleMap query={place} title={`${daycare.name} · ${daycare.city}`} />
      </View>

      <SafeAreaView edges={['top']} style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <IconButton icon="back" accessibilityLabel="Back" onPress={() => navigation.goBack()} />
          <View style={styles.titleBox}>
            <AppText variant="bodyStrong" numberOfLines={1}>{daycare.name} · {daycare.city}</AppText>
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
  map: { flex: 1, overflow: 'hidden' },
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
