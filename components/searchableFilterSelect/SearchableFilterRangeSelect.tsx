'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from '../SearchableFilterSelect.module.css';
import { formatRangeSummary, sanitizeNumberInput, type RangeProps } from './types';

export default function SearchableFilterRangeSelect({
  title,
  from,
  to,
  onRangeChange,
  fromLabel,
  toLabel,
  clearLabel,
  applyLabel = 'OK',
}: RangeProps) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fromRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  const summary = useMemo(() => formatRangeSummary(from, to, fromLabel, toLabel), [from, to, fromLabel, toLabel]);
  const hasValue = Boolean(from || to);
  const showFloating = isOpen || hasValue;

  useEffect(() => {
    if (!isOpen) {
      setDraftFrom(from);
      setDraftTo(to);
    }
  }, [from, to, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setDraftFrom(from);
        setDraftTo(to);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setDraftFrom(from);
        setDraftTo(to);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [from, isOpen, to]);

  useEffect(() => {
    if (!isOpen) return;
    fromRef.current?.focus();
  }, [isOpen]);

  const open = () => {
    setDraftFrom(from);
    setDraftTo(to);
    setIsOpen(true);
  };

  const clearRange = () => {
    setDraftFrom('');
    setDraftTo('');
    onRangeChange('', '');
    setIsOpen(false);
  };

  const applyRange = () => {
    const nextFrom = draftFrom.trim();
    let nextTo = draftTo.trim();
    if (nextFrom && nextTo && Number(nextFrom) > Number(nextTo)) {
      nextTo = nextFrom;
    }
    onRangeChange(nextFrom, nextTo);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={`${styles.root} ${isOpen ? styles.rootOpen : ''}`}>
      <div
        className={`${styles.field} ${showFloating ? styles.fieldActive : ''}`}
        role="button"
        tabIndex={isOpen ? -1 : 0}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={open}
        onKeyDown={(event) => {
          if (!isOpen && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            open();
          }
        }}>
        <span className={`${styles.title} ${showFloating ? styles.titleFloating : ''}`}>{title}</span>
        <span className={`${styles.value} ${hasValue ? styles.valueSelected : ''}`}>{summary || title}</span>
        <span className={styles.chevron} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className={styles.rangeDropdown} id={panelId} aria-label={title} onClick={(event) => event.stopPropagation()}>
          <div className={styles.rangeInputs}>
            <label className={styles.rangeField}>
              <span className={styles.rangeLabel}>{fromLabel}</span>
              <input
                ref={fromRef}
                type="text"
                inputMode="decimal"
                className={styles.rangeInput}
                value={draftFrom}
                placeholder={fromLabel}
                onChange={(event) => setDraftFrom(sanitizeNumberInput(event.target.value))}
              />
            </label>
            <label className={styles.rangeField}>
              <span className={styles.rangeLabel}>{toLabel}</span>
              <input
                type="text"
                inputMode="decimal"
                className={styles.rangeInput}
                value={draftTo}
                placeholder={toLabel}
                onChange={(event) => setDraftTo(sanitizeNumberInput(event.target.value))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    applyRange();
                  }
                }}
              />
            </label>
          </div>

          <div className={styles.rangeActions}>
            {hasValue || draftFrom || draftTo ? (
              <button type="button" className={styles.rangeClear} onClick={clearRange}>
                {clearLabel ?? title}
              </button>
            ) : (
              <span />
            )}
            <button type="button" className={styles.rangeApply} onClick={applyRange}>
              {applyLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
