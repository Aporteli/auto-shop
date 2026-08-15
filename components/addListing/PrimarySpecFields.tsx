import type { AddListingFieldsProps } from './types';
import { CYLINDER_OPTIONS, ENGINE_VOLUMES } from './constants';
import { label } from './label';
import styles from '../AddListingForm.module.css';

export default function PrimarySpecFields({ al, language, form, update, filters }: AddListingFieldsProps) {
  return (
    <>
      <div className={styles.field}>
        <label className={styles.label}>
          {al.fields.cylinders} <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={form.cylinders}
          onChange={(e) => update('cylinders', e.target.value ? Number(e.target.value) : '')}>
          <option value="">{al.select}</option>
          {CYLINDER_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          {al.fields.engineVolume} <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={form.engineVolume}
          onChange={(e) => update('engineVolume', e.target.value)}>
          <option value="">{al.select}</option>
          {ENGINE_VOLUMES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>{al.fields.turbo}</label>
        <div className={styles.toggleRow}>
          <span />
          <button
            type="button"
            className={`${styles.toggle} ${form.isTurbo ? styles.toggleOn : ''}`}
            onClick={() => update('isTurbo', !form.isTurbo)}>
            <span className={styles.toggleThumb} />
          </button>
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          {al.fields.mileage} <span className={styles.required}>*</span>
        </label>
        <div className={styles.priceInputWrap}>
          <input
            className={styles.input}
            placeholder={al.fields.mileage}
            value={form.mileage}
            onChange={(e) => update('mileage', e.target.value.replace(/\D/g, ''))}
          />
          <select
            className={styles.select}
            style={{ width: 100 }}
            value={form.mileageUnit}
            onChange={(e) => update('mileageUnit', e.target.value as 'KM' | 'MI')}>
            <option value="KM">Km</option>
            <option value="MI">Mi</option>
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          {al.fields.wheel} <span className={styles.required}>*</span>
        </label>
        <div className={styles.segmentGroup}>
          {(['LEFT', 'RIGHT'] as const).map((side) => (
            <button
              key={side}
              type="button"
              className={`${styles.segmentBtn} ${form.steeringWheel === side ? styles.segmentBtnActive : ''}`}
              onClick={() => update('steeringWheel', side)}>
              {side === 'LEFT' ? al.left : al.right}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          {al.fields.transmission} <span className={styles.required}>*</span>
        </label>
        <div className={styles.segmentGroup}>
          {filters.transmissions.slice(0, 4).map((tr) => (
            <button
              key={tr.id}
              type="button"
              className={`${styles.segmentBtn} ${form.transmissionId === tr.id ? styles.segmentBtnActive : ''}`}
              onClick={() => update('transmissionId', tr.id)}>
              {label(tr, language)}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.fieldFull}>
        <label className={styles.label}>
          {al.fields.driveWheels} <span className={styles.required}>*</span>
        </label>
        <div className={styles.segmentGroup}>
          {filters.driveTypes.slice(0, 4).map((dt) => (
            <button
              key={dt.id}
              type="button"
              className={`${styles.segmentBtn} ${form.driveTypeId === dt.id ? styles.segmentBtnActive : ''}`}
              onClick={() => update('driveTypeId', dt.id)}>
              {label(dt, language)}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.fieldFull}>
        <label className={styles.label}>
          {al.fields.airbags} <span className={styles.required}>*</span>
        </label>
        <div className={styles.airbagGrid}>
          {Array.from({ length: 13 }, (_, i) => i).map((n) => (
            <button
              key={n}
              type="button"
              className={`${styles.airbagBtn} ${form.airbags === n ? styles.airbagBtnActive : ''}`}
              onClick={() => update('airbags', n)}>
              {n}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
