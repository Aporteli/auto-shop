import type { SearchFiltersState } from '../searchParams';
import type { ChipOptions, SearchFilterChip } from './types';

export function appendFlagChips(
  chips: SearchFilterChip[],
  filters: SearchFiltersState,
  options: ChipOptions,
) {
  const { labels } = options;

  if (filters.withVin) {
    chips.push({ id: 'withVin', label: labels.withVin, clear: { withVin: false } });
  }
  if (filters.hideNegotiable) {
    chips.push({
      id: 'hideNegotiable',
      label: labels.hideNegotiable,
      clear: { hideNegotiable: false },
    });
  }
  if (filters.with360) {
    chips.push({ id: 'with360', label: labels.with360, clear: { with360: false } });
  }
  if (filters.exchange) {
    chips.push({ id: 'exchange', label: labels.exchange, clear: { exchange: false } });
  }
  if (filters.auction) {
    chips.push({ id: 'auction', label: labels.auction, clear: { auction: false } });
  }
  if (filters.withVideo) {
    chips.push({ id: 'withVideo', label: labels.withVideo, clear: { withVideo: false } });
  }

  if (filters.publishedWithin) {
    chips.push({
      id: 'publishedWithin',
      label: labels.periodHours.replace('{{hours}}', filters.publishedWithin),
      clear: { publishedWithin: '' },
    });
  }

  if (filters.q?.trim()) {
    chips.push({ id: 'q', label: `"${filters.q.trim()}"`, clear: { q: '' } });
  }
}
