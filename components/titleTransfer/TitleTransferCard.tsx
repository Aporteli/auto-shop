'use client';

import styles from '../TitleTransferPage.module.css';
import {
  BOOKING_PHONE,
  RESERVATION_FEE,
  TIME_SLOTS,
  formatUsd,
  type FormState,
  type Step,
} from './constants';
import TitleTransferPersonalStep from './TitleTransferPersonalStep';

type TitleTransferCopy = {
  vehicleQuestion: string;
  car: string;
  motorcycle: string;
  payOnSite: string;
  fullName: string;
  personalId: string;
  contactNumber: string;
  pickDate: string;
  pickHour: string;
  successTitle: string;
  successBody: string;
  vehicleType: string;
  stepTime: string;
  transferFee: string;
  reservationNow: string;
  agreePrefix: string;
  privacyPolicy: string;
  back: string;
  continue: string;
  pay: string;
};

type TitleTransferCardProps = {
  step: Step;
  paid: boolean;
  error: string;
  form: FormState;
  dates: Array<{ value: string; label: string }>;
  dateLabel: string;
  transferFee: number;
  copy: TitleTransferCopy;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  goNext: () => void;
  onBack: () => void;
  onPay: () => void;
};

export default function TitleTransferCard({
  step,
  paid,
  error,
  form,
  dates,
  dateLabel,
  transferFee,
  copy,
  setField,
  goNext,
  onBack,
  onPay,
}: TitleTransferCardProps) {
  return (
    <div className={styles.card}>
      {step === 1 && (
        <TitleTransferPersonalStep
          form={form}
          vehicleQuestion={copy.vehicleQuestion}
          carLabel={copy.car}
          motorcycleLabel={copy.motorcycle}
          payOnSite={copy.payOnSite}
          fullNamePlaceholder={copy.fullName}
          personalIdPlaceholder={copy.personalId}
          contactPlaceholder={copy.contactNumber}
          setField={setField}
        />
      )}

      {step === 2 && (
        <>
          <p className={styles.question}>{copy.pickDate}</p>
          <div className={styles.slots}>
            {dates.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`${styles.slot} ${form.date === item.value ? styles.slotActive : ''}`}
                onClick={() => setField('date', item.value)}>
                {item.label}
              </button>
            ))}
          </div>
          <p className={styles.question}>{copy.pickHour}</p>
          <div className={styles.slots}>
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`${styles.slot} ${form.time === slot ? styles.slotActive : ''}`}
                onClick={() => setField('time', slot)}>
                {slot}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          {paid ? (
            <div className={styles.success}>
              <h3>{copy.successTitle}</h3>
              <p>{copy.successBody.replace('{{phone}}', BOOKING_PHONE)}</p>
            </div>
          ) : (
            <ul className={styles.summary}>
              <li>
                <span>{copy.vehicleType}</span>
                <strong>{form.vehicle === 'car' ? copy.car : copy.motorcycle}</strong>
              </li>
              <li>
                <span>{copy.fullName}</span>
                <strong>{form.fullName}</strong>
              </li>
              <li>
                <span>{copy.personalId}</span>
                <strong>{form.personalId}</strong>
              </li>
              <li>
                <span>{copy.contactNumber}</span>
                <strong>{form.phone}</strong>
              </li>
              <li>
                <span>{copy.stepTime}</span>
                <strong>
                  {dateLabel} · {form.time}
                </strong>
              </li>
              <li>
                <span>{copy.transferFee}</span>
                <strong>{formatUsd(transferFee)}</strong>
              </li>
              <li>
                <span>{copy.reservationNow}</span>
                <strong>{formatUsd(RESERVATION_FEE)}</strong>
              </li>
            </ul>
          )}
        </>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.cardFooter}>
        {step === 1 ? (
          <p className={styles.policy}>
            {copy.agreePrefix}{' '}
            <a href="#">{copy.privacyPolicy}</a>
          </p>
        ) : (
          <button type="button" className={styles.back} onClick={onBack}>
            {copy.back}
          </button>
        )}
        {step < 3 ? (
          <button type="button" className={styles.continue} onClick={goNext}>
            {copy.continue}
          </button>
        ) : (
          !paid && (
            <button type="button" className={styles.continue} onClick={onPay}>
              {copy.pay.replace('{{fee}}', formatUsd(RESERVATION_FEE))}
            </button>
          )
        )}
      </div>
    </div>
  );
}
