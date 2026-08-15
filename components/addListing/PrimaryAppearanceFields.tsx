import {
  INTERIOR_COLOR_KEYS,
  INTERIOR_MATERIAL_KEYS,
  interiorColorLabel,
  interiorMaterialLabel,
} from '@/lib/addListing';
import type { AddListingFieldsProps } from './types';
import { label } from './label';
import styles from '../AddListingForm.module.css';

export default function PrimaryAppearanceFields({
  al,
  language,
  form,
  update,
  filters,
  descLang,
  setDescLang,
  toggleFeature,
}: AddListingFieldsProps & {
  descLang: 'en' | 'ru';
  setDescLang: (lang: 'en' | 'ru') => void;
  toggleFeature: (id: number) => void;
}) {
  return (
    <>
      <div className={styles.fieldFull}>
        <label className={styles.label}>
          {al.fields.carColor} <span className={styles.required}>*</span>
        </label>
        <div className={styles.colorGrid}>
          {filters.colors.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`${styles.colorBtn} ${form.colorId === color.id ? styles.colorBtnActive : ''}`}
              onClick={() => update('colorId', color.id)}>
              <span className={styles.colorSwatch} style={{ background: color.hex || '#d1d5db' }} />
              {label(color, language)}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.fieldFull}>
        <label className={styles.label}>
          {al.fields.interior} <span className={styles.required}>*</span>
        </label>
        <div className={styles.segmentGroup}>
          {INTERIOR_MATERIAL_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={`${styles.segmentBtn} ${form.interiorMaterial === key ? styles.segmentBtnActive : ''}`}
              onClick={() => update('interiorMaterial', key)}>
              {interiorMaterialLabel(key, language)}
            </button>
          ))}
        </div>
        <div className={styles.colorGrid} style={{ marginTop: 12 }}>
          {INTERIOR_COLOR_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={`${styles.colorBtn} ${form.interiorColor === key ? styles.colorBtnActive : ''}`}
              onClick={() => update('interiorColor', key)}>
              {interiorColorLabel(key, language)}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.fieldFull}>
        <label className={styles.label}>{al.fields.extraOptions}</label>
        <div className={styles.featureGrid}>
          {filters.features.map((feature) => (
            <button
              key={feature.id}
              type="button"
              className={`${styles.featureChip} ${
                form.featureIds.includes(feature.id) ? styles.featureChipActive : ''
              }`}
              onClick={() => toggleFeature(feature.id)}>
              <span>+</span>
              {label(feature, language)}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.fieldFull}>
        <label className={styles.label}>{al.fields.description}</label>
        <div className={styles.langTabs}>
          <button
            type="button"
            className={`${styles.langTab} ${descLang === 'en' ? styles.langTabActive : ''}`}
            onClick={() => setDescLang('en')}>
            English
          </button>
          <button
            type="button"
            className={`${styles.langTab} ${descLang === 'ru' ? styles.langTabActive : ''}`}
            onClick={() => setDescLang('ru')}>
            Русский
          </button>
        </div>
        <textarea
          className={styles.textarea}
          value={descLang === 'en' ? form.descriptionEn : form.descriptionRu}
          onChange={(e) => update(descLang === 'en' ? 'descriptionEn' : 'descriptionRu', e.target.value)}
          maxLength={4000}
        />
        <p className={styles.charCount}>
          {al.remainingSymbols} {4000 - (descLang === 'en' ? form.descriptionEn : form.descriptionRu).length}
        </p>
      </div>
    </>
  );
}
