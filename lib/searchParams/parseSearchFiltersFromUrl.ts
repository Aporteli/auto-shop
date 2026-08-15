import { SEARCH_SORT_OPTIONS, type SearchFiltersState, type SearchSort } from './types';

function parseIds(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((id) => Number.isFinite(id));
}

export function parseSearchFiltersFromUrl(searchParams: URLSearchParams): SearchFiltersState {
  const getNum = (key: string): number | '' => {
    const value = searchParams.get(key);
    if (!value) return '';
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : '';
  };

  const listingType = searchParams.get('listingType');
  const customsCleared = searchParams.get('customsCleared');
  const auction = listingType === 'AUCTION';
  const sortParam = searchParams.get('sort');
  const sort = SEARCH_SORT_OPTIONS.includes(sortParam as SearchSort)
    ? (sortParam as SearchSort)
    : 'date_desc';

  return {
    q: searchParams.get('q') ?? '',
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null,
    saleType: listingType === 'RENT' ? 'rent' : listingType === 'SALE' ? 'sale' : 'all',
    customsType: customsCleared === 'false' ? 'before' : customsCleared === 'true' ? 'cleared' : 'all',
    manufacturerId: getNum('manufacturerId'),
    modelId: getNum('modelId'),
    cityId: getNum('cityId'),
    year: (() => {
      const from = getNum('yearFrom');
      const to = getNum('yearTo');
      return from !== '' && to !== '' && from === to ? from : '';
    })(),
    yearFrom: getNum('yearFrom'),
    yearTo: getNum('yearTo'),
    priceFrom: searchParams.get('priceFrom') ?? '',
    priceTo: searchParams.get('priceTo') ?? '',
    fuelTypeId: getNum('fuelTypeId'),
    bodyTypeId: getNum('bodyTypeId'),
    bodyTypeIds: (() => {
      const ids = parseIds(searchParams.get('bodyTypeIds'));
      if (ids.length > 0) return ids;
      const single = getNum('bodyTypeId');
      return single === '' ? [] : [single];
    })(),
    transmissionId: getNum('transmissionId'),
    driveTypeId: getNum('driveTypeId'),
    colorId: getNum('colorId'),
    withVin: searchParams.get('withVin') === 'true',
    hideNegotiable: searchParams.get('hideNegotiable') === 'true',
    with360: searchParams.get('has360') === 'true',
    dealerId: getNum('dealerId'),
    sort,
    page: Math.max(1, Number(searchParams.get('page')) || 1),
    engineFrom: searchParams.get('engineFrom') ?? '',
    engineTo: searchParams.get('engineTo') ?? '',
    mileageFrom: searchParams.get('mileageFrom') ?? '',
    mileageTo: searchParams.get('mileageTo') ?? '',
    steeringWheel: (searchParams.get('steeringWheel') as SearchFiltersState['steeringWheel']) ?? '',
    doors: (searchParams.get('doors') as SearchFiltersState['doors']) ?? '',
    thirdRowSeats: (searchParams.get('thirdRowSeats') as SearchFiltersState['thirdRowSeats']) ?? '',
    isNew: (searchParams.get('isNew') as SearchFiltersState['isNew']) ?? '',
    techInspection: (searchParams.get('techInspection') as SearchFiltersState['techInspection']) ?? '',
    catalyst: (searchParams.get('catalyst') as SearchFiltersState['catalyst']) ?? '',
    featureIds: parseIds(searchParams.get('featureIds')),
    colorIds: parseIds(searchParams.get('colorIds')),
    interiorMaterial: searchParams.get('interiorMaterial') ?? '',
    interiorColor: searchParams.get('interiorColor') ?? '',
    applicant: (searchParams.get('applicant') as SearchFiltersState['applicant']) ?? '',
    publishedWithin: searchParams.get('publishedWithin') ?? '',
    exchange: searchParams.get('exchange') === 'true',
    auction,
    withVideo: searchParams.get('withVideo') === 'true',
    stickerIds: parseIds(searchParams.get('stickerIds')),
  };
}
