'use client';

import styles from '../TitleTransferPage.module.css';
import { BOOKING_PHONE, formatUsd, RESERVATION_FEE, type Step } from './constants';

type TitleTransferSidebarProps = {
  step: Step;
  copy: {
    sideTitle: string;
    sideSubtitle: string;
    stepPersonal: string;
    stepTime: string;
    stepPay: string;
    orPhone: string;
    faq: string;
    faqHint: string;
    contact: string;
    contactHint: string;
  };
};

export default function TitleTransferSidebar({ step, copy }: TitleTransferSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sideTop}>
        <span className={styles.badgeIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h8M8 11h5M7 3h10a2 2 0 012 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z" />
          </svg>
        </span>
        <h1 className={styles.sideTitle}>{copy.sideTitle}</h1>
        <p className={styles.sideSubtitle}>{copy.sideSubtitle.replace('{{fee}}', formatUsd(RESERVATION_FEE))}</p>

        <ol className={styles.steps}>
          {[copy.stepPersonal, copy.stepTime, copy.stepPay].map((label, index) => {
            const number = (index + 1) as Step;
            const active = step === number;
            const done = step > number;
            return (
              <li key={label} className={`${styles.step} ${active ? styles.stepActive : ''} ${done ? styles.stepDone : ''}`}>
                <span>{number}</span>
                {label}
              </li>
            );
          })}
        </ol>
      </div>

      <div className={styles.sideFooter}>
        <p className={styles.orPhone}>{copy.orPhone}</p>
        <a href="/help#faq" className={styles.sideLink}>
          <span className={styles.sideLinkIcon}>?</span>
          <span>
            <strong>{copy.faq}</strong>
            <small>{copy.faqHint}</small>
          </span>
        </a>
        <a href={`tel:${BOOKING_PHONE.replace(/\s+/g, '')}`} className={styles.sideLink}>
          <span className={styles.sideLinkIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h2.2a1 1 0 01.96.73l1.1 4a1 1 0 01-.5 1.15L7.2 10.2a12 12 0 006.6 6.6l1.32-1.56a1 1 0 011.15-.5l4 1.1a1 1 0 01.73.96V19a2 2 0 01-2 2h-.5C9.6 21 3 14.4 3 6.5V5z" />
            </svg>
          </span>
          <span>
            <strong>{copy.contact}</strong>
            <small>{copy.contactHint}</small>
          </span>
        </a>
      </div>
    </aside>
  );
}
