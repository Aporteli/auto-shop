'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './TitleTransferPage.module.css';
import {
  CAR_FEE,
  MOTORCYCLE_FEE,
  upcomingDates,
  type FormState,
  type Step,
} from './titleTransfer/constants';
import { CarArt } from './titleTransfer/icons';
import TitleTransferCard from './titleTransfer/TitleTransferCard';
import TitleTransferSidebar from './titleTransfer/TitleTransferSidebar';

export default function TitleTransferPage() {
  const { t, language } = useLanguage();
  const copy = t.titleTransfer;
  const [step, setStep] = useState<Step>(1);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>({
    vehicle: 'car',
    fullName: '',
    personalId: '',
    phone: '',
    date: '',
    time: '',
  });

  const dates = useMemo(() => upcomingDates(language), [language]);
  const transferFee = form.vehicle === 'car' ? CAR_FEE : MOTORCYCLE_FEE;
  const dateLabel = dates.find((item) => item.value === form.date)?.label ?? form.date;

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const goNext = () => {
    if (step === 1) {
      if (!form.fullName.trim() || !form.personalId.trim() || !form.phone.trim()) {
        setError(copy.required);
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!form.date || !form.time) {
        setError(copy.pickTime);
        return;
      }
      setStep(3);
    }
  };

  return (
    <div className={styles.shell}>
      <TitleTransferSidebar step={step} copy={copy} />

      <section className={styles.main}>
        <header className={styles.header}>
          <h2>{step === 1 ? copy.personalTitle : step === 2 ? copy.timeTitle : copy.payTitle}</h2>
          <p>
            {step === 1 ? copy.personalSubtitle : step === 2 ? copy.timeSubtitle : copy.paySubtitle}
          </p>
        </header>

        <TitleTransferCard
          step={step}
          paid={paid}
          error={error}
          form={form}
          dates={dates}
          dateLabel={dateLabel}
          transferFee={transferFee}
          copy={copy}
          setField={setField}
          goNext={goNext}
          onBack={() => setStep((step - 1) as Step)}
          onPay={() => setPaid(true)}
        />

        <CarArt />
      </section>
    </div>
  );
}
