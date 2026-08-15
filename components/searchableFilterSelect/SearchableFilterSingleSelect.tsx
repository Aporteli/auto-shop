'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from '../SearchableFilterSelect.module.css';
import type { SelectProps } from './types';

export default function SearchableFilterSingleSelect({
  title,
  value,
  options,
  onChange,
  emptyLabel,
  disabled,
}: SelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedLabel = useMemo(() => {
    if (!value) return '';
    return options.find((option) => option.value === value)?.label ?? value;
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  const open = () => {
    if (disabled) return;
    setIsOpen(true);
    setQuery('');
  };

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
    setQuery('');
  };

  const clearSelection = () => {
    onChange('');
    setQuery('');
    inputRef.current?.focus();
  };

  const showFloating = isOpen || Boolean(selectedLabel);
  const displayValue = isOpen ? query : selectedLabel;

  return (
    <div ref={rootRef} className={`${styles.root} ${isOpen ? styles.rootOpen : ''}`}>
      <div
        className={`${styles.field} ${showFloating ? styles.fieldActive : ''} ${disabled ? styles.fieldDisabled : ''}`}
        role="combobox"
        tabIndex={disabled || isOpen ? -1 : 0}
        aria-expanded={isOpen}
        aria-disabled={disabled || undefined}
        aria-controls={listId}
        aria-haspopup="listbox"
        onClick={open}
        onKeyDown={(event) => {
          if (!isOpen && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            open();
          }
        }}>
        <span className={`${styles.title} ${showFloating ? styles.titleFloating : ''}`}>{title}</span>

        {isOpen ? (
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            placeholder=""
            aria-label={title}
            onChange={(event) => setQuery(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && filteredOptions[0]) {
                event.preventDefault();
                selectOption(filteredOptions[0].value);
              }
            }}
          />
        ) : (
          <span className={`${styles.value} ${selectedLabel ? styles.valueSelected : ''}`}>
            {selectedLabel || title}
          </span>
        )}

        <span className={styles.chevron} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdown} id={listId} role="listbox" aria-label={title}>
          {value && (
            <button type="button" className={styles.clearOption} onClick={clearSelection}>
              {emptyLabel ?? title}
            </button>
          )}

          {filteredOptions.length === 0 ? (
            <div className={styles.empty}>{displayValue ? `"${displayValue}"` : title}</div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={`${styles.option} ${option.value === value ? styles.optionActive : ''}`}
                onClick={() => selectOption(option.value)}>
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
