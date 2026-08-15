'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '../SearchDashboard.module.css';
import SearchAiMatchedListings from './SearchAiMatchedListings';
import type { AiMatchedListing } from './types';

type SearchAiModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  lastAiPrompt: string;
  aiResponse: string;
  aiResults: AiMatchedListing[];
  onClose: () => void;
};

export default function SearchAiModal({
  isOpen,
  isLoading,
  lastAiPrompt,
  aiResponse,
  aiResults,
  onClose,
}: SearchAiModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
    // Match original dashboard deps: re-bind when open/loading change, not onClose identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isLoading]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={styles.aiModalOverlay} role="presentation">
      <button
        type="button"
        className={styles.aiModalBackdrop}
        aria-label={t.searchDashboard.aiResponseClose}
        onClick={onClose}
      />
      <div className={styles.aiModal} role="dialog" aria-modal="true" aria-labelledby="autoshop-ai-modal-title">
        <div className={styles.aiModalHeader}>
          <div className={styles.aiModalTitleWrap}>
            <span className={styles.aiModalBadge} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.5l1.35 4.15L17.5 8l-4.15 1.35L12 13.5l-1.35-4.15L6.5 8l4.15-1.35L12 2.5z" />
                <path d="M18.5 13.5l.75 2.25L21.5 16.5l-2.25.75L18.5 19.5l-.75-2.25L15.5 16.5l2.25-.75.75-2.25z" />
              </svg>
            </span>
            <div>
              <h2 id="autoshop-ai-modal-title" className={styles.aiModalTitle}>
                {t.searchDashboard.aiResponseTitle}
              </h2>
              {lastAiPrompt ? <p className={styles.aiModalSubtitle}>{lastAiPrompt}</p> : null}
            </div>
          </div>
          <button
            type="button"
            className={styles.aiModalClose}
            aria-label={t.searchDashboard.aiResponseClose}
            onClick={onClose}
            disabled={isLoading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeWidth="2.2" strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className={styles.aiModalBody}>
          {isLoading ? (
            <div className={styles.aiModalLoading}>
              <span className={styles.aiModalSpinner} aria-hidden="true" />
              <span>{t.searchDashboard.aiLoading}</span>
            </div>
          ) : (
            <>
              <p className={styles.aiModalText}>{aiResponse}</p>
              <SearchAiMatchedListings listings={aiResults} onSelectListing={onClose} />
            </>
          )}
        </div>

        {!isLoading && (
          <div className={styles.aiModalFooter}>
            <button type="button" className={styles.aiModalFooterButton} onClick={onClose}>
              {t.searchDashboard.aiResponseClose}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
