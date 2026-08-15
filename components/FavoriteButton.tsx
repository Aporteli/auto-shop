'use client';

import { useFavorites } from '@/contexts/FavoritesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './FavoriteButton.module.css';

type FavoriteButtonProps = {
  listingId: number;
  className?: string;
};

export default function FavoriteButton({ listingId, className }: FavoriteButtonProps) {
  const { t } = useLanguage();
  const { isFavorite, isPending, toggleFavorite } = useFavorites();
  const saved = isFavorite(listingId);

  return (
    <button
      type="button"
      className={`${styles.button}${saved ? ` ${styles.active}` : ''}${className ? ` ${className}` : ''}`}
      aria-pressed={saved}
      aria-label={saved ? t.searchResults.removeFavorite : t.searchResults.addFavorite}
      disabled={isPending(listingId)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggleFavorite(listingId);
      }}
      onPointerDown={(event) => event.stopPropagation()}>
      <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 20.25s-6.75-4.35-9-8.55C1.35 8.55 3.6 4.5 8.1 4.5c1.95 0 3.15.9 3.9 2.1.75-1.2 1.95-2.1 3.9-2.1 4.5 0 6.75 4.05 5.1 7.2-2.25 4.2-9 8.55-9 8.55z"
        />
      </svg>
    </button>
  );
}
