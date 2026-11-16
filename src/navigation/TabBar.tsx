import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { AppText, Icon, type IconName } from '@/components';
import { colors, radius, spacing } from '@/theme';

export type TabItem = {
  label: string;
  icon: IconName;
  highlight?: boolean;
};

export type TabItems<ParamList> = Record<keyof ParamList & string, TabItem>;

type TabBarProps = BottomTabBarProps & { items: Record<string, TabItem> };

export function TabBar({ state, navigation, items }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
      {state.routes.map((route, index) => {
        const item = items[route.name];
        const focused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={item.label}
            style={styles.item}
          >
            {item.highlight ? (
              <View style={styles.highlight}>
                <Icon name={item.icon} size={26} />
              </View>
            ) : (
              <View style={[styles.pill, focused && styles.pillActive]}>
                <Icon name={item.icon} size={22} />
              </View>
            )}
            <AppText variant="tab" color={focused ? 'text' : 'textSecondary'}>
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  item: { width: 70, alignItems: 'center', gap: spacing.xxs },
  pill: {
    width: 52,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: { backgroundColor: colors.accentSoft },
  highlight: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    borderWidth: 4,
    borderColor: colors.surface,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 6px 14px 0px rgba(255, 194, 26, 0.45)',
  },
});
