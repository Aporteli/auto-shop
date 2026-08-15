'use client';

import type { SearchFiltersState } from '@/lib/searchParams';
import SearchableFilterSelect from '../SearchableFilterSelect';
import styles from '../CataloguePage.module.css';
import type { ApiFiltersResponse, FilterOption } from './types';

type CatalogueFilterGridProps = {
  filters: SearchFiltersState;
  setFilters: (patch: Partial<SearchFiltersState>) => void;
  filterOptions: ApiFiltersResponse | null;
  modelsForManufacturer: Array<FilterOption & { manufacturerId: number }>;
  locationOptions: Array<{ value: string; label: string }>;
  yearOptions: Array<{ value: string; label: string }>;
  engineOptions: Array<{ value: string; label: string }>;
  isCountLoading: boolean;
  resultCount: number;
  language: string;
  label: (item: { nameEn: string; nameRu: string }) => string;
  c: {
    manufacturer: string;
    yearFrom: string;
    yearTo: string;
    transmission: string;
    fuelType: string;
    model: string;
    engineFrom: string;
    engineTo: string;
    driveWheels: string;
    location: string;
    category: string;
    price: string;
    mileage: string;
    bodyType: string;
    searching: string;
    results: string;
  };
  fromLabel: string;
  toLabel: string;
  clearLabel: string;
  applyLabel: string;
  onSearch: () => void;
};

export default function CatalogueFilterGrid({
  filters,
  setFilters,
  filterOptions,
  modelsForManufacturer,
  locationOptions,
  yearOptions,
  engineOptions,
  isCountLoading,
  resultCount,
  language,
  label,
  c,
  fromLabel,
  toLabel,
  clearLabel,
  applyLabel,
  onSearch,
}: CatalogueFilterGridProps) {
  return (
    <section className={styles.filterCard}>
      <div className={styles.filterGrid}>
        <SearchableFilterSelect
          title={c.manufacturer}
          value={filters.manufacturerId === '' ? '' : String(filters.manufacturerId)}
          options={(filterOptions?.manufacturers ?? []).map((item) => ({ value: String(item.id), label: label(item) }))}
          onChange={(next) => setFilters({ manufacturerId: next === '' ? '' : Number(next), modelId: '' })}
        />
        <SearchableFilterSelect
          title={c.yearFrom}
          value={filters.yearFrom === '' ? '' : String(filters.yearFrom)}
          options={yearOptions}
          onChange={(next) => setFilters({ year: '', yearFrom: next === '' ? '' : Number(next) })}
        />
        <SearchableFilterSelect
          title={c.yearTo}
          value={filters.yearTo === '' ? '' : String(filters.yearTo)}
          options={yearOptions}
          onChange={(next) => setFilters({ year: '', yearTo: next === '' ? '' : Number(next) })}
        />
        <SearchableFilterSelect
          title={c.transmission}
          value={filters.transmissionId === '' ? '' : String(filters.transmissionId)}
          options={(filterOptions?.transmissions ?? []).map((item) => ({ value: String(item.id), label: label(item) }))}
          onChange={(next) => setFilters({ transmissionId: next === '' ? '' : Number(next) })}
        />
        <SearchableFilterSelect
          title={c.fuelType}
          value={filters.fuelTypeId === '' ? '' : String(filters.fuelTypeId)}
          options={(filterOptions?.fuelTypes ?? []).map((item) => ({ value: String(item.id), label: label(item) }))}
          onChange={(next) => setFilters({ fuelTypeId: next === '' ? '' : Number(next) })}
        />

        <SearchableFilterSelect
          title={c.model}
          value={filters.modelId === '' ? '' : String(filters.modelId)}
          options={modelsForManufacturer.map((item) => ({ value: String(item.id), label: label(item) }))}
          onChange={(next) => setFilters({ modelId: next === '' ? '' : Number(next) })}
        />
        <SearchableFilterSelect
          title={c.engineFrom}
          value={filters.engineFrom}
          options={engineOptions}
          onChange={(next) => setFilters({ engineFrom: next })}
        />
        <SearchableFilterSelect
          title={c.engineTo}
          value={filters.engineTo}
          options={engineOptions}
          onChange={(next) => setFilters({ engineTo: next })}
        />
        <SearchableFilterSelect
          title={c.driveWheels}
          value={filters.driveTypeId === '' ? '' : String(filters.driveTypeId)}
          options={(filterOptions?.driveTypes ?? []).map((item) => ({ value: String(item.id), label: label(item) }))}
          onChange={(next) => setFilters({ driveTypeId: next === '' ? '' : Number(next) })}
        />
        <SearchableFilterSelect
          title={c.location}
          value={filters.cityId === '' ? '' : String(filters.cityId)}
          options={locationOptions}
          onChange={(next) => setFilters({ cityId: next === '' ? '' : Number(next) })}
        />

        <SearchableFilterSelect
          title={c.category}
          value={filters.categoryId == null ? '' : String(filters.categoryId)}
          options={(filterOptions?.categories ?? []).map((item) => ({ value: String(item.id), label: label(item) }))}
          onChange={(next) => setFilters({ categoryId: next === '' ? null : Number(next) })}
        />
        <SearchableFilterSelect
          variant="range"
          title={c.price}
          from={filters.priceFrom}
          to={filters.priceTo}
          fromLabel={fromLabel}
          toLabel={toLabel}
          clearLabel={clearLabel}
          applyLabel={applyLabel}
          onRangeChange={(priceFrom, priceTo) => setFilters({ priceFrom, priceTo })}
        />
        <SearchableFilterSelect
          variant="range"
          title={c.mileage}
          from={filters.mileageFrom}
          to={filters.mileageTo}
          fromLabel={fromLabel}
          toLabel={toLabel}
          clearLabel={clearLabel}
          applyLabel={applyLabel}
          onRangeChange={(mileageFrom, mileageTo) => setFilters({ mileageFrom, mileageTo })}
        />
        <SearchableFilterSelect
          title={c.bodyType}
          value={filters.bodyTypeId === '' ? '' : String(filters.bodyTypeId)}
          options={(filterOptions?.bodyTypes ?? []).map((item) => ({ value: String(item.id), label: label(item) }))}
          onChange={(next) => setFilters({ bodyTypeId: next === '' ? '' : Number(next), bodyTypeIds: [] })}
        />
        <button type="button" className={styles.searchButton} onClick={onSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
          </svg>
          <span>
            {isCountLoading ? c.searching : c.results.replace('{{count}}', String(resultCount.toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')))}
          </span>
        </button>
      </div>
    </section>
  );
}
