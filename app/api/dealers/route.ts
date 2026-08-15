import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() ?? '';
    const type = searchParams.get('type');
    const dealerType = type === 'LOCAL' || type === 'INTERNATIONAL' ? (type as 'LOCAL' | 'INTERNATIONAL') : undefined;

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

    const formattedDealers = (dealers || []).map((dealer) => ({
      id: dealer.id,
      companyName: dealer.companyName,
      companyNameRu: dealer.companyNameRu,
      logo: dealer.logo,
      address: dealer.address,
      addressRu: dealer.addressRu,
      phone: dealer.phone ?? dealer.user?.phone ?? null,
      email: dealer.user?.email ?? null,
      website: dealer.website,
      dealerType: dealer.dealerType,
      verified: dealer.verified,
      listingsCount: dealer.user?._count?.listings ?? 0,
    }));

    return NextResponse.json({
      dealers: formattedDealers,
      total: formattedDealers.length,
    });
  } catch (error: any) {
    console.error('Error fetching dealers in /api/dealers:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch dealers',
        dealers: [],
        total: 0 
      },
      { status: 500 }
    );
  }
}