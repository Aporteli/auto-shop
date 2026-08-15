import type { SearchFiltersState } from './types';

function appendIfPresent(params: URLSearchParams, key: string, value: string | number | boolean | undefined | null) {
  if (value === '' || value === false || value == null) return;
  params.set(key, String(value));
}

function appendIds(params: URLSearchParams, key: string, ids: number[]) {
  if (ids.length > 0) params.set(key, ids.join(','));
}

export function buildListingSearchParams(filters: SearchFiltersState, options?: { limit?: number }) {
  const params = new URLSearchParams();

  if (options?.limit) params.set('limit', String(options.limit));
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  if (filters.q?.trim()) params.set('q', filters.q.trim());

  if (filters.categoryId != null) params.set('categoryId', String(filters.categoryId));

  if (filters.auction) {
    params.set('listingType', 'AUCTION');
  } else if (filters.saleType === 'sale') {
    params.set('listingType', 'SALE');
  } else if (filters.saleType === 'rent') {
    params.set('listingType', 'RENT');
  }

  if (filters.customsType === 'cleared') params.set('customsCleared', 'true');
  else if (filters.customsType === 'before') params.set('customsCleared', 'false');

  if (filters.manufacturerId !== '') params.set('manufacturerId', String(filters.manufacturerId));
  if (filters.modelId !== '') params.set('modelId', String(filters.modelId));
  if (filters.cityId !== '') params.set('cityId', String(filters.cityId));
  if (filters.fuelTypeId !== '') params.set('fuelTypeId', String(filters.fuelTypeId));
  if (filters.bodyTypeIds.length > 0) {
    appendIds(params, 'bodyTypeIds', filters.bodyTypeIds);
  } else if (filters.bodyTypeId !== '') {
    params.set('bodyTypeId', String(filters.bodyTypeId));
  }
  if (filters.transmissionId !== '') params.set('transmissionId', String(filters.transmissionId));
  if (filters.driveTypeId !== '') params.set('driveTypeId', String(filters.driveTypeId));
  if (filters.colorId !== '') params.set('colorId', String(filters.colorId));

  if (filters.year !== '') {
    params.set('yearFrom', String(filters.year));
    params.set('yearTo', String(filters.year));
  } else {
    appendIfPresent(params, 'yearFrom', filters.yearFrom);
    appendIfPresent(params, 'yearTo', filters.yearTo);
  }

  appendIfPresent(params, 'priceFrom', filters.priceFrom);
  appendIfPresent(params, 'priceTo', filters.priceTo);

  if (filters.withVin) params.set('withVin', 'true');
  if (filters.hideNegotiable) params.set('hideNegotiable', 'true');
  if (filters.with360) params.set('has360', 'true');
  if (filters.dealerId !== '') params.set('dealerId', String(filters.dealerId));

  appendIfPresent(params, 'engineFrom', filters.engineFrom);
  appendIfPresent(params, 'engineTo', filters.engineTo);
  appendIfPresent(params, 'mileageFrom', filters.mileageFrom);
  appendIfPresent(params, 'mileageTo', filters.mileageTo);
  appendIfPresent(params, 'steeringWheel', filters.steeringWheel);
  appendIfPresent(params, 'doors', filters.doors);
  appendIfPresent(params, 'thirdRowSeats', filters.thirdRowSeats);
  appendIfPresent(params, 'isNew', filters.isNew);
  appendIfPresent(params, 'techInspection', filters.techInspection);
  appendIfPresent(params, 'catalyst', filters.catalyst);
  appendIfPresent(params, 'interiorMaterial', filters.interiorMaterial);
  appendIfPresent(params, 'interiorColor', filters.interiorColor);
  appendIfPresent(params, 'applicant', filters.applicant);
  appendIfPresent(params, 'publishedWithin', filters.publishedWithin);
  if (filters.exchange) params.set('exchange', 'true');
  if (filters.withVideo) params.set('withVideo', 'true');

  appendIds(params, 'colorIds', filters.colorIds);
  appendIds(params, 'featureIds', filters.featureIds);
  appendIds(params, 'stickerIds', filters.stickerIds);

  if (filters.sort && filters.sort !== 'date_desc') {
    params.set('sort', filters.sort);
  }

  return params;
}
