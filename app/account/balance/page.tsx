'use client';

import { useMemo, useState, useEffect } from 'react';
import RequireAuth from '@/components/RequireAuth';
import AccountPageShell from '@/components/AccountPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { readAccountBalance, writeAccountBalance } from '@/lib/accountBalance';
import styles from '@/components/AccountPage.module.css';

const PRESETS = [10, 20, 50, 100];

export default function BalancePage() {
  const { t, language } = useLanguage();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(20);
  const [custom, setCustom] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setBalance(readAccountBalance());
  }, []);

  const locale = language === 'ru' ? 'ru-RU' : 'en-US';
  const display = useMemo(
    () =>
      new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
        balance,
      ),
    [balance, locale],
  );

  const handleTopUp = () => {
    const value = custom.trim() ? Number(custom) : amount;
    if (!Number.isFinite(value) || value <= 0) return;
    const next = balance + value;
    setBalance(next);
    writeAccountBalance(next);
    setSaved(true);
  };

  return (
    <RequireAuth>
      <AccountPageShell title={t.header.account.topUpBalance} subtitle={t.accountPages.balanceSubtitle}>
        <p className={styles.subtitle}>{t.accountPages.currentBalance}</p>
        <p className={styles.balanceValue}>{display}</p>
        <p className={styles.subtitle}>{t.accountPages.chooseAmount}</p>
        <div className={styles.amountGrid}>
          {PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles.amountButton} ${amount === value && !custom ? styles.amountActive : ''}`}
              onClick={() => {
                setAmount(value);
                setCustom('');
                setSaved(false);
              }}>
              ${value}
            </button>
          ))}
        </div>
        <label className={styles.field}>
          <span>{t.accountPages.customAmount}</span>
          <input
            type="number"
            min={1}
            value={custom}
            onChange={(event) => {
              setCustom(event.target.value);
              setSaved(false);
            }}
          />
        </label>
        <div style={{ marginTop: '1rem' }}>
          <button type="button" className={styles.primaryButton} onClick={handleTopUp}>
            {t.accountPages.topUp}
          </button>
        </div>
        {saved ? <p className={styles.status}>{t.accountPages.topUpSuccess}</p> : null}
      </AccountPageShell>
    </RequireAuth>
  );
}
