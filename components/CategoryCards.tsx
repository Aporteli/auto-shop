'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  buildCategorySearchHref,
  CATEGORY_CARDS,
  labelForCategoryBodyType,
  splitCategoryCardColumns,
} from '@/lib/categoryCardLinks';
import styles from './CategoryCards.module.css';

type FilterOption = { id: number; nameEn: string; nameRu: string; slug?: string };

type ApiFiltersResponse = {
  categories: Array<{ id: number; nameEn: string; nameRu: string; slug: string }>;
  bodyTypes: FilterOption[];
};

export default function CategoryCards() {
  const { t, language } = useLanguage();
  const [filterOptions, setFilterOptions] = useState<ApiFiltersResponse | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch('/api/filters')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ApiFiltersResponse | null) => {
        if (mounted && data) setFilterOptions(data);
      })
      .catch(() => {
        if (mounted) setFilterOptions(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(
    () =>
      CATEGORY_CARDS.map((card) => {
        const copy = t.categoryCards[card.localeKey];
        const [column1, column2] = splitCategoryCardColumns(card.bodyTypeKeys);

        const hrefFor = (bodyTypeKey?: string) => {
          if (!filterOptions) return '/search';
          return buildCategorySearchHref(
            card.slug,
            filterOptions.categories,
            filterOptions.bodyTypes,
            bodyTypeKey,
          );
        };

        const labelFor = (bodyTypeKey: string) => {
          if (!filterOptions) return bodyTypeKey;
          return labelForCategoryBodyType(card.slug, filterOptions.bodyTypes, bodyTypeKey, language);
        };

        return {
          ...card,
          title: copy.title,
          imageAlt: copy.imageAlt,
          seeAllHref: hrefFor(),
          column1: column1.map((key) => ({ key, label: labelFor(key), href: hrefFor(key) })),
          column2: column2.map((key) => ({ key, label: labelFor(key), href: hrefFor(key) })),
        };
      }),
    [filterOptions, language, t.categoryCards],
  );

  return (
    <section className={styles.section}>
      {cards.map((card) => (
        <article key={card.slug} className={styles.card}>
          <div className={styles.content}>
            <h2 className={styles.title}>{card.title}</h2>
            <div className={styles.lists}>
              <div className={styles.listColumn}>
                {card.column1.map((item) => (
                  <Link key={item.key} href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className={styles.listColumn}>
                {card.column2.map((item) => (
                  <Link key={item.key} href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link href={card.seeAllHref} className={styles.seeAll}>
              {t.categoryCards.seeAll}
            </Link>
          </div>
          <Link href={card.seeAllHref} className={styles.imageWrap} aria-label={card.title}>
            <img
              className={styles.image}
              src={`https://picsum.photos/seed/${card.imageSeed}/480/400`}
              alt={card.imageAlt}
              draggable={false}
            />
          </Link>
        </article>
      ))}
    </section>
  );
}
