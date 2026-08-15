import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

function serializeFavorite(listing: {
  id: number;
  year: number;
  price: { toString(): string };
  currency: string;
  status: string;
  titleEn: string | null;
  titleRu: string | null;
  images: Array<{ url: string }>;
  model: {
    nameEn: string;
    nameRu: string;
    manufacturer: { nameEn: string; nameRu: string };
  };
}) {
  return {
    id: listing.id,
    year: listing.year,
    price: listing.price.toString(),
    currency: listing.currency,
    status: listing.status,
    titleEn: listing.titleEn,
    titleRu: listing.titleRu,
    imageUrl: listing.images[0]?.url ?? null,
    manufacturerEn: listing.model.manufacturer.nameEn,
    manufacturerRu: listing.model.manufacturer.nameRu,
    modelEn: listing.model.nameEn,
    modelRu: listing.model.nameRu,
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        include: {
          images: { orderBy: { position: 'asc' }, take: 1 },
          model: { include: { manufacturer: true } },
        },
      },
    },
  });

  const listings = favorites.map(({ listing }) => serializeFavorite(listing));

  return NextResponse.json({
    listingIds: listings.map((listing) => listing.id),
    listings,
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let listingId = 0;
  try {
    const body = (await request.json()) as { listingId?: unknown };
    listingId = Number(body.listingId);
  } catch {
    return NextResponse.json({ error: 'Invalid listing' }, { status: 400 });
  }

  if (!Number.isInteger(listingId) || listingId <= 0) {
    return NextResponse.json({ error: 'Invalid listing' }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true },
  });
  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_listingId: { userId: user.id, listingId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false, listingId });
  }

  await prisma.favorite.create({
    data: { userId: user.id, listingId },
  });
  return NextResponse.json({ saved: true, listingId });
}
