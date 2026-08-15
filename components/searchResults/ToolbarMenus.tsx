'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEARCH_PERIOD_HOURS, SEARCH_SORT_OPTIONS, type SearchSort } from '@/lib/searchParams';
import { useSearchFilters } from '@/lib/useSearchFilters';
import type { OpenMenu } from './types';
import styles from '../SearchResults.module.css';

type Props = {
  openMenu: OpenMenu;
  setOpenMenu: (menu: OpenMenu) => void;
};

export default function ToolbarMenus({ openMenu, setOpenMenu }: Props) {
  const { filters, setFilters } = useSearchFilters();
  const { t } = useLanguage();

  const periodLabel = useMemo(() => {
    if (!filters.publishedWithin) return t.searchResults.period;
    const map: Record<string, string> = {
      '1': t.searchResults.period1h,
      '3': t.searchResults.period3h,
      '6': t.searchResults.period6h,
      '12': t.searchResults.period12h,
      '24': t.searchResults.period24h,
    };
    return map[filters.publishedWithin] ?? t.searchResults.period;
  }, [filters.publishedWithin, t]);

  const sortLabel = useMemo(() => {
    const map: Record<SearchSort, string> = {
      date_desc: t.searchResults.sortDateDesc,
      date_asc: t.searchResults.sortDateAsc,
      price_desc: t.searchResults.sortPriceDesc,
      price_asc: t.searchResults.sortPriceAsc,
      mileage_desc: t.searchResults.sortMileageDesc,
      mileage_asc: t.searchResults.sortMileageAsc,
    };
    return map[filters.sort] ?? t.searchResults.sort;
  }, [filters.sort, t]);

  const periodOptionLabels: Record<string, string> = {
    '1': t.searchResults.period1h,
    '3': t.searchResults.period3h,
    '6': t.searchResults.period6h,
    '12': t.searchResults.period12h,
    '24': t.searchResults.period24h,
  };

  return (
    <div className={styles.toolbarRight}>
      <div className={styles.toolbarSelectWrap}>
        <button
          type="button"
          className={`${styles.toolbarSelectButton} ${openMenu === 'period' ? styles.toolbarSelectButtonOpen : ''}`}
          onClick={() => setOpenMenu(openMenu === 'period' ? null : 'period')}>
          {periodLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {openMenu === 'period' && (
          <div className={styles.toolbarSelectMenu} role="listbox">
            <button
              type="button"
              className={`${styles.toolbarSelectOption} ${!filters.publishedWithin ? styles.toolbarSelectOptionActive : ''}`}
              onClick={() => {
                setFilters({ publishedWithin: '' });
                setOpenMenu(null);
              }}>
              {t.searchResults.period}
            </button>
            {SEARCH_PERIOD_HOURS.map((hours) => (
              <button
                key={hours}
                type="button"
                className={`${styles.toolbarSelectOption} ${
                  filters.publishedWithin === hours ? styles.toolbarSelectOptionActive : ''
                }`}
                onClick={() => {
                  setFilters({ publishedWithin: hours });
                  setOpenMenu(null);
                }}>
                {periodOptionLabels[hours]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.toolbarSelectWrap}>
        <button
          type="button"
          className={`${styles.toolbarSelectButton} ${openMenu === 'sort' ? styles.toolbarSelectButtonOpen : ''}`}
          onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}>
          {sortLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {openMenu === 'sort' && (
          <div className={styles.toolbarSelectMenu} role="listbox">
            {SEARCH_SORT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.toolbarSelectOption} ${
                  filters.sort === option ? styles.toolbarSelectOptionActive : ''
                }`}
                onClick={() => {
                  setFilters({ sort: option });
                  setOpenMenu(null);
                }}>
                {
                  {
                    date_desc: t.searchResults.sortDateDesc,
                    date_asc: t.searchResults.sortDateAsc,
                    price_desc: t.searchResults.sortPriceDesc,
                    price_asc: t.searchResults.sortPriceAsc,
                    mileage_desc: t.searchResults.sortMileageDesc,
                    mileage_asc: t.searchResults.sortMileageAsc,
                  }[option]
                }
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
