'use client';

import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import {
  footerCategoryColumns,
  footerHelpLinks,
  footerNavigationLinks,
  footerSearchHref,
  footerSocialLinks,
} from '@/lib/footerLinks';
import styles from './Footer.module.css';

function SocialIcon({ id }: { id: (typeof footerSocialLinks)[number]['id'] }) {
  if (id === 'facebook') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 9.5V7.75c0-.69.56-1.25 1.25-1.25H16V4h-2.1c-2.07 0-3.4 1.26-3.4 3.2V9.5H8v2.75h2.5V20h3V12.25H16l.5-2.75h-3Z" />
      </svg>
    );
  }

  if (id === 'instagram') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.5 8.5h3v9h-3v-9Zm1.5-4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM10 8.5h2.9v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59V17.5h-3v-4.02c0-.96-.02-2.2-1.34-2.2-1.34 0-1.55 1.05-1.55 2.13v4.09H10V8.5Z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const searchHref = footerSearchHref();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <nav className={styles.footerSection} aria-label={t.footer.navigation.title}>
            <h3 className={styles.footerTitle}>{t.footer.navigation.title}</h3>
            <ul className={styles.footerLinks}>
              {footerNavigationLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.footerLink}>
                    {t.footer.navigation[item.label as keyof typeof t.footer.navigation]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{t.footer.help.title}</h3>
            <ul className={styles.footerLinks}>
              {footerHelpLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.footerLink}>
                    {t.footer.help[item.label as keyof typeof t.footer.help]}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.socialLinks}>
              {footerSocialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  className={styles.socialButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}>
                  <SocialIcon id={social.id} />
                </a>
              ))}
            </div>
          </div>

          <div className={`${styles.footerSection} ${styles.categoriesSection}`}>
            <h3 className={styles.footerTitle}>{t.footer.categories.title}</h3>
            <div className={styles.categoryColumns}>
              {footerCategoryColumns.map((columnKey) => (
                <ul key={columnKey} className={styles.categoryList}>
                  {t.footer.categories[columnKey].map((label) => (
                    <li key={label}>
                      <Link href={searchHref} className={styles.footerLink}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} AutoShop. {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
