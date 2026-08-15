'use client';

import { FormEvent } from 'react';
import styles from '../AuthModal.module.css';
import type { AuthMode } from './types';

type AuthFormFieldsProps = {
  mode: AuthMode;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  code: string;
  isSubmitting: boolean;
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  passwordLabel: string;
  signingIn: string;
  signingUp: string;
  signIn: string;
  signUp: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setCode: (value: string) => void;
  setMode: (mode: AuthMode) => void;
  onSubmit: (event: FormEvent) => void;
};

export default function AuthFormFields({
  mode,
  email,
  password,
  firstName,
  lastName,
  code,
  isSubmitting,
  firstNameLabel,
  lastNameLabel,
  emailLabel,
  passwordLabel,
  signingIn,
  signingUp,
  signIn,
  signUp,
  setEmail,
  setPassword,
  setFirstName,
  setLastName,
  setCode,
  setMode,
  onSubmit,
}: AuthFormFieldsProps) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {mode === 'signup' ? (
        <div className={styles.nameRow}>
          <label className={styles.field} htmlFor="auth-first-name">
            <span>{firstNameLabel}</span>
            <input
              id="auth-first-name"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <label className={styles.field} htmlFor="auth-last-name">
            <span>{lastNameLabel}</span>
            <input
              id="auth-last-name"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
        </div>
      ) : null}

      {mode !== 'verify' ? (
        <>
          <label className={styles.field}>
            <span>{emailLabel}</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>{passwordLabel}</span>
            <input
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </>
      ) : (
        /* ✅ კოდის შეყვანის ველი */
        <label className={styles.field}>
          <span>დამადასტურებელი კოდი (OTP)</span>
          <input
            type="text"
            maxLength={6}
            placeholder="123456"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '1.25rem' }}
          />
        </label>
      )}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting
          ? mode === 'signin'
            ? signingIn
            : mode === 'signup'
            ? signingUp
            : 'მოწმდება...'
          : mode === 'signin'
          ? signIn
          : mode === 'signup'
          ? signUp
          : 'დადასტურება'}
      </button>

      {mode === 'verify' ? (
        <button
          type="button"
          onClick={() => setMode('signup')}
          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginTop: '10px', fontSize: '13px' }}>
          ← უკან დაბრუნება
        </button>
      ) : null}
    </form>
  );
}
