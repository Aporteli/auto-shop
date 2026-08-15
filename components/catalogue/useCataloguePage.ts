import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildListingSearchParams, type SearchFiltersState } from '@/lib/searchParams';
import {
  type ApiFiltersResponse,
  type Brand,
  ENGINE_VOLUMES,
  YEARS,
  INITIAL_BRAND_ROWS,
  POPULAR_COUNT,
  defaultCatalogueFilters,
  brandInitial,
} from './types';

export function useCataloguePage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const c = t.catalogue;

  const [filters, setFiltersState] = useState<SearchFiltersState>(defaultCatalogueFilters);
  const [filterOptions, setFilterOptions] = useState<ApiFiltersResponse | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [resultCount, setResultCount] = useState(0);
  const [isCountLoading, setIsCountLoading] = useState(true);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [activeLetter, setActiveLetter] = useState('ALL');

  const label = (item: { nameEn: string; nameRu: string }) => (language === 'ru' ? item.nameRu : item.nameEn);

  const setFilters = (patch: Partial<SearchFiltersState>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  };

  useEffect(() => {
    fetch('/api/filters')
      .then((res) => res.json())
      .then((data: ApiFiltersResponse) => setFilterOptions(data))
      .catch(() => setFilterOptions(null));

    fetch('/api/catalogue/brands')
      .then((res) => res.json())
      .then((data: { brands: Brand[] }) => setBrands(data.brands ?? []))
      .catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsCountLoading(true);
      const params = buildListingSearchParams(filters, { limit: 1 });
      fetch(`/api/listings?${params.toString()}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data: { pagination?: { total: number } }) => setResultCount(data.pagination?.total ?? 0))
        .catch(() => {
          if (!controller.signal.aborted) setResultCount(0);
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsCountLoading(false);
        });
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [filters]);

  const modelsForManufacturer = useMemo(() => {
    if (!filterOptions) return [];
    if (filters.manufacturerId === '') return filterOptions.models;
    return filterOptions.models.filter((item) => item.manufacturerId === filters.manufacturerId);
  }, [filterOptions, filters.manufacturerId]);

  const locationOptions = useMemo(() => {
    if (!filterOptions) return [];
    return filterOptions.countries.flatMap((country) =>
      country.cities.map((city) => ({
        value: String(city.id),
        label: `${label(city)} (${label(country)})`,
      })),
    );
  }, [filterOptions, language]);

  const yearOptions = useMemo(() => {
    const source = filterOptions?.years?.length ? filterOptions.years : YEARS;
    return [...source].sort((a, b) => b - a).map((year) => ({ value: String(year), label: String(year) }));
  }, [filterOptions]);

  const engineOptions = ENGINE_VOLUMES.map((value) => ({ value, label: `${value} L` }));

  const popularBrands = useMemo(
    () => [...brands].sort((a, b) => b.listingsCount - a.listingsCount).filter((item) => item.listingsCount > 0),
    [brands],
  );

  const visiblePopular = showAllPopular ? popularBrands : popularBrands.slice(0, POPULAR_COUNT);

  const letters = useMemo(() => {
    const set = new Set<string>();
    brands.forEach((brand) => {
      const letter = brandInitial(brand.nameEn);
      if (/[A-Z]/.test(letter)) set.add(letter);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [brands]);

  const groupedBrands = useMemo(() => {
    const source = activeLetter === 'ALL' ? brands : brands.filter((brand) => brandInitial(brand.nameEn) === activeLetter);
    const groups = new Map<string, Brand[]>();
    source.forEach((brand) => {
      const letter = /[A-Z]/.test(brandInitial(brand.nameEn)) ? brandInitial(brand.nameEn) : '#';
      const list = groups.get(letter) ?? [];
      list.push(brand);
      groups.set(letter, list);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [activeLetter, brands]);

  const visibleGroupedBrands = useMemo(() => {
    if (showAllBrands || activeLetter !== 'ALL') return groupedBrands;
    let remaining = INITIAL_BRAND_ROWS;
    const limited: Array<[string, Brand[]]> = [];
    for (const [letter, list] of groupedBrands) {
      if (remaining <= 0) break;
      limited.push([letter, list.slice(0, remaining)]);
      remaining -= Math.min(list.length, remaining);
    }
    return limited;
  }, [activeLetter, groupedBrands, showAllBrands]);

  const goToSearch = (patch?: Partial<SearchFiltersState>) => {
    const next = { ...filters, ...patch, page: 1 };
    if (next.yearFrom !== '' && next.yearTo !== '' && Number(next.yearFrom) > Number(next.yearTo)) {
      const swapped = next.yearFrom;
      next.yearFrom = next.yearTo;
      next.yearTo = swapped;
    }
    router.push(`/search?${buildListingSearchParams(next).toString()}`);
  };

  const openBrand = (brand: Brand) => {
    goToSearch({
      ...defaultCatalogueFilters(),
      manufacturerId: brand.id,
    });
  };

  return {
    c,
    language,
    t,
    filters,
    setFilters,
    filterOptions,
    brands,
    resultCount,
    isCountLoading,
    showAllBrands,
    setShowAllBrands,
    showAllPopular,
    setShowAllPopular,
    activeLetter,
    setActiveLetter,
    label,
    modelsForManufacturer,
    locationOptions,
    yearOptions,
    engineOptions,
    visiblePopular,
    letters,
    visibleGroupedBrands,
    goToSearch,
    openBrand,
  };
}
