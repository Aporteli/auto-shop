'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { defaultSearchFilters, type SearchFiltersState } from '@/lib/searchParams';
import styles from '../SearchDashboard.module.css';
import SearchCategorySidebar from './SearchCategorySidebar';
import SearchFilterFields from './SearchFilterFields';
import { carsCategoryId, type ApiFiltersResponse, type FilterSelectOptions } from './types';

type SearchFilterPanelProps = {
  filters: SearchFiltersState;
  setFilters: (patch: Partial<SearchFiltersState>) => void;
  setFiltersState: Dispatch<SetStateAction<SearchFiltersState>>;
  filterOptions: ApiFiltersResponse | null;
  isLoading: boolean;
  selectOptions: FilterSelectOptions;
  resultCount: number;
  isCountLoading: boolean;
  onSearch: () => void;
  onOpenAdditionalFilters: () => void;
};

export default function SearchFilterPanel({
  filters,
  setFilters,
  setFiltersState,
  filterOptions,
  isLoading,
  selectOptions,
  resultCount,
  isCountLoading,
  onSearch,
  onOpenAdditionalFilters,
}: SearchFilterPanelProps) {
  const { t } = useLanguage();

  const cycleSaleType = () => {
    setFilters({
      saleType: filters.saleType === 'all' ? 'sale' : filters.saleType === 'sale' ? 'rent' : 'all',
    });
  };

  const handleClearFilters = () => {
    setFiltersState({
      ...defaultSearchFilters(),
      categoryId: carsCategoryId(filterOptions?.categories),
    });
  };

  return (
    <div className={styles.mainCard}>
      <div className={styles.topBar}>
        <div className={styles.saleTypeToggle}>
          <span
            className={`${styles.saleTypeLabel} ${filters.saleType === 'sale' ? styles.saleTypeLabelActive : ''}`}
            onClick={() => setFilters({ saleType: filters.saleType === 'sale' ? 'all' : 'sale' })}>
            {t.searchDashboard.forSale}
          </span>
          <button
            type="button"
            className={`${styles.toggleSwitch} ${filters.saleType !== 'all' ? styles.toggleSwitchActive : ''}`}
            onClick={cycleSaleType}
            aria-label={t.searchDashboard.forSale}>
            <span
              className={`${styles.toggleSwitchKnob} ${
                filters.saleType === 'rent'
                  ? styles.toggleSwitchKnobRight
                  : filters.saleType === 'all'
                    ? styles.toggleSwitchKnobCenter
                    : ''
              }`}
            />
          </button>
          <span
            className={`${styles.saleTypeLabel} ${filters.saleType === 'rent' ? styles.saleTypeLabelActive : ''}`}
            onClick={() => setFilters({ saleType: filters.saleType === 'rent' ? 'all' : 'rent' })}>
            {t.searchDashboard.forRent}
          </span>
        </div>

        <button type="button" className={styles.clearFilters} onClick={handleClearFilters}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {t.searchDashboard.clearFilters}
        </button>
      </div>

      <div className={styles.body}>
        <SearchCategorySidebar
          categories={filterOptions?.categories}
          selectedCategoryId={filters.categoryId}
          isLoading={isLoading}
          onSelect={(categoryId) => setFilters({ categoryId })}
        />
        <SearchFilterFields
          filters={filters}
          setFilters={setFilters}
          selectOptions={selectOptions}
          resultCount={resultCount}
          isCountLoading={isCountLoading}
          onSearch={onSearch}
          onOpenAdditionalFilters={onOpenAdditionalFilters}
        />
      </div>
    </div>
  );
}
