import styles from '../TitleTransferPage.module.css';

export function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 13l2.2-5.2A2 2 0 018.05 6.5h7.9a2 2 0 011.85 1.3L20 13M5 17h.01M19 17h.01M4 13h16v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z" />
    </svg>
  );
}

export function BikeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="6.5" cy="16.5" r="2.4" strokeWidth={1.7} />
      <circle cx="17.5" cy="16.5" r="2.4" strokeWidth={1.7} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M6.5 16.5L10 8h4l4 8.5M10 8l2 4h5" />
    </svg>
  );
}

export function CarArt() {
  return (
    <div className={styles.carArt} aria-hidden="true">
      <svg viewBox="0 0 640 220" fill="none">
        <path d="M80 168c40-58 92-88 168-96 70-8 150 8 220 46 42 22 78 52 108 82" fill="#3b82f6" opacity="0.18" />
        <path d="M120 168c28-52 78-82 148-88 82-8 148 18 210 70" fill="#2563eb" opacity="0.35" />
        <path d="M70 176h430c22 0 36 10 36 24H40c0-14 12-24 30-24Z" fill="#1d4ed8" />
        <circle cx="170" cy="196" r="22" fill="#0f172a" />
        <circle cx="170" cy="196" r="10" fill="#93c5fd" />
        <circle cx="430" cy="196" r="22" fill="#0f172a" />
        <circle cx="430" cy="196" r="10" fill="#93c5fd" />
        <path d="M188 112h150c36 0 62 14 86 36H214c-16 0-26-10-26-22v-14Z" fill="#60a5fa" />
      </svg>
    </div>
  );
}
