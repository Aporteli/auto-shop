import styles from '../CustomsCalculatorPage.module.css';

export function formatUsd(value: number) {
  return `$${value.toLocaleString('en-US')}`;
}

type CustomsResultProps = {
  total: number;
  rate: 'previous' | 'current';
  previousRateLabel: string;
  currentRateLabel: string;
  totalLabel: string;
  lines: Array<{ key: string; amount: number }>;
  lineLabel: Record<string, string>;
  onRateChange: (rate: 'previous' | 'current') => void;
};

export default function CustomsResult({
  total,
  rate,
  previousRateLabel,
  currentRateLabel,
  totalLabel,
  lines,
  lineLabel,
  onRateChange,
}: CustomsResultProps) {
  return (
    <aside className={styles.result}>
      <div className={styles.rateTabs}>
        <button
          type="button"
          className={`${styles.rateTab} ${rate === 'previous' ? styles.rateTabActive : ''}`}
          onClick={() => onRateChange('previous')}>
          {previousRateLabel}
        </button>
        <button
          type="button"
          className={`${styles.rateTab} ${rate === 'current' ? styles.rateTabActive : ''}`}
          onClick={() => onRateChange('current')}>
          {currentRateLabel}
        </button>
      </div>

      <p className={styles.totalLabel}>{totalLabel}</p>
      <p className={styles.total}>{formatUsd(total)}</p>

      <ul className={styles.lines}>
        {lines.map((line) => (
          <li key={line.key}>
            <span>{lineLabel[line.key]}</span>
            <span>{formatUsd(line.amount)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
