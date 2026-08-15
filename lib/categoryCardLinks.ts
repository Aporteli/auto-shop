import { resolveCategoryBodyTypes } from './categoryBodyTypes';
import { buildListingSearchParams, defaultSearchFilters } from './searchParams';

export type CategoryCardConfig = {
  slug: 'custom-vehicles' | 'motorcycles';
  localeKey: 'customVehicles' | 'motorcycles';
  imageUrl: string;
  /** Body type keys (English names), first half = column 1, second half = column 2 */
  bodyTypeKeys: string[];
};

export const CATEGORY_CARDS: CategoryCardConfig[] = [
  {
    slug: 'custom-vehicles',
    localeKey: 'customVehicles',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7',
    bodyTypeKeys: [
      'Semi-trailer truck',
      'Dump truck',
      'Cranes',
      'Custom machinery',
      'Loader',
      'Truck',
      'Agricultural',
      'Excavators',
      'Trailer',
      'Concrete pump truck',
    ],
  },
  {
    slug: 'motorcycles',
    localeKey: 'motorcycles',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
    bodyTypeKeys: [
      'Motorcycle',
      'Quad bike',
      'Tricycle',
      'Snowmobile',
      'Trailer for motorcycle',
      'Scooter',
      'Water transport',
      'Buggy',
      'Trailer for boat',
      'Karting-car',
    ],
  },
];

type CategoryRef = { id: number; slug: string };
type BodyTypeRef = { id: number; nameEn: string; nameRu: string };

export function buildCategorySearchHref(
  categorySlug: string,
  categories: CategoryRef[],
  bodyTypes: BodyTypeRef[],
  bodyTypeKey?: string,
): string {
  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) return '/search';

  const filters = {
    ...defaultSearchFilters(),
    categoryId: category.id,
    bodyTypeIds: [] as number[],
    bodyTypeId: '' as const,
  };

  if (bodyTypeKey) {
    const resolved = resolveCategoryBodyTypes(categorySlug, bodyTypes);
    const match = resolved.find((option) => option.key === bodyTypeKey || option.nameEn === bodyTypeKey);
    if (match?.ids.length) {
      filters.bodyTypeIds = match.ids;
    }
  }

  return `/search?${buildListingSearchParams(filters).toString()}`;
}

export function labelForCategoryBodyType(
  categorySlug: string,
  bodyTypes: BodyTypeRef[],
  bodyTypeKey: string,
  language: string,
): string {
  const resolved = resolveCategoryBodyTypes(categorySlug, bodyTypes);
  const match = resolved.find((option) => option.key === bodyTypeKey || option.nameEn === bodyTypeKey);
  if (!match) return bodyTypeKey;
  return language === 'ru' ? match.nameRu : match.nameEn;
}

export function splitCategoryCardColumns(keys: string[]): [string[], string[]] {
  const midpoint = Math.ceil(keys.length / 2);
  return [keys.slice(0, midpoint), keys.slice(midpoint)];
}
