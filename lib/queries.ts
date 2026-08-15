import { connection } from 'next/server';
import { unstable_cache } from 'next/cache';
import { prisma } from './prisma';

const listingCardInclude = {
  model: { include: { manufacturer: true } },
  bodyType: true,
  fuelType: true,
  city: { include: { country: true } },
  images: { orderBy: { position: 'asc' as const }, take: 1 },
};

async function db() {
  await connection();
  return prisma;
}

async function safeQuery<T>(fallback: T, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error('Database query failed:', error);
    return fallback;
  }
}

const getCachedStickerCounts = unstable_cache(
  async () => {
    const stickers = await prisma.sticker.findMany({
      include: { _count: { select: { listings: true } } },
    });
    return stickers.map((s) => ({
      id: s.id,
      nameEn: s.nameEn,
      nameRu: s.nameRu,
      color: s.color ?? '#14b8ff',
      icon: s.icon ?? 'sparkle',
      count: s._count.listings,
    }));
  },
  ['sticker-counts'],
  { revalidate: 3600 },
);

const getCachedDealersByType = unstable_cache(
  async (type: 'LOCAL' | 'INTERNATIONAL', limit: number) => {
    const dealers = await prisma.dealer.findMany({
      where: { dealerType: type },
      include: {
        user: {
          select: { id: true, _count: { select: { listings: { where: { status: 'ACTIVE' } } } } },
        },
      },
    });
    return dealers
      .map((dealer) => ({
        id: dealer.id,
        companyName: dealer.companyName,
        companyNameRu: dealer.companyNameRu,
        logo: dealer.logo,
        listingsCount: dealer.user._count.listings,
      }))
      .sort((a, b) => b.listingsCount - a.listingsCount)
      .slice(0, limit);
  },
  ['dealers-by-type'],
  { revalidate: 300 },
);

const getCachedBlogPosts = unstable_cache(
  async (limit: number) => {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      ...(limit > 0 ? { take: limit } : {}),
    });
    return posts.map((post) => ({
      ...post,
      publishedAt: post.publishedAt?.toISOString() ?? null,
    }));
  },
  ['blog-posts'],
  { revalidate: 300 },
);

const getCachedAutoParts = unstable_cache(
  async () => prisma.autoPart.findMany({ orderBy: [{ categoryEn: 'asc' }, { nameEn: 'asc' }] }),
  ['auto-parts'],
  { revalidate: 3600 },
);

export async function getLatestListings(limit = 10) {
  return safeQuery([], async () =>
    (await db()).listing.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: listingCardInclude,
    }),
  );
}

export async function getVipListings(limit = 10) {
  return safeQuery([], async () =>
    (await db()).listing.findMany({
      where: { status: 'ACTIVE', isVip: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: listingCardInclude,
    }),
  );
}

export async function getFeaturedListings(limit = 12) {
  return safeQuery([], async () =>
    (await db()).listing.findMany({
      where: { status: 'ACTIVE', isVip: false },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: listingCardInclude,
    }),
  );
}

export async function getStickerCounts() {
  return safeQuery([], async () => {
    await connection();
    return getCachedStickerCounts();
  });
}

export async function getRecentListingsByCategory(categorySlug: string, limit = 5) {
  return safeQuery([], async () =>
    (await db()).listing.findMany({
      where: { status: 'ACTIVE', category: { slug: categorySlug } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: listingCardInclude,
    }),
  );
}

export async function getDealersByType(type: 'LOCAL' | 'INTERNATIONAL', limit = 6) {
  return safeQuery([], async () => {
    await connection();
    return getCachedDealersByType(type, limit);
  });
}

export async function getBlogPosts(limit?: number) {
  return safeQuery([], async () => {
    await connection();
    return getCachedBlogPosts(limit ?? 0);
  });
}

export async function getBlogPostBySlug(slug: string) {
  return safeQuery(null, async () =>
    (await db()).blogPost.findFirst({ where: { slug, published: true } }),
  );
}

export async function getListingCount() {
  return safeQuery(0, async () => (await db()).listing.count({ where: { status: 'ACTIVE' } }));
}

export async function getAutoParts() {
  return safeQuery([], async () => {
    await connection();
    return getCachedAutoParts();
  });
}

export async function getAutoPartBySlug(slug: string) {
  return safeQuery(null, async () => (await db()).autoPart.findUnique({ where: { slug } }));
}

export async function getRelatedAutoParts(categorySlug: string, excludeSlug: string, limit = 6) {
  return safeQuery([], async () =>
    (await db()).autoPart.findMany({
      where: { categorySlug, slug: { not: excludeSlug } },
      orderBy: { nameEn: 'asc' },
      take: limit,
    }),
  );
}
