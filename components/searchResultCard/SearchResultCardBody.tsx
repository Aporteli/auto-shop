'use client';

import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import CarImage from '@/components/CarImage';
import styles from '../SearchResultCard.module.css';
import { SpecIcon } from './SpecIcon';
import type { SearchResultListing } from './types';

type SearchResultCardBodyProps = {
  listing: SearchResultListing;
  title: string;
  yearSuffix: string;
  locationLabel: string;
  customsClearedLabel: string;
  beforeCustomsLabel: string;
  engineSpec: string;
  transmissionLabel: string;
  mileageSpec: string;
  steeringLabel: string;
  superVipBadge: string;
  postedAgo: string;
  viewsLabel: string;
  priceAmount: string;
  compareLabel: string;
  contactLabel: string;
  hideListingLabel: string;
  imageNumberTemplate: string;
  galleryImages: Array<{ url: string | null }>;
  activeImageIndex: number;
  currentImage: { url: string | null };
  onImageAreaLeave: () => void;
  onImageIndexChange: (index: number) => void;
  onHide: () => void;
};

export default function SearchResultCardBody({
  listing,
  title,
  yearSuffix,
  locationLabel,
  customsClearedLabel,
  beforeCustomsLabel,
  engineSpec,
  transmissionLabel,
  mileageSpec,
  steeringLabel,
  superVipBadge,
  postedAgo,
  viewsLabel,
  priceAmount,
  compareLabel,
  contactLabel,
  hideListingLabel,
  imageNumberTemplate,
  galleryImages,
  activeImageIndex,
  currentImage,
  onImageAreaLeave,
  onImageIndexChange,
  onHide,
}: SearchResultCardBodyProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.imageSection} onMouseLeave={onImageAreaLeave}>
          <Link href={`/listings/${listing.id}`} className={styles.imageLink}>
            <CarImage
              className={styles.image}
              src={currentImage.url}
              make={listing.model.manufacturer.nameEn}
              model={listing.model.nameEn}
              alt={title}
              photoIndex={activeImageIndex}
              draggable={false}
              sizes="(max-width: 768px) 100vw, 220px"
            />
          </Link>

          {galleryImages.length > 1 && (
            <div className={styles.imageDots}>
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.dot} ${index === activeImageIndex ? styles.dotActive : ''}`}
                  aria-label={`${title} — ${imageNumberTemplate.replace('{{number}}', String(index + 1))}`}
                  onMouseEnter={() => onImageIndexChange(index)}
                  onFocus={() => onImageIndexChange(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.contentSection}>
          <div className={styles.titleRow}>
            <div className={styles.titleBlock}>
              <h3 className={styles.title}>
                {title}{' '}
                <span className={styles.year}>
                  {listing.year} {yearSuffix}
                </span>
              </h3>
            </div>
            <div className={styles.metaTop}>
              <span className={styles.location}>{locationLabel}</span>
              <span
                className={`${styles.customsBadge} ${
                  listing.customsCleared ? styles.customsCleared : styles.customsPending
                }`}>
                {listing.customsCleared ? customsClearedLabel : beforeCustomsLabel}
              </span>
            </div>
          </div>

          <div className={styles.specGrid}>
            <div className={styles.specItem}>
              <SpecIcon type="engine" />
              <span>{engineSpec}</span>
            </div>
            <div className={styles.specItem}>
              <SpecIcon type="transmission" />
              <span>{transmissionLabel}</span>
            </div>
            <div className={styles.specItem}>
              <SpecIcon type="mileage" />
              <span>{mileageSpec}</span>
            </div>
            <div className={styles.specItem}>
              <SpecIcon type="steering" />
              <span>{steeringLabel}</span>
            </div>
          </div>

          <div className={styles.footerRow}>
            {listing.isVip && <span className={styles.vipBadge}>{superVipBadge}</span>}
            <span className={styles.metaText}>
              {postedAgo} • {viewsLabel}
            </span>
          </div>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.priceRow}>
            <span className={styles.price}>{priceAmount}</span>
            <span className={styles.currencyToggle} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="8" strokeWidth="1.8" />
                <path strokeWidth="1.8" strokeLinecap="round" d="M8 12h8M12 8v8" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <FavoriteButton listingId={listing.id} className={styles.actionButton} />
        <button type="button" className={styles.actionButton} aria-label={compareLabel}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.8" strokeLinecap="round" d="M5 17h14M7 13h10M9 9h6" />
          </svg>
        </button>
        <button type="button" className={styles.actionButton} aria-label={contactLabel}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.8" strokeLinecap="round" d="M8 10h8M8 14h5" />
            <path strokeWidth="1.8" strokeLinejoin="round" d="M6 6h12v12H6z" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.actionButton}
          aria-label={hideListingLabel}
          onClick={onHide}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.8" strokeLinecap="round" d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" />
            <circle cx="12" cy="12" r="2.5" strokeWidth="1.8" />
            <path strokeWidth="1.8" strokeLinecap="round" d="m4 4 16 16" />
          </svg>
        </button>
      </div>
    </article>
  );
}
