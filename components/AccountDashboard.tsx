'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { readAccountBalance } from '@/lib/accountBalance';
import AccountSidebar from './accountDashboard/AccountSidebar';
import styles from './AccountDashboard.module.css';

export default function AccountDashboard({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setBalance(readAccountBalance());
    function onStorage() {
      setBalance(readAccountBalance());
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onStorage);
    };
  }, []);

  if (!user) return null;

  const primary = [
    { href: '/add', label: t.accountDashboard.newListing, icon: 'plus' },
    { href: '/account/listings', label: t.accountDashboard.myListings, icon: 'listings' },
    { href: '/account/won-lots', label: t.accountDashboard.wonLots, icon: 'won' },
    { href: '/account/vin-codes', label: t.accountDashboard.vinCodes, icon: 'vin' },
    { href: '/account/favorites', label: t.accountDashboard.savedCars, icon: 'heart' },
    { href: '/account/leasing', label: t.accountDashboard.leasing, icon: 'leasing' },
    { href: '/account/compare', label: t.accountDashboard.compare, icon: 'compare' },
    { href: '/account/subscribe', label: t.accountDashboard.subscribe, icon: 'subscribe' },
    { href: '/account/messages', label: t.accountDashboard.messages, icon: 'messages' },
    { href: '/account/news', label: t.accountDashboard.news, icon: 'news' },
    { href: '/account/photos-360', label: t.accountDashboard.photos360, icon: 'photos' },
    { href: '/account/profile', label: t.accountDashboard.editData, icon: 'edit' },
  ];

  const secondary = [
    { href: '/account/company', label: t.accountDashboard.addCompany, icon: 'company' },
    { href: '/account/balance', label: t.accountDashboard.topUpBalance, icon: 'wallet' },
    { href: '/account/transfer', label: t.accountDashboard.transferMoney, icon: 'transfer' },
    { href: '/account/cards', label: t.accountDashboard.cards, icon: 'cards' },
    { href: '/account/transactions', label: t.accountDashboard.transactions, icon: 'transactions' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <AccountSidebar
          firstName={user.firstName}
          lastName={user.lastName}
          userIdLabel={t.accountDashboard.userId.replace('{{id}}', String(user.id))}
          balance={balance}
          balanceLabel={t.accountDashboard.balance}
          topUpLabel={t.accountDashboard.topUp}
          navAriaLabel={t.header.accountMenu}
          logoutLabel={t.header.logout}
          primary={primary}
          secondary={secondary}
          isActive={isActive}
          onLogout={() => logout()}
        />
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
}
