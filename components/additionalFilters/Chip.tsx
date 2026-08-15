import type { ReactNode } from 'react';
import type { YesNoFilter } from '@/lib/additionalFilters';
import styles from '../AdditionalFiltersModal.module.css';

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className={`${styles.chip} ${active ? styles.chipActive : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

export function YesNoGroup({
  label,
  value,
  onChange,
  yesLabel,
  noLabel,
}: {
  label: string;
  value: YesNoFilter;
  onChange: (value: YesNoFilter) => void;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.chipGroup}>
        <Chip active={value === 'yes'} onClick={() => onChange(value === 'yes' ? '' : 'yes')}>
          {yesLabel}
        </Chip>
        <Chip active={value === 'no'} onClick={() => onChange(value === 'no' ? '' : 'no')}>
          {noLabel}
        </Chip>
      </div>
    </div>
  );
}

export function ColorLabel({ hex, children }: { hex?: string | null; children: ReactNode }) {
  return (
    <span className={styles.colorChip}>
      {hex && <span className={styles.colorSwatch} style={{ backgroundColor: hex }} />}
      {children}
    </span>
  );
}

export function ExpandableChips({
  hasExtra,
  show,
  onToggle,
  moreLabel,
  lessLabel,
  children,
}: {
  hasExtra: boolean;
  show: boolean;
  onToggle: () => void;
  moreLabel: string;
  lessLabel: string;
  children: ReactNode;
}) {
  if (!hasExtra) return null;
  return (
    <>
      {show && children}
      <button type="button" className={styles.expandButton} onClick={onToggle}>
        {show ? lessLabel : moreLabel}
      </button>
    </>
  );
}

export function ToggleRow({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={styles.toggleRow}>
      <span>{label}</span>
      <button
        type="button"
        className={`${styles.toggle} ${on ? styles.toggleOn : ''}`}
        onClick={onToggle}
        aria-pressed={on}>
        <span className={styles.toggleKnob} />
      </button>
    </div>
  );
}
