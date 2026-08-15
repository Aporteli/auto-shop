'use client';

import styles from '../DealersPage.module.css';

type DealersToolbarProps = {
  countLabel: string;
  view: 'grid' | 'list';
  query: string;
  viewModeLabel: string;
  gridViewLabel: string;
  listViewLabel: string;
  searchPlaceholder: string;
  onViewChange: (view: 'grid' | 'list') => void;
  onQueryChange: (query: string) => void;
};

export default function DealersToolbar({
  countLabel,
  view,
  query,
  viewModeLabel,
  gridViewLabel,
  listViewLabel,
  searchPlaceholder,
  onViewChange,
  onQueryChange,
}: DealersToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <p className={styles.count}>{countLabel}</p>
      <div className={styles.toolbarRight}>
        <div className={styles.viewToggle} role="group" aria-label={viewModeLabel}>
          <button
            type="button"
            className={`${styles.viewButton} ${view === 'grid' ? styles.viewButtonActive : ''}`}
            aria-pressed={view === 'grid'}
            aria-label={gridViewLabel}
            onClick={() => onViewChange('grid')}>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.viewButton} ${view === 'list' ? styles.viewButtonActive : ''}`}
            aria-pressed={view === 'list'}
            aria-label={listViewLabel}
            onClick={() => onViewChange('list')}>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h14v2H3v-2z" />
            </svg>
          </button>
        </div>
        <label className={styles.searchField}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={searchPlaceholder}
            className={styles.searchInput}
          />
        </label>
      </div>
    </div>
  );
}
