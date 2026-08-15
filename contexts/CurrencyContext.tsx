'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useLanguage } from './LanguageContext';
import {
  convertAmount,
  currencySymbol,
  isDisplayCurrency,
  type DisplayCurrency,
} from '@/lib/currency';

const STORAGE_KEY = 'autoshop-currency';
const DEFAULT_CURRENCY: DisplayCurrency = 'USD';

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function getSnapshot(): DisplayCurrency {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && isDisplayCurrency(stored) ? stored : DEFAULT_CURRENCY;
}

function getServerSnapshot(): DisplayCurrency {
  return DEFAULT_CURRENCY;
}

type CurrencyContextType = {
  currency: DisplayCurrency;
  setCurrency: (currency: DisplayCurrency) => void;
  symbol: string;
  convert: (amount: unknown, from?: string) => number;
  formatAmount: (amount: unknown, from?: string) => string;
  formatPrice: (amount: unknown, from: string, priceNegotiable?: boolean) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setCurrency = useCallback((next: DisplayCurrency) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo<CurrencyContextType>(() => {
    const locale = language === 'ru' ? 'ru-RU' : 'en-US';
    const symbol = currencySymbol(currency);

    const convert = (amount: unknown, from = 'USD') => {
      const numeric = Number(amount);
      if (!Number.isFinite(numeric)) return 0;
      return convertAmount(numeric, from, currency);
    };

    const formatAmount = (amount: unknown, from = 'USD') =>
      `${Math.round(convert(amount, from)).toLocaleString(locale)} ${symbol}`;

    const formatPrice = (amount: unknown, from: string, priceNegotiable = false) => {
      if (priceNegotiable) return language === 'ru' ? 'Цена договорная' : 'Price negotiable';
      return formatAmount(amount, from);
    };

    return { currency, setCurrency, symbol, convert, formatAmount, formatPrice };
  }, [currency, language, setCurrency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
