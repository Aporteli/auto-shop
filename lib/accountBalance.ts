export const ACCOUNT_BALANCE_KEY = 'autoshop-balance';
export const LISTING_LIMIT = 2;

export function readAccountBalance() {
  if (typeof window === 'undefined') return 0;
  return Number(window.localStorage.getItem(ACCOUNT_BALANCE_KEY) ?? 0) || 0;
}

export function writeAccountBalance(value: number) {
  window.localStorage.setItem(ACCOUNT_BALANCE_KEY, String(value));
}
