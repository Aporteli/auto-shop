import type { AddListingCopy, FormUpdate } from './types';
import type { AddListingFormState } from '@/lib/addListing';
import styles from '../AddListingForm.module.css';

export default function AddListingVinCard({
  al,
  vin,
  update,
}: {
  al: AddListingCopy;
  vin: string;
  update: FormUpdate;
}) {
  return (
    <div className={styles.vinCard}>
      <div className={styles.vinHeader}>
        <span className={styles.vinTitle}>{al.vin.title}</span>
        <span className={styles.vinBadge}>{al.vin.new}</span>
      </div>
      <p className={styles.vinDesc}>{al.vin.description}</p>
      <div className={styles.vinRow}>
        <div className={styles.vinInputWrap}>
          <input
            className={styles.vinInput}
            placeholder={al.vin.placeholder}
            value={vin}
            onChange={(e) => update('vin', e.target.value.toUpperCase() as AddListingFormState['vin'])}
            maxLength={17}
          />
        </div>
        <button type="button" className={styles.vinAddBtn}>
          {al.vin.add}
        </button>
      </div>
      <p className={styles.vinHelp}>{al.vin.help}</p>
    </div>
  );
}
