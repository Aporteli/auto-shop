"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import SearchModal from "./SearchModal";
import AuthModal from "./AuthModal";
import HeaderDesktopBar from "./header/HeaderDesktopBar";
import HeaderMobileMenu, {
  HeaderMobileBottomBar,
  HeaderMobileSearchOverlay,
} from "./header/HeaderMobileMenu";
import { HeaderMobileTopButtons } from "./header/HeaderMobileTopButtons";

export default function Header() {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTopHidden, setIsTopHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const desktopLangDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLangDropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const isTopHiddenRef = useRef(false);
  const isScrolledRef = useRef(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 769px)");

    const applyScrollState = () => {
      tickingRef.current = false;
      const y = window.scrollY;
      const scrolled = y > 8;

      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
      }

      if (!media.matches) {
        if (isTopHiddenRef.current) {
          isTopHiddenRef.current = false;
          setIsTopHidden(false);
        }
        lastScrollYRef.current = y;
        return;
      }

      const lastY = lastScrollYRef.current;
      let nextHidden = isTopHiddenRef.current;

      if (y < 64) {
        nextHidden = false;
      } else if (y > lastY + 14) {
        nextHidden = true;
      } else if (y < lastY - 14) {
        nextHidden = false;
      }

      if (nextHidden !== isTopHiddenRef.current) {
        isTopHiddenRef.current = nextHidden;
        setIsTopHidden(nextHidden);
      }

      lastScrollYRef.current = y;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(applyScrollState);
    };

    applyScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    media.addEventListener("change", applyScrollState);

    return () => {
      window.removeEventListener("scroll", onScroll);
      media.removeEventListener("change", applyScrollState);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsideDesktop = desktopLangDropdownRef.current?.contains(target);
      const isInsideMobile = mobileLangDropdownRef.current?.contains(target);

      if (!isInsideDesktop && !isInsideMobile) {
        setIsLangDropdownOpen(false);
      }
    }

    if (isLangDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangDropdownOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsMobileSearchOpen(false);
      }
    }

    if (isMobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSearchOpen]);

  return (
    <>
      <header
        className={`${styles.header} dark:${styles.headerDark}${isTopHidden ? ` ${styles.headerTopHidden}` : ""}${
          isScrolled ? ` ${styles.headerScrolled}` : ""
        }`}
      >
        <HeaderMobileSearchOverlay
          isOpen={isMobileSearchOpen}
          overlayRef={mobileSearchRef}
          onNavigate={() => setIsMobileSearchOpen(false)}
        />
        <HeaderDesktopBar
          isLangDropdownOpen={isLangDropdownOpen}
          onToggleLang={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
          langDropdownRef={desktopLangDropdownRef}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          mobileControls={
            <HeaderMobileTopButtons
              isSearchOpen={isMobileSearchOpen}
              isMenuOpen={isMobileMenuOpen}
              onToggleSearch={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          }
        />
        <HeaderMobileMenu isOpen={isMobileMenuOpen} />
      </header>
      <HeaderMobileBottomBar
        isLangDropdownOpen={isLangDropdownOpen}
        onToggleLang={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
        langDropdownRef={mobileLangDropdownRef}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
