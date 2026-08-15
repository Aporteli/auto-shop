import type { SearchFiltersState } from '../searchParams';
import type { ChipOptions, SearchFilterChip } from './types';

export function appendIdentityChips(
  chips: SearchFilterChip[],
  filters: SearchFiltersState,
  options: ChipOptions,
) {
  const { labels, resolveName } = options;

  if (filters.saleType === 'sale') {
    chips.push({ id: 'saleType', label: labels.forSale, clear: { saleType: 'all' } });
  } else if (filters.saleType === 'rent') {
    chips.push({ id: 'saleType', label: labels.forRent, clear: { saleType: 'all' } });
  }

  if (filters.categoryId != null) {
    chips.push({
      id: 'categoryId',
      label: resolveName('category', filters.categoryId) ?? `Category ${filters.categoryId}`,
      clear: { categoryId: null, bodyTypeIds: [], bodyTypeId: '' },
    });
  }

  if (filters.customsType === 'cleared') {
    chips.push({ id: 'customs', label: labels.customsCleared, clear: { customsType: 'all' } });
  } else if (filters.customsType === 'before') {
    chips.push({ id: 'customs', label: labels.beforeCustoms, clear: { customsType: 'all' } });
  }

  if (filters.manufacturerId !== '') {
    chips.push({
      id: 'manufacturerId',
      label: resolveName('manufacturer', filters.manufacturerId) ?? String(filters.manufacturerId),
      clear: { manufacturerId: '', modelId: '' },
    });
  }

  if (filters.modelId !== '') {
    chips.push({
      id: 'modelId',
      label: resolveName('model', filters.modelId) ?? String(filters.modelId),
      clear: { modelId: '' },
    });
  }

  if (filters.cityId !== '') {
    chips.push({
      id: 'cityId',
      label: resolveName('city', filters.cityId) ?? String(filters.cityId),
      clear: { cityId: '' },
    });
  }

  if (filters.year !== '') {
    chips.push({
      id: 'year',
      label: `${filters.year} ${labels.year}`,
      clear: { year: '', yearFrom: '', yearTo: '' },
    });
  } else {
    if (filters.yearFrom !== '') {
      chips.push({
        id: 'yearFrom',
        label: `${labels.year} ≥ ${filters.yearFrom}`,
        clear: { yearFrom: '' },
      });
    }
    if (filters.yearTo !== '') {
      chips.push({
        id: 'yearTo',
        label: `${labels.year} ≤ ${filters.yearTo}`,
        clear: { yearTo: '' },
      });
    }
  }

  if (filters.priceFrom !== '') {
    chips.push({
      id: 'priceFrom',
      label: `${labels.priceFrom} ${filters.priceFrom}`,
      clear: { priceFrom: '' },
    });
  }
  if (filters.priceTo !== '') {
    chips.push({
      id: 'priceTo',
      label: `${labels.priceTo} ${filters.priceTo}`,
      clear: { priceTo: '' },
    });
  }

  if (filters.fuelTypeId !== '') {
    chips.push({
      id: 'fuelTypeId',
      label: resolveName('fuel', filters.fuelTypeId) ?? String(filters.fuelTypeId),
      clear: { fuelTypeId: '' },
    });
  }

  if (filters.transmissionId !== '') {
    chips.push({
      id: 'transmissionId',
      label: resolveName('transmission', filters.transmissionId) ?? String(filters.transmissionId),
      clear: { transmissionId: '' },
    });
  }

  if (filters.driveTypeId !== '') {
    chips.push({
      id: 'driveTypeId',
      label: resolveName('drive', filters.driveTypeId) ?? String(filters.driveTypeId),
      clear: { driveTypeId: '' },
    });
  }

  if (filters.colorId !== '') {
    chips.push({
      id: 'colorId',
      label: resolveName('color', filters.colorId) ?? String(filters.colorId),
      clear: { colorId: '' },
    });
  }

  for (const id of filters.bodyTypeIds) {
    chips.push({
      id: `bodyType-${id}`,
      label: resolveName('bodyType', id) ?? String(id),
      clear: {
        bodyTypeIds: filters.bodyTypeIds.filter((item) => item !== id),
        bodyTypeId: '',
      },
    });
  }
}
