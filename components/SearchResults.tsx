'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildListingSearchParams } from '@/lib/searchParams';
import { useSearchFilters } from '@/lib/useSearchFilters';
import { getPaginationItems } from '@/lib/pagination';
import type { SearchResultListing } from '@/components/SearchResultCard';
import SearchResultsSidebar from './searchResults/SearchResultsSidebar';
import SearchResultsToolbar from './searchResults/SearchResultsToolbar';
import SearchResultsList from './searchResults/SearchResultsList';
import { useActiveChips } from './searchResults/useActiveChips';
import {
  RESULTS_PAGE_SIZE,
  type ApiFiltersResponse,
  type ListingsResponse,
  type ViewMode,
} from './searchResults/types';
import styles from './SearchResults.module.css';

export default function SearchResults() {
  const { filters, setFilters, searchParams } = useSearchFilters();
  const { t } = useLanguage();

  const [filterOptions, setFilterOptions] = useState<ApiFiltersResponse | null>(null);
  const [listings, setListings] = useState<SearchResultListing[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/filters')
      .then((res) => res.json())
      .then((data: ApiFiltersResponse) => setFilterOptions(data))
      .catch(() => setFilterOptions(null));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const params = buildListingSearchParams(filters, { limit: RESULTS_PAGE_SIZE });

    setIsLoading(true);
    fetch(`/api/listings?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: ListingsResponse) => {
        setListings(data.listings ?? []);
        setPagination({
          page: data.pagination?.page ?? 1,
          total: data.pagination?.total ?? 0,
          totalPages: data.pagination?.totalPages ?? 1,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setListings([]);
          setPagination({ page: 1, total: 0, totalPages: 1 });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [searchParams]);

  const activeChips = useActiveChips(filters, filterOptions);

  const listingsCountLabel =
    pagination.total === 1
      ? t.searchResults.listingsCount.replace('{{count}}', String(pagination.total))
      : t.searchResults.listingsCountPlural.replace('{{count}}', String(pagination.total));

  const handlePageChange = (page: number) => {
    setFilters({ page }, { resetPage: false, scroll: true });
    const top = resultsRef.current?.getBoundingClientRect().top ?? 0;
    const offset = window.scrollY + top - 96;
    window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
  };

  const paginationItems = useMemo(
    () => getPaginationItems(pagination.page, pagination.totalPages),
    [pagination.page, pagination.totalPages],
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.searchResults.title}</h1>
        <p className={styles.subtitle}>{t.searchResults.subtitle}</p>
      </div>

      <div className={styles.layout}>
        <SearchResultsSidebar filterOptions={filterOptions} />
        <section className={styles.results} ref={resultsRef}>
          <SearchResultsToolbar
            listingsCountLabel={listingsCountLabel}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            activeChips={activeChips}
          />
          <SearchResultsList
            listings={listings}
            isLoading={isLoading}
            viewMode={viewMode}
            pagination={pagination}
            paginationItems={paginationItems}
            onPageChange={handlePageChange}
          />
        </section>
      </div>
    </div>
  );
}
