import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { autoPartSearchText, type AutoPartSort } from '@/lib/autoParts';

function parseSort(value: string | null): AutoPartSort {
  if (value === 'name-desc' || value === 'category') return value;
  return 'name-asc';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim().toLowerCase() ?? '';
  const category = searchParams.get('category')?.trim() ?? '';
  const sort = parseSort(searchParams.get('sort'));
  const language = searchParams.get('lang') === 'ru' ? 'ru' : 'en';

  const parts = await prisma.autoPart.findMany();
  const categories = Array.from(
    new Map(
      parts.map((part) => [
        part.categorySlug,
        { slug: part.categorySlug, nameEn: part.categoryEn, nameRu: part.categoryRu },
      ]),
    ).values(),
  ).sort((a, b) => a.nameEn.localeCompare(b.nameEn));

  const scoped = category ? parts.filter((part) => part.categorySlug === category) : parts;
  const filtered = q
    ? scoped.filter((part) => autoPartSearchText(part).includes(q))
    : scoped;

  const sorted = [...filtered].sort((a, b) => {
    const nameA = language === 'ru' ? a.nameRu : a.nameEn;
    const nameB = language === 'ru' ? b.nameRu : b.nameEn;
    const categoryA = language === 'ru' ? a.categoryRu : a.categoryEn;
    const categoryB = language === 'ru' ? b.categoryRu : b.categoryEn;

    if (sort === 'category') {
      const byCategory = categoryA.localeCompare(categoryB, language, { sensitivity: 'base' });
      if (byCategory !== 0) return byCategory;
      return nameA.localeCompare(nameB, language, { sensitivity: 'base' });
    }

    const byName = nameA.localeCompare(nameB, language, { sensitivity: 'base' });
    return sort === 'name-desc' ? -byName : byName;
  });

  return NextResponse.json({
    parts: sorted,
    categories,
    total: sorted.length,
  });
}
