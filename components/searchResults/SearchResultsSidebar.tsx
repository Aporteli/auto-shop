'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchFilters } from '@/lib/useSearchFilters';
import type { ApiFiltersResponse } from './types';
import SidebarCategorySale from './SidebarCategorySale';
import SidebarFilterSelects from './SidebarFilterSelects';
import SidebarToggles from './SidebarToggles';
import styles from '../SearchResults.module.css';

type Props = { filterOptions: ApiFiltersResponse | null };

export default function SearchResultsSidebar({ filterOptions }: Props) {
  const { t } = useLanguage();
  const { filters } = useSearchFilters();
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const updateStickyTop = () => {
      if (window.matchMedia('(max-width: 1024px)').matches) {
        sidebar.style.removeProperty('top');
        return;
      }

      const headerOffset = 84;
      const bottomGap = 12;
      const nextTop = Math.min(headerOffset, window.innerHeight - sidebar.offsetHeight - bottomGap);
      sidebar.style.top = `${nextTop}px`;
    };

    updateStickyTop();

    const resizeObserver = new ResizeObserver(updateStickyTop);
    resizeObserver.observe(sidebar);
    window.addEventListener('resize', updateStickyTop);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateStickyTop);
    };
  }, [filterOptions, filters.categoryId]);

  return (
    <aside className={styles.sidebar} ref={sidebarRef}>
      <div className={styles.sidebarScroll}>
        <h2 className={styles.sidebarTitle}>{t.searchResults.filtersTitle}</h2>
        <SidebarCategorySale filterOptions={filterOptions} />
        <SidebarFilterSelects filterOptions={filterOptions} />
        <SidebarToggles />
      </div>
    </aside>
  );
}
