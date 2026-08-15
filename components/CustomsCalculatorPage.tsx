'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  calculateCustoms,
  type FuelKind,
  type RateKind,
  type RegistrationKind,
  type VehicleKind,
  type WheelSide,
} from '@/lib/customsCalculator';
import styles from './CustomsCalculatorPage.module.css';
import CustomsResult from './customsCalculator/CustomsResult';
import { BikeIcon, CarIcon, OptionGroup } from './customsCalculator/OptionGroup';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);
const ENGINE_VOLUMES = Array.from({ length: 60 }, (_, i) => ((i + 1) / 10).toFixed(1));

export default function CustomsCalculatorPage() {
  const { t } = useLanguage();
  const copy = t.customsCalculator;

  const [vehicle, setVehicle] = useState<VehicleKind>('car');
  const [fuel, setFuel] = useState<FuelKind>('petrol');
  const [wheel, setWheel] = useState<WheelSide>('left');
  const [registration, setRegistration] = useState<RegistrationKind>('single');
  const [issueYear, setIssueYear] = useState(String(CURRENT_YEAR));
  const [engineLiters, setEngineLiters] = useState('0.1');
  const [rate, setRate] = useState<RateKind>('current');

  const result = useMemo(
    () =>
      calculateCustoms({
        vehicle,
        fuel,
        registration,
        issueYear: Number(issueYear),
        engineLiters: Number(engineLiters),
        rate,
      }),
    [engineLiters, fuel, issueYear, rate, registration, vehicle],
  );

  const lineLabel: Record<(typeof result.lines)[number]['key'], string> = {
    excise: copy.excise,
    customsService: copy.customsService,
    registration: copy.registrationFee,
    importTax: copy.importTax,
    expert: copy.expert,
    declaration: copy.declaration,
    transit: copy.transit,
  };

  return (
    <div className={styles.page}>
      <div className={styles.tabs} role="tablist" aria-label={copy.vehicle}>
        <button
          type="button"
          role="tab"
          aria-selected={vehicle === 'car'}
          className={`${styles.tab} ${vehicle === 'car' ? styles.tabActive : ''}`}
          onClick={() => setVehicle('car')}>
          <CarIcon />
          {copy.cars}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={vehicle === 'motorcycle'}
          className={`${styles.tab} ${vehicle === 'motorcycle' ? styles.tabActive : ''}`}
          onClick={() => setVehicle('motorcycle')}>
          <BikeIcon />
          {copy.motorcycles}
        </button>
      </div>

      <div className={styles.layout}>
        <section className={styles.form}>
          <OptionGroup
            label={copy.carType}
            value={fuel}
            onChange={setFuel}
            options={[
              { id: 'petrol', label: copy.petrolDiesel },
              { id: 'electric', label: copy.electric },
              { id: 'hybrid', label: copy.hybrid },
            ]}
          />
          <OptionGroup
            label={copy.wheel}
            value={wheel}
            onChange={setWheel}
            options={[
              { id: 'left', label: copy.left },
              { id: 'right', label: copy.right },
            ]}
          />
          <OptionGroup
            label={copy.registration}
            value={registration}
            onChange={setRegistration}
            options={[
              { id: 'single', label: copy.single },
              { id: 'double', label: copy.double },
            ]}
          />

          <div className={styles.selects}>
            <label className={styles.field}>
              <span className={styles.label}>{copy.dateOfIssue}</span>
              <select className={styles.select} value={issueYear} onChange={(event) => setIssueYear(event.target.value)}>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>{copy.engineVolume}</span>
              <select
                className={styles.select}
                value={engineLiters}
                disabled={fuel === 'electric'}
                onChange={(event) => setEngineLiters(event.target.value)}>
                {ENGINE_VOLUMES.map((volume) => (
                  <option key={volume} value={volume}>
                    {volume}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className={styles.note}>
            {copy.howBody}{' '}
            <strong>
              {copy.formula}
            </strong>
          </p>
        </section>

        <CustomsResult
          total={result.total}
          rate={rate}
          previousRateLabel={copy.previousRate}
          currentRateLabel={copy.currentRate}
          totalLabel={copy.totalLabel}
          lines={result.lines}
          lineLabel={lineLabel}
          onRateChange={setRate}
        />
      </div>
    </div>
  );
}
