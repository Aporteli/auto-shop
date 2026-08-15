'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from '../SearchDashboard.module.css';

type SearchAiPanelProps = {
  aiQuery: string;
  onQueryChange: (value: string) => void;
  isAiLoading: boolean;
  onSearch: () => void;
};

export default function SearchAiPanel({
  aiQuery,
  onQueryChange,
  isAiLoading,
  onSearch,
}: SearchAiPanelProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.aiCard}>
      <p className={styles.aiHint}>{t.searchDashboard.aiHint}</p>
      <textarea
        className={styles.aiInput}
        value={aiQuery}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={t.searchDashboard.aiPlaceholder}
        rows={4}
      />
      <div className={styles.aiActions}>
        <button
          type="button"
          className={styles.aiSearchButton}
          disabled={!aiQuery.trim() || isAiLoading}
          onClick={onSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.5l1.35 4.15L17.5 8l-4.15 1.35L12 13.5l-1.35-4.15L6.5 8l4.15-1.35L12 2.5z" />
            <path d="M18.5 13.5l.75 2.25L21.5 16.5l-2.25.75L18.5 19.5l-.75-2.25L15.5 16.5l2.25-.75.75-2.25z" />
          </svg>
          {isAiLoading ? t.searchDashboard.aiLoading : t.searchDashboard.aiSearch}
        </button>
      </div>
    </div>
  );
}
