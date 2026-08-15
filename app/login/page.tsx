'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthForm } from '@/components/AuthModal';
import styles from '@/components/AuthModal.module.css';

function LoginPageContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';
  const errorCode = searchParams.get('error');

  const errorMessage = useMemo(() => {
    if (!errorCode) return '';
    if (errorCode === 'google_not_configured') return t.auth.googleNotConfigured;
    if (errorCode === 'google_denied') return t.auth.googleDenied;
    return t.auth.googleFailed;
  }, [errorCode, t.auth]);

  return (
    <div className={styles.page}>
      <div className={styles.pageCard}>
        {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}
        <AuthForm nextPath={nextPath} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center p-8 text-[#6b7280]">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
