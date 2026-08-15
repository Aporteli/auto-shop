import { ListingType, Prisma } from '@prisma/client';

function parseIds(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((id) => Number.isFinite(id));
}

export type ListingSearchQuery = {
  where: Prisma.ListingWhereInput;
  orderBy: Prisma.ListingOrderByWithRelationInput;
  page: number;
  limit: number;
  skip: number;
};

export function buildListingSearchQuery(searchParams: URLSearchParams): ListingSearchQuery {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 20));
  const skip = (page - 1) * limit;

  const categoryId = searchParams.get('categoryId');
  const manufacturerId = searchParams.get('manufacturerId');
  const modelId = searchParams.get('modelId');
  const bodyTypeId = searchParams.get('bodyTypeId');
  const bodyTypeIds = parseIds(searchParams.get('bodyTypeIds'));
  const fuelTypeId = searchParams.get('fuelTypeId');
  const transmissionId = searchParams.get('transmissionId');
  const driveTypeId = searchParams.get('driveTypeId');
  const colorId = searchParams.get('colorId');
  const colorIds = parseIds(searchParams.get('colorIds'));
  const featureIds = parseIds(searchParams.get('featureIds'));
  const stickerIds = parseIds(searchParams.get('stickerIds'));
  const cityId = searchParams.get('cityId');
  const yearFrom = searchParams.get('yearFrom');
  const yearTo = searchParams.get('yearTo');
  const priceFrom = searchParams.get('priceFrom');
  const priceTo = searchParams.get('priceTo');
  const listingType = searchParams.get('listingType');
  const customsCleared = searchParams.get('customsCleared');
  const isVip = searchParams.get('isVip');
  const has360 = searchParams.get('has360');
  const withVin = searchParams.get('withVin');
  const hideNegotiable = searchParams.get('hideNegotiable');
  const engineFrom = searchParams.get('engineFrom');
  const engineTo = searchParams.get('engineTo');
  const mileageFrom = searchParams.get('mileageFrom');
  const mileageTo = searchParams.get('mileageTo');
  const steeringWheel = searchParams.get('steeringWheel');
  const doors = searchParams.get('doors');
  const isNew = searchParams.get('isNew');
  const applicant = searchParams.get('applicant');
  const publishedWithin = searchParams.get('publishedWithin');
  const sort = searchParams.get('sort') || 'date_desc';
  const dealerId = searchParams.get('dealerId');
  const q = searchParams.get('q')?.trim() ?? '';

  const where: Prisma.ListingWhereInput = { status: 'ACTIVE' };
  const andConditions: Prisma.ListingWhereInput[] = [];

  if (categoryId) where.categoryId = Number(categoryId);
  if (manufacturerId) andConditions.push({ model: { manufacturerId: Number(manufacturerId) } });
  if (modelId) where.modelId = Number(modelId);
  if (bodyTypeIds.length > 0) {
    where.bodyTypeId = { in: bodyTypeIds };
  } else if (bodyTypeId) {
    where.bodyTypeId = Number(bodyTypeId);
  }
  if (fuelTypeId) where.fuelTypeId = Number(fuelTypeId);
  if (transmissionId) where.transmissionId = Number(transmissionId);
  if (driveTypeId) where.driveTypeId = Number(driveTypeId);
  if (colorId) where.colorId = Number(colorId);
  if (colorIds.length > 0) where.colorId = { in: colorIds };
  if (cityId) where.cityId = Number(cityId);

  if (listingType && Object.values(ListingType).includes(listingType as ListingType)) {
    where.listingType = listingType as ListingType;
  }

  if (customsCleared === 'true') where.customsCleared = true;
  if (customsCleared === 'false') where.customsCleared = false;
  if (isVip === 'true') where.isVip = true;
  if (has360 === 'true') where.has360 = true;
  if (hideNegotiable === 'true') where.priceNegotiable = false;

  if (withVin === 'true') {
    andConditions.push({ vin: { not: null } }, { vin: { not: '' } });
  }

  if (yearFrom || yearTo) {
    where.year = {};
    if (yearFrom) where.year.gte = Number(yearFrom);
    if (yearTo) where.year.lte = Number(yearTo);
  }

  if (isNew === 'yes') {
    const currentYear = new Date().getFullYear();
    where.year = { ...(where.year as Prisma.IntFilter | undefined), gte: currentYear - 1 };
  } else if (isNew === 'no') {
    const currentYear = new Date().getFullYear();
    where.year = { ...(where.year as Prisma.IntFilter | undefined), lt: currentYear - 1 };
  }

  if (priceFrom || priceTo) {
    where.price = {};
    if (priceFrom) where.price.gte = Number(priceFrom);
    if (priceTo) where.price.lte = Number(priceTo);
  }

  if (mileageFrom || mileageTo) {
    where.mileage = {};
    if (mileageFrom) where.mileage.gte = Number(mileageFrom);
    if (mileageTo) where.mileage.lte = Number(mileageTo);
  }

  if (engineFrom || engineTo) {
    where.engineVolume = {};
    if (engineFrom) where.engineVolume.gte = Number(engineFrom);
    if (engineTo) where.engineVolume.lte = Number(engineTo);
  }

  if (steeringWheel === 'LEFT' || steeringWheel === 'RIGHT') where.steeringWheel = steeringWheel;

  if (doors === '2-3') {
    where.doors = { lte: 3 };
  } else if (doors === '4-5') {
    where.doors = { in: [4, 5] };
  } else if (doors === '5+') {
    where.doors = { gt: 5 };
  }

  if (applicant === 'private') {
    where.user = { role: 'USER', dealership: null };
  } else if (applicant === 'dealer') {
    where.user = { role: 'DEALER' };
  } else if (applicant === 'showroom') {
    where.user = { dealership: { isNot: null } };
  }

  if (dealerId) andConditions.push({ user: { dealership: { id: Number(dealerId) } } });

  if (publishedWithin) {
    const hours = Number(publishedWithin);
    if (Number.isFinite(hours) && hours > 0) {
      where.createdAt = { gte: new Date(Date.now() - hours * 60 * 60 * 1000) };
    }
  }

  for (const featureId of featureIds) {
    andConditions.push({ features: { some: { featureId } } });
  }

  if (stickerIds.length > 0) {
    andConditions.push({ stickers: { some: { stickerId: { in: stickerIds } } } });
  }

  if (q) {
    const yearMatch = Number(q);
    const orConditions: Prisma.ListingWhereInput[] = [
      { titleEn: { contains: q } },
      { titleRu: { contains: q } },
      { model: { nameEn: { contains: q } } },
      { model: { nameRu: { contains: q } } },
      { model: { manufacturer: { nameEn: { contains: q } } } },
      { model: { manufacturer: { nameRu: { contains: q } } } },
      { city: { nameEn: { contains: q } } },
      { city: { nameRu: { contains: q } } },
    ];

    if (Number.isFinite(yearMatch) && q.length === 4) {
      orConditions.push({ year: yearMatch });
    }

    andConditions.push({ OR: orConditions });
  }

  if (andConditions.length > 0) where.AND = andConditions;

  const orderBy: Prisma.ListingOrderByWithRelationInput =
    sort === 'date_asc'
      ? { createdAt: 'asc' }
      : sort === 'price_desc'
        ? { price: 'desc' }
        : sort === 'price_asc'
          ? { price: 'asc' }
          : sort === 'mileage_desc'
            ? { mileage: 'desc' }
            : sort === 'mileage_asc'
              ? { mileage: 'asc' }
              : { createdAt: 'desc' };

  return { where, orderBy, page, limit, skip };
}
