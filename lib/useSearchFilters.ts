'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  buildListingSearchParams,
  parseSearchFiltersFromUrl,
  type SearchFiltersState,
} from './searchParams';

type SetFiltersArg =
  | Partial<SearchFiltersState>
  | ((current: SearchFiltersState) => Partial<SearchFiltersState>);

type SetFiltersOptions = {
  /** Reset to page 1 when filters change (default: true). Set false for pagination. */
  resetPage?: boolean;
  scroll?: boolean;
};

export function useSearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseSearchFiltersFromUrl(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const pushFilters = useCallback(
    (next: SearchFiltersState, options?: { scroll?: boolean }) => {
      const params = buildListingSearchParams(next);
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: options?.scroll ?? false });
    },
    [router, pathname],
  );

  const replaceFilters = useCallback(
    (next: SearchFiltersState) => {
      const params = buildListingSearchParams(next);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const setFilters = useCallback(
    (update: SetFiltersArg, options?: SetFiltersOptions) => {
      const current = parseSearchFiltersFromUrl(new URLSearchParams(searchParams.toString()));
      const patch = typeof update === 'function' ? update(current) : update;
      const resetPage = options?.resetPage !== false;

      const next: SearchFiltersState = {
        ...current,
        ...patch,
      };

      if (resetPage && patch.page === undefined) {
        next.page = 1;
      }

      pushFilters(next, { scroll: options?.scroll });
    },
    [searchParams, pushFilters],
  );

  return {
    filters,
    setFilters,
    replaceFilters,
    pathname,
    searchParams,
  };
}
