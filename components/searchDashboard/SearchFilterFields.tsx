'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import type { SearchFiltersState } from '@/lib/searchParams';
import PriceRangeFilter from '../PriceRangeFilter';
import SearchableFilterSelect from '../SearchableFilterSelect';
import styles from '../SearchDashboard.module.css';
import type { FilterSelectOptions } from './types';

type SearchFilterFieldsProps = {
  filters: SearchFiltersState;
  setFilters: (patch: Partial<SearchFiltersState>) => void;
  selectOptions: FilterSelectOptions;
  resultCount: number;
  isCountLoading: boolean;
  onSearch: () => void;
  onOpenAdditionalFilters: () => void;
};

export default function SearchFilterFields({
  filters,
  setFilters,
  selectOptions,
  resultCount,
  isCountLoading,
  onSearch,
  onOpenAdditionalFilters,
}: SearchFilterFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.filtersArea}>
      <div className={styles.filtersGridTop}>
        <SearchableFilterSelect
          title={t.searchDashboard.filters.manufacturer}
          value={filters.manufacturerId === '' ? '' : String(filters.manufacturerId)}
          options={selectOptions.manufacturerSelectOptions}
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
          options={selectOptions.modelSelectOptions}
          onChange={(next) => setFilters({ modelId: next === '' ? '' : Number(next) })}
        />
        <SearchableFilterSelect
          title={t.searchDashboard.filters.location}
          value={filters.cityId === '' ? '' : String(filters.cityId)}
          options={selectOptions.locationSelectOptions}
          onChange={(next) => setFilters({ cityId: next === '' ? '' : Number(next) })}
        />
        <div className={styles.segmentedControl}>
          <button
            type="button"
            className={`${styles.segmentButton} ${filters.customsType === 'cleared' ? styles.segmentButtonActive : ''}`}
            onClick={() => setFilters({ customsType: filters.customsType === 'cleared' ? 'all' : 'cleared' })}>
            {t.searchDashboard.filters.customsCleared}
          </button>
          <button
            type="button"
            className={`${styles.segmentButton} ${filters.customsType === 'before' ? styles.segmentButtonActive : ''}`}
            onClick={() => setFilters({ customsType: filters.customsType === 'before' ? 'all' : 'before' })}>
            {t.searchDashboard.filters.beforeCustoms}
          </button>
        </div>
      </div>

      <div className={styles.filtersGridMiddle}>
        <SearchableFilterSelect
          title={t.searchDashboard.filters.year}
          value={filters.year === '' ? '' : String(filters.year)}
          options={selectOptions.yearSelectOptions}
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
          options={selectOptions.fuelSelectOptions}
          onChange={(next) => setFilters({ fuelTypeId: next === '' ? '' : Number(next) })}
        />
        <button type="button" className={styles.additionalFilters} onClick={onOpenAdditionalFilters}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          {t.searchDashboard.filters.additionalFilters}
        </button>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.toggles}>
          <label className={styles.filterToggle}>
            <button
              type="button"
              className={`${styles.smallToggle} ${filters.withVin ? styles.smallToggleOn : ''}`}
              onClick={() => setFilters({ withVin: !filters.withVin })}
              aria-pressed={filters.withVin}
            />
            <span className={styles.filterToggleLabel}>{t.searchDashboard.toggles.withVin}</span>
          </label>
          <label className={styles.filterToggle}>
            <button
              type="button"
              className={`${styles.smallToggle} ${filters.hideNegotiable ? styles.smallToggleOn : ''}`}
              onClick={() => setFilters({ hideNegotiable: !filters.hideNegotiable })}
              aria-pressed={filters.hideNegotiable}
            />
            <span className={styles.filterToggleLabel}>{t.searchDashboard.toggles.hideNegotiable}</span>
          </label>
          <label className={styles.filterToggle}>
            <button
              type="button"
              className={`${styles.smallToggle} ${filters.with360 ? styles.smallToggleOn : ''}`}
              onClick={() => setFilters({ with360: !filters.with360 })}
              aria-pressed={filters.with360}
            />
            <span className={styles.filterToggleLabel}>{t.searchDashboard.toggles.with360}</span>
          </label>
        </div>

        <button type="button" className={styles.searchButton} onClick={onSearch}>
          {t.searchDashboard.search} ({isCountLoading ? '...' : resultCount})
        </button>
      </div>
    </div>
  );
}
