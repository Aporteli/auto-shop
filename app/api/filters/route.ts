import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function listingYears() {
  const current = new Date().getFullYear();
  return Array.from({ length: current - 1989 }, (_, i) => current - i);
}

const EMPTY_FILTERS = {
  manufacturers: [],
  bodyTypes: [],
  fuelTypes: [],
  transmissions: [],
  driveTypes: [],
  colors: [],
  categories: [],
  countries: [],
  models: [],
  years: listingYears(),
  prices: [] as unknown[],
  features: [],
  stickers: [],
};

export async function GET() {
  try {
    const [manufacturers, bodyTypes, fuelTypes, transmissions] = await Promise.all([
      prisma.manufacturer.findMany({
        orderBy: { nameEn: 'asc' },
        include: { models: { orderBy: { nameEn: 'asc' } } },
      }),
      prisma.bodyType.findMany({ orderBy: { nameEn: 'asc' } }),
      prisma.fuelType.findMany({ orderBy: { nameEn: 'asc' } }),
      prisma.transmission.findMany({ orderBy: { nameEn: 'asc' } }),
    ]);

    const [driveTypes, colors, categories, countries] = await Promise.all([
      prisma.driveType.findMany({ orderBy: { nameEn: 'asc' } }),
      prisma.color.findMany({ orderBy: { nameEn: 'asc' } }),
      prisma.vehicleCategory.findMany({ orderBy: { nameEn: 'asc' } }),
      prisma.country.findMany({
        orderBy: { nameEn: 'asc' },
        include: { cities: { orderBy: { nameEn: 'asc' } } },
      }),
    ]);

    const [models, features, stickers] = await Promise.all([
      prisma.model.findMany({
        orderBy: { nameEn: 'asc' },
        select: { id: true, nameEn: true, nameRu: true, manufacturerId: true },
      }),
      prisma.feature.findMany({ orderBy: { nameEn: 'asc' } }),
      prisma.sticker.findMany({ orderBy: { nameEn: 'asc' } }),
    ]);

    return NextResponse.json({
      manufacturers,
      bodyTypes,
      fuelTypes,
      transmissions,
      driveTypes,
      colors,
      categories,
      countries,
      models,
      years: listingYears(),
      prices: [],
      features,
      stickers,
    });
  } catch (error) {
    console.error('GET /api/filters failed:', error);
    return NextResponse.json(EMPTY_FILTERS);
  }
}
