'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import HeaderSearch from './HeaderSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[10050] flex items-start justify-center pt-20" role="presentation">
      <button
        type="button"
        className="absolute inset-0 border-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        aria-label={t.auth.close}
        onClick={onClose}
      />
      <div
        className="relative overflow-visible bg-white dark:bg-[#1a1a2e] rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4"
        role="dialog"
        aria-modal="true"
        aria-label={t.searchModal.title}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-white">{t.searchModal.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={t.auth.close}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <HeaderSearch variant="desktop" autoFocus onNavigate={onClose} />
      </div>
    </div>,
    document.body,
  );
}
