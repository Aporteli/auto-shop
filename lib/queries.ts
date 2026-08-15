import { prisma } from './prisma';

export async function getLatestListings(limit = 10) {
  return prisma.listing.findMany({
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
  return prisma.listing.findMany({
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
  return prisma.listing.findMany({
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
  const stickers = await prisma.sticker.findMany({
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
  return prisma.listing.findMany({
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
  const dealers = await prisma.dealer.findMany({
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
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    ...(limit ? { take: limit } : {}),
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, published: true },
  });
}

export async function getListingCount() {
  return prisma.listing.count({ where: { status: 'ACTIVE' } });
}

export async function getAutoParts() {
  return prisma.autoPart.findMany({
    orderBy: [{ categoryEn: 'asc' }, { nameEn: 'asc' }],
  });
}

export async function getAutoPartBySlug(slug: string) {
  return prisma.autoPart.findUnique({
    where: { slug },
  });
}

export async function getRelatedAutoParts(categorySlug: string, excludeSlug: string, limit = 6) {
  return prisma.autoPart.findMany({
    where: { categorySlug, slug: { not: excludeSlug } },
    orderBy: { nameEn: 'asc' },
    take: limit,
  });
}
