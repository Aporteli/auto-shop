import type { SearchResultListing } from '@/components/SearchResultCard';

export const RESULTS_PAGE_SIZE = 40;

export type FilterOption = { id: number; nameEn: string; nameRu: string };

export type ApiFiltersResponse = {
  manufacturers: FilterOption[];
  models: Array<FilterOption & { manufacturerId: number }>;
  fuelTypes: FilterOption[];
  bodyTypes: FilterOption[];
  transmissions: FilterOption[];
  driveTypes: FilterOption[];
  colors: FilterOption[];
  categories: Array<FilterOption & { slug: string }>;
  countries: Array<{
    id: number;
    nameEn: string;
    nameRu: string;
    cities: Array<{ id: number; nameEn: string; nameRu: string }>;
  }>;
  years: number[];
  prices: unknown[];
};

export type ListingsResponse = {
  listings: SearchResultListing[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type OpenMenu = 'period' | 'sort' | null;
export type ViewMode = 'list' | 'grid';

export type SelectOption = { value: string; label: string };

export function localizedName(item: { nameEn: string; nameRu: string }, language: string) {
  return language === 'ru' ? item.nameRu : item.nameEn;
}
