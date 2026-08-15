'use client';

import { useEffect, useState } from 'react';
import { buildListingSearchParams, type SearchFiltersState } from '@/lib/searchParams';
import type { ApiFiltersResponse, ListingsCountResponse } from './types';

export function useListingCount(filterOptions: ApiFiltersResponse | null, filters: SearchFiltersState) {
  const [resultCount, setResultCount] = useState<number>(0);
  const [isCountLoading, setIsCountLoading] = useState(false);

  useEffect(() => {
    if (!filterOptions) return;

    const controller = new AbortController();
    const params = buildListingSearchParams(filters, { limit: 1 });

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsCountLoading(true);
        const response = await fetch(`/api/listings?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to load listing count: ${response.status}`);
        }
        const data = (await response.json()) as ListingsCountResponse;
        setResultCount(data.pagination.total);
      } catch {
        if (controller.signal.aborted) return;
        setResultCount(0);
      } finally {
        if (!controller.signal.aborted) {
          setIsCountLoading(false);
        }
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [filterOptions, filters]);

  return { resultCount, isCountLoading };
}
