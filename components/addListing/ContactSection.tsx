import type { AddListingFieldsProps } from './types';
import { label } from './label';
import SectionCard from './SectionCard';
import styles from '../AddListingForm.module.css';

export default function ContactSection({
  al,
  language,
  form,
  update,
  filters,
  toggleSticker,
  progress,
  isOpen,
  onToggle,
  sectionRef,
}: AddListingFieldsProps & {
  toggleSticker: (id: number) => void;
  progress: number;
  isOpen: boolean;
  onToggle: () => void;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <SectionCard
      id="section-contact"
      title={al.steps.contact}
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      }
      progress={progress}
      total={2}
      isOpen={isOpen}
      onToggle={onToggle}>
      <div ref={sectionRef as React.RefObject<HTMLDivElement>}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>
              {al.fields.name} <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              value={form.contactName}
              onChange={(e) => update('contactName', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              {al.fields.phone} <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              value={form.contactPhone}
              onChange={(e) => update('contactPhone', e.target.value)}
            />
          </div>
        </div>
        <div className={styles.toggleRow}>
          <span>{al.fields.callTime}</span>
          <button
            type="button"
            className={`${styles.toggle} ${form.callTimeEnabled ? styles.toggleOn : ''}`}
            onClick={() => update('callTimeEnabled', !form.callTimeEnabled)}>
            <span className={styles.toggleThumb} />
          </button>
        </div>

        <div className={styles.promoSection}>
          <h3 className={styles.promoTitle}>{al.sellFaster}</h3>
          <div className={styles.promoGrid}>
            {(['superVip', 'vip', 'vipPlus'] as const).map((plan) => (
              <label
                key={plan}
                className={`${styles.promoCard} ${form.promoPlan === plan ? styles.promoCardActive : ''}`}>
                <input
                  type="radio"
                  name="promoPlan"
                  checked={form.promoPlan === plan}
                  onChange={() => update('promoPlan', plan)}
                />
                <div className={styles.promoName}>{al.promo[plan].name}</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#4b5563' }}>
                  {al.promo[plan].benefits.map((benefit: string) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <div className={styles.promoPrice}>{al.promo[plan].price}</div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <h3 className={styles.promoTitle}>{al.addServices}</h3>
          <div className={styles.serviceRow}>
            <span className={styles.serviceLeft}>
              <input
                type="checkbox"
                checked={form.addColourService}
                onChange={(e) => update('addColourService', e.target.checked)}
              />
              {al.services.addColour}
            </span>
            <span>0.30₾/Day</span>
          </div>
          <div className={styles.serviceRow}>
            <span className={styles.serviceLeft}>
              <input
                type="checkbox"
                checked={form.autoRenewal}
                onChange={(e) => update('autoRenewal', e.target.checked)}
              />
              {al.services.autoRenewal}
            </span>
            <span>0.30₾/Day</span>
          </div>
        </div>

        <div className={styles.stickersBox}>
          <strong>{al.stickers.title}</strong>
          <p className={styles.vinDesc}>{al.stickers.hint}</p>
          <div className={styles.stickerGrid}>
            {filters.stickers.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                className={`${styles.stickerBtn} ${
                  form.stickerIds.includes(sticker.id) ? styles.stickerBtnActive : ''
                }`}
                onClick={() => toggleSticker(sticker.id)}>
                {label(sticker, language)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
