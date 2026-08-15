"use client";

import type { RefObject } from "react";
import styles from "../Header.module.css";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { ChevronIcon, GlobeIcon } from "./HeaderIcons";

type LanguageCurrencyMenuProps = {
  namePrefix: string;
  variant: "desktop" | "mobile";
  isOpen: boolean;
  onToggle: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
};

function RadioOption({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className={`${styles.radioLabel} dark:${styles.radioLabelDark}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.radioInput}
      />
      <span
        className={`${styles.radioIndicator} dark:${styles.radioIndicatorDark}`}
      />
      <span>{label}</span>
    </label>
  );
}

export default function LanguageCurrencyMenu({
  namePrefix,
  variant,
  isOpen,
  onToggle,
  containerRef,
}: LanguageCurrencyMenuProps) {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const isDesktop = variant === "desktop";
  const languageName = t.languages[language === "en" ? "english" : "russian"];

  const buttonInner = (
    <>
      <GlobeIcon className={isDesktop ? "w-5 h-5" : undefined} />
      <span>{languageName}</span>
      {isDesktop && <ChevronIcon className="w-4 h-4 ml-1" />}
    </>
  );

  return (
    <div
      className={
        isDesktop
          ? `${styles.langDropdownContainer} ${styles.desktopOnly}`
          : styles.mobileLangDropdownContainer
      }
      ref={containerRef}
    >
      <button
        className={
          isDesktop
            ? `${styles.actionButton} dark:${styles.actionButtonDark}`
            : `${styles.mobileBottomActionButton} dark:${styles.mobileBottomActionButtonDark}`
        }
        onClick={onToggle}
      >
        {isDesktop ? (
          buttonInner
        ) : (
          <span className={styles.actionButtonContent}>{buttonInner}</span>
        )}
      </button>
      {isOpen && (
        <div
          className={
            isDesktop
              ? `${styles.langDropdown} dark:${styles.langDropdownDark}`
              : `${styles.mobileLangDropdown} dark:${styles.mobileLangDropdownDark}`
          }
        >
          <div className={styles.dropdownSection}>
            <RadioOption
              name={`language-${namePrefix}`}
              value="en"
              checked={language === "en"}
              onChange={() => setLanguage("en")}
              label={t.languages.english}
            />
            <RadioOption
              name={`language-${namePrefix}`}
              value="ru"
              checked={language === "ru"}
              onChange={() => setLanguage("ru")}
              label={t.languages.russian}
            />
          </div>
          <div
            className={`${styles.dropdownDivider} dark:${styles.dropdownDividerDark}`}
          ></div>
          <div className={styles.dropdownSection}>
            <RadioOption
              name={`currency-${namePrefix}`}
              value="USD"
              checked={currency === "USD"}
              onChange={() => setCurrency("USD")}
              label={t.currencies.dollar}
            />
            <RadioOption
              name={`currency-${namePrefix}`}
              value="EUR"
              checked={currency === "EUR"}
              onChange={() => setCurrency("EUR")}
              label={t.currencies.euro}
            />
          </div>
        </div>
      )}
    </div>
  );
}
