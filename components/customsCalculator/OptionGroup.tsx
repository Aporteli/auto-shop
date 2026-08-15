import styles from '../CustomsCalculatorPage.module.css';

export function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.field}>
      <p className={styles.label}>{label}</p>
      <div className={styles.toggles}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`${styles.toggle} ${value === option.id ? styles.toggleActive : ''}`}
            onClick={() => onChange(option.id)}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 13l2-5h14l2 5M5 17h.01M19 17h.01M4 13h16v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z" />
    </svg>
  );
}

export function BikeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="6.5" cy="16.5" r="2.5" strokeWidth={1.8} />
      <circle cx="17.5" cy="16.5" r="2.5" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6.5 16.5L10 8h4l4 8.5M10 8l2 4h5" />
    </svg>
  );
}
