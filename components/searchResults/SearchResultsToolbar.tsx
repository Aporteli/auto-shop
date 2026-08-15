'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { clearAllSearchFilters, type SearchFilterChip } from '@/lib/searchFilterChips';
import { useSearchFilters } from '@/lib/useSearchFilters';
import type { OpenMenu, ViewMode } from './types';
import ToolbarMenus from './ToolbarMenus';
import styles from '../SearchResults.module.css';

type Props = {
  listingsCountLabel: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeChips: SearchFilterChip[];
};

export default function SearchResultsToolbar({
  listingsCountLabel,
  viewMode,
  onViewModeChange,
  activeChips,
}: Props) {
  const { t } = useLanguage();
  const { setFilters, replaceFilters } = useSearchFilters();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.resultsToolbar} ref={toolbarRef}>
      <div className={styles.toolbarBar}>
        <span className={styles.resultsCount}>{listingsCountLabel}</span>

        <div className={styles.toolbarCenter}>
          <button
            type="button"
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.viewButtonActive : ''}`}
            aria-label={t.searchResults.listView}
            aria-pressed={viewMode === 'list'}
            onClick={() => onViewModeChange('list')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="4" y="5" width="16" height="2" rx="1" />
              <rect x="4" y="11" width="16" height="2" rx="1" />
              <rect x="4" y="17" width="16" height="2" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.viewButtonActive : ''}`}
            aria-label={t.searchResults.gridView}
            aria-pressed={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="4" y="5" width="7" height="3" rx="1" />
              <rect x="13" y="5" width="7" height="3" rx="1" />
              <rect x="4" y="16" width="7" height="3" rx="1" />
              <rect x="13" y="16" width="7" height="3" rx="1" />
            </svg>
          </button>
        </div>

        <ToolbarMenus openMenu={openMenu} setOpenMenu={setOpenMenu} />
      </div>

      {activeChips.length > 0 && (
        <div className={styles.chipsBar}>
          <button
            type="button"
            className={styles.clearChipsButton}
            aria-label={t.searchResults.clearAllFilters}
            onClick={() => replaceFilters(clearAllSearchFilters())}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12"
              />
            </svg>
          </button>
          <span className={styles.chipsDivider} aria-hidden />
          <div className={styles.chipsList}>
            {activeChips.map((chip) => (
              <span key={chip.id} className={styles.chip}>
                <span className={styles.chipLabel}>{chip.label}</span>
                <button
                  type="button"
                  className={styles.chipRemove}
                  aria-label={`${t.searchResults.removeFilter}: ${chip.label}`}
                  onClick={() => setFilters(chip.clear)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeWidth="2.2" strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
