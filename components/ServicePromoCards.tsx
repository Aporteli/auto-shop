'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './ServicePromoCards.module.css';

export default function ServicePromoCards() {
  const { t } = useLanguage();

  return (
    <section className={styles.section}>
      <article className={`${styles.card} ${styles.darkCard}`}>
        <div className={styles.content}>
          <h2 className={styles.title}>{t.servicePromo.vin.title}</h2>
          <p className={styles.description}>{t.servicePromo.vin.description}</p>
        </div>

        <div>
          <div className={styles.formRow}>
            <input
              type="text"
              className={styles.input}
              placeholder={t.servicePromo.vin.placeholder}
            />
            <button type="button" className={`${styles.button} ${styles.orangeButton}`}>
              {t.servicePromo.vin.button}
            </button>
          </div>

          <div className={styles.brands}>
            <span className={`${styles.brand} ${styles.brandGreen}`}>CLEARVIN</span>
            <span className={`${styles.brand} ${styles.brandMono}`}>CARFAX</span>
          </div>
        </div>
      </article>

      <article className={`${styles.card} ${styles.lightCard}`}>
        <div className={styles.content}>
          <h2 className={styles.title}>{t.servicePromo.inspection.title}</h2>
          <p className={styles.description}>{t.servicePromo.inspection.description}</p>
        </div>

        <div>
          <div className={styles.formRow}>
            <input
              type="text"
              className={styles.input}
              placeholder={t.servicePromo.inspection.placeholder}
            />
            <button type="button" className={`${styles.button} ${styles.darkButton}`}>
              {t.servicePromo.inspection.button}
            </button>
          </div>

          <img
            className={styles.carImage}
            src="https://picsum.photos/seed/autoshop-inspection-car/640/360"
            alt={t.servicePromo.inspection.imageAlt}
            draggable={false}
          />
        </div>
      </article>
    </section>
  );
}
