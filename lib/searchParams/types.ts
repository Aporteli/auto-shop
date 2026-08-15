import {
  defaultAdditionalFilterFields,
  type AdditionalFilterFields,
} from '../additionalFilters';

export type SearchFiltersState = {
  q?: string;
  categoryId: number | null;
  saleType: 'all' | 'sale' | 'rent';
  customsType: 'cleared' | 'before' | 'all';
  manufacturerId: number | '';
  modelId: number | '';
  cityId: number | '';
  year: number | '';
  yearFrom: number | '';
  yearTo: number | '';
  priceFrom: string | '';
  priceTo: string | '';
  fuelTypeId: number | '';
  bodyTypeId: number | '';
  bodyTypeIds: number[];
  transmissionId: number | '';
  driveTypeId: number | '';
  colorId: number | '';
  withVin: boolean;
  hideNegotiable: boolean;
  with360: boolean;
  dealerId: number | '';
  sort: SearchSort;
  page?: number;
} & AdditionalFilterFields;

export type SearchSort =
  | 'date_desc'
  | 'date_asc'
  | 'price_desc'
  | 'price_asc'
  | 'mileage_desc'
  | 'mileage_asc';

export const SEARCH_SORT_OPTIONS: SearchSort[] = [
  'date_desc',
  'date_asc',
  'price_desc',
  'price_asc',
  'mileage_desc',
  'mileage_asc',
];

export const SEARCH_PERIOD_HOURS = ['1', '3', '6', '12', '24'] as const;

export const defaultSearchFilters = (): SearchFiltersState => ({
  q: '',
  categoryId: null,
  saleType: 'all',
  customsType: 'all',
  manufacturerId: '',
  modelId: '',
  cityId: '',
  year: '',
  yearFrom: '',
  yearTo: '',
  priceFrom: '',
  priceTo: '',
  fuelTypeId: '',
  bodyTypeId: '',
  bodyTypeIds: [],
  transmissionId: '',
  driveTypeId: '',
  colorId: '',
  withVin: false,
  hideNegotiable: false,
  with360: false,
  dealerId: '',
  sort: 'date_desc',
  ...defaultAdditionalFilterFields(),
});
