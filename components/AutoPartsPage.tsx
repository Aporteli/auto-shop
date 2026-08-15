'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  autoPartCategory,
  autoPartName,
  autoPartSearchText,
  type AutoPartRecord,
  type AutoPartSort,
} from '@/lib/autoParts';
import AutoPartsList from './AutoPartsList';
import styles from './AutoPartsPage.module.css';

type AutoPartsPageProps = {
  parts: AutoPartRecord[];
};

export default function AutoPartsPage({ parts }: AutoPartsPageProps) {
  const { t, language } = useLanguage();
  const copy = t.autoParts;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<AutoPartSort>('category');

  const categories = useMemo(() => {
    const counts = new Map<string, { slug: string; name: string; count: number }>();
    for (const part of parts) {
      const existing = counts.get(part.categorySlug);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(part.categorySlug, {
          slug: part.categorySlug,
          name: autoPartCategory(part, language),
          count: 1,
        });
      }
    }
    return [...counts.values()].sort((a, b) => a.name.localeCompare(b.name, language, { sensitivity: 'base' }));
  }, [language, parts]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = parts.filter((part) => {
      if (category !== 'all' && part.categorySlug !== category) return false;
      if (needle && !autoPartSearchText(part).includes(needle)) return false;
      return true;
    });

    next.sort((a, b) => {
      const nameA = autoPartName(a, language);
      const nameB = autoPartName(b, language);
      const categoryA = autoPartCategory(a, language);
      const categoryB = autoPartCategory(b, language);

      if (sort === 'category') {
        const byCategory = categoryA.localeCompare(categoryB, language, { sensitivity: 'base' });
        if (byCategory !== 0) return byCategory;
        return nameA.localeCompare(nameB, language, { sensitivity: 'base' });
      }

      const byName = nameA.localeCompare(nameB, language, { sensitivity: 'base' });
      return sort === 'name-desc' ? -byName : byName;
    });

    return next;
  }, [category, language, parts, query, sort]);

  const grouped = useMemo(() => {
    if (category !== 'all' || sort !== 'category') return null;
    const groups: Array<{ slug: string; name: string; items: AutoPartRecord[] }> = [];
    for (const part of filtered) {
      const last = groups[groups.length - 1];
      if (last && last.slug === part.categorySlug) {
        last.items.push(part);
      } else {
        groups.push({
          slug: part.categorySlug,
          name: autoPartCategory(part, language),
          items: [part],
        });
      }
    }
    return groups;
  }, [category, filtered, language, sort]);

  const countLabel = copy.results.replace('{{count}}', String(filtered.length));
  const showCategoryOnRow = category === 'all' && sort !== 'category';

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <p className={styles.sideTitle}>{copy.category}</p>
          <nav className={styles.sideNav} aria-label={copy.category}>
            <button
              type="button"
              className={`${styles.sideLink} ${category === 'all' ? styles.sideLinkActive : ''}`}
              onClick={() => setCategory('all')}>
              <span>{copy.all}</span>
              <span>{parts.length}</span>
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                type="button"
                className={`${styles.sideLink} ${category === item.slug ? styles.sideLinkActive : ''}`}
                onClick={() => setCategory(item.slug)}>
                <span>{item.name}</span>
                <span>{item.count}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className={styles.main}>
          <div className={styles.controls}>
            <label className={styles.searchField}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className={styles.searchInput}
              />
            </label>
            <label className={styles.sortField}>
              <span>{copy.sort}</span>
              <select
                className={styles.sortSelect}
                value={sort}
                onChange={(event) => setSort(event.target.value as AutoPartSort)}>
                <option value="category">{copy.sortCategory}</option>
                <option value="name-asc">{copy.sortNameAsc}</option>
                <option value="name-desc">{copy.sortNameDesc}</option>
              </select>
            </label>
          </div>

          <p className={styles.count}>{countLabel}</p>

          {filtered.length === 0 ? (
            <p className={styles.empty}>{copy.empty}</p>
          ) : grouped ? (
            <div className={styles.groups}>
              {grouped.map((group) => (
                <section key={group.slug}>
                  <h2 className={styles.groupTitle}>{group.name}</h2>
                  <AutoPartsList parts={group.items} language={language} showCategory={false} />
                </section>
              ))}
            </div>
          ) : (
            <AutoPartsList parts={filtered} language={language} showCategory={showCategoryOnRow} />
          )}
        </div>
      </div>
    </div>
  );
}
