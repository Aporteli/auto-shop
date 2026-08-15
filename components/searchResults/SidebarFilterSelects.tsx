'use client';

import SearchableFilterSelect from '@/components/SearchableFilterSelect';
import PriceRangeFilter from '@/components/PriceRangeFilter';
import CategoryFilterSelect from '@/components/CategoryFilterSelect';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchFilters } from '@/lib/useSearchFilters';
import { useFilterSelectOptions } from './useFilterSelectOptions';
import type { ApiFiltersResponse } from './types';

type Props = { filterOptions: ApiFiltersResponse | null };

export default function SidebarFilterSelects({ filterOptions }: Props) {
  const { filters, setFilters } = useSearchFilters();
  const { t } = useLanguage();
  const options = useFilterSelectOptions(filterOptions, filters);

  return (
    <>
      <CategoryFilterSelect
        title={t.searchResults.category}
        options={options.categoryBodyTypeOptions}
        value={filters.bodyTypeIds}
        selectLabel={t.searchResults.select}
        onChange={(ids) => setFilters({ bodyTypeIds: ids, bodyTypeId: '' })}
      />

      <SearchableFilterSelect
        title={t.searchDashboard.filters.manufacturer}
        value={filters.manufacturerId === '' ? '' : String(filters.manufacturerId)}
        options={options.manufacturerSelectOptions}
        onChange={(next) =>
          setFilters({
            manufacturerId: next === '' ? '' : Number(next),
            modelId: '',
          })
        }
      />

      <SearchableFilterSelect
        title={t.searchDashboard.filters.model}
        value={filters.modelId === '' ? '' : String(filters.modelId)}
        options={options.modelSelectOptions}
        onChange={(next) => setFilters({ modelId: next === '' ? '' : Number(next) })}
      />

      <SearchableFilterSelect
        title={t.searchDashboard.filters.location}
        value={filters.cityId === '' ? '' : String(filters.cityId)}
        options={options.locationSelectOptions}
        onChange={(next) => setFilters({ cityId: next === '' ? '' : Number(next) })}
      />

      <SearchableFilterSelect
        title={t.searchDashboard.filters.year}
        value={filters.year === '' ? '' : String(filters.year)}
        options={options.yearSelectOptions}
        onChange={(next) => setFilters({ year: next === '' ? '' : Number(next) })}
      />

      <PriceRangeFilter
        from={filters.priceFrom}
        to={filters.priceTo}
        onChange={(priceFrom, priceTo) => setFilters({ priceFrom, priceTo })}
      />

      <SearchableFilterSelect
        title={t.searchDashboard.filters.fuel}
        value={filters.fuelTypeId === '' ? '' : String(filters.fuelTypeId)}
        options={options.fuelSelectOptions}
        onChange={(next) => setFilters({ fuelTypeId: next === '' ? '' : Number(next) })}
      />

      <SearchableFilterSelect
        title={t.searchResults.transmission}
        value={filters.transmissionId === '' ? '' : String(filters.transmissionId)}
        options={options.transmissionSelectOptions}
        onChange={(next) => setFilters({ transmissionId: next === '' ? '' : Number(next) })}
      />

      <SearchableFilterSelect
        title={t.searchResults.driveType}
        value={filters.driveTypeId === '' ? '' : String(filters.driveTypeId)}
        options={options.driveTypeSelectOptions}
        onChange={(next) => setFilters({ driveTypeId: next === '' ? '' : Number(next) })}
      />

      <SearchableFilterSelect
        title={t.searchResults.color}
        value={filters.colorId === '' ? '' : String(filters.colorId)}
        options={options.colorSelectOptions}
        onChange={(next) => setFilters({ colorId: next === '' ? '' : Number(next) })}
      />
    </>
  );
}
