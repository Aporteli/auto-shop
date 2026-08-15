import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [manufacturers, grouped] = await Promise.all([
    prisma.manufacturer.findMany({
      orderBy: { nameEn: 'asc' },
      select: {
        id: true,
        nameEn: true,
        nameRu: true,
        logo: true,
        country: true,
      },
    }),
    prisma.listing.groupBy({
      by: ['modelId'],
      where: { status: 'ACTIVE' },
      _count: { _all: true },
    }),
  ]);

  const models = await prisma.model.findMany({
    select: { id: true, manufacturerId: true },
  });

  const manufacturerByModel = new Map(models.map((model) => [model.id, model.manufacturerId]));
  const counts = new Map<number, number>();

  for (const row of grouped) {
    const manufacturerId = manufacturerByModel.get(row.modelId);
    if (!manufacturerId) continue;
    counts.set(manufacturerId, (counts.get(manufacturerId) ?? 0) + row._count._all);
  }

  const brands = manufacturers.map((item) => ({
    ...item,
    listingsCount: counts.get(item.id) ?? 0,
  }));

  return NextResponse.json({ brands });
}
