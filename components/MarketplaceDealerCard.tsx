import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import type { MarketplaceDealerItem } from './MarketplaceOverview';
import styles from './MarketplaceOverview.module.css';

const ACCENTS = ['dark', 'red', 'purple', 'orange', 'blue'] as const;

function DealerBadge({
  name,
  accent,
  logo,
}: {
  name: string;
  accent: (typeof ACCENTS)[number];
  logo: string | null;
}) {
  const badgeClass = {
    dark: styles.badgeDark,
    red: styles.badgeRed,
    purple: styles.badgePurple,
    orange: styles.badgeOrange,
    blue: styles.badgeBlue,
  }[accent];

  if (logo) {
    return (
      <span className={`${styles.dealerBadge} ${styles.dealerBadgeImage}`}>
        <OptimizedImage src={logo} alt="" fill sizes="32px" draggable={false} />
      </span>
    );
  }

  const shortName = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return <span className={`${styles.dealerBadge} ${badgeClass}`}>{shortName}</span>;
}

export default function MarketplaceDealerCard({
  title,
  allHref,
  allLabel,
  emptyLabel,
  listingLabel,
  dealers,
  language,
}: {
  title: string;
  allHref: string;
  allLabel: string;
  emptyLabel: string;
  listingLabel: string;
  dealers: MarketplaceDealerItem[];
  language: string;
}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <Link href={allHref} className={styles.viewAll}>
          {allLabel}
        </Link>
      </div>

      <div className={styles.dealerList}>
        {dealers.length === 0 ? (
          <p className={styles.empty}>{emptyLabel}</p>
        ) : (
          dealers.map((dealer, index) => {
            const name =
              language === 'ru' && dealer.companyNameRu ? dealer.companyNameRu : dealer.companyName;
            return (
              <Link
                key={dealer.id}
                href={`/search?dealerId=${dealer.id}&listingType=SALE&customsCleared=true`}
                className={styles.dealerRow}>
                <div className={styles.dealerInfo}>
                  <DealerBadge name={name} accent={ACCENTS[index % ACCENTS.length]} logo={dealer.logo} />
                  <span className={styles.dealerName}>{name}</span>
                </div>
                <span className={styles.dealerCount}>
                  {dealer.listingsCount.toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')} {listingLabel}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </article>
  );
}
