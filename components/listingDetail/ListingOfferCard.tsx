import FavoriteButton from '@/components/FavoriteButton';
import { labelFor } from '@/lib/listingDetail';
import type { Listing, SpecItem } from './types';
import styles from '../ListingDetail.module.css';

type ListingOfferCardProps = {
  listing: Listing;
  language: string;
  d: {
    listingId: string;
    views: string;
    dealer: string;
    seller: string;
    call: string;
  };
  priceLabel: string;
  highlights: SpecItem[];
  sellerName: string | null;
  sellerPhone: string | null;
  location: string;
};

export default function ListingOfferCard({
  listing,
  language,
  d,
  priceLabel,
  highlights,
  sellerName,
  sellerPhone,
  location,
}: ListingOfferCardProps) {
  return (
    <aside className={styles.offer}>
      <div className={styles.priceRow}>
        <p className={styles.price}>{priceLabel}</p>
        <FavoriteButton listingId={listing.id} className={styles.saveButton} />
      </div>
      <div className={styles.meta}>
        <span>{d.listingId.replace('{{id}}', String(listing.id))}</span>
        <span>
          {listing.views} {d.views}
        </span>
      </div>
      {listing.stickers.length > 0 && (
        <div className={styles.stickers}>
          {listing.stickers.map(({ sticker }) => (
            <span key={sticker.nameEn} className={styles.sticker} style={{ backgroundColor: sticker.color ?? '#64748b' }}>
              {labelFor(language, sticker)}
            </span>
          ))}
        </div>
      )}
      <div className={styles.facts}>
        {highlights.slice(0, 4).map((item) => (
          <div key={item.label} className={styles.fact}>
            <span className={styles.factLabel}>{item.label}</span>
            <span className={styles.factValue}>{item.value}</span>
          </div>
        ))}
      </div>
      <div className={styles.seller}>
        <p className={styles.sellerLabel}>{listing.user?.dealership ? d.dealer : d.seller}</p>
        <p className={styles.sellerName}>{sellerName || 'AutoShop'}</p>
        <p className={styles.sellerPlace}>{location}</p>
        {sellerPhone ? (
          <a href={`tel:${sellerPhone}`} className={styles.call}>
            {d.call}
          </a>
        ) : null}
      </div>
    </aside>
  );
}
