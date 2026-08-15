export type FilterOption = { id: number; nameEn: string; nameRu: string };

export type FiltersResponse = {
  manufacturers: Array<FilterOption & { models?: FilterOption[] }>;
  models: Array<FilterOption & { manufacturerId: number }>;
  driveTypes: FilterOption[];
  categories: Array<FilterOption & { slug: string }>;
};

export type EstimateResponse = {
  sampleSize: number;
  matchLevel: 'exact' | 'close' | 'broad';
  estimate: {
    count: number;
    estimate: number;
    rangeFrom: number;
    rangeTo: number;
    average: number;
  } | null;
};

export const ENGINE_VOLUMES = [
  '0.8', '1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '2.2', '2.4', '2.5', '2.7', '3.0', '3.5', '4.0', '4.4', '5.0', '6.0',
];
export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);

export function formatUsd(value: number) {
  return `$${value.toLocaleString('en-US')}`;
}
