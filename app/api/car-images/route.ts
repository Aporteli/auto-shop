import { NextRequest, NextResponse } from 'next/server';
import { carImageCacheKey, carImageQuery, genericCarPhotoUrls } from '@/lib/carImage';

type UnsplashSearchResponse = {
  results?: Array<{
    urls?: { regular?: string; small?: string };
  }>;
};

const memoryCache = new Map<string, { urls: string[]; expiresAt: number }>();
const CACHE_MS = 24 * 60 * 60 * 1000;

async function searchUnsplash(query: string, accessKey: string) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '8');
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('content_filter', 'high');

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
    next: { revalidate: 86400 },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as UnsplashSearchResponse;
  return (data.results ?? [])
    .map((photo) => photo.urls?.regular || photo.urls?.small)
    .filter((photoUrl): photoUrl is string => Boolean(photoUrl));
}

export async function GET(request: NextRequest) {
  const make = request.nextUrl.searchParams.get('make')?.trim() || '';
  const model = request.nextUrl.searchParams.get('model')?.trim() || '';
  const cacheKey = carImageCacheKey(make, model);
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ urls: cached.urls, query: carImageQuery(make, model) });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
  let urls: string[] = [];

  if (accessKey) {
    const primary = carImageQuery(make, model);
    urls = await searchUnsplash(primary, accessKey);
    if (urls.length === 0 && make && model) {
      urls = await searchUnsplash(`${make} car`, accessKey);
    }
    if (urls.length === 0) {
      urls = await searchUnsplash('car', accessKey);
    }
  }

  if (urls.length === 0) {
    urls = genericCarPhotoUrls(make, model);
  }

  memoryCache.set(cacheKey, { urls, expiresAt: Date.now() + CACHE_MS });
  return NextResponse.json({ urls, query: carImageQuery(make, model) });
}
