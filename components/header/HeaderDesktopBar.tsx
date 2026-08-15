"use client";

import { useState, useRef, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import styles from "../Header.module.css";
import Logo from "../Logo";
import AccountMenu from "../AccountMenu";
import LanguageCurrencyMenu from "./LanguageCurrencyMenu";
import { ChevronIcon, PlusIcon, SearchIcon, UserIcon } from "./HeaderIcons";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";

type HeaderDesktopBarProps = {
  mobileControls: ReactNode;
  isLangDropdownOpen: boolean;
  onToggleLang: () => void;
  langDropdownRef: RefObject<HTMLDivElement | null>;
  onOpenSearchModal: () => void;
  onOpenAuthModal: () => void;
};

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`${styles.navLink} dark:${styles.navLinkDark}`}>
      {children}
    </Link>
  );
}

export default function HeaderDesktopBar({
  mobileControls,
  isLangDropdownOpen,
  onToggleLang,
  langDropdownRef,
  onOpenSearchModal,
  onOpenAuthModal,
}: HeaderDesktopBarProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const addHref = user ? "/add" : "/login?next=/add";
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          <div className={styles.leftSection}>
            <Link
              href="/"
              className={`${styles.logoLink} dark:${styles.logoLinkDark}`}
              aria-label={t.header.logo}
            >
              <Logo className={styles.logo} />
            </Link>
            <div className={styles.searchContainer}>
              <button
                type="button"
                className={`${styles.searchTrigger} dark:${styles.searchTriggerDark}`}
                onClick={onOpenSearchModal}
                aria-label={t.header.searchPlaceholder}
              >
                <SearchIcon
                  className={styles.searchTriggerIcon}
                  aria-hidden="true"
                />
                <span className={styles.searchTriggerText}>
                  {t.header.searchPlaceholder}
                </span>
              </button>
            </div>
          </div>
          <div className={styles.actionButtons}>
            {mobileControls}
            <Link
              href={addHref}
              className={`${styles.actionButton} ${styles.addButton} dark:${styles.actionButtonDark} ${styles.desktopOnly}`}
            >
              <span className={styles.actionButtonContent}>
                <PlusIcon />
                <span>{t.header.add}</span>
              </span>
            </Link>
            <LanguageCurrencyMenu
              namePrefix="desktop"
              variant="desktop"
              isOpen={isLangDropdownOpen}
              onToggle={onToggleLang}
              containerRef={langDropdownRef}
            />
            {user ? (
              <AccountMenu className={styles.desktopOnly} />
            ) : (
              <button
                type="button"
                className={`${styles.actionButton} dark:${styles.actionButtonDark} ${styles.desktopOnly}`}
                onClick={onOpenAuthModal}
              >
                <span className={styles.actionButtonContent}>
                  <UserIcon />
                  <span>{t.header.login}</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={`${styles.divider} dark:${styles.dividerDark}`}></div>
      <div className={styles.navSection}>
        <nav className={styles.nav}>
          <div
            className={styles.servicesDropdownContainer}
            ref={servicesDropdownRef}
            onMouseEnter={() => setIsServicesDropdownOpen(true)}
            onMouseLeave={() => setIsServicesDropdownOpen(false)}
          >
            <button
              className={`${styles.servicesButton} dark:${styles.servicesButtonDark}`}
            >
              <span>{t.header.nav.services}</span>
              <ChevronIcon
                className={`${styles.servicesArrow} ${isServicesDropdownOpen ? styles.servicesArrowRotated : ""}`}
              />
            </button>
            {isServicesDropdownOpen && (
              <div
                className={`${styles.servicesDropdown} dark:${styles.servicesDropdownDark}`}
              >
                <Link
                  href="/title-transfer"
                  className={`${styles.dropdownLink} dark:${styles.dropdownLinkDark}`}
                >
                  {t.header.nav.titleTransfer}
                </Link>
                <Link
                  href="/customs"
                  className={`${styles.dropdownLink} dark:${styles.dropdownLinkDark}`}
                >
                  {t.header.nav.customs}
                </Link>
                <Link
                  href="/price-calculator"
                  className={`${styles.dropdownLink} dark:${styles.dropdownLinkDark}`}
                >
                  {t.header.nav.priceCalculator}
                </Link>
              </div>
            )}
          </div>
          <NavLink href="/dealers">{t.header.nav.dealers}</NavLink>
          <NavLink href="/auto-parts">{t.header.nav.autoParts}</NavLink>
          <NavLink href="/catalogue">{t.header.nav.catalogue}</NavLink>
          <NavLink href="/blog">{t.header.nav.blog}</NavLink>
        </nav>
        <div className={styles.navRightLinks}>
          <Link
            href="/help"
            className={`${styles.navLinkSmall} dark:${styles.navLinkSmallDark}`}
          >
            {t.header.nav.help}
          </Link>
          <Link
            href="/contacts"
            className={`${styles.navLinkSmall} dark:${styles.navLinkSmallDark}`}
          >
            {t.header.nav.contacts}
          </Link>
        </div>
      </div>
    </>
  );
}
