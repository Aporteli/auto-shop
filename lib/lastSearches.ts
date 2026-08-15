import { buildListingSearchParams, type SearchFiltersState } from './searchParams';

export type LastSearchEntry = {
  query: string;
  label: string;
  searchedAt: number;
};

export type LastSearchFilterOptions = {
  manufacturers: Array<{ id: number; nameEn: string; nameRu: string }>;
  models: Array<{ id: number; nameEn: string; nameRu: string; manufacturerId: number }>;
  fuelTypes: Array<{ id: number; nameEn: string; nameRu: string }>;
  countries: Array<{
    id: number;
    nameEn: string;
    nameRu: string;
    cities: Array<{ id: number; nameEn: string; nameRu: string }>;
  }>;
};

const STORAGE_KEY = 'autoshop-last-searches';
const MAX_ITEMS = 8;

function labelFor(language: string, item: { nameEn: string; nameRu: string }) {
  return language === 'ru' ? item.nameRu : item.nameEn;
}

export function hasLastSearchContent(filters: SearchFiltersState): boolean {
  return (
    filters.manufacturerId !== '' ||
    filters.modelId !== '' ||
    filters.cityId !== '' ||
    filters.fuelTypeId !== '' ||
    filters.year !== '' ||
    filters.priceFrom !== '' ||
    filters.priceTo !== '' ||
    filters.bodyTypeId !== '' ||
    filters.bodyTypeIds.length > 0 ||
    filters.transmissionId !== '' ||
    filters.driveTypeId !== '' ||
    filters.colorId !== '' ||
    filters.withVin ||
    filters.hideNegotiable ||
    filters.with360 ||
    filters.featureIds.length > 0 ||
    filters.stickerIds.length > 0 ||
    filters.colorIds.length > 0
  );
}

export function buildLastSearchLabel(
  filters: SearchFiltersState,
  options: LastSearchFilterOptions,
  language: string,
): string {
  const parts: string[] = [];

  if (filters.modelId !== '') {
    const model = options.models.find((item) => item.id === filters.modelId);
    if (model) {
      const manufacturer = options.manufacturers.find((item) => item.id === model.manufacturerId);
      parts.push(
        manufacturer
          ? `${labelFor(language, manufacturer)} - ${labelFor(language, model)}`
          : labelFor(language, model),
      );
    }
  } else if (filters.manufacturerId !== '') {
    const manufacturer = options.manufacturers.find((item) => item.id === filters.manufacturerId);
    if (manufacturer) parts.push(labelFor(language, manufacturer));
  }

  if (filters.cityId !== '') {
    for (const country of options.countries) {
      const city = country.cities.find((item) => item.id === filters.cityId);
      if (city) {
        parts.push(labelFor(language, city));
        break;
      }
    }
  }

  if (filters.fuelTypeId !== '') {
    const fuel = options.fuelTypes.find((item) => item.id === filters.fuelTypeId);
    if (fuel) parts.push(labelFor(language, fuel));
  }

  if (filters.year !== '') parts.push(String(filters.year));
  if (filters.priceFrom !== '' || filters.priceTo !== '') {
    if (filters.priceFrom && filters.priceTo) parts.push(`${filters.priceFrom}-${filters.priceTo}`);
    else if (filters.priceFrom) parts.push(`${language === 'ru' ? 'От' : 'From'} ${filters.priceFrom}`);
    else parts.push(`${language === 'ru' ? 'До' : 'To'} ${filters.priceTo}`);
  }

  return parts.join(' · ');
}

export function getLastSearches(): LastSearchEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LastSearchEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addLastSearch(filters: SearchFiltersState, label: string): LastSearchEntry[] {
  if (typeof window === 'undefined') return [];

  const trimmedLabel = label.trim();
  if (!trimmedLabel || !hasLastSearchContent(filters)) {
    return getLastSearches();
  }

  const query = buildListingSearchParams({ ...filters, page: 1 }).toString();
  const existing = getLastSearches().filter((entry) => entry.query !== query);
  const next: LastSearchEntry[] = [
    { query, label: trimmedLabel, searchedAt: Date.now() },
    ...existing,
  ].slice(0, MAX_ITEMS);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
