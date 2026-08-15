'use client';

import OptimizedImage from '@/components/OptimizedImage';
import styles from '../CataloguePage.module.css';
import { brandAccent, brandInitial, INITIAL_BRAND_ROWS, type Brand } from './types';

type CatalogueBrandsSectionProps = {
  language: string;
  brands: Brand[];
  visiblePopular: Brand[];
  letters: string[];
  visibleGroupedBrands: Array<[string, Brand[]]>;
  showAllPopular: boolean;
  showAllBrands: boolean;
  activeLetter: string;
  setShowAllPopular: (value: boolean | ((prev: boolean) => boolean)) => void;
  setShowAllBrands: (value: boolean | ((prev: boolean) => boolean)) => void;
  setActiveLetter: (letter: string) => void;
  openBrand: (brand: Brand) => void;
  c: {
    popularBrands: string;
    seeLess: string;
    seeAll: string;
    jumpToLetter: string;
    all: string;
  };
};

export default function CatalogueBrandsSection({
  language,
  brands,
  visiblePopular,
  letters,
  visibleGroupedBrands,
  showAllPopular,
  showAllBrands,
  activeLetter,
  setShowAllPopular,
  setShowAllBrands,
  setActiveLetter,
  openBrand,
  c,
}: CatalogueBrandsSectionProps) {
  return (
    <section className={styles.brandsCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{c.popularBrands}</h2>
        <button type="button" className={styles.seeAllLink} onClick={() => setShowAllPopular((prev) => !prev)}>
          {showAllPopular ? c.seeLess : c.seeAll}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAllPopular ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
          </svg>
        </button>
      </div>

      <div className={styles.logoRow}>
        {visiblePopular.map((brand) => {
          const name = language === 'ru' ? brand.nameRu : brand.nameEn;
          return (
            <button key={brand.id} type="button" className={styles.logoCard} onClick={() => openBrand(brand)}>
              {brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <OptimizedImage src={brand.logo} alt={name} width={54} height={54} sizes="54px" fit="contain" />
              ) : (
                <span className={styles.monogram} style={{ background: `hsl(${brandAccent(brand.nameEn)} 72% 46%)` }}>
                  {brandInitial(brand.nameEn)}
                </span>
              )}
              <span className={styles.logoName}>{name}</span>
              <span className={styles.logoCount}>{brand.listingsCount}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.letterBar} aria-label={c.jumpToLetter}>
        {letters.map((letter) => (
          <button
            key={letter}
            type="button"
            className={`${styles.letter} ${activeLetter === letter ? styles.letterActive : ''}`}
            onClick={() => {
              setActiveLetter(letter);
              setShowAllBrands(letter !== 'ALL');
            }}>
            {letter === 'ALL' ? c.all : letter}
          </button>
        ))}
      </div>

      <div className={styles.brandDirectory}>
        {visibleGroupedBrands.map(([letter, list]) => (
          <div key={letter} className={styles.letterGroup}>
            <h3 className={styles.letterHeading}>{letter}</h3>
            <div className={styles.brandColumns}>
              {list.map((brand) => (
                <button key={brand.id} type="button" className={styles.brandLink} onClick={() => openBrand(brand)}>
                  <span>{language === 'ru' ? brand.nameRu : brand.nameEn}</span>
                  <span className={styles.brandCount}>({brand.listingsCount})</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {activeLetter === 'ALL' && brands.length > INITIAL_BRAND_ROWS ? (
        <div className={styles.footerAction}>
          <button type="button" className={styles.seeAllButton} onClick={() => setShowAllBrands((prev) => !prev)}>
            {showAllBrands ? c.seeLess : c.seeAll}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAllBrands ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
            </svg>
          </button>
        </div>
      ) : null}
    </section>
  );
}
