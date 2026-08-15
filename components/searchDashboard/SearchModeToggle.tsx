'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from '../SearchDashboard.module.css';
import type { SearchMode } from './types';

type SearchModeToggleProps = {
  searchMode: SearchMode;
  onChange: (mode: SearchMode) => void;
};

export default function SearchModeToggle({ searchMode, onChange }: SearchModeToggleProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.modeToggleWrap}>
      <div className={styles.modeToggle} role="tablist" aria-label={t.searchDashboard.modeFilters}>
        <button
          type="button"
          role="tab"
          aria-selected={searchMode === 'filters'}
          className={`${styles.modeToggleButton} ${searchMode === 'filters' ? styles.modeToggleButtonActive : ''}`}
          onClick={() => onChange('filters')}>
          <svg
            className={styles.modeToggleIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true">
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              d="M4 7h10M14 7a2 2 0 104 0 2 2 0 00-4 0zM20 12H10M10 12a2 2 0 11-4 0 2 2 0 014 0zM4 17h8M12 17a2 2 0 104 0 2 2 0 00-4 0z"
            />
          </svg>
          {t.searchDashboard.modeFilters}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={searchMode === 'ai'}
          className={`${styles.modeToggleButton} ${searchMode === 'ai' ? styles.modeToggleButtonActive : ''}`}
          onClick={() => onChange('ai')}>
          <svg
            className={`${styles.modeToggleIcon} ${styles.modeToggleAiIcon}`}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true">
            <path d="M12 2.5l1.35 4.15L17.5 8l-4.15 1.35L12 13.5l-1.35-4.15L6.5 8l4.15-1.35L12 2.5z" />
            <path d="M18.5 13.5l.75 2.25L21.5 16.5l-2.25.75L18.5 19.5l-.75-2.25L15.5 16.5l2.25-.75.75-2.25z" />
          </svg>
          {t.searchDashboard.modeAi}
          <span className={styles.modeToggleBeta}>{t.searchDashboard.modeAiBeta}</span>
        </button>
      </div>
    </div>
  );
}
