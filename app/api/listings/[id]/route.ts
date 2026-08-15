import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { listingInclude } from '@/lib/listingDetail';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid listing id' }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: listingInclude,
  });

  if (!listing || !['ACTIVE', 'DRAFT', 'MODERATION'].includes(listing.status)) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  if (listing.status === 'ACTIVE') {
    await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  const similar = await prisma.listing.findMany({
    where: {
      status: 'ACTIVE',
      id: { not: id },
      OR: [
        { categoryId: listing.categoryId, model: { manufacturerId: listing.model.manufacturerId } },
        { categoryId: listing.categoryId, bodyTypeId: listing.bodyTypeId ?? undefined },
        { categoryId: listing.categoryId },
      ],
    },
    take: 16,
    orderBy: { createdAt: 'desc' },
    include: {
      model: { include: { manufacturer: true } },
      bodyType: true,
      fuelType: true,
      color: true,
      city: true,
      images: { orderBy: { position: 'asc' }, take: 1 },
    },
  });

  return NextResponse.json({ listing, similar });
}
