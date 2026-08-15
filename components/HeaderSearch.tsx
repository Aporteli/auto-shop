'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import styles from './HeaderSearch.module.css';
import HeaderSearchPanel from './headerSearch/HeaderSearchPanel';
import type { HeaderSearchProps, SearchHit } from './headerSearch/types';

export default function HeaderSearch({ variant, autoFocus = false, onNavigate }: HeaderSearchProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { formatAmount } = useCurrency();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setActiveIndex(-1);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          q: trimmed,
          limit: '8',
          listingType: 'SALE',
        });
        const response = await fetch(`/api/listings?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('search failed');
        const data = (await response.json()) as { listings: SearchHit[] };
        setResults(data.listings);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (error) {
        if (controller.signal.aborted) return;
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const labelCity = (item: SearchHit) => {
    if (!item.city) return t.searchResults.unknownLocation;
    return language === 'ru' ? item.city.nameRu : item.city.nameEn;
  };

  const formatPrice = (item: SearchHit) => {
    if (item.priceNegotiable) return t.searchResults.priceNegotiable;
    return formatAmount(item.price, item.currency);
  };

  const goToSearchPage = (value = query) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setIsOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(trimmed)}&listingType=SALE&customsCleared=true`);
  };

  const goToListing = (id: number) => {
    setIsOpen(false);
    onNavigate?.();
    router.push(`/listings/${id}`);
  };

  const showPanel = isOpen && query.trim().length >= 2;

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${variant === 'mobile' ? styles.rootMobile : styles.rootDesktop}`}>
      <div className={styles.inputWrap}>
        <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          placeholder={t.header.searchPlaceholder}
          className={`${styles.input} ${variant === 'mobile' ? styles.inputMobile : styles.inputDesktop}`}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={showPanel}
          role="combobox"
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
              return;
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((prev) => Math.max(prev - 1, -1));
              return;
            }
            if (event.key === 'Enter') {
              event.preventDefault();
              if (activeIndex >= 0 && results[activeIndex]) {
                goToListing(results[activeIndex].id);
                return;
              }
              goToSearchPage();
              return;
            }
            if (event.key === 'Escape') {
              setIsOpen(false);
            }
          }}
        />
        {query && (
          <button
            type="button"
            className={styles.clearButton}
            aria-label={t.header.clearSearch}
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}>
            ×
          </button>
        )}
      </div>

      {showPanel && (
        <HeaderSearchPanel
          listId={listId}
          language={language}
          isLoading={isLoading}
          results={results}
          activeIndex={activeIndex}
          searchingLabel={t.header.searching}
          noResultsLabel={t.header.noSearchResults}
          viewAllLabel={t.header.viewAllResults}
          onHover={setActiveIndex}
          onSelect={goToListing}
          onViewAll={() => goToSearchPage()}
          labelCity={labelCity}
          formatPrice={formatPrice}
        />
      )}
    </div>
  );
}
