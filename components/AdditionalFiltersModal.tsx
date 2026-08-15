'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './AdditionalFiltersModal.module.css';
import BodyAndTechFields from './additionalFilters/BodyAndTechFields';
import ColorFeatureFields, { AdditionalOptionsFields } from './additionalFilters/ColorFeatureFields';
import ListingAndStickerFields from './additionalFilters/ListingAndStickerFields';
import {
  defaultModalState,
  type AdditionalModalState,
  type ApiFilters,
  type IdListKey,
} from './additionalFilters/types';

export type { AdditionalModalState };

type AdditionalFiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  filters: ApiFilters | null;
  value: AdditionalModalState;
  onApply: (value: AdditionalModalState) => void;
  onClear: () => void;
};

export default function AdditionalFiltersModal({
  isOpen,
  onClose,
  filters,
  value,
  onApply,
  onClear,
}: AdditionalFiltersModalProps) {
  const { t, language } = useLanguage();
  const [draft, setDraft] = useState<AdditionalModalState>(value);

  const label = (item: { nameEn: string; nameRu: string }) =>
    language === 'ru' ? item.nameRu : item.nameEn;

  useEffect(() => {
    if (isOpen) {
      setDraft(value);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, value]);

  const updateDraft = (patch: Partial<AdditionalModalState>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const toggleId = (key: IdListKey, id: number) => {
    setDraft((prev) => {
      const current = prev[key];
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      return { ...prev, [key]: next };
    });
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    setDraft(defaultModalState());
    onClear();
  };

  if (!isOpen) return null;

  const m = t.additionalFiltersModal;
  const fieldProps = { m, draft, filters, label, updateDraft, toggleId };

  return (
    <div className={styles.additionalFiltersModal} role="dialog" aria-modal="true" aria-labelledby="additional-filters-title">
      <button type="button" className={styles.backdrop} aria-label={m.close} onClick={onClose} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id="additional-filters-title" className={styles.title}>
            {m.title}
          </h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label={m.close}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <BodyAndTechFields {...fieldProps}>
            <AdditionalOptionsFields {...fieldProps} />
          </BodyAndTechFields>
          <ColorFeatureFields {...fieldProps} />
          <ListingAndStickerFields {...fieldProps} />
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.clearButton} onClick={handleClear}>
            {m.clear}
          </button>
          <button type="button" className={styles.applyButton} onClick={handleApply}>
            {m.apply}
          </button>
        </div>
      </div>
    </div>
  );
}
