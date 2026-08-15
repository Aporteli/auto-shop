'use client';

import { useMemo } from 'react';
import type { SearchFiltersState } from '@/lib/searchParams';
import type { ApiFiltersResponse, FilterSelectOptions } from './types';

export function useSearchFilterSelectOptions(
  filterOptions: ApiFiltersResponse | null,
  filters: SearchFiltersState,
  language: string,
): FilterSelectOptions {
  const modelsForManufacturer = useMemo(() => {
    if (!filterOptions) return [];
    if (filters.manufacturerId === '') return filterOptions.models;
    return filterOptions.models.filter((m) => m.manufacturerId === filters.manufacturerId);
  }, [filterOptions, filters.manufacturerId]);

  const locationOptions = useMemo(() => {
    if (!filterOptions) return [];
    return filterOptions.countries.flatMap((c) =>
      c.cities.map((city) => ({
        id: city.id,
        label: `${language === 'ru' ? city.nameRu : city.nameEn} (${language === 'ru' ? c.nameRu : c.nameEn})`,
      })),
    );
  }, [filterOptions, language]);

  const manufacturerSelectOptions = useMemo(
    () =>
      (filterOptions?.manufacturers ?? []).map((m) => ({
        value: String(m.id),
        label: language === 'ru' ? m.nameRu : m.nameEn,
      })),
    [filterOptions, language],
  );

  const modelSelectOptions = useMemo(
    () =>
      modelsForManufacturer.map((m) => ({
        value: String(m.id),
        label: language === 'ru' ? m.nameRu : m.nameEn,
      })),
    [modelsForManufacturer, language],
  );

  const locationSelectOptions = useMemo(
    () => locationOptions.map((loc) => ({ value: String(loc.id), label: loc.label })),
    [locationOptions],
  );

  const yearSelectOptions = useMemo(
    () => (filterOptions?.years ?? []).map((y) => ({ value: String(y), label: String(y) })),
    [filterOptions],
  );

  const fuelSelectOptions = useMemo(
    () =>
      (filterOptions?.fuelTypes ?? []).map((f) => ({
        value: String(f.id),
        label: language === 'ru' ? f.nameRu : f.nameEn,
      })),
    [filterOptions, language],
  );

  return {
    manufacturerSelectOptions,
    modelSelectOptions,
    locationSelectOptions,
    yearSelectOptions,
    fuelSelectOptions,
  };
}
