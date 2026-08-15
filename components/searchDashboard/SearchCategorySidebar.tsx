'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from '../SearchDashboard.module.css';

function categoryIconForSlug(slug: string) {
  if (slug === 'cars') {
    return (
      <svg className={styles.categoryIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 17h8M5 11l1.5-4h11L19 11M5 11v6h14v-6M7 17a1 1 0 102 0 1 1 0 00-2 0zm10 0a1 1 0 102 0 1 1 0 00-2 0z"
        />
      </svg>
    );
  }

  if (slug === 'custom-vehicles') {
    return (
      <svg className={styles.categoryIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 13h2l1-3h12l1 3h2M4 13v4h16v-4M6 17a1 1 0 102 0 1 1 0 00-2 0zm12 0a1 1 0 102 0 1 1 0 00-2 0z"
        />
      </svg>
    );
  }

  return (
    <svg className={styles.categoryIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="6" cy="17" r="2" strokeWidth={1.5} />
      <circle cx="18" cy="17" r="2" strokeWidth={1.5} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6 17h3l2-5 3 2 2-4h2M14 14l-2 3"
      />
    </svg>
  );
}

type SearchCategorySidebarProps = {
  categories: Array<{ id: number; nameEn: string; nameRu: string; slug: string }> | undefined;
  selectedCategoryId: number | null;
  isLoading: boolean;
  onSelect: (categoryId: number) => void;
};

export default function SearchCategorySidebar({
  categories,
  selectedCategoryId,
  isLoading,
  onSelect,
}: SearchCategorySidebarProps) {
  const { t, language } = useLanguage();

  return (
    <aside className={styles.sidebar}>
      {categories?.map((c) => (
        <button
          key={c.id}
          type="button"
          disabled={isLoading}
          className={`${styles.categoryButton} ${selectedCategoryId === c.id ? styles.categoryButtonActive : ''}`}
          onClick={() => onSelect(c.id)}>
          {categoryIconForSlug(c.slug)}
          {language === 'ru' ? c.nameRu : c.nameEn}
        </button>
      )) ?? (
        <>
          <button className={`${styles.categoryButton} ${styles.categoryButtonActive}`} type="button" disabled>
            {categoryIconForSlug('cars')}
            {t.searchDashboard.categories.cars}
          </button>
          <button className={styles.categoryButton} type="button" disabled>
            {categoryIconForSlug('custom-vehicles')}
            {t.searchDashboard.categories.customVehicles}
          </button>
          <button className={styles.categoryButton} type="button" disabled>
            {categoryIconForSlug('motorcycles')}
            {t.searchDashboard.categories.motorcycles}
          </button>
        </>
      )}
    </aside>
  );
}
