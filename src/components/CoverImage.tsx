import { StyleSheet, View, type DimensionValue } from 'react-native';

import { colors, radius, spacing, tones } from '@/theme';
import type { Cover } from '@/types/models';
import { AppText } from './AppText';
import { Icon } from './Icon/Icon';

type CoverImageProps = {
  cover: Cover;
  height?: DimensionValue;
  width?: DimensionValue;
  iconSize?: number;
  badge?: string;
  rounded?: number;
};

export function CoverImage({ cover, height = 140, width = '100%', iconSize = 56, badge, rounded = radius.md }: CoverImageProps) {
  const t = tones[cover.tone];
  return (
    <View style={[styles.cover, { height, width, borderRadius: rounded, backgroundColor: t.background }]} accessibilityRole="image">
      <Icon name={cover.icon} size={iconSize} color={t.foreground} />
      {badge && (
        <View style={styles.badge}>
          <AppText variant="caption" color="textOnPrimary" style={styles.badgeText}>{badge}</AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    left: spacing.xs,
    bottom: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: { fontFamily: 'Nunito_700Bold' },
});
