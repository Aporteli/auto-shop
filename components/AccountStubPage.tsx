'use client';

import RequireAuth from '@/components/RequireAuth';
import AccountPageShell from '@/components/AccountPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '@/components/AccountPage.module.css';

export default function AccountStubPage({ title }: { title: string }) {
  const { t } = useLanguage();

  return (
    <RequireAuth>
      <AccountPageShell title={title}>
        <p className={styles.empty}>{t.accountDashboard.emptySection}</p>
      </AccountPageShell>
    </RequireAuth>
  );
}
