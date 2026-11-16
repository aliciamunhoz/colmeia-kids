import { StyleSheet, View } from 'react-native';

import { tones, type Tone } from '@/theme';
import { Icon, type IconName } from './Icon/Icon';

type IconTileProps = { icon: IconName; tone: Tone; size?: number; iconSize?: number; rounded?: number };

export function IconTile({ icon, tone, size = 40, iconSize, rounded = 12 }: IconTileProps) {
  const t = tones[tone];
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: rounded, backgroundColor: t.background }]}>
      <Icon name={icon} size={iconSize ?? Math.round(size * 0.5)} color={t.foreground} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
});
