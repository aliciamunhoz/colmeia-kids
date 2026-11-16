import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, CoverImage, Icon, IconTile, Screen, ScreenHeader, TextField, type IconName } from '@/components';
import { colors, radius, spacing, tones, type Tone } from '@/theme';
import type { Cover, PortfolioItem } from '@/types/models';
import { firstName } from '../parent/SelectedChildContext';
import { useRecordForm } from './useRecordForm';

type Kind = PortfolioItem['kind'];

const kinds: { value: Kind; label: string; icon: IconName; tone: Tone }[] = [
  { value: 'photo', label: 'Photo', icon: 'image', tone: 'green' },
  { value: 'video', label: 'Video', icon: 'video', tone: 'red' },
  { value: 'artwork', label: 'Artwork', icon: 'palette', tone: 'honey' },
  { value: 'progress', label: 'Progress', icon: 'sprout', tone: 'green' },
];

const fakeCaptures: Cover[] = [
  { icon: 'sun', tone: 'blue' },
  { icon: 'smile', tone: 'honey' },
  { icon: 'star', tone: 'green' },
  { icon: 'palette', tone: 'purple' },
  { icon: 'heart', tone: 'red' },
];

export function AddToPortfolioScreen() {
  const { child, user, data, actions, goBack } = useRecordForm<'AddToPortfolio'>();
  const [kind, setKind] = useState<Kind>('photo');
  const [capture, setCapture] = useState<Cover | null>(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!child) return null;
  const name = firstName(child.name);

  const takePhoto = () => {
    const i = capture ? (fakeCaptures.indexOf(capture) + 1) % fakeCaptures.length : data.portfolio.length % fakeCaptures.length;
    setCapture(fakeCaptures[i]);
  };

  const save = () => {
    if (!title.trim()) return setError('Give the item a title.');
    const k = kinds.find((x) => x.value === kind)!;
    actions.addPortfolioItem({
      childId: child.id,
      kind,
      title: title.trim(),
      description: notes.trim() || title.trim(),
      cover: kind === 'photo' && capture ? capture : { icon: k.icon, tone: k.tone },
      authorId: user.id,
      duration: kind === 'video' ? '0:30' : undefined,
    });
    actions.notify(child.guardianIds, 'photo', 'New in the portfolio', `${title.trim()} was added to ${name}'s portfolio`);
    goBack();
  };

  return (
    <Screen header={<ScreenHeader title="Add to portfolio" subtitle={child.name} />}>
      <View style={styles.kinds}>
        {kinds.map((k) => {
          const selected = k.value === kind;
          return (
            <Pressable
              key={k.value}
              onPress={() => setKind(k.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[styles.kind, selected && styles.kindSelected]}
            >
              <Icon name={k.icon} size={24} color={tones[k.tone].foreground} />
              <AppText variant="label">{k.label}</AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.capture}>
        {capture ? (
          <CoverImage cover={capture} height={140} iconSize={48} />
        ) : (
          <>
            <Icon name="camera" size={32} />
            <AppText variant="label">Take a photo or choose from gallery</AppText>
          </>
        )}
        <View style={styles.captureButtons}>
          <Button title="Camera" icon="camera" variant="accent" onPress={takePhoto} />
          <Button title="Gallery" icon="image" variant="secondary" onPress={takePhoto} />
        </View>
      </View>

      <TextField label="Title" value={title} onChangeText={(t) => { setTitle(t); setError(null); }} placeholder="First crayon drawing" error={error ?? undefined} />
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline placeholder="Held the crayon with his whole hand…" />

      <View style={styles.visible}>
        <IconTile icon="users" tone="purple" size={36} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">Visible to</AppText>
          <AppText variant="small" color="textSecondary">{name}'s parents</AppText>
        </View>
      </View>

      <Button title="Add to portfolio" icon="plus" fullWidth onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  kinds: { flexDirection: 'row', gap: spacing.xs },
  kind: {
    flex: 1, alignItems: 'center', gap: 6, paddingVertical: spacing.sm,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  kindSelected: { borderWidth: 2, borderColor: colors.accent, backgroundColor: colors.accentSoft },
  capture: {
    alignItems: 'center', gap: spacing.sm, padding: spacing.lg,
    borderRadius: radius.lg, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border,
  },
  captureButtons: { flexDirection: 'row', gap: spacing.sm },
  visible: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
});
