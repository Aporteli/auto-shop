export const CAR_PLACEHOLDER_SRC = '/car-placeholder.svg';

export type UnsplashImageVariant = 'card' | 'hero';

const PLACEHOLDER_HOSTS = ['picsum.photos', 'loremflickr.com', 'placehold.co', 'placeholder.com'];

const UNSPLASH_PARAMS = {
  card: { w: '600', q: '80' },
  hero: { w: '1200', q: '85' },
} as const;

export function isPlaceholderImageUrl(url: string | null | undefined) {
  if (!url) return true;
  return PLACEHOLDER_HOSTS.some((host) => url.includes(host));
}

export function carImageQuery(make?: string | null, model?: string | null) {
  return [make, model, 'car'].map((part) => part?.trim()).filter(Boolean).join(' ');
}

export function carImageCacheKey(make?: string | null, model?: string | null) {
  return `${make?.trim() ?? ''}|${model?.trim() ?? ''}`.toLowerCase();
}

export function optimizeUnsplashUrl(url: string, variant: UnsplashImageVariant = 'card') {
  if (!url.includes('images.unsplash.com') && !url.includes('plus.unsplash.com')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const params = UNSPLASH_PARAMS[variant];
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('w', params.w);
    parsed.searchParams.set('q', params.q);
    return parsed.toString();
  } catch {
    return url;
  }
}

const GENERIC_CAR_PHOTOS = [
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
  'https://images.unsplash.com/photo-1542362567-b07e54358753',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2',
  'https://images.unsplash.com/photo-1617531658521-82443c3d50d0',
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
];

export const CATEGORY_UNSPLASH_IMAGES = {
  'custom-vehicles': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7',
  motorcycles: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
  inspection: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
} as const;

export function genericCarPhotoUrls(make?: string | null, model?: string | null) {
  const seed = [...carImageCacheKey(make, model)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const start = seed % GENERIC_CAR_PHOTOS.length;
  return Array.from({ length: GENERIC_CAR_PHOTOS.length }, (_, index) => {
    return GENERIC_CAR_PHOTOS[(start + index) % GENERIC_CAR_PHOTOS.length];
  });
}
