import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors } from '@/theme';
import { googleMapEmbedUrl, type GoogleMapProps } from './googleMapUrl';

// On Android, opening maps.google.com directly in a WebView redirects to an
// intent:// link (to open the Google Maps app) and the page fails to load.
// Loading the embed inside an iframe keeps the map in the app.
const mapHtml = (src: string) => `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>html, body, iframe { margin: 0; padding: 0; width: 100%; height: 100%; border: 0; }</style>
  </head>
  <body><iframe src="${src}" allowfullscreen loading="eager"></iframe></body>
</html>`;

export function GoogleMap({ query, title, zoom }: GoogleMapProps) {
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: mapHtml(googleMapEmbedUrl({ query, zoom })), baseUrl: 'https://maps.google.com' }}
      style={styles.map}
      accessibilityLabel={`Google Maps showing ${title}`}
      scrollEnabled={false}
      setSupportMultipleWindows={false}
      onShouldStartLoadWithRequest={(request) => /^(https?|about|data):/.test(request.url)}
      startInLoadingState
    />
  );
}

const styles = StyleSheet.create({
  map: { flex: 1, backgroundColor: colors.background },
});
