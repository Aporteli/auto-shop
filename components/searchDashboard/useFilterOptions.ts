'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { SearchFiltersState } from '@/lib/searchParams';
import { carsCategoryId, type ApiFiltersResponse } from './types';

export function useFilterOptions(setFiltersState: Dispatch<SetStateAction<SearchFiltersState>>) {
  const [filterOptions, setFilterOptions] = useState<ApiFiltersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/filters');
        if (!res.ok) throw new Error(`Failed to load filters: ${res.status}`);
        const data = (await res.json()) as ApiFiltersResponse;
        if (!mounted) return;
        setFilterOptions(data);
        setFiltersState((prev) => {
          if (prev.categoryId != null) return prev;
          const carsId = carsCategoryId(data.categories);
          if (carsId == null) return prev;
          return { ...prev, categoryId: carsId };
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setFiltersState]);

  return { filterOptions, isLoading };
}
