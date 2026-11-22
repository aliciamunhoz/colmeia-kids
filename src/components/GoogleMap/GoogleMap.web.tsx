import { googleMapEmbedUrl, type GoogleMapProps } from './googleMapUrl';

export function GoogleMap({ query, title, zoom }: GoogleMapProps) {
  return (
    <iframe
      src={googleMapEmbedUrl({ query, zoom })}
      title={`Google Maps showing ${title}`}
      style={{ flex: 1, width: '100%', height: '100%', border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
