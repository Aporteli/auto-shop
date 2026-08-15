import type { SearchFiltersState } from '../searchParams';

export type SearchFilterChip = {
  id: string;
  label: string;
  clear: Partial<SearchFiltersState>;
};

export type ChipOptions = {
  language: string;
  labels: {
    forSale: string;
    forRent: string;
    customsCleared: string;
    beforeCustoms: string;
    withVin: string;
    hideNegotiable: string;
    with360: string;
    periodHours: string;
    year: string;
    priceFrom: string;
    priceTo: string;
    exchange: string;
    auction: string;
    withVideo: string;
  };
  resolveName: (kind: string, id: number) => string | null;
};
