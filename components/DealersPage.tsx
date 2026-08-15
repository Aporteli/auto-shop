'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './DealersPage.module.css';
import DealerCard from './dealers/DealerCard';
import DealersToolbar from './dealers/DealersToolbar';
import type { DealerCardData, DealersResponse } from './dealers/types';

export type { DealerCardData } from './dealers/types';

export default function DealersPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type');
  const [dealers, setDealers] = useState<DealerCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [openMoreId, setOpenMoreId] = useState<number | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSearch(query.trim()), 220);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (typeFilter === 'LOCAL' || typeFilter === 'INTERNATIONAL') {
      params.set('type', typeFilter);
    }

    fetch(`/api/dealers?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: DealersResponse) => {
        setDealers(data.dealers);
        setTotal(data.total);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setDealers([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [search, typeFilter]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest(`.${styles.moreWrap}`)) setOpenMoreId(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const countLabel = useMemo(() => {
    const template = t.dealers.dealerCount;
    return template.replace('{{count}}', String(total));
  }, [t.dealers.dealerCount, total]);

  const labelName = (dealer: DealerCardData) =>
    language === 'ru' && dealer.companyNameRu ? dealer.companyNameRu : dealer.companyName;

  const labelAddress = (dealer: DealerCardData) => {
    if (language === 'ru' && dealer.addressRu) return dealer.addressRu;
    return dealer.address ?? t.dealers.unknownAddress;
  };

  const listingsLabel = (count: number) =>
    t.dealers.listingsCount.replace('{{count}}', String(count));

  return (
    <div className={styles.page}>
      <DealersToolbar
        countLabel={countLabel}
        view={view}
        query={query}
        viewModeLabel={t.dealers.viewMode}
        gridViewLabel={t.dealers.gridView}
        listViewLabel={t.dealers.listView}
        searchPlaceholder={t.dealers.searchPlaceholder}
        onViewChange={setView}
        onQueryChange={setQuery}
      />

      {isLoading ? (
        <p className={styles.status}>{t.dealers.loading}</p>
      ) : dealers.length === 0 ? (
        <p className={styles.status}>{t.dealers.noResults}</p>
      ) : (
        <div className={view === 'grid' ? styles.grid : styles.list}>
          {dealers.map((dealer) => (
            <DealerCard
              key={dealer.id}
              dealer={dealer}
              view={view}
              name={labelName(dealer)}
              address={labelAddress(dealer)}
              listingsLabel={listingsLabel(dealer.listingsCount)}
              phoneLabel={t.dealers.phone}
              emailLabel={t.dealers.email}
              moreLabel={t.dealers.more}
              websiteLabel={t.dealers.website}
              viewListingsLabel={t.dealers.viewListings}
              openMoreId={openMoreId}
              onToggleMore={(id) => setOpenMoreId((prev) => (prev === id ? null : id))}
              onCloseMore={() => setOpenMoreId(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
