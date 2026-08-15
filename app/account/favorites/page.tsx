'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import AccountPageShell from '@/components/AccountPageShell';
import AccountListingRow, { type AccountListingItem } from '@/components/AccountListingRow';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '@/components/AccountPage.module.css';

export default function FavoritesPage() {
  const { t } = useLanguage();
  const { isReady, isFavorite } = useFavorites();
  const [listings, setListings] = useState<AccountListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/account/favorites')
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data.listings) ? data.listings : []))
      .finally(() => setIsLoading(false));
  }, []);

  const visible = useMemo(
    () => listings.filter((listing) => isFavorite(listing.id)),
    [isFavorite, listings],
  );

  return (
    <RequireAuth>
      <AccountPageShell
        title={t.accountDashboard.savedCars}
        subtitle={t.accountPages.favoritesSubtitle}
        action={
          <Link href="/search" className={styles.secondaryButton}>
            {t.accountPages.browseListings}
          </Link>
        }>
        {isLoading || !isReady ? (
          <p className={styles.empty}>{t.accountPages.loading}</p>
        ) : visible.length === 0 ? (
          <p className={styles.empty}>{t.accountPages.emptyFavorites}</p>
        ) : (
          <div className={styles.list}>
            {visible.map((listing) => (
              <AccountListingRow key={listing.id} listing={listing} showFavorite />
            ))}
          </div>
        )}
      </AccountPageShell>
    </RequireAuth>
  );
}
