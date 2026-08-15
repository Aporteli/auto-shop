import type { SearchFiltersState } from './searchParams';
import { defaultSearchFilters } from './searchParams';
import { appendIdentityChips } from './searchFilterChips/identityChips';
import { appendFlagChips } from './searchFilterChips/flagChips';
import type { ChipOptions, SearchFilterChip } from './searchFilterChips/types';

export type { SearchFilterChip };

export function buildSearchFilterChips(
  filters: SearchFiltersState,
  options: ChipOptions,
): SearchFilterChip[] {
  const chips: SearchFilterChip[] = [];
  appendIdentityChips(chips, filters, options);
  appendFlagChips(chips, filters, options);
  return chips;
}

export function hasActiveSearchFilterChips(filters: SearchFiltersState) {
  return buildSearchFilterChips(filters, {
    language: 'en',
    labels: {
      forSale: 'sale',
      forRent: 'rent',
      customsCleared: 'cleared',
      beforeCustoms: 'before',
      withVin: 'vin',
      hideNegotiable: 'negotiable',
      with360: '360',
      periodHours: '{{hours}}',
      year: 'y',
      priceFrom: 'from',
      priceTo: 'to',
      exchange: 'exchange',
      auction: 'auction',
      withVideo: 'video',
    },
    resolveName: () => 'x',
  }).length > 0;
}

export function clearAllSearchFilters(): SearchFiltersState {
  return defaultSearchFilters();
}
