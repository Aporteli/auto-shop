import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [
    manufacturers,
    bodyTypes,
    fuelTypes,
    transmissions,
    driveTypes,
    colors,
    categories,
    countries,
    models,
    years,
    prices,
    features,
    stickers,
  ] = await Promise.all([
    prisma.manufacturer.findMany({
      orderBy: { nameEn: 'asc' },
      include: { models: { orderBy: { nameEn: 'asc' } } },
    }),
    prisma.bodyType.findMany({ orderBy: { nameEn: 'asc' } }),
    prisma.fuelType.findMany({ orderBy: { nameEn: 'asc' } }),
    prisma.transmission.findMany({ orderBy: { nameEn: 'asc' } }),
    prisma.driveType.findMany({ orderBy: { nameEn: 'asc' } }),
    prisma.color.findMany({ orderBy: { nameEn: 'asc' } }),
    prisma.vehicleCategory.findMany({ orderBy: { nameEn: 'asc' } }),
    prisma.country.findMany({
      orderBy: { nameEn: 'asc' },
      include: { cities: { orderBy: { nameEn: 'asc' } } },
    }),
    prisma.model.findMany({
      orderBy: { nameEn: 'asc' },
      include: { manufacturer: true },
    }),
    prisma.listing.findMany({
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'desc' },
    }),
    prisma.listing.findMany({
      select: { price: true },
      distinct: ['price'],
      orderBy: { price: 'asc' },
      take: 30,
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
    years: years.map((y) => y.year),
    prices: prices.map((p) => p.price),
    features,
    stickers,
  });
}
