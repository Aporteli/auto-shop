import type { AiListingResult, ExtractedFilters } from './types';

function filterSummaryBits(filters: ExtractedFilters, language: string): string {
  const ru = language === 'ru';
  const bits: string[] = [];
  if (filters.manufacturer) bits.push(filters.manufacturer);
  if (filters.model) bits.push(filters.model);
  if (filters.color) bits.push(filters.color);
  if (filters.bodyTypes?.length) bits.push(filters.bodyTypes.join('/'));
  if (filters.fuelType) bits.push(filters.fuelType);
  if (filters.transmission) bits.push(filters.transmission);
  if (filters.city) bits.push(filters.city);
  if (filters.minYear != null && filters.maxYear != null) bits.push(`${filters.minYear}–${filters.maxYear}`);
  else if (filters.minYear != null) bits.push(ru ? `от ${filters.minYear}` : `from ${filters.minYear}`);
  else if (filters.maxYear != null) bits.push(ru ? `до ${filters.maxYear}` : `until ${filters.maxYear}`);
  if (filters.maxPrice != null) {
    bits.push(ru ? `до ${filters.maxPrice} ${filters.currency ?? ''}` : `under ${filters.maxPrice} ${filters.currency ?? ''}`.trim());
  }
  if (filters.engineFrom != null || filters.engineTo != null || filters.engineVolume != null) {
    const from = filters.engineFrom ?? (filters.engineVolume != null ? filters.engineVolume - 0.2 : null);
    const to = filters.engineTo ?? (filters.engineVolume != null ? filters.engineVolume + 0.2 : null);
    if (from != null && to != null) bits.push(`${from}–${to}L`);
  }
  if (filters.listingType) bits.push(filters.listingType.toLowerCase());
  return bits.join(', ');
}

export function buildSearchSummary(
  filters: ExtractedFilters,
  listings: AiListingResult[],
  total: number,
  language: string,
): string {
  const ru = language === 'ru';
  const bits = filterSummaryBits(filters, language);

  if (total === 0) {
    const interpreted =
      filters.intent
        ? ru
          ? ` Запрос понят как: ${filters.intent}.`
          : ` Interpreted as: ${filters.intent}.`
        : '';
    return ru
      ? `По запросу${bits ? ` (${bits})` : ''} объявлений не найдено.${interpreted} Попробуйте ослабить фильтры.`
      : `No listings match those filters${bits ? ` (${bits})` : ''}.${interpreted} Try a broader search.`;
  }

  const header = ru
    ? `Найдено объявлений: ${total}${bits ? ` — ${bits}` : ''}.`
    : `Found ${total} listing${total === 1 ? '' : 's'}${bits ? ` — ${bits}` : ''}.`;
  const interpreted =
    filters.intent
      ? ru
        ? ` Запрос понят как: ${filters.intent}`
        : ` Interpreted as: ${filters.intent}`
      : '';
  const shown =
    total > listings.length
      ? ru
        ? ` Показаны ${listings.length} из ${total}.`
        : ` Showing ${listings.length} of ${total}.`
      : '';

  const lines = listings.slice(0, 8).map((item) => {
    const engine = item.engineVolume ? `, ${item.engineVolume}L` : '';
    const mileage =
      item.mileage != null ? `, ${item.mileage.toLocaleString()} ${item.mileageUnit ?? 'KM'}` : '';
    return `• ${item.titleEn} (${item.year})${engine}${mileage} — ${item.price} ${item.currency}`;
  });

  return `${header}${interpreted}${shown}\n\n${lines.join('\n')}`;
}
