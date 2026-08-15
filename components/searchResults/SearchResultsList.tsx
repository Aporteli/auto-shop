'use client';

import SearchResultCard, { type SearchResultListing } from '@/components/SearchResultCard';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PaginationItem } from '@/lib/pagination';
import type { ViewMode } from './types';
import styles from '../SearchResults.module.css';

type Props = {
  listings: SearchResultListing[];
  isLoading: boolean;
  viewMode: ViewMode;
  pagination: { page: number; total: number; totalPages: number };
  paginationItems: PaginationItem[];
  onPageChange: (page: number) => void;
};

export default function SearchResultsList({
  listings,
  isLoading,
  viewMode,
  pagination,
  paginationItems,
  onPageChange,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className={styles.resultsPanel}>
      {isLoading ? (
        <div className={styles.loading}>{t.searchResults.loading}</div>
      ) : listings.length === 0 ? (
        <div className={styles.empty}>{t.searchResults.noResults}</div>
      ) : (
        <div className={viewMode === 'grid' ? styles.grid : styles.list}>
          {listings.map((listing) => (
            <SearchResultCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Pagination">
          <button
            type="button"
            className={styles.pageButton}
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            aria-label="Previous page">
            ‹
          </button>
          {paginationItems.map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className={styles.pageEllipsis} aria-hidden>
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={`${styles.pageButton} ${item === pagination.page ? styles.pageButtonActive : ''}`}
                onClick={() => onPageChange(item)}
                aria-current={item === pagination.page ? 'page' : undefined}>
                {item}
              </button>
            ),
          )}
          <button
            type="button"
            className={styles.pageButton}
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            aria-label="Next page">
            ›
          </button>
        </nav>
      )}
    </div>
  );
}
