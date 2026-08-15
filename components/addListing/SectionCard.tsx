import styles from '../AddListingForm.module.css';

export default function SectionCard({
  id,
  title,
  icon,
  progress,
  total,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  progress: number;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const done = progress >= total && total > 0;
  return (
    <section className={styles.sectionCard} id={id}>
      <button type="button" className={styles.sectionHeader} onClick={onToggle}>
        <span className={styles.sectionHeaderLeft}>
          {icon}
          {title}
        </span>
        <span className={styles.sectionHeaderRight}>
          Information {progress} / {total}
          <span className={`${styles.progressRing} ${done ? styles.progressRingDone : ''}`} />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
            />
          </svg>
        </span>
      </button>
      {isOpen ? <div className={styles.sectionBody}>{children}</div> : null}
    </section>
  );
}
