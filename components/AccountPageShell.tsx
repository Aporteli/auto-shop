'use client';

import type { ReactNode } from 'react';
import AccountDashboard from '@/components/AccountDashboard';
import styles from './AccountPage.module.css';

export default function AccountPageShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AccountDashboard>
      <section className={styles.card}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>
          {action}
        </div>
        {children}
      </section>
    </AccountDashboard>
  );
}
