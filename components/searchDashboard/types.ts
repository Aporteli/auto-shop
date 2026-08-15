export type FilterOption = {
  id: number;
  nameEn?: string;
  nameRu?: string;
  year?: number;
  price?: unknown;
};

export type ApiFiltersResponse = {
  manufacturers: Array<{ id: number; nameEn: string; nameRu: string }>;
  bodyTypes: FilterOption[];
  fuelTypes: Array<{ id: number; nameEn: string; nameRu: string }>;
  transmissions: FilterOption[];
  driveTypes: FilterOption[];
  colors: FilterOption[];
  categories: Array<{ id: number; nameEn: string; nameRu: string; slug: string }>;
  countries: Array<{
    id: number;
    nameEn: string;
    nameRu: string;
    cities: Array<{ id: number; nameEn: string; nameRu: string }>;
  }>;
  models: Array<{ id: number; nameEn: string; nameRu: string; manufacturerId: number; manufacturer?: { id: number } | null }>;
  years: number[];
  prices: unknown[];
  features: Array<{ id: number; nameEn: string; nameRu: string }>;
  stickers: Array<{ id: number; nameEn: string; nameRu: string }>;
};

export type ListingsCountResponse = {
  pagination: {
    total: number;
  };
};

export type SearchMode = 'filters' | 'ai';

export type AiMatchedListing = {
  id: number;
  titleEn?: string | null;
  year?: number | null;
  price?: number | string | null;
  currency?: string | null;
  engineVolume?: number | string | null;
  mileage?: number | string | null;
  mileageUnit?: string | null;
};

export type FilterSelectOption = { value: string; label: string };

export type FilterSelectOptions = {
  manufacturerSelectOptions: FilterSelectOption[];
  modelSelectOptions: FilterSelectOption[];
  locationSelectOptions: FilterSelectOption[];
  yearSelectOptions: FilterSelectOption[];
  fuelSelectOptions: FilterSelectOption[];
};

export function carsCategoryId(
  categories: Array<{ id: number; slug: string }> | undefined | null,
): number | null {
  return categories?.find((c) => c.slug === 'cars')?.id ?? null;
}
