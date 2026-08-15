import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { listingPriceToUsd, summarizePrices } from '@/lib/priceCalculator';

function num(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

type MatchLevel = 'exact' | 'close' | 'broad';

type Attempt = {
  level: MatchLevel;
  yearSlack: number;
  engineSlack: number | null;
  drive: boolean;
  model: boolean;
};

function buildWhere(input: {
  manufacturerId: number | null;
  modelId: number | null;
  categoryId: number | null;
  driveTypeId: number | null;
  year: number | null;
  yearSlack: number;
  engine: number | null;
  engineSlack: number | null;
}): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {
    status: 'ACTIVE',
    listingType: 'SALE',
    damaged: false,
  };

  if (input.modelId) where.modelId = input.modelId;
  else if (input.manufacturerId) where.model = { manufacturerId: input.manufacturerId };
  if (input.categoryId) where.categoryId = input.categoryId;
  if (input.driveTypeId) where.driveTypeId = input.driveTypeId;

  if (input.year) {
    where.year = {
      gte: input.year - input.yearSlack,
      lte: input.year + input.yearSlack,
    };
  }

  if (input.engine != null && input.engineSlack != null) {
    where.engineVolume = {
      gte: input.engine - input.engineSlack,
      lte: input.engine + input.engineSlack,
    };
  }

  return where;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const manufacturerId = num(searchParams.get('manufacturerId'));
  const modelId = num(searchParams.get('modelId'));
  const categoryId = num(searchParams.get('categoryId'));
  const driveTypeId = num(searchParams.get('driveTypeId'));
  const year = num(searchParams.get('year'));
  const engine = num(searchParams.get('engine'));

  if (!manufacturerId || !modelId) {
    return NextResponse.json({ error: 'manufacturer_and_model_required' }, { status: 400 });
  }

  const attempts: Attempt[] = [
    { level: 'exact', yearSlack: 0, engineSlack: engine == null ? null : 0.2, drive: Boolean(driveTypeId), model: true },
    { level: 'close', yearSlack: 1, engineSlack: engine == null ? null : 0.3, drive: Boolean(driveTypeId), model: true },
    { level: 'close', yearSlack: 2, engineSlack: engine == null ? null : 0.5, drive: false, model: true },
    { level: 'broad', yearSlack: 3, engineSlack: null, drive: false, model: true },
    { level: 'broad', yearSlack: 8, engineSlack: null, drive: false, model: false },
  ];

  let matchLevel: MatchLevel = 'broad';
  let rows: Array<{ price: Prisma.Decimal; currency: 'USD' | 'EUR' | 'GEL' }> = [];

  for (let i = 0; i < attempts.length; i += 1) {
    const attempt = attempts[i];
    const found = await prisma.listing.findMany({
      where: buildWhere({
        manufacturerId,
        modelId: attempt.model ? modelId : null,
        categoryId,
        driveTypeId: attempt.drive ? driveTypeId : null,
        year,
        yearSlack: year ? attempt.yearSlack : 0,
        engine,
        engineSlack: attempt.engineSlack,
      }),
      select: { price: true, currency: true },
      take: 400,
    });

    if (found.length > rows.length) {
      rows = found;
      matchLevel = attempt.level;
    }

    if (found.length >= 8 || (i === attempts.length - 1 && rows.length > 0)) {
      break;
    }
  }

  const summary = summarizePrices(rows.map((row) => listingPriceToUsd(Number(row.price), row.currency)));

  return NextResponse.json({
    sampleSize: rows.length,
    matchLevel,
    estimate: summary,
  });
}
