'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  buildListingSearchParams,
  defaultSearchFilters,
  type SearchFiltersState,
} from '@/lib/searchParams';
import {
  addLastSearch,
  buildLastSearchLabel,
  getLastSearches,
  hasLastSearchContent,
  type LastSearchEntry,
} from '@/lib/lastSearches';
import styles from './SearchDashboard.module.css';
import SearchAdditionalFilters from './searchDashboard/SearchAdditionalFilters';
import SearchAiModal from './searchDashboard/SearchAiModal';
import SearchAiPanel from './searchDashboard/SearchAiPanel';
import SearchFilterPanel from './searchDashboard/SearchFilterPanel';
import SearchLastSearches from './searchDashboard/SearchLastSearches';
import SearchModeToggle from './searchDashboard/SearchModeToggle';
import { useAiSearch } from './searchDashboard/useAiSearch';
import { useFilterOptions } from './searchDashboard/useFilterOptions';
import { useListingCount } from './searchDashboard/useListingCount';
import { useSearchFilterSelectOptions } from './searchDashboard/useSearchFilterSelectOptions';
import type { SearchMode } from './searchDashboard/types';

export default function SearchDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const [filters, setFiltersState] = useState<SearchFiltersState>(defaultSearchFilters);
  const [isAdditionalFiltersOpen, setIsAdditionalFiltersOpen] = useState(false);
  const [lastSearches, setLastSearches] = useState<LastSearchEntry[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode>('filters');

  const setFilters = (patch: Partial<SearchFiltersState>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  };

  const { filterOptions, isLoading } = useFilterOptions(setFiltersState);
  const { resultCount, isCountLoading } = useListingCount(filterOptions, filters);
  const selectOptions = useSearchFilterSelectOptions(filterOptions, filters, language);
  const {
    aiQuery,
    setAiQuery,
    aiResponse,
    aiResults,
    isAiLoading,
    isAiModalOpen,
    lastAiPrompt,
    handleAiSearch,
    closeAiModal,
  } = useAiSearch();

  useEffect(() => {
    setLastSearches(getLastSearches());
  }, []);

  useEffect(() => {
    if (pathname === '/' && searchParams.toString()) {
      router.replace('/');
    }
  }, [pathname, searchParams, router]);

  const handleSearch = () => {
    if (filterOptions && hasLastSearchContent(filters)) {
      const label = buildLastSearchLabel(filters, filterOptions, language);
      setLastSearches(addLastSearch(filters, label));
    }

    const params = buildListingSearchParams(filters);
    const query = params.toString();
    router.push(query ? `/search?${query}` : '/search');
  };

  const handleLastSearchClick = (entry: LastSearchEntry) => {
    router.push(`/search?${entry.query}`);
  };

  return (
    <div className={styles.dashboard}>
      <SearchModeToggle searchMode={searchMode} onChange={setSearchMode} />
      {searchMode === 'ai' ? (
        <SearchAiPanel
          aiQuery={aiQuery}
          onQueryChange={setAiQuery}
          isAiLoading={isAiLoading}
          onSearch={handleAiSearch}
        />
      ) : (
        <SearchFilterPanel
          filters={filters}
          setFilters={setFilters}
          setFiltersState={setFiltersState}
          filterOptions={filterOptions}
          isLoading={isLoading}
          selectOptions={selectOptions}
          resultCount={resultCount}
          isCountLoading={isCountLoading}
          onSearch={handleSearch}
          onOpenAdditionalFilters={() => setIsAdditionalFiltersOpen(true)}
        />
      )}
      <SearchAdditionalFilters
        isOpen={isAdditionalFiltersOpen}
        onClose={() => setIsAdditionalFiltersOpen(false)}
        filterOptions={filterOptions}
        filters={filters}
        setFilters={setFilters}
      />
      <SearchLastSearches lastSearches={lastSearches} onSelect={handleLastSearchClick} />
      <SearchAiModal
        isOpen={isAiModalOpen}
        isLoading={isAiLoading}
        lastAiPrompt={lastAiPrompt}
        aiResponse={aiResponse}
        aiResults={aiResults}
        onClose={closeAiModal}
      />
    </div>
  );
}
