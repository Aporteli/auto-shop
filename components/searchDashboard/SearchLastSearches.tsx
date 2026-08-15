'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import type { LastSearchEntry } from '@/lib/lastSearches';
import styles from '../SearchDashboard.module.css';

type SearchLastSearchesProps = {
  lastSearches: LastSearchEntry[];
  onSelect: (entry: LastSearchEntry) => void;
};

export default function SearchLastSearches({ lastSearches, onSelect }: SearchLastSearchesProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.lastSearches}>
      <span className={styles.lastSearchesTitle}>{t.searchDashboard.lastSearches}</span>
      <div className={styles.lastSearchesList}>
        {lastSearches.length === 0 ? (
          <span className={styles.lastSearchesEmpty}>{t.searchDashboard.lastSearchesEmpty}</span>
        ) : (
          lastSearches.map((entry) => (
            <button
              key={entry.query}
              type="button"
              className={styles.lastSearchItem}
              onClick={() => onSelect(entry)}>
              <svg className={styles.lastSearchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {entry.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
