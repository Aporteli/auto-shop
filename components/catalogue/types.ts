import { defaultSearchFilters, type SearchFiltersState } from '@/lib/searchParams';

export type FilterOption = { id: number; nameEn: string; nameRu: string };

export type ApiFiltersResponse = {
  manufacturers: Array<FilterOption & { models?: FilterOption[] }>;
  models: Array<FilterOption & { manufacturerId: number }>;
  fuelTypes: FilterOption[];
  transmissions: FilterOption[];
  driveTypes: FilterOption[];
  bodyTypes: FilterOption[];
  categories: Array<FilterOption & { slug: string }>;
  countries: Array<{
    id: number;
    nameEn: string;
    nameRu: string;
    cities: Array<{ id: number; nameEn: string; nameRu: string }>;
  }>;
  years: number[];
};

export type Brand = {
  id: number;
  nameEn: string;
  nameRu: string;
  logo: string | null;
  country: string | null;
  listingsCount: number;
};

export const ENGINE_VOLUMES = [
  '0.8', '1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '2.2', '2.4', '2.5', '2.7', '3.0', '3.5', '4.0', '4.4', '5.0', '6.0',
];
export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);
export const INITIAL_BRAND_ROWS = 24;
export const POPULAR_COUNT = 10;

export const defaultCatalogueFilters = (): SearchFiltersState => ({
  ...defaultSearchFilters(),
  customsType: 'all',
});

export function brandInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '#';
}

export function brandAccent(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hues = [18, 28, 205, 222, 198, 160];
  return hues[Math.abs(hash) % hues.length];
}
