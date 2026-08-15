'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import AccountDashboard from '@/components/AccountDashboard';
import AccountListingRow, { type AccountListingItem } from '@/components/AccountListingRow';
import { useLanguage } from '@/contexts/LanguageContext';
import { LISTING_LIMIT } from '@/lib/accountBalance';
import styles from '@/components/AccountListings.module.css';

type ListingTab = 'active' | 'expired' | 'disabled' | 'blocked';
type ListingSort = 'newest' | 'oldest' | 'price_desc' | 'price_asc';
type ListingFilter = 'all' | 'sale' | 'rent';
type OpenMenu = 'filter' | 'sort' | null;

type MyListing = AccountListingItem & {
  listingType?: string;
  createdAt?: string;
};

function tabForStatus(status?: string): ListingTab {
  if (status === 'EXPIRED') return 'expired';
  if (status === 'DRAFT' || status === 'MODERATION') return 'disabled';
  if (status === 'SOLD' || status === 'RENTED') return 'blocked';
  return 'active';
}

export default function MyListingsPage() {
  const { t } = useLanguage();
  const [listings, setListings] = useState<MyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<ListingTab>('active');
  const [sort, setSort] = useState<ListingSort>('newest');
  const [filter, setFilter] = useState<ListingFilter>('all');
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  useEffect(() => {
    fetch('/api/account/listings')
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data.listings) ? data.listings : []))
      .finally(() => setIsLoading(false));
  }, []);

  const counts = useMemo(() => {
    const next = { active: 0, expired: 0, disabled: 0, blocked: 0 };
    for (const listing of listings) next[tabForStatus(listing.status)] += 1;
    return next;
  }, [listings]);

  const visible = useMemo(() => {
    const filtered = listings.filter((listing) => {
      if (tabForStatus(listing.status) !== tab) return false;
      if (filter === 'sale') return listing.listingType === 'SALE';
      if (filter === 'rent') return listing.listingType === 'RENT';
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'oldest') {
        return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
      }
      if (sort === 'price_desc') return Number(b.price) - Number(a.price);
      if (sort === 'price_asc') return Number(a.price) - Number(b.price);
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });
  }, [filter, listings, sort, tab]);

  const tabs: Array<{ id: ListingTab; label: string }> = [
    { id: 'active', label: `${t.accountPages.tabActive} (${counts.active})` },
    { id: 'expired', label: `${t.accountPages.tabExpired} (${counts.expired})` },
    { id: 'disabled', label: `${t.accountPages.tabDisabled} (${counts.disabled})` },
    { id: 'blocked', label: `${t.accountPages.tabBlocked} (${counts.blocked})` },
  ];

  return (
    <RequireAuth>
      <AccountDashboard>
        <section className={styles.panel}>
          <h1 className={styles.title}>{t.accountDashboard.myListings}</h1>

          <div className={styles.toolbar}>
            <span className={styles.limit}>
              {t.accountPages.limit
                .replace('{{used}}', String(listings.length))
                .replace('{{max}}', String(LISTING_LIMIT))}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                <path strokeWidth="1.8" strokeLinecap="round" d="M12 11v5M12 8h.01" />
              </svg>
            </span>

            <Link href="/account/leasing" className={styles.loan}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeWidth="1.8" d="M4 19V5h10v14H4zM14 8h4l2 3v8h-6" />
              </svg>
              {t.accountPages.getLoan}
            </Link>

            <div className={styles.toolWrap}>
              <button
                type="button"
                className={`${styles.toolButton} ${openMenu === 'filter' ? styles.toolButtonOpen : ''}`}
                onClick={() => setOpenMenu(openMenu === 'filter' ? null : 'filter')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeWidth="1.8" d="M4 7h16M7 12h10M10 17h4" />
                </svg>
                {t.accountPages.filter}
              </button>
              {openMenu === 'filter' && (
                <div className={styles.menu}>
                  {(['all', 'sale', 'rent'] as ListingFilter[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.menuItem} ${filter === option ? styles.menuItemActive : ''}`}
                      onClick={() => {
                        setFilter(option);
                        setOpenMenu(null);
                      }}>
                      {option === 'all'
                        ? t.accountPages.filterAll
                        : option === 'sale'
                          ? t.accountPages.filterSale
                          : t.accountPages.filterRent}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.toolWrap}>
              <button
                type="button"
                className={`${styles.toolButton} ${openMenu === 'sort' ? styles.toolButtonOpen : ''}`}
                onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeWidth="1.8" d="M4 7h10M4 12h7M4 17h4M16 7l4 4M20 7v10" />
                </svg>
                {t.accountPages.sort}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeWidth="2" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openMenu === 'sort' && (
                <div className={styles.menu}>
                  {(
                    [
                      ['newest', t.accountPages.sortNewest],
                      ['oldest', t.accountPages.sortOldest],
                      ['price_desc', t.accountPages.sortPriceDesc],
                      ['price_asc', t.accountPages.sortPriceAsc],
                    ] as Array<[ListingSort, string]>
                  ).map(([option, label]) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.menuItem} ${sort === option ? styles.menuItemActive : ''}`}
                      onClick={() => {
                        setSort(option);
                        setOpenMenu(null);
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.tabs}>
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.tab} ${tab === item.id ? styles.tabActive : ''}`}
                onClick={() => setTab(item.id)}>
                {item.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className={styles.empty}>{t.accountPages.loading}</p>
          ) : visible.length === 0 ? (
            <p className={styles.empty}>{t.accountPages.adNotFound}</p>
          ) : (
            <div className={styles.list}>
              {visible.map((listing) => (
                <AccountListingRow key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </AccountDashboard>
    </RequireAuth>
  );
}
