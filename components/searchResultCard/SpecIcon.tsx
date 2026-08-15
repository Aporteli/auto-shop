import type { FuelKind } from '@/lib/customsCalculator';
import styles from '../SearchResultCard.module.css';
import type { SearchResultListing } from './types';

export function resolveFuelKind(fuelType: SearchResultListing['fuelType']): FuelKind {
  const name = `${fuelType?.nameEn ?? ''} ${fuelType?.nameRu ?? ''}`.toLowerCase();
  if (name.includes('electric') || name.includes('электро')) return 'electric';
  if (name.includes('hybrid') || name.includes('гибрид')) return 'hybrid';
  return 'petrol';
}

export function SpecIcon({ type }: { type: 'engine' | 'transmission' | 'mileage' | 'steering' }) {
  if (type === 'engine') {
    return (
      <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeWidth="1.8" d="M8 10h8v4H8z" />
        <path strokeWidth="1.8" strokeLinecap="round" d="M10 10V7h4v3M12 14v3" />
      </svg>
    );
  }

  if (type === 'transmission') {
    return (
      <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="7" cy="7" r="2" strokeWidth="1.8" />
        <circle cx="17" cy="7" r="2" strokeWidth="1.8" />
        <circle cx="12" cy="17" r="2" strokeWidth="1.8" />
        <path strokeWidth="1.8" strokeLinecap="round" d="M9 7h6M12 9v6" />
      </svg>
    );
  }

  if (type === 'mileage') {
    return (
      <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="12" cy="12" r="8" strokeWidth="1.8" />
        <path strokeWidth="1.8" strokeLinecap="round" d="M12 8v4l2.5 2.5" />
      </svg>
    );
  }

  return (
    <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="8" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path strokeWidth="1.8" strokeLinecap="round" d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </svg>
  );
}
