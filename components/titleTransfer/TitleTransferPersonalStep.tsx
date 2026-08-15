'use client';

import styles from '../TitleTransferPage.module.css';
import { CAR_FEE, MOTORCYCLE_FEE, RESERVATION_FEE, formatUsd, type FormState } from './constants';
import { BikeIcon, CarIcon } from './icons';

type TitleTransferPersonalStepProps = {
  form: FormState;
  vehicleQuestion: string;
  carLabel: string;
  motorcycleLabel: string;
  payOnSite: string;
  fullNamePlaceholder: string;
  personalIdPlaceholder: string;
  contactPlaceholder: string;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

export default function TitleTransferPersonalStep({
  form,
  vehicleQuestion,
  carLabel,
  motorcycleLabel,
  payOnSite,
  fullNamePlaceholder,
  personalIdPlaceholder,
  contactPlaceholder,
  setField,
}: TitleTransferPersonalStepProps) {
  return (
    <>
      <p className={styles.question}>{vehicleQuestion}</p>
      <div className={styles.vehicles}>
        <button
          type="button"
          className={`${styles.vehicle} ${form.vehicle === 'car' ? styles.vehicleActive : ''}`}
          onClick={() => setField('vehicle', 'car')}>
          <CarIcon />
          <span>{carLabel}</span>
          <strong>{formatUsd(CAR_FEE)}</strong>
        </button>
        <button
          type="button"
          className={`${styles.vehicle} ${form.vehicle === 'motorcycle' ? styles.vehicleActive : ''}`}
          onClick={() => setField('vehicle', 'motorcycle')}>
          <BikeIcon />
          <span>{motorcycleLabel}</span>
          <strong>{formatUsd(MOTORCYCLE_FEE)}</strong>
        </button>
      </div>
      <p className={styles.note}>
        {payOnSite} <strong>{formatUsd(RESERVATION_FEE)}</strong>
      </p>
      <div className={styles.fields}>
        <input
          className={styles.input}
          value={form.fullName}
          onChange={(event) => setField('fullName', event.target.value)}
          placeholder={fullNamePlaceholder}
        />
        <input
          className={styles.input}
          value={form.personalId}
          onChange={(event) => setField('personalId', event.target.value)}
          placeholder={personalIdPlaceholder}
        />
        <input
          className={styles.input}
          value={form.phone}
          onChange={(event) => setField('phone', event.target.value)}
          placeholder={contactPlaceholder}
        />
      </div>
    </>
  );
}
