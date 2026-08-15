'use client';

import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import styles from '../DealersPage.module.css';
import type { DealerCardData } from './types';

type DealerCardProps = {
  dealer: DealerCardData;
  view: 'grid' | 'list';
  name: string;
  address: string;
  listingsLabel: string;
  phoneLabel: string;
  emailLabel: string;
  moreLabel: string;
  websiteLabel: string;
  viewListingsLabel: string;
  openMoreId: number | null;
  onToggleMore: (id: number) => void;
  onCloseMore: () => void;
};

export default function DealerCard({
  dealer,
  view,
  name,
  address,
  listingsLabel,
  phoneLabel,
  emailLabel,
  moreLabel,
  websiteLabel,
  viewListingsLabel,
  openMoreId,
  onToggleMore,
  onCloseMore,
}: DealerCardProps) {
  const phoneHref = dealer.phone ? `tel:${dealer.phone.replace(/\s+/g, '')}` : undefined;
  const emailHref = `mailto:${dealer.email}`;
  const listingsHref = `/search?dealerId=${dealer.id}&listingType=SALE&customsCleared=true`;

  return (
    <article className={`${styles.card} ${view === 'list' ? styles.cardList : ''}`}>
      <div className={styles.cardTop}>
        <div className={styles.logoWrap}>
          {dealer.logo ? (
            <OptimizedImage className={styles.logo} src={dealer.logo} alt="" fill sizes="72px" draggable={false} />
          ) : (
            <div className={styles.logoFallback} aria-hidden="true">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <h2 className={styles.name}>{name}</h2>
      </div>

      <div className={styles.actions}>
        {phoneHref ? (
          <a href={phoneHref} className={styles.action}>
            <span className={`${styles.actionIcon} ${styles.actionPhone}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
              </svg>
            </span>
            <span className={styles.actionLabel}>{phoneLabel}</span>
          </a>
        ) : (
          <span className={`${styles.action} ${styles.actionDisabled}`}>
            <span className={`${styles.actionIcon} ${styles.actionPhone}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
              </svg>
            </span>
            <span className={styles.actionLabel}>{phoneLabel}</span>
          </span>
        )}

        <a href={emailHref} className={styles.action}>
          <span className={styles.actionIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M4 6h16v12H4V6zm0 0l8 7 8-7"
              />
            </svg>
          </span>
          <span className={styles.actionLabel}>{emailLabel}</span>
        </a>

        <div className={styles.moreWrap}>
          <button
            type="button"
            className={styles.action}
            aria-expanded={openMoreId === dealer.id}
            onClick={() => onToggleMore(dealer.id)}>
            <span className={styles.actionIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="5" cy="12" r="1.8" />
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="19" cy="12" r="1.8" />
              </svg>
            </span>
            <span className={styles.actionLabel}>{moreLabel}</span>
          </button>
          {openMoreId === dealer.id && (
            <div className={styles.moreMenu} role="menu">
              {dealer.website && (
                <a href={dealer.website} target="_blank" rel="noreferrer" role="menuitem">
                  {websiteLabel}
                </a>
              )}
              <Link href={listingsHref} role="menuitem" onClick={onCloseMore}>
                {viewListingsLabel}
              </Link>
              <a href={emailHref} role="menuitem">
                {dealer.email}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className={styles.meta}>
        <p className={styles.address}>{address}</p>
        {dealer.phone && <p className={styles.phone}>{dealer.phone}</p>}
      </div>

      <Link href={listingsHref} className={styles.listingsLink}>
        {listingsLabel}
      </Link>
    </article>
  );
}
