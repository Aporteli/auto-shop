'use client';

import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FavoriteButton from '../FavoriteButton';
import styles from '../SearchDashboard.module.css';
import type { AiMatchedListing } from './types';

type SearchAiMatchedListingsProps = {
  listings: AiMatchedListing[];
  onSelectListing: () => void;
};

export default function SearchAiMatchedListings({
  listings,
  onSelectListing,
}: SearchAiMatchedListingsProps) {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();

  if (listings.length === 0) return null;

  return (
    <div className={styles.aiModalResults}>
      <h3 className={styles.aiModalResultsTitle}>{t.searchDashboard.aiMatchedListings}</h3>
      <div className={styles.aiModalResultsList}>
        {listings.map((listing) => {
          const priceLabel =
            listing.price != null ? formatAmount(listing.price, listing.currency ?? 'USD') : null;
          const yearLabel = listing.year != null ? String(listing.year) : null;
          const detail = [yearLabel, priceLabel].filter(Boolean).join(' · ');

          return (
            <div key={listing.id} className={styles.aiModalResultRow}>
              <Link
                href={`/listings/${listing.id}`}
                className={styles.aiModalResultLink}
                onClick={onSelectListing}>
                <span className={styles.aiModalResultMeta}>
                  <span className={styles.aiModalResultTitle}>{listing.titleEn || `#${listing.id}`}</span>
                  {detail ? <span className={styles.aiModalResultDetail}>{detail}</span> : null}
                </span>
                <span className={styles.aiModalResultCta}>{t.searchDashboard.aiViewListing}</span>
              </Link>
              <FavoriteButton listingId={listing.id} className={styles.aiModalFavorite} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
