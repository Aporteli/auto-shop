import type { AddListingFieldsProps } from './types';
import type { FilterOption } from './types';
import { YEARS, MONTHS } from './constants';
import { label } from './label';
import styles from '../AddListingForm.module.css';

export default function PrimaryIdentityFields({
  al,
  language,
  form,
  update,
  filters,
  modelsForManufacturer,
}: AddListingFieldsProps & { modelsForManufacturer: FilterOption[] }) {
  return (
    <>
      <div className={styles.field}>
        <label className={styles.label}>
          {al.fields.manufacturer} <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={form.manufacturerId}
          onChange={(e) => {
            update('manufacturerId', e.target.value ? Number(e.target.value) : '');
            update('modelId', '');
          }}>
          <option value="">{al.select}</option>
          {filters.manufacturers.map((m) => (
            <option key={m.id} value={m.id}>
              {label(m, language)}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          {al.fields.model} <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={form.modelId}
          onChange={(e) => update('modelId', e.target.value ? Number(e.target.value) : '')}
          disabled={!form.manufacturerId}>
          <option value="">{al.select}</option>
          {modelsForManufacturer.map((m) => (
            <option key={m.id} value={m.id}>
              {label(m, language)}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          {al.fields.year} <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={form.year}
          onChange={(e) => update('year', e.target.value ? Number(e.target.value) : '')}>
          <option value="">{al.select}</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>{al.fields.month}</label>
        <select
          className={styles.select}
          value={form.month}
          onChange={(e) => update('month', e.target.value ? Number(e.target.value) : '')}>
          <option value="">{al.select}</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>{al.fields.trim}</label>
        <input className={styles.input} value={form.trim} onChange={(e) => update('trim', e.target.value)} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          {al.fields.fuelType} <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={form.fuelTypeId}
          onChange={(e) => update('fuelTypeId', e.target.value ? Number(e.target.value) : '')}>
          <option value="">{al.select}</option>
          {filters.fuelTypes.map((f) => (
            <option key={f.id} value={f.id}>
              {label(f, language)}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          {al.fields.category} <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={form.bodyTypeId}
          onChange={(e) => update('bodyTypeId', e.target.value ? Number(e.target.value) : '')}>
          <option value="">{al.select}</option>
          {filters.bodyTypes.map((b) => (
            <option key={b.id} value={b.id}>
              {label(b, language)}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
