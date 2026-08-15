import type { AddListingFieldsProps, FilterOption } from './types';
import { label } from './label';
import SectionCard from './SectionCard';
import styles from '../AddListingForm.module.css';

export default function LocationSection({
  al,
  language,
  form,
  update,
  cities,
  progress,
  isOpen,
  onToggle,
  sectionRef,
}: Omit<AddListingFieldsProps, 'filters'> & {
  cities: FilterOption[];
  progress: number;
  isOpen: boolean;
  onToggle: () => void;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <SectionCard
      id="section-location"
      title={al.steps.location}
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      }
      progress={progress}
      total={1}
      isOpen={isOpen}
      onToggle={onToggle}>
      <div ref={sectionRef as React.RefObject<HTMLDivElement>}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>
              {al.fields.location} <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.select}
              value={form.cityId}
              onChange={(e) => update('cityId', e.target.value ? Number(e.target.value) : '')}>
              <option value="">{al.select}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {label(city, language)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <div className={styles.toggleRow}>
              <span>{al.fields.customsCleared}</span>
              <button
                type="button"
                className={`${styles.toggle} ${form.customsCleared ? styles.toggleOn : ''}`}
                onClick={() => update('customsCleared', !form.customsCleared)}>
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.toggleRow}>
              <span>{al.fields.techInspection}</span>
              <button
                type="button"
                className={`${styles.toggle} ${form.techInspection ? styles.toggleOn : ''}`}
                onClick={() => update('techInspection', !form.techInspection)}>
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>
          <div className={styles.fieldFull}>
            <div className={styles.toggleRow}>
              <span>{al.fields.checkInspectionTime}</span>
              <button
                type="button"
                className={`${styles.toggle} ${form.checkInspectionTime ? styles.toggleOn : ''}`}
                onClick={() => update('checkInspectionTime', !form.checkInspectionTime)}>
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
