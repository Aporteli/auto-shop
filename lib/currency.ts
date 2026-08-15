export type DisplayCurrency = 'USD' | 'EUR';

export const DISPLAY_CURRENCIES: DisplayCurrency[] = ['USD', 'EUR'];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GEL: '₾',
};

// Static rates against USD until an exchange-rate feed is wired up.
const RATES_PER_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GEL: 2.7,
};

export function currencySymbol(currency: string) {
  return CURRENCY_SYMBOLS[currency] ?? CURRENCY_SYMBOLS.USD;
}

export function convertAmount(amount: number, from: string, to: string) {
  const fromRate = RATES_PER_USD[from] ?? 1;
  const toRate = RATES_PER_USD[to] ?? 1;
  return (amount / fromRate) * toRate;
}

export function isDisplayCurrency(value: string): value is DisplayCurrency {
  return (DISPLAY_CURRENCIES as string[]).includes(value);
}
