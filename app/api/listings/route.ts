import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createListing } from '@/lib/createListing';
import { buildListingSearchQuery } from '@/lib/listingSearch';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { where, orderBy, page, limit, skip } = buildListingSearchQuery(searchParams);

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        model: { include: { manufacturer: true } },
        category: true,
        bodyType: true,
        fuelType: true,
        transmission: true,
        driveType: true,
        color: true,
        city: { include: { country: true } },
        images: { orderBy: { position: 'asc' }, take: 5 },
        stickers: { include: { sticker: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await createListing(user, await request.json());
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (error) {
    console.error('Create listing failed:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
