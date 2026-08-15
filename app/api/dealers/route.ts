import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const type = searchParams.get('type');
  const dealerType = type === 'LOCAL' || type === 'INTERNATIONAL' ? type : undefined;

  const dealers = await prisma.dealer.findMany({
    where: {
      ...(dealerType ? { dealerType } : {}),
      ...(q
        ? {
            OR: [
              { companyName: { contains: q } },
              { companyNameRu: { contains: q } },
              { address: { contains: q } },
              { addressRu: { contains: q } },
              { phone: { contains: q } },
              { user: { email: { contains: q } } },
            ],
          }
        : {}),
    },
    orderBy: { companyName: 'asc' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          _count: { select: { listings: { where: { status: 'ACTIVE' } } } },
        },
      },
    },
  });

  return NextResponse.json({
    dealers: dealers.map((dealer) => ({
      id: dealer.id,
      companyName: dealer.companyName,
      companyNameRu: dealer.companyNameRu,
      logo: dealer.logo,
      address: dealer.address,
      addressRu: dealer.addressRu,
      phone: dealer.phone ?? dealer.user.phone,
      email: dealer.user.email,
      website: dealer.website,
      dealerType: dealer.dealerType,
      verified: dealer.verified,
      listingsCount: dealer.user._count.listings,
    })),
    total: dealers.length,
  });
}
