import { Pressable } from 'react-native';

import { AppText } from './AppText';

export function LinkText({ label, onPress, center }: { label: string; onPress: () => void; center?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" hitSlop={10} style={center && { alignSelf: 'center' }}>
      <AppText variant="label" color="info">{label}</AppText>
    </Pressable>
  );
}
