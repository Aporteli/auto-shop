'use client';

import { FormEvent, useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import AccountPageShell from '@/components/AccountPageShell';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '@/components/AccountPage.module.css';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phone ?? '');
  }, [user]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data.user);
      setStatus('saved');
    } catch {
      setStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RequireAuth>
      <AccountPageShell title={t.header.account.editData} subtitle={t.accountPages.profileSubtitle}>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            <span>{t.auth.firstName}</span>
            <input value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
          </label>
          <label className={styles.field}>
            <span>{t.auth.lastName}</span>
            <input value={lastName} onChange={(event) => setLastName(event.target.value)} required />
          </label>
          <label className={styles.field}>
            <span>{t.auth.email}</span>
            <input value={user?.email ?? ''} disabled />
          </label>
          <label className={styles.field}>
            <span>{t.accountPages.phone}</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <button type="submit" className={styles.primaryButton} disabled={isSaving}>
            {t.accountPages.saveChanges}
          </button>
          {status === 'saved' ? <p className={styles.status}>{t.accountPages.saved}</p> : null}
          {status === 'error' ? <p className={`${styles.status} ${styles.error}`}>{t.accountPages.saveFailed}</p> : null}
        </form>
      </AccountPageShell>
    </RequireAuth>
  );
}
