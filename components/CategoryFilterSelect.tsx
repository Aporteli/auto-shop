'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ResolvedCategoryBodyType } from '@/lib/categoryBodyTypes';
import styles from './CategoryFilterSelect.module.css';

type CategoryFilterSelectProps = {
  title: string;
  options: ResolvedCategoryBodyType[];
  value: number[];
  onChange: (ids: number[]) => void;
  selectLabel: string;
};

export default function CategoryFilterSelect({
  title,
  options,
  value,
  onChange,
  selectLabel,
}: CategoryFilterSelectProps) {
  const { language } = useLanguage();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draftIds, setDraftIds] = useState<number[]>(value);

  useEffect(() => {
    if (!isOpen) setDraftIds(value);
  }, [value, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setDraftIds(value);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setDraftIds(value);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, value]);

  const selectedLabels = useMemo(() => {
    return options
      .filter((option) => option.ids.some((id) => value.includes(id)))
      .map((option) => (language === 'ru' ? option.nameRu : option.nameEn));
  }, [options, value, language]);

  const displayValue = selectedLabels.join(', ');
  const showFloating = isOpen || selectedLabels.length > 0;

  const isOptionActive = (option: ResolvedCategoryBodyType) =>
    option.ids.length > 0 && option.ids.every((id) => draftIds.includes(id));

  const toggleOption = (option: ResolvedCategoryBodyType) => {
    if (option.ids.length === 0) return;
    setDraftIds((prev) => {
      const active = option.ids.every((id) => prev.includes(id));
      if (active) {
        return prev.filter((id) => !option.ids.includes(id));
      }
      return [...new Set([...prev, ...option.ids])];
    });
  };

  const applySelection = () => {
    onChange(draftIds);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={`${styles.root} ${isOpen ? styles.rootOpen : ''}`}>
      <button
        type="button"
        className={`${styles.field} ${showFloating ? styles.fieldActive : ''}`}
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev;
            if (next) setDraftIds(value);
            return next;
          });
        }}>
        <span className={`${styles.title} ${showFloating ? styles.titleFloating : ''}`}>{title}</span>
        {showFloating && <span className={styles.value}>{displayValue}</span>}
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.panel} id={listId} role="listbox" aria-multiselectable="true">
          <div className={styles.chips}>
            {options.map((option) => {
              const active = isOptionActive(option);
              const label = language === 'ru' ? option.nameRu : option.nameEn;
              return (
                <button
                  key={option.key}
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={option.ids.length === 0}
                  className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                  onClick={() => toggleOption(option)}>
                  <span className={styles.chipIcon} aria-hidden="true">
                    {active ? '✓' : '+'}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
          <button type="button" className={styles.selectButton} onClick={applySelection}>
            {selectLabel}
          </button>
        </div>
      )}
    </div>
  );
}
