export type GoogleMapProps = {
  query: string;
  title: string;
  zoom?: number;
};

export const googleMapEmbedUrl = ({ query, zoom = 16 }: Pick<GoogleMapProps, 'query' | 'zoom'>) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&hl=en&output=embed`;
