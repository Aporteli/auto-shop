'use client';

import type { MutableRefObject, Ref } from 'react';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import CarImage from '@/components/CarImage';
import styles from '../CarSlider.module.css';
import type { CarSliderItem } from './types';

type CarSliderCardProps = {
  item: CarSliderItem;
  cardRef?: Ref<HTMLDivElement>;
  cardWidth: number;
  didDragRef: MutableRefObject<boolean>;
};

export default function CarSliderCard({ item, cardRef, cardWidth, didDragRef }: CarSliderCardProps) {
  const listingId = Number(item.id);
  const cardContent = (
    <>
      <div className={styles.imageWrap}>
        <CarImage
          className={styles.image}
          src={item.imageUrl}
          make={item.make}
          model={item.modelName}
          alt={item.model}
          draggable={false}
          sizes="280px"
        />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.titleRow}>
          <div className={styles.city}>{item.location}</div>
        </div>

        <div className={styles.model}>{item.model}</div>
        <div className={styles.price}>{item.price}</div>

        {(item.tag1 || item.tag2) && (
          <div className={styles.tags}>
            {item.tag1 && <span className={styles.tag}>{item.tag1}</span>}
            {item.tag2 && <span className={styles.tag}>{item.tag2}</span>}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      ref={cardRef}
      className={styles.card}
      style={{ '--card-width': `${cardWidth}px` } as React.CSSProperties}>
      {item.href ? (
        <Link
          href={item.href}
          className={styles.cardLink}
          draggable={false}
          onClick={(event) => {
            if (didDragRef.current) {
              event.preventDefault();
              didDragRef.current = false;
            }
          }}>
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
      {Number.isInteger(listingId) && listingId > 0 ? (
        <FavoriteButton listingId={listingId} className={styles.heartButton} />
      ) : null}
    </div>
  );
}
