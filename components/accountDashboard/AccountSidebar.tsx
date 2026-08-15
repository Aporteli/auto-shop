'use client';

import Link from 'next/link';
import styles from '../AccountDashboard.module.css';
import { Icon } from './AccountNavIcons';

type NavItem = { href: string; label: string; icon: string };

type AccountSidebarProps = {
  firstName: string;
  lastName: string;
  userIdLabel: string;
  balance: number;
  balanceLabel: string;
  topUpLabel: string;
  navAriaLabel: string;
  logoutLabel: string;
  primary: NavItem[];
  secondary: NavItem[];
  isActive: (href: string) => boolean;
  onLogout: () => void;
};

export default function AccountSidebar({
  firstName,
  lastName,
  userIdLabel,
  balance,
  balanceLabel,
  topUpLabel,
  navAriaLabel,
  logoutLabel,
  primary,
  secondary,
  isActive,
  onLogout,
}: AccountSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        <span className={styles.avatar} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.7" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <div>
          <p className={styles.name}>
            {firstName} {lastName}
          </p>
          <p className={styles.userId}>{userIdLabel}</p>
        </div>
      </div>

      <div className={styles.balanceRow}>
        <div>
          <p className={styles.balanceLabel}>{balanceLabel}</p>
          <p className={styles.balanceValue}>₾ {balance}</p>
        </div>
        <Link href="/account/balance" className={styles.topUp}>
          {topUpLabel}
        </Link>
      </div>

      <nav className={styles.nav} aria-label={navAriaLabel}>
        {primary.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}>
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
        <div className={styles.divider} />
        {secondary.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}>
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
        <div className={styles.divider} />
        <button type="button" className={styles.logout} onClick={onLogout}>
          <Icon name="logout" />
          {logoutLabel}
        </button>
      </nav>
    </aside>
  );
}
