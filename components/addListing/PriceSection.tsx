import type { AddListingCopy, FormUpdate } from './types';
import type { AddListingFormState } from '@/lib/addListing';
import SectionCard from './SectionCard';
import styles from '../AddListingForm.module.css';

export default function PriceSection({
  al,
  form,
  update,
  progress,
  isOpen,
  onToggle,
  sectionRef,
}: {
  al: AddListingCopy;
  form: AddListingFormState;
  update: FormUpdate;
  progress: number;
  isOpen: boolean;
  onToggle: () => void;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <SectionCard
      id="section-price"
      title={al.steps.price}
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
      progress={progress}
      total={1}
      isOpen={isOpen}
      onToggle={onToggle}>
      <div ref={sectionRef as React.RefObject<HTMLDivElement>}>
        <p className={styles.priceNote}>{al.priceNote}</p>
        <div className={styles.field}>
          <label className={styles.label}>
            {al.fields.enterPrice} <span className={styles.required}>*</span>
          </label>
          <div className={styles.priceInputWrap}>
            <input
              className={styles.input}
              value={form.price}
              onChange={(e) => update('price', e.target.value.replace(/[^\d.]/g, ''))}
            />
            <button
              type="button"
              className={styles.currencyBtn}
              onClick={() => {
                const next = form.currency === 'USD' ? 'EUR' : form.currency === 'EUR' ? 'GEL' : 'USD';
                update('currency', next);
              }}>
              {form.currency === 'GEL' ? '₾' : form.currency === 'EUR' ? '€' : '$'}
            </button>
          </div>
        </div>
        <div className={styles.toggleRow}>
          <span>{al.fields.priceNegotiable}</span>
          <button
            type="button"
            className={`${styles.toggle} ${form.priceNegotiable ? styles.toggleOn : ''}`}
            onClick={() => update('priceNegotiable', !form.priceNegotiable)}>
            <span className={styles.toggleThumb} />
          </button>
        </div>
        <div className={styles.toggleRow}>
          <span>{al.fields.exchange}</span>
          <button
            type="button"
            className={`${styles.toggle} ${form.exchange ? styles.toggleOn : ''}`}
            onClick={() => update('exchange', !form.exchange)}>
            <span className={styles.toggleThumb} />
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
