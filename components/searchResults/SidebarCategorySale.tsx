'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchFilters } from '@/lib/useSearchFilters';
import type { ApiFiltersResponse } from './types';
import { localizedName } from './types';
import styles from '../SearchResults.module.css';

function categoryIconForSlug(slug: string) {
  if (slug === 'cars') {
    return (
      <svg className={styles.categoryIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 17h8M5 11l1.5-4h11L19 11M5 11v6h14v-6M7 17a1 1 0 102 0 1 1 0 00-2 0z"
        />
      </svg>
    );
  }

  if (slug === 'custom-vehicles') {
    return (
      <svg className={styles.categoryIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 13h2l1-3h12l1 3h2M4 13v4h16v-4M6 17a1 1 0 102 0 1 1 0 00-2 0zm12 0a1 1 0 102 0 1 1 0 00-2 0z"
        />
      </svg>
    );
  }

  return (
    <svg className={styles.categoryIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="6" cy="17" r="2" strokeWidth={1.5} />
      <circle cx="18" cy="17" r="2" strokeWidth={1.5} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6 17h3l2-5 3 2 2-4h2M14 14l-2 3"
      />
    </svg>
  );
}

type Props = { filterOptions: ApiFiltersResponse | null };

export default function SidebarCategorySale({ filterOptions }: Props) {
  const { filters, setFilters } = useSearchFilters();
  const { t, language } = useLanguage();
  const label = (item: { nameEn: string; nameRu: string }) => localizedName(item, language);

  const cycleSaleType = () => {
    setFilters({
      saleType: filters.saleType === 'all' ? 'sale' : filters.saleType === 'sale' ? 'rent' : 'all',
    });
  };

  return (
    <>
      <div className={styles.categoryTabs} role="tablist" aria-label={t.searchResults.category}>
        {filterOptions?.categories.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={filters.categoryId === c.id}
            aria-label={label(c)}
            className={`${styles.categoryTab} ${filters.categoryId === c.id ? styles.categoryTabActive : ''}`}
            onClick={() =>
              setFilters({
                categoryId: filters.categoryId === c.id ? null : c.id,
                bodyTypeIds: [],
                bodyTypeId: '',
              })
            }>
            {categoryIconForSlug(c.slug)}
          </button>
        )) ?? (
          <>
            <button type="button" className={styles.categoryTab} disabled aria-label={t.searchDashboard.categories.cars}>
              {categoryIconForSlug('cars')}
            </button>
            <button
              type="button"
              className={styles.categoryTab}
              disabled
              aria-label={t.searchDashboard.categories.customVehicles}>
              {categoryIconForSlug('custom-vehicles')}
            </button>
            <button
              type="button"
              className={styles.categoryTab}
              disabled
              aria-label={t.searchDashboard.categories.motorcycles}>
              {categoryIconForSlug('motorcycles')}
            </button>
          </>
        )}
      </div>

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
    </>
  );
}
