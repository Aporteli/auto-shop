import { Currency } from '@prisma/client';

const USD_PER_EUR = 1.08;
const USD_PER_GEL = 1 / 2.7;

export function listingPriceToUsd(price: number, currency: Currency) {
  if (currency === 'EUR') return price * USD_PER_EUR;
  if (currency === 'GEL') return price * USD_PER_GEL;
  return price;
}

export function percentile(sorted: number[], p: number) {
  if (sorted.length === 0) return 0;
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

export function summarizePrices(pricesUsd: number[]) {
  const sorted = [...pricesUsd].filter((value) => Number.isFinite(value) && value > 0).sort((a, b) => a - b);
  if (sorted.length === 0) {
    return null;
  }

  const q1 = percentile(sorted, 0.25);
  const median = percentile(sorted, 0.5);
  const q3 = percentile(sorted, 0.75);
  const iqr = Math.max(q3 - q1, 0);
  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;
  const cleaned = sorted.filter((value) => value >= lowFence && value <= highFence);
  const sample = cleaned.length >= 3 ? cleaned : sorted;

  return {
    count: sorted.length,
    estimate: Math.round(percentile(sample, 0.5)),
    rangeFrom: Math.round(percentile(sample, 0.25)),
    rangeTo: Math.round(percentile(sample, 0.75)),
    average: Math.round(sample.reduce((sum, value) => sum + value, 0) / sample.length),
    median: Math.round(median),
  };
}
