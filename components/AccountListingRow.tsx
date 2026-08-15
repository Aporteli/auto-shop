'use client';

import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import CarImage from '@/components/CarImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import styles from './AccountPage.module.css';

export type AccountListingItem = {
  id: number;
  year: number;
  price: string;
  currency: string;
  status?: string;
  titleEn?: string | null;
  titleRu?: string | null;
  imageUrl: string | null;
  manufacturerEn: string;
  manufacturerRu: string;
  modelEn: string;
  modelRu: string;
};

export default function AccountListingRow({
  listing,
  showFavorite = false,
}: {
  listing: AccountListingItem;
  showFavorite?: boolean;
}) {
  const { language, t } = useLanguage();
  const { formatAmount } = useCurrency();
  const title =
    (language === 'ru' ? listing.titleRu : listing.titleEn)?.trim() ||
    `${language === 'ru' ? listing.manufacturerRu : listing.manufacturerEn} ${
      language === 'ru' ? listing.modelRu : listing.modelEn
    }`;
  const price = formatAmount(listing.price, listing.currency);

  return (
    <div className={styles.row}>
      <Link href={`/listings/${listing.id}`} className={styles.rowMain}>
        <CarImage
          className={styles.thumb}
          src={listing.imageUrl}
          make={listing.manufacturerEn}
          model={listing.modelEn}
          alt=""
          sizes="88px"
        />
        <div className={styles.meta}>
          <p className={styles.rowTitle}>{title}</p>
          <p className={styles.rowDetail}>
            {listing.year}
            {listing.status ? ` · ${listing.status}` : ''}
          </p>
        </div>
        <span className={styles.price}>{price}</span>
        {showFavorite ? null : <span className={styles.rowDetail}>{t.accountPages.openListing}</span>}
      </Link>
      {showFavorite ? <FavoriteButton listingId={listing.id} className={styles.rowFavorite} /> : null}
    </div>
  );
}
