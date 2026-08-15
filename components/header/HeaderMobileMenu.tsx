"use client";

import { useEffect, useState, type RefObject } from "react";
import Link from "next/link";
import styles from "../Header.module.css";
import HeaderSearch from "../HeaderSearch";
import AccountMenu from "../AccountMenu";
import LanguageCurrencyMenu from "./LanguageCurrencyMenu";
import { PlusIcon, UserIcon, ChevronIcon } from "./HeaderIcons";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";

export function HeaderMobileSearchOverlay({
  isOpen,
  overlayRef,
  onNavigate,
}: {
  isOpen: boolean;
  overlayRef: RefObject<HTMLDivElement | null>;
  onNavigate: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`${styles.mobileSearchOverlay} dark:${styles.mobileSearchOverlayDark}`}
      ref={overlayRef}
    >
      <HeaderSearch variant="mobile" autoFocus onNavigate={onNavigate} />
    </div>
  );
}

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${styles.mobileNavLink} dark:${styles.mobileNavLinkDark}`}
    >
      {children}
    </Link>
  );
}

export default function HeaderMobileMenu({ isOpen }: { isOpen: boolean }) {
  const { t } = useLanguage();
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) setIsMobileServicesOpen(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.mobileMenu} dark:${styles.mobileMenuDark}`}>
      <nav className={styles.mobileNav}>
        <div className={styles.mobileNavSection}>
          <button
            type="button"
            className={`${styles.mobileServicesButton} dark:${styles.mobileServicesButtonDark}`}
            onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
            aria-expanded={isMobileServicesOpen}
          >
            <span>{t.header.nav.services}</span>
            <ChevronIcon
              className={`${styles.mobileServicesArrow} ${isMobileServicesOpen ? styles.mobileServicesArrowRotated : ""}`}
            />
          </button>
          {isMobileServicesOpen && (
            <div className={styles.mobileSubNav}>
              <MobileNavLink href="/title-transfer">
                {t.header.nav.titleTransfer}
              </MobileNavLink>
              <MobileNavLink href="/customs">
                {t.header.nav.customs}
              </MobileNavLink>
              <MobileNavLink href="/price-calculator">
                {t.header.nav.priceCalculator}
              </MobileNavLink>
            </div>
          )}
        </div>
        <MobileNavLink href="/dealers">{t.header.nav.dealers}</MobileNavLink>
        <MobileNavLink href="/auto-parts">
          {t.header.nav.autoParts}
        </MobileNavLink>
        <MobileNavLink href="/catalogue">{t.header.nav.catalogue}</MobileNavLink>
        <MobileNavLink href="/blog">{t.header.nav.blog}</MobileNavLink>
        <div className={styles.mobileNavDivider}></div>
        <MobileNavLink href="/help">{t.header.nav.help}</MobileNavLink>
        <MobileNavLink href="/contacts">{t.header.nav.contacts}</MobileNavLink>
      </nav>
    </div>
  );
}

export function HeaderMobileBottomBar({
  isLangDropdownOpen,
  onToggleLang,
  langDropdownRef,
  onOpenAuthModal,
}: {
  isLangDropdownOpen: boolean;
  onToggleLang: () => void;
  langDropdownRef: RefObject<HTMLDivElement | null>;
  onOpenAuthModal: () => void;
}) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const addHref = user ? "/add" : "/login?next=/add";

  return (
    <div
      className={`${styles.mobileBottomContainer} dark:${styles.mobileBottomContainerDark}`}
    >
      <div className={styles.mobileBottomContent}>
        <Link
          href={addHref}
          className={`${styles.mobileBottomActionButton} ${styles.mobileAddButton} dark:${styles.mobileBottomActionButtonDark}`}
        >
          <span className={styles.actionButtonContent}>
            <PlusIcon />
            <span>{t.header.add}</span>
          </span>
        </Link>
        <LanguageCurrencyMenu
          namePrefix="mobile"
          variant="mobile"
          isOpen={isLangDropdownOpen}
          onToggle={onToggleLang}
          containerRef={langDropdownRef}
        />
        {user ? (
          <AccountMenu placement="up" />
        ) : (
          <button
            type="button"
            className={`${styles.mobileBottomActionButton} dark:${styles.mobileBottomActionButtonDark}`}
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
  );
}
