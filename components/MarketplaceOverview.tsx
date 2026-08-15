'use client';

import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import CarImage from '@/components/CarImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatListingTitle } from '@/lib/listingCardFormat';
import { labelFor } from '@/lib/listingDetail';
import type { ListingForSlider } from '@/lib/listingSlider';
import MarketplaceDealerCard from './MarketplaceDealerCard';
import styles from './MarketplaceOverview.module.css';

export type MarketplaceDealerItem = {
  id: number;
  companyName: string;
  companyNameRu: string | null;
  logo: string | null;
  listingsCount: number;
};

type MarketplaceOverviewProps = {
  recentListings: ListingForSlider[];
  internationalDealers: MarketplaceDealerItem[];
  localDealers: MarketplaceDealerItem[];
};

export default function MarketplaceOverview({
  recentListings,
  internationalDealers,
  localDealers,
}: MarketplaceOverviewProps) {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();

  const dealersHref = '/dealers';
  const recentAllHref = '/search?listingType=SALE&customsCleared=true';
  const internationalAllHref = `${dealersHref}?type=INTERNATIONAL`;
  const localAllHref = `${dealersHref}?type=LOCAL`;

  return (
    <section className={styles.section}>
      <article className={`${styles.card} ${styles.recentCard}`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{t.marketplaceOverview.recent.title}</h2>
          <Link href={recentAllHref} className={styles.viewAll}>
            {t.marketplaceOverview.all}
          </Link>
        </div>

        <div className={styles.recentList}>
          {recentListings.length === 0 ? (
            <p className={styles.empty}>{t.marketplaceOverview.recent.empty}</p>
          ) : (
            recentListings.map((listing) => {
              const title = `${listing.year} - ${formatListingTitle(listing, language)}`;
              const location = listing.city
                ? labelFor(language, listing.city)
                : t.searchResults.unknownLocation;
              const price = formatPrice(listing.price, listing.currency, listing.priceNegotiable);
              const tag1 = listing.bodyType ? labelFor(language, listing.bodyType) : null;
              const tag2 = listing.fuelType ? labelFor(language, listing.fuelType) : null;
              const href = `/listings/${listing.id}`;

              return (
                <div key={listing.id} className={styles.recentItem}>
                  <Link href={href} className={styles.recentImageLink}>
                    <CarImage
                      className={styles.recentImage}
                      src={listing.images[0]?.url}
                      make={listing.model.manufacturer.nameEn}
                      model={listing.model.nameEn}
                      alt={title}
                      draggable={false}
                      sizes="96px"
                    />
                  </Link>

                  <div className={styles.recentContent}>
                    <span className={styles.recentLocation}>{location}</span>
                    <div className={styles.recentMainRow}>
                      <Link href={href} className={styles.recentTitle}>
                        {title}
                      </Link>
                      <span className={styles.recentPrice}>{price}</span>
                    </div>
                    {(tag1 || tag2) && (
                      <div className={styles.tags}>
                        {tag1 && <span className={styles.tag}>{tag1}</span>}
                        {tag2 && <span className={styles.tag}>{tag2}</span>}
                      </div>
                    )}
                  </div>

                  <FavoriteButton listingId={listing.id} className={styles.favoriteButton} />
                </div>
              );
            })
          )}
        </div>
      </article>

      <div className={styles.dealersColumn}>
        <MarketplaceDealerCard
          title={t.marketplaceOverview.internationalDealers.title}
          allHref={internationalAllHref}
          allLabel={t.marketplaceOverview.all}
          emptyLabel={t.marketplaceOverview.dealersEmpty}
          listingLabel={t.marketplaceOverview.listing}
          dealers={internationalDealers}
          language={language}
        />
        <MarketplaceDealerCard
          title={t.marketplaceOverview.localDealers.title}
          allHref={localAllHref}
          allLabel={t.marketplaceOverview.all}
          emptyLabel={t.marketplaceOverview.dealersEmpty}
          listingLabel={t.marketplaceOverview.listing}
          dealers={localDealers}
          language={language}
        />
      </div>
    </section>
  );
}
