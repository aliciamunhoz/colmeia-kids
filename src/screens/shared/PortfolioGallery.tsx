import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, Chip, CoverImage, type IconName } from '@/components';
import { formatMonth, getPortfolio, getUser, useData } from '@/data';
import { colors, radius, spacing, type Tone } from '@/theme';
import type { PortfolioItem } from '@/types/models';

type Filter = 'all' | 'photo' | 'video' | 'artwork';

const filters: { value: Filter; label: string; tone: Tone; icon?: IconName }[] = [
  { value: 'all', label: 'All', tone: 'blue' },
  { value: 'photo', label: 'Photos', tone: 'purple', icon: 'image' },
  { value: 'video', label: 'Videos', tone: 'red', icon: 'video' },
  { value: 'artwork', label: 'Artwork', tone: 'honey', icon: 'palette' },
];

const badgeFor = (item: PortfolioItem) =>
  item.kind === 'video' ? `Video ${item.duration ?? ''}` : item.kind === 'artwork' ? 'Artwork' : item.kind === 'progress' ? 'Progress' : undefined;

export function PortfolioGallery({ childId, newestFirst = true }: { childId: string; newestFirst?: boolean }) {
  const { data } = useData();
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = getPortfolio(data, childId)
    .filter((i) => filter === 'all' || i.kind === filter)
    .sort((a, b) => (newestFirst ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));

  const byMonth = items.reduce<Record<string, PortfolioItem[]>>((groups, item) => {
    const month = item.date.slice(0, 7);
    (groups[month] ??= []).push(item);
    return groups;
  }, {});

  const selected = items.find((i) => i.id === selectedId) ?? items[0];

  return (
    <>
      <View style={styles.filters}>
        {filters.map((f) => (
          <Chip key={f.value} label={f.label} tone={f.tone} icon={f.icon} selected={filter === f.value} onPress={() => setFilter(f.value)} />
        ))}
      </View>

      {Object.entries(byMonth).map(([month, list]) => (
        <View key={month} style={styles.group}>
          <AppText variant="section">{formatMonth(month)}</AppText>
          <View style={styles.grid}>
            {list.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                accessibilityState={{ selected: item.id === selected?.id }}
                style={[styles.tile, item.id === selected?.id && styles.tileSelected]}
              >
                <CoverImage cover={item.cover} height={100} iconSize={32} badge={badgeFor(item)} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {items.length === 0 && <AppText color="textSecondary">Nothing here yet.</AppText>}

      {selected && (
        <Card>
          <View style={styles.detail}>
            <CoverImage cover={selected.cover} width={72} height={56} iconSize={24} rounded={radius.sm} />
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{selected.title}</AppText>
              <AppText variant="small" color="textSecondary">
                {selected.description}
                {selected.description.includes('—') ? '' : ` — ${getUser(data, selected.authorId)?.name ?? ''}`}
              </AppText>
            </View>
          </View>
        </Card>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  group: { gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  tile: { width: '31.5%', borderRadius: radius.md + 2, borderWidth: 2, borderColor: 'transparent' },
  tileSelected: { borderColor: colors.primary },
  detail: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
});
