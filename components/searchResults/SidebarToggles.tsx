'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { clearAllSearchFilters } from '@/lib/searchFilterChips';
import { useSearchFilters } from '@/lib/useSearchFilters';
import styles from '../SearchResults.module.css';

export default function SidebarToggles() {
  const { filters, setFilters, replaceFilters } = useSearchFilters();
  const { t } = useLanguage();

  return (
    <>
      <div className={styles.filterGroup}>
        <span className={styles.label}>{t.searchResults.customs}</span>
        <div className={styles.segmentedControl}>
          <button
            type="button"
            className={`${styles.segmentButton} ${filters.customsType === 'cleared' ? styles.segmentButtonActive : ''}`}
            onClick={() =>
              setFilters({ customsType: filters.customsType === 'cleared' ? 'all' : 'cleared' })
            }>
            {t.searchDashboard.filters.customsCleared}
          </button>
          <button
            type="button"
            className={`${styles.segmentButton} ${filters.customsType === 'before' ? styles.segmentButtonActive : ''}`}
            onClick={() =>
              setFilters({ customsType: filters.customsType === 'before' ? 'all' : 'before' })
            }>
            {t.searchDashboard.filters.beforeCustoms}
          </button>
        </div>
      </div>

      <div className={styles.toggleRow}>
        <span>{t.searchDashboard.toggles.withVin}</span>
        <button
          type="button"
          className={`${styles.toggle} ${filters.withVin ? styles.toggleOn : ''}`}
          onClick={() => setFilters({ withVin: !filters.withVin })}
          aria-pressed={filters.withVin}>
          <span className={styles.toggleKnob} />
        </button>
      </div>

      <div className={styles.toggleRow}>
        <span>{t.searchDashboard.toggles.hideNegotiable}</span>
        <button
          type="button"
          className={`${styles.toggle} ${filters.hideNegotiable ? styles.toggleOn : ''}`}
          onClick={() => setFilters({ hideNegotiable: !filters.hideNegotiable })}
          aria-pressed={filters.hideNegotiable}>
          <span className={styles.toggleKnob} />
        </button>
      </div>

      <div className={styles.toggleRow}>
        <span>{t.searchDashboard.toggles.with360}</span>
        <button
          type="button"
          className={`${styles.toggle} ${filters.with360 ? styles.toggleOn : ''}`}
          onClick={() => setFilters({ with360: !filters.with360 })}
          aria-pressed={filters.with360}>
          <span className={styles.toggleKnob} />
        </button>
      </div>

      <div className={styles.sidebarActions}>
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => replaceFilters(clearAllSearchFilters())}>
          {t.searchDashboard.clearFilters}
        </button>
      </div>
    </>
  );
}
