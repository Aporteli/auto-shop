import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { carImageCacheKey, carImageQuery, genericCarPhotoUrls, optimizeUnsplashUrl } from '@/lib/carImage';

export const revalidate = 86400;

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

const getUnsplashUrls = unstable_cache(
  async (query: string) => {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
    if (!accessKey) return [] as string[];
    return searchUnsplash(query, accessKey);
  },
  ['unsplash-search'],
  { revalidate: 86400 },
);

function sizedUrls(urls: string[]) {
  return urls.map((url) => optimizeUnsplashUrl(url, 'card'));
}

export async function GET(request: NextRequest) {
  const make = request.nextUrl.searchParams.get('make')?.trim() || '';
  const model = request.nextUrl.searchParams.get('model')?.trim() || '';
  const cacheKey = carImageCacheKey(make, model);
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(
      { urls: cached.urls, query: carImageQuery(make, model) },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  }

  let urls: string[] = [];
  const primary = carImageQuery(make, model);
  urls = await getUnsplashUrls(primary);
  if (urls.length === 0 && make && model) {
    urls = await getUnsplashUrls(`${make} car`);
  }
  if (urls.length === 0) {
    urls = await getUnsplashUrls('car');
  }
  if (urls.length === 0) {
    urls = genericCarPhotoUrls(make, model);
  }

  urls = sizedUrls(urls);
  memoryCache.set(cacheKey, { urls, expiresAt: Date.now() + CACHE_MS });
  return NextResponse.json(
    { urls, query: primary },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
  );
}
