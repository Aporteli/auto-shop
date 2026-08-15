'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildSearchFilterChips } from '@/lib/searchFilterChips';
import type { SearchFiltersState } from '@/lib/searchParams';
import type { ApiFiltersResponse, FilterOption } from './types';
import { localizedName } from './types';

export function useActiveChips(
  filters: SearchFiltersState,
  filterOptions: ApiFiltersResponse | null,
) {
  const { t, language } = useLanguage();

  return useMemo(() => {
    const findName = (kind: string, id: number) => {
      if (!filterOptions) return null;
      if (kind === 'city') {
        for (const country of filterOptions.countries) {
          const city = country.cities.find((c) => c.id === id);
          if (city) return `${localizedName(city, language)} (${localizedName(country, language)})`;
        }
        return null;
      }
      const collections: Record<string, FilterOption[] | undefined> = {
        category: filterOptions.categories,
        manufacturer: filterOptions.manufacturers,
        model: filterOptions.models,
        fuel: filterOptions.fuelTypes,
        transmission: filterOptions.transmissions,
        drive: filterOptions.driveTypes,
        color: filterOptions.colors,
        bodyType: filterOptions.bodyTypes,
      };
      const item = collections[kind]?.find((entry) => entry.id === id);
      return item ? localizedName(item, language) : null;
    };

    const additional = t.searchDashboard as {
      additionalFilters?: { exchange?: string; auction?: string; withVideo?: string };
    };

    return buildSearchFilterChips(filters, {
      language,
      labels: {
        forSale: t.searchDashboard.forSale,
        forRent: t.searchDashboard.forRent,
        customsCleared: t.searchDashboard.filters.customsCleared,
        beforeCustoms: t.searchDashboard.filters.beforeCustoms,
        withVin: t.searchDashboard.toggles.withVin,
        hideNegotiable: t.searchDashboard.toggles.hideNegotiable,
        with360: t.searchDashboard.toggles.with360,
        periodHours: t.searchResults.periodChip,
        year: t.searchResults.yearSuffix,
        priceFrom: 'from',
        priceTo: 'to',
        exchange: additional.additionalFilters?.exchange ?? 'Exchange',
        auction: additional.additionalFilters?.auction ?? 'Auction',
        withVideo: additional.additionalFilters?.withVideo ?? 'Video',
      },
      resolveName: findName,
    }).map((chip) => {
      if (chip.id === 'priceFrom') {
        return {
          ...chip,
          label: t.searchResults.priceFromChip.replace('{{value}}', String(filters.priceFrom)),
        };
      }
      if (chip.id === 'priceTo') {
        return {
          ...chip,
          label: t.searchResults.priceToChip.replace('{{value}}', String(filters.priceTo)),
        };
      }
      return chip;
    });
  }, [filters, filterOptions, language, t]);
}
