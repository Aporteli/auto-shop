'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthForm } from './authModal/AuthForm';
import styles from './AuthModal.module.css';
import type { AuthMode } from './authModal/types';

export type { AuthMode } from './authModal/types';
export { AuthForm } from './authModal/AuthForm';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  nextPath?: string;
};

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'signin',
  nextPath = '/',
}: AuthModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={t.auth.title}>
      <button type="button" className={styles.backdrop} aria-label={t.auth.close} onClick={onClose} />
      <div className={styles.modal}>
        <button type="button" className={styles.close} onClick={onClose} aria-label={t.auth.close}>
          ×
        </button>
        <AuthForm
          initialMode={initialMode}
          nextPath={nextPath}
          embedded
          onSuccess={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}
