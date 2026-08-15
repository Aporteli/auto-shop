'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { resolveCategoryBodyTypes } from '@/lib/categoryBodyTypes';
import type { SearchFiltersState } from '@/lib/searchParams';
import type { ApiFiltersResponse } from './types';
import { localizedName } from './types';

export function useFilterSelectOptions(
  filterOptions: ApiFiltersResponse | null,
  filters: SearchFiltersState,
) {
  const { language } = useLanguage();

  const modelsForManufacturer = useMemo(() => {
    if (!filterOptions) return [];
    if (filters.manufacturerId === '') return filterOptions.models;
    return filterOptions.models.filter((m) => m.manufacturerId === filters.manufacturerId);
  }, [filterOptions, filters.manufacturerId]);

  const manufacturerSelectOptions = useMemo(
    () => (filterOptions?.manufacturers ?? []).map((m) => ({ value: String(m.id), label: localizedName(m, language) })),
    [filterOptions, language],
  );

  const modelSelectOptions = useMemo(
    () => modelsForManufacturer.map((m) => ({ value: String(m.id), label: localizedName(m, language) })),
    [modelsForManufacturer, language],
  );

  const locationSelectOptions = useMemo(() => {
    if (!filterOptions) return [];
    return filterOptions.countries.flatMap((country) =>
      country.cities.map((city) => ({
        value: String(city.id),
        label: `${localizedName(city, language)} (${localizedName(country, language)})`,
      })),
    );
  }, [filterOptions, language]);

  const yearSelectOptions = useMemo(
    () => (filterOptions?.years ?? []).map((y) => ({ value: String(y), label: String(y) })),
    [filterOptions],
  );

  const fuelSelectOptions = useMemo(
    () => (filterOptions?.fuelTypes ?? []).map((f) => ({ value: String(f.id), label: localizedName(f, language) })),
    [filterOptions, language],
  );

  const selectedCategorySlug = useMemo(() => {
    if (!filterOptions || filters.categoryId == null) return undefined;
    return filterOptions.categories.find((c) => c.id === filters.categoryId)?.slug;
  }, [filterOptions, filters.categoryId]);

  const categoryBodyTypeOptions = useMemo(
    () => resolveCategoryBodyTypes(selectedCategorySlug, filterOptions?.bodyTypes ?? []),
    [selectedCategorySlug, filterOptions],
  );

  const transmissionSelectOptions = useMemo(
    () =>
      (filterOptions?.transmissions ?? []).map((item) => ({
        value: String(item.id),
        label: localizedName(item, language),
      })),
    [filterOptions, language],
  );

  const driveTypeSelectOptions = useMemo(
    () =>
      (filterOptions?.driveTypes ?? []).map((item) => ({
        value: String(item.id),
        label: localizedName(item, language),
      })),
    [filterOptions, language],
  );

  const colorSelectOptions = useMemo(
    () =>
      (filterOptions?.colors ?? []).map((item) => ({
        value: String(item.id),
        label: localizedName(item, language),
      })),
    [filterOptions, language],
  );

  return {
    manufacturerSelectOptions,
    modelSelectOptions,
    locationSelectOptions,
    yearSelectOptions,
    fuelSelectOptions,
    categoryBodyTypeOptions,
    transmissionSelectOptions,
    driveTypeSelectOptions,
    colorSelectOptions,
  };
}
