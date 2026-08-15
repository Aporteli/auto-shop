import {
  Currency,
  ListingStatus,
  ListingType,
  MileageUnit,
  SteeringWheel,
} from '@prisma/client';
import { interiorColorLabel, interiorMaterialLabel } from '@/lib/addListing';
import type { SessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type CreateListingBody = {
  status?: ListingStatus;
  categoryId?: number;
  listingType?: ListingType;
  modelId?: number;
  bodyTypeId?: number | null;
  fuelTypeId?: number | null;
  transmissionId?: number | null;
  driveTypeId?: number | null;
  colorId?: number | null;
  cityId?: number | null;
  year?: number;
  price?: string | number;
  currency?: Currency;
  priceNegotiable?: boolean;
  mileage?: number | null;
  mileageUnit?: MileageUnit;
  engineVolume?: string | number | null;
  cylinders?: number | null;
  isTurbo?: boolean;
  steeringWheel?: SteeringWheel;
  airbags?: number | null;
  customsCleared?: boolean;
  techInspection?: boolean;
  exchange?: boolean;
  vin?: string | null;
  trim?: string;
  descriptionEn?: string;
  descriptionRu?: string;
  interiorMaterial?: string;
  interiorColor?: string;
  featureIds?: number[];
  stickerIds?: number[];
  imageUrls?: string[];
  videoUrl?: string | null;
  isVip?: boolean;
  contactName?: string;
  contactPhone?: string;
};

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export type CreateListingResult =
  | { id: number }
  | { error: string; status: 400 };

export async function createListing(
  user: SessionUser,
  rawBody: unknown,
): Promise<CreateListingResult> {
  const body = rawBody as CreateListingBody;
  const status: ListingStatus = body.status === 'DRAFT' ? 'DRAFT' : 'ACTIVE';

  if (!body.categoryId || !body.modelId || !body.year) {
    return { error: 'Missing required fields', status: 400 };
  }

  if (status === 'ACTIVE') {
    if (!body.price || !body.cityId) {
      return { error: 'Price and location are required to publish', status: 400 };
    }
  }

  if (body.contactName?.trim() || body.contactPhone?.trim()) {
    const nameParts = (body.contactName?.trim() || `${user.firstName} ${user.lastName}`).split(/\s+/);
    const firstName = nameParts[0] || user.firstName;
    const lastName = nameParts.slice(1).join(' ') || user.lastName;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        phone: body.contactPhone?.trim() || user.phone,
      },
    });
  }

  const model = await prisma.model.findUnique({
    where: { id: body.modelId },
    include: { manufacturer: true },
  });

  if (!model) {
    return { error: 'Invalid model', status: 400 };
  }

  const trimPart = body.trim?.trim() ? ` ${body.trim.trim()}` : '';
  const titleEn = `${body.year} ${model.manufacturer.nameEn} ${model.nameEn}${trimPart}`;
  const titleRu = `${body.year} ${model.manufacturer.nameRu} ${model.nameRu}${trimPart}`;

  const interiorMaterialEn = body.interiorMaterial
    ? interiorMaterialLabel(body.interiorMaterial, 'en')
    : null;
  const interiorMaterialRu = body.interiorMaterial
    ? interiorMaterialLabel(body.interiorMaterial, 'ru')
    : null;
  const interiorColorEn = body.interiorColor ? interiorColorLabel(body.interiorColor, 'en') : null;
  const interiorColorRu = body.interiorColor ? interiorColorLabel(body.interiorColor, 'ru') : null;

  const listing = await prisma.listing.create({
    data: {
      userId: user.id,
      modelId: body.modelId,
      categoryId: body.categoryId,
      bodyTypeId: body.bodyTypeId ?? null,
      fuelTypeId: body.fuelTypeId ?? null,
      transmissionId: body.transmissionId ?? null,
      driveTypeId: body.driveTypeId ?? null,
      colorId: body.colorId ?? null,
      cityId: body.cityId ?? null,
      listingType: body.listingType ?? 'SALE',
      status,
      year: body.year,
      price: body.price ?? 0,
      currency: body.currency ?? 'USD',
      priceNegotiable: body.priceNegotiable ?? false,
      mileage: parseNumber(body.mileage),
      mileageUnit: body.mileageUnit ?? 'KM',
      engineVolume: body.engineVolume != null && body.engineVolume !== '' ? body.engineVolume : null,
      cylinders: parseNumber(body.cylinders),
      isTurbo: body.isTurbo ?? false,
      steeringWheel: body.steeringWheel ?? 'LEFT',
      airbags: parseNumber(body.airbags),
      customsCleared: body.customsCleared ?? false,
      techInspection: body.techInspection ?? false,
      exchange: body.exchange ?? false,
      vin: body.vin?.trim() || null,
      isVip: body.isVip ?? false,
      titleEn,
      titleRu,
      descriptionEn: body.descriptionEn?.trim() || null,
      descriptionRu: body.descriptionRu?.trim() || null,
      interiorMaterialEn,
      interiorMaterialRu,
      interiorColorEn,
      interiorColorRu,
      images: {
        create: (body.imageUrls ?? []).slice(0, 15).map((url, position) => ({
          url,
          position,
        })),
      },
      features: {
        create: (body.featureIds ?? []).map((featureId) => ({ featureId })),
      },
      stickers: {
        create: (body.stickerIds ?? []).slice(0, 3).map((stickerId) => ({ stickerId })),
      },
    },
  });

  return { id: listing.id };
}
