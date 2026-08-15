'use client';

import { formatListingTitle } from '@/lib/listingCardFormat';
import CarImage from '@/components/CarImage';
import styles from '../HeaderSearch.module.css';
import type { SearchHit } from './types';

type HeaderSearchPanelProps = {
  listId: string;
  language: 'en' | 'ru' | string;
  isLoading: boolean;
  results: SearchHit[];
  activeIndex: number;
  searchingLabel: string;
  noResultsLabel: string;
  viewAllLabel: string;
  onHover: (index: number) => void;
  onSelect: (id: number) => void;
  onViewAll: () => void;
  labelCity: (item: SearchHit) => string;
  formatPrice: (item: SearchHit) => string;
};

export default function HeaderSearchPanel({
  listId,
  language,
  isLoading,
  results,
  activeIndex,
  searchingLabel,
  noResultsLabel,
  viewAllLabel,
  onHover,
  onSelect,
  onViewAll,
  labelCity,
  formatPrice,
}: HeaderSearchPanelProps) {
  return (
    <div className={styles.panel} id={listId} role="listbox">
      {isLoading ? (
        <div className={styles.status}>{searchingLabel}</div>
      ) : results.length === 0 ? (
        <div className={styles.status}>{noResultsLabel}</div>
      ) : (
        <>
          {results.map((item, index) => {
            const title = formatListingTitle(item, language);
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`${styles.result} ${index === activeIndex ? styles.resultActive : ''}`}
                onMouseEnter={() => onHover(index)}
                onClick={() => onSelect(item.id)}>
                <CarImage
                  className={styles.resultImage}
                  src={item.images[0]?.url}
                  make={item.model.manufacturer.nameEn}
                  model={item.model.nameEn}
                  alt=""
                  draggable={false}
                />
                <span className={styles.resultBody}>
                  <span className={styles.resultTitle}>
                    {title} <span className={styles.resultYear}>{item.year}</span>
                  </span>
                  <span className={styles.resultMeta}>
                    {labelCity(item)} · {formatPrice(item)}
                  </span>
                </span>
              </button>
            );
          })}
          <button type="button" className={styles.viewAll} onClick={onViewAll}>
            {viewAllLabel}
          </button>
        </>
      )}
    </div>
  );
}
