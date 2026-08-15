import type { AddListingFieldsProps } from './types';
import { label } from './label';
import styles from '../AddListingForm.module.css';

export default function AddListingTopBar({ al, language, form, update, filters }: AddListingFieldsProps) {
  return (
    <div className={styles.topBar}>
      <div className={styles.categoryTabs}>
        {filters.categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`${styles.categoryTab} ${form.categoryId === category.id ? styles.categoryTabActive : ''}`}
            onClick={() => update('categoryId', category.id)}>
            {label(category, language)}
          </button>
        ))}
      </div>
      <div className={styles.listingTypeRow}>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="listingType"
              checked={form.listingType === 'SALE'}
              onChange={() => update('listingType', 'SALE')}
            />
            {al.forSale}
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="listingType"
              checked={form.listingType === 'RENT'}
              onChange={() => update('listingType', 'RENT')}
            />
            {al.forRent}
          </label>
        </div>
        <button type="button" className={styles.loanBtn}>
          {al.getLoan}
        </button>
      </div>
    </div>
  );
}
