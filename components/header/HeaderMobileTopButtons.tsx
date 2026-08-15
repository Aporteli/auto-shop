"use client";

import styles from "../Header.module.css";
import { CloseIcon, MenuIcon, SearchIcon } from "./HeaderIcons";

type TopButtonsProps = {
  isSearchOpen: boolean;
  isMenuOpen: boolean;
  onToggleSearch: () => void;
  onToggleMenu: () => void;
};

export function HeaderMobileTopButtons({
  isSearchOpen,
  isMenuOpen,
  onToggleSearch,
  onToggleMenu,
}: TopButtonsProps) {
  return (
    <>
      <button
        className={`${styles.mobileSearchButton} dark:${styles.mobileSearchButtonDark}`}
        onClick={onToggleSearch}
      >
        {isSearchOpen ? <CloseIcon className="w-6 h-6" /> : <SearchIcon className="w-6 h-6" />}
      </button>
      <button
        className={`${styles.hamburgerButton} dark:${styles.hamburgerButtonDark}`}
        onClick={onToggleMenu}
      >
        {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>
    </>
  );
}
