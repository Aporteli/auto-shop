const DEFAULT_LABEL = 'AutoShop, Tbilisi, Georgia';
const DEFAULT_LAT = 41.715137;
const DEFAULT_LNG = 44.827096;
const BBOX_PAD = 0.02;

function parseCoord(value: string | undefined, fallback: number) {
  const parsed = Number(value?.trim());
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Free OpenStreetMap embed — no API key or billing. */
export function getMapLocation() {
  const label = process.env.NEXT_PUBLIC_MAP_QUERY?.trim() || DEFAULT_LABEL;
  const lat = parseCoord(process.env.NEXT_PUBLIC_MAP_LAT, DEFAULT_LAT);
  const lng = parseCoord(process.env.NEXT_PUBLIC_MAP_LNG, DEFAULT_LNG);

  const west = lng - BBOX_PAD;
  const south = lat - BBOX_PAD;
  const east = lng + BBOX_PAD;
  const north = lat + BBOX_PAD;

  const embedUrl =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${west}%2C${south}%2C${east}%2C${north}` +
    `&layer=mapnik&marker=${lat}%2C${lng}`;

  const openMapUrl =
    `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}` +
    `#map=15/${lat}/${lng}`;

  return { label, lat, lng, embedUrl, openMapUrl };
}
