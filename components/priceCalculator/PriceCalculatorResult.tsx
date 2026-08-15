import Link from 'next/link';
import styles from '../PriceCalculatorPage.module.css';
import { formatUsd, type EstimateResponse } from './constants';

type PriceCalculatorResultProps = {
  result: EstimateResponse | null;
  similarHref: string;
  noResults: string;
  estimateLabel: string;
  rangeLabel: string;
  basedOn: string;
  matchLabel: string;
  viewSimilar: string;
};

export function PriceCalculatorResult({
  result,
  similarHref,
  noResults,
  estimateLabel,
  rangeLabel,
  basedOn,
  matchLabel,
  viewSimilar,
}: PriceCalculatorResultProps) {
  if (result && !result.estimate) {
    return <p className={styles.empty}>{noResults}</p>;
  }

  if (!result?.estimate) return null;

  return (
    <div className={styles.result}>
      <p className={styles.resultLabel}>{estimateLabel}</p>
      <p className={styles.resultPrice}>{formatUsd(result.estimate.estimate)}</p>
      <p className={styles.resultRange}>
        {rangeLabel}: {formatUsd(result.estimate.rangeFrom)} – {formatUsd(result.estimate.rangeTo)}
      </p>
      <p className={styles.resultMeta}>
        {basedOn.replace('{{count}}', String(result.sampleSize)).replace('{{match}}', matchLabel)}
      </p>
      <Link href={similarHref} className={styles.resultLink}>
        {viewSimilar}
      </Link>
    </div>
  );
}

export function PriceCalculatorVisual() {
  return (
    <div className={styles.visual} aria-hidden="true">
      <svg className={styles.car} viewBox="0 0 640 360" fill="none">
        <path
          d="M92 248c18-62 48-98 96-118 41-17 92-24 154-24 71 0 128 14 178 46 28 18 62 52 86 86"
          stroke="#d7dde6"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M78 248h478c18 0 32 12 32 28v12H46v-12c0-16 14-28 32-28Z"
          fill="#e8edf3"
        />
        <path
          d="M168 248c22-70 58-104 118-118 52-12 108-12 158 8 36 14 68 46 92 110"
          fill="#f4f6f8"
          stroke="#d0d7e1"
          strokeWidth="6"
        />
        <circle cx="168" cy="276" r="38" fill="#f8fafc" stroke="#c5ced8" strokeWidth="10" />
        <circle cx="168" cy="276" r="16" fill="#dbe2ea" />
        <circle cx="468" cy="276" r="38" fill="#f8fafc" stroke="#c5ced8" strokeWidth="10" />
        <circle cx="468" cy="276" r="16" fill="#dbe2ea" />
        <path d="M214 154h168c28 0 48 8 70 28H236c-14 0-22-8-22-18v-10Z" fill="#eef2f6" />
      </svg>
    </div>
  );
}
