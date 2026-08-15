'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth, type AuthUser } from '@/contexts/AuthContext';
import styles from './AccountMenu.module.css';

type AccountMenuProps = {
  className?: string;
  placement?: 'down' | 'up';
};

function userInitials(user: AuthUser) {
  const first = user.firstName.trim().charAt(0);
  const last = user.lastName.trim().charAt(0);
  const initials = `${first}${last}`.toUpperCase();
  return initials || user.email.charAt(0).toUpperCase() || 'U';
}

export default function AccountMenu({ className, placement = 'down' }: AccountMenuProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  if (!user) return null;

  const links = [
    { href: '/account/listings', label: t.header.account.myListings },
    { href: '/account/balance', label: t.header.account.topUpBalance },
    { href: '/account/compare', label: t.header.account.compare },
    { href: '/account/favorites', label: t.header.account.favorites },
    { href: '/account/profile', label: t.header.account.editData },
    { href: '/account/messages', label: t.header.account.messages },
    { href: '/account/news', label: t.header.account.news },
  ];

  return (
    <div className={`${styles.wrap}${className ? ` ${className}` : ''}`} ref={wrapRef}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t.header.accountMenu}
        onClick={() => setIsOpen((open) => !open)}>
        <span className={styles.avatar} aria-hidden="true">
          {userInitials(user)}
        </span>
      </button>

      {isOpen && (
        <div className={`${styles.menu} ${placement === 'up' ? styles.menuUp : ''}`} role="menu">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={styles.item}
              onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className={styles.divider} />
          <button
            type="button"
            role="menuitem"
            className={`${styles.item} ${styles.logout}`}
            onClick={async () => {
              setIsOpen(false);
              await logout();
            }}>
            {t.header.logout}
          </button>
        </div>
      )}
    </div>
  );
}
