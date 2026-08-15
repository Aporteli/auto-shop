import { connection } from 'next/server';
import { prisma } from './prisma';

async function db() {
  await connection();
  return prisma;
}

export async function getLatestListings(limit = 10) {
  return (await db()).listing.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      model: { include: { manufacturer: true } },
      bodyType: true,
      fuelType: true,
      city: { include: { country: true } },
      images: { orderBy: { position: 'asc' }, take: 1 },
    },
  });
}

export async function getVipListings(limit = 10) {
  return (await db()).listing.findMany({
    where: { status: 'ACTIVE', isVip: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      model: { include: { manufacturer: true } },
      bodyType: true,
      fuelType: true,
      city: { include: { country: true } },
      images: { orderBy: { position: 'asc' }, take: 1 },
    },
  });
}

export async function getFeaturedListings(limit = 12) {
  return (await db()).listing.findMany({
    where: { status: 'ACTIVE', isVip: false },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      model: { include: { manufacturer: true } },
      bodyType: true,
      fuelType: true,
      city: { include: { country: true } },
      images: { orderBy: { position: 'asc' }, take: 1 },
    },
  });
}

export async function getStickerCounts() {
  const stickers = await (await db()).sticker.findMany({
    include: {
      _count: { select: { listings: true } },
    },
  });

  return stickers.map((s) => ({
    id: s.id,
    nameEn: s.nameEn,
    nameRu: s.nameRu,
    color: s.color ?? '#14b8ff',
    icon: s.icon ?? 'sparkle',
    count: s._count.listings,
  }));
}

export async function getRecentListingsByCategory(categorySlug: string, limit = 5) {
  return (await db()).listing.findMany({
    where: {
      status: 'ACTIVE',
      category: { slug: categorySlug },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      model: { include: { manufacturer: true } },
      bodyType: true,
      fuelType: true,
      city: { include: { country: true } },
      images: { orderBy: { position: 'asc' }, take: 1 },
    },
  });
}

export async function getDealersByType(type: 'LOCAL' | 'INTERNATIONAL', limit = 6) {
  const dealers = await (await db()).dealer.findMany({
    where: { dealerType: type },
    include: {
      user: {
        select: {
          id: true,
          _count: { select: { listings: { where: { status: 'ACTIVE' } } } },
        },
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
}

export async function getBlogPosts(limit?: number) {
  return (await db()).blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    ...(limit ? { take: limit } : {}),
  });
}

export async function getBlogPostBySlug(slug: string) {
  return (await db()).blogPost.findFirst({
    where: { slug, published: true },
  });
}

export async function getListingCount() {
  return (await db()).listing.count({ where: { status: 'ACTIVE' } });
}

export async function getAutoParts() {
  return (await db()).autoPart.findMany({
    orderBy: [{ categoryEn: 'asc' }, { nameEn: 'asc' }],
  });
}

export async function getAutoPartBySlug(slug: string) {
  return (await db()).autoPart.findUnique({
    where: { slug },
  });
}

export async function getRelatedAutoParts(categorySlug: string, excludeSlug: string, limit = 6) {
  return (await db()).autoPart.findMany({
    where: { categorySlug, slug: { not: excludeSlug } },
    orderBy: { nameEn: 'asc' },
    take: limit,
  });
}
