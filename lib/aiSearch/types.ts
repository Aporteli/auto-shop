import type { Currency, ListingType, SteeringWheel } from '@prisma/client';

export const AI_SEARCH_LIMIT = 20;

export type ExtractedFilters = {
  manufacturer: string | null;
  model: string | null;
  color: string | null;
  fuelType: string | null;
  transmission: string | null;
  bodyTypes: string[] | null;
  city: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  currency: Currency | null;
  minYear: number | null;
  maxYear: number | null;
  engineFrom: number | null;
  engineTo: number | null;
  engineVolume: number | null;
  minMileage: number | null;
  maxMileage: number | null;
  steeringWheel: SteeringWheel | null;
  customsCleared: boolean | null;
  listingType: ListingType | null;
  intent: string | null;
};

export type AiListingResult = {
  id: number;
  titleEn: string;
  year: number;
  price: string;
  currency: string;
  engineVolume: string | null;
  mileage: number | null;
  mileageUnit: string | null;
};

export const EMPTY_FILTERS: ExtractedFilters = {
  manufacturer: null,
  model: null,
  color: null,
  fuelType: null,
  transmission: null,
  bodyTypes: null,
  city: null,
  minPrice: null,
  maxPrice: null,
  currency: null,
  minYear: null,
  maxYear: null,
  engineFrom: null,
  engineTo: null,
  engineVolume: null,
  minMileage: null,
  maxMileage: null,
  steeringWheel: null,
  customsCleared: null,
  listingType: null,
  intent: null,
};
