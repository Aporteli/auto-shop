import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const listings = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      images: { orderBy: { position: 'asc' }, take: 1 },
      model: { include: { manufacturer: true } },
    },
  });

  return NextResponse.json({
    listings: listings.map((listing) => ({
      id: listing.id,
      year: listing.year,
      price: listing.price.toString(),
      currency: listing.currency,
      status: listing.status,
      listingType: listing.listingType,
      createdAt: listing.createdAt,
      titleEn: listing.titleEn,
      titleRu: listing.titleRu,
      imageUrl: listing.images[0]?.url ?? null,
      manufacturerEn: listing.model.manufacturer.nameEn,
      manufacturerRu: listing.model.manufacturer.nameRu,
      modelEn: listing.model.nameEn,
      modelRu: listing.model.nameRu,
    })),
  });
}
