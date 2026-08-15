'use client';

import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import AccountPageShell from '@/components/AccountPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '@/components/AccountPage.module.css';

export default function ComparePage() {
  const { t } = useLanguage();

  return (
    <RequireAuth>
      <AccountPageShell
        title={t.header.account.compare}
        subtitle={t.accountPages.compareSubtitle}
        action={
          <Link href="/search" className={styles.secondaryButton}>
            {t.accountPages.browseListings}
          </Link>
        }>
        <p className={styles.empty}>{t.accountPages.emptyCompare}</p>
      </AccountPageShell>
    </RequireAuth>
  );
}
