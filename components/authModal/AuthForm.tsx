'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../AuthModal.module.css';
import AuthFormFields from './AuthFormFields';
import type { AuthFormProps, AuthMode } from './types';

export function AuthForm({
  initialMode = 'signin',
  nextPath = '/',
  onSuccess,
  embedded = false,
}: AuthFormProps) {
  const { t } = useLanguage();
  const { login, signup, refresh } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [code, setCode] = useState(''); // ✅ OTP კოდისთვის
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  async function finishAuth() {
    await refresh();
    onSuccess?.();
    const target = nextPath.startsWith('/') ? nextPath : '/';
    if (typeof window !== 'undefined') {
      const current = `${window.location.pathname}${window.location.search}`;
      if (target !== '/' && target !== current && target !== window.location.pathname) {
        router.replace(target);
      }
    }
    router.refresh();
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        // 1. სისტემაში შესვლა
        await login(email.trim(), password);
        await finishAuth();
      } else if (mode === 'signup') {
        // 2. რეგისტრაცია და კოდის გაგზავნა
        await signup({
          email: email.trim(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
        // გადავრთავთ კოდის შეყვანის ეტაპზე მოდალშივე
        setMode('verify');
      } else if (mode === 'verify') {
        // 3. კოდის შემოწმება
        const res = await fetch('/api/auth/verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), code: code.trim() }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'არასწორი კოდი');
        }

        // წარმატებით დადასტურდა და შეიქმნა სესია
        await finishAuth();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.loginFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  function startGoogle() {
    const params = new URLSearchParams();
    if (nextPath && nextPath !== '/') params.set('next', nextPath);
    window.location.href = `/api/auth/google${params.toString() ? `?${params}` : ''}`;
  }

  return (
    <div className={embedded ? styles.embedded : undefined}>
      {/* ტაბები გამოჩნდება მხოლოდ signin და signup დროს */}
      {mode !== 'verify' ? (
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'signin' ? styles.tabActive : ''}`}
            onClick={() => {
              setMode('signin');
              setError('');
            }}>
            {t.auth.signIn}
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
            onClick={() => {
              setMode('signup');
              setError('');
            }}>
            {t.auth.signUp}
          </button>
        </div>
      ) : null}

      <h2 className={styles.title}>
        {mode === 'signin'
          ? t.auth.signInTitle
          : mode === 'signup'
          ? t.auth.signUpTitle
          : 'ვერიფიკაცია'}
      </h2>
      <p className={styles.subtitle}>
        {mode === 'signin'
          ? t.auth.signInSubtitle
          : mode === 'signup'
          ? t.auth.signUpSubtitle
          : `შეიყვანეთ ${email} მისამართზე გამოგზავნილი 6-ნიშნა კოდი`}
      </p>

      {mode !== 'verify' ? (
        <>
          <button type="button" className={styles.googleBtn} onClick={startGoogle}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21 21-9.3 21-21c0-1.4-.1-2.7-.4-4z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 16.3 3 9.6 7.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 36 26.8 37 24 37c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 40.6 16.2 45 24 45z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 37 45 32 45 24c0-1.4-.1-2.7-.4-4z" />
            </svg>
            {t.auth.continueWithGoogle}
          </button>

          <div className={styles.divider}>
            <span>{t.auth.orEmail}</span>
          </div>
        </>
      ) : null}

      {error ? <div className={styles.error}>{error}</div> : null}

      <AuthFormFields
        mode={mode}
        email={email}
        password={password}
        firstName={firstName}
        lastName={lastName}
        code={code}
        isSubmitting={isSubmitting}
        firstNameLabel={t.auth.firstName}
        lastNameLabel={t.auth.lastName}
        emailLabel={t.auth.email}
        passwordLabel={t.auth.password}
        signingIn={t.auth.signingIn}
        signingUp={t.auth.signingUp}
        signIn={t.auth.signIn}
        signUp={t.auth.signUp}
        setEmail={setEmail}
        setPassword={setPassword}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setCode={setCode}
        setMode={setMode}
        onSubmit={onSubmit}
      />
    </div>
  );
}
