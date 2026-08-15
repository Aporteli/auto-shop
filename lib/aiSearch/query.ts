import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { AI_SEARCH_LIMIT, type AiListingResult, type ExtractedFilters } from './types';

function nameContains(value: string) {
  return {
    OR: [{ nameEn: { contains: value } }, { nameRu: { contains: value } }],
  };
}

async function findByBilingualName(
  delegate: {
    findFirst: (args: {
      where: ReturnType<typeof nameContains>;
      select: { id: true };
    }) => Promise<{ id: number } | null>;
  },
  name: string | null,
): Promise<number | null> {
  if (!name) return null;
  const row = await delegate.findFirst({
    where: nameContains(name),
    select: { id: true },
  });
  return row?.id ?? null;
}

export async function searchListingsFromFilters(filters: ExtractedFilters): Promise<{
  listings: AiListingResult[];
  total: number;
}> {
  const [manufacturerId, colorId, fuelTypeId, transmissionId, cityId] = await Promise.all([
    findByBilingualName(prisma.manufacturer, filters.manufacturer),
    findByBilingualName(prisma.color, filters.color),
    findByBilingualName(prisma.fuelType, filters.fuelType),
    findByBilingualName(prisma.transmission, filters.transmission),
    findByBilingualName(prisma.city, filters.city),
  ]);

  const bodyTypeIds = (
    await Promise.all((filters.bodyTypes ?? []).map((name) => findByBilingualName(prisma.bodyType, name)))
  ).filter((id): id is number => id != null);

  let modelId: number | null = null;
  if (filters.model) {
    const model = await prisma.model.findFirst({
      where: {
        AND: [
          nameContains(filters.model),
          manufacturerId ? { manufacturerId } : {},
        ],
      },
      select: { id: true },
    });
    modelId = model?.id ?? null;
  }

  const where: Prisma.ListingWhereInput = { status: 'ACTIVE' };
  const andConditions: Prisma.ListingWhereInput[] = [];

  if (modelId) {
    where.modelId = modelId;
  } else if (manufacturerId) {
    andConditions.push({ model: { manufacturerId } });
  } else if (filters.manufacturer) {
    andConditions.push({
      OR: [
        { titleEn: { contains: filters.manufacturer } },
        { titleRu: { contains: filters.manufacturer } },
        { model: { manufacturer: { nameEn: { contains: filters.manufacturer } } } },
        { model: { manufacturer: { nameRu: { contains: filters.manufacturer } } } },
      ],
    });
  }

  if (!modelId && filters.model) {
    andConditions.push({
      OR: [
        { titleEn: { contains: filters.model } },
        { titleRu: { contains: filters.model } },
        { model: { nameEn: { contains: filters.model } } },
        { model: { nameRu: { contains: filters.model } } },
      ],
    });
  }

  if (colorId) where.colorId = colorId;
  else if (filters.color) {
    andConditions.push({
      OR: [
        { color: { nameEn: { contains: filters.color } } },
        { color: { nameRu: { contains: filters.color } } },
        { interiorColorEn: { contains: filters.color } },
        { interiorColorRu: { contains: filters.color } },
      ],
    });
  }

  if (fuelTypeId) where.fuelTypeId = fuelTypeId;
  if (transmissionId) where.transmissionId = transmissionId;
  if (bodyTypeIds.length === 1) where.bodyTypeId = bodyTypeIds[0];
  else if (bodyTypeIds.length > 1) where.bodyTypeId = { in: [...new Set(bodyTypeIds)] };
  else if (filters.bodyTypes && filters.bodyTypes.length > 0) {
    andConditions.push({
      OR: filters.bodyTypes.flatMap((name) => [
        { bodyType: { nameEn: { contains: name } } },
        { bodyType: { nameRu: { contains: name } } },
      ]),
    });
  }
  if (cityId) where.cityId = cityId;
  else if (filters.city) {
    andConditions.push({
      OR: [
        { city: { nameEn: { contains: filters.city } } },
        { city: { nameRu: { contains: filters.city } } },
      ],
    });
  }

  if (filters.listingType) where.listingType = filters.listingType;
  if (filters.steeringWheel) where.steeringWheel = filters.steeringWheel;
  if (filters.customsCleared != null) where.customsCleared = filters.customsCleared;
  if (filters.currency) where.currency = filters.currency;

  if (filters.minYear != null || filters.maxYear != null) {
    where.year = {};
    if (filters.minYear != null) where.year.gte = filters.minYear;
    if (filters.maxYear != null) where.year.lte = filters.maxYear;
  }

  if (filters.minPrice != null || filters.maxPrice != null) {
    where.price = {};
    if (filters.minPrice != null) where.price.gte = filters.minPrice;
    if (filters.maxPrice != null) where.price.lte = filters.maxPrice;
  }

  if (filters.minMileage != null || filters.maxMileage != null) {
    where.mileage = {};
    if (filters.minMileage != null) where.mileage.gte = Math.round(filters.minMileage);
    if (filters.maxMileage != null) where.mileage.lte = Math.round(filters.maxMileage);
  }

  let engineFrom = filters.engineFrom;
  let engineTo = filters.engineTo;
  if (engineFrom == null && engineTo == null && filters.engineVolume != null) {
    engineFrom = Math.max(0.1, Number((filters.engineVolume - 0.2).toFixed(1)));
    engineTo = Number((filters.engineVolume + 0.2).toFixed(1));
  }
  if (engineFrom != null || engineTo != null) {
    where.engineVolume = {};
    if (engineFrom != null) where.engineVolume.gte = engineFrom;
    if (engineTo != null) where.engineVolume.lte = engineTo;
  }

  if (andConditions.length > 0) where.AND = andConditions;

  const [rows, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      take: AI_SEARCH_LIMIT,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        titleEn: true,
        year: true,
        price: true,
        currency: true,
        engineVolume: true,
        mileage: true,
        mileageUnit: true,
        model: { select: { nameEn: true, manufacturer: { select: { nameEn: true } } } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  const listings: AiListingResult[] = rows.map((listing) => ({
    id: listing.id,
    titleEn:
      listing.titleEn?.trim() ||
      `${listing.year} ${listing.model.manufacturer.nameEn} ${listing.model.nameEn}`,
    year: listing.year,
    price: listing.price.toString(),
    currency: listing.currency,
    engineVolume: listing.engineVolume != null ? listing.engineVolume.toString() : null,
    mileage: listing.mileage,
    mileageUnit: listing.mileageUnit,
  }));

  return { listings, total };
}
