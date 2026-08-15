'use client';

import styles from '../SearchResultCard.module.css';

type HiddenSearchResultCardProps = {
  title: string;
  year: number;
  yearSuffix: string;
  customsEstimate: number | null;
  customsFeeLabel: string;
  convertedCustoms: string;
  currencySymbol: string;
  compactPrice: string;
  showListingLabel: string;
  onShow: () => void;
};

export default function HiddenSearchResultCard({
  title,
  year,
  yearSuffix,
  customsEstimate,
  customsFeeLabel,
  convertedCustoms,
  currencySymbol,
  compactPrice,
  showListingLabel,
  onShow,
}: HiddenSearchResultCardProps) {
  return (
    <article className={styles.hiddenCard}>
      <div className={styles.hiddenMain}>
        <span className={styles.hiddenTitle}>{title}</span>
        <span className={styles.hiddenYear}>
          {year} {yearSuffix}
        </span>
        {customsEstimate != null && (
          <span className={styles.hiddenCustoms}>
            {customsFeeLabel} {convertedCustoms}
            <span className={styles.hiddenCustomsCurrency}> {currencySymbol}</span>
          </span>
        )}
        <span className={styles.hiddenPrice}>{compactPrice}</span>
      </div>
      <button
        type="button"
        className={styles.hiddenShowButton}
        aria-label={showListingLabel}
        onClick={onShow}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeWidth="1.8" strokeLinecap="round" d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" />
          <circle cx="12" cy="12" r="2.5" strokeWidth="1.8" />
        </svg>
      </button>
    </article>
  );
}
