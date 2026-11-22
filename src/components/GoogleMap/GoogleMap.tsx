import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors } from '@/theme';
import { googleMapEmbedUrl, type GoogleMapProps } from './googleMapUrl';

export function GoogleMap({ query, title, zoom }: GoogleMapProps) {
  return (
    <WebView
      source={{ uri: googleMapEmbedUrl({ query, zoom }) }}
      style={styles.map}
      accessibilityLabel={`Google Maps showing ${title}`}
      scrollEnabled={false}
      startInLoadingState
    />
  );
}

const styles = StyleSheet.create({
  map: { flex: 1, backgroundColor: colors.background },
});
