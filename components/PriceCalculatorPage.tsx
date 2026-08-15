'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './PriceCalculatorPage.module.css';
import { type EstimateResponse, type FiltersResponse } from './priceCalculator/constants';
import PriceCalculatorForm from './priceCalculator/PriceCalculatorForm';
import { PriceCalculatorResult, PriceCalculatorVisual } from './priceCalculator/PriceCalculatorResult';

export default function PriceCalculatorPage() {
  const { t, language } = useLanguage();
  const copy = t.priceCalculator;

  const [filterOptions, setFilterOptions] = useState<FiltersResponse | null>(null);
  const [manufacturerId, setManufacturerId] = useState('');
  const [modelId, setModelId] = useState('');
  const [year, setYear] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [engine, setEngine] = useState('');
  const [driveTypeId, setDriveTypeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<EstimateResponse | null>(null);

  const label = (item: { nameEn: string; nameRu: string }) => (language === 'ru' ? item.nameRu : item.nameEn);

  useEffect(() => {
    fetch('/api/filters')
      .then((res) => res.json())
      .then((data: FiltersResponse) => setFilterOptions(data))
      .catch(() => setFilterOptions(null));
  }, []);

  const models = useMemo(() => {
    if (!manufacturerId) return [];
    const manufacturer = filterOptions?.manufacturers.find((item) => String(item.id) === manufacturerId);
    if (manufacturer?.models?.length) return manufacturer.models;
    return (filterOptions?.models ?? []).filter((item) => String(item.manufacturerId) === manufacturerId);
  }, [filterOptions, manufacturerId]);

  const canCalculate = Boolean(manufacturerId && modelId);

  const similarHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set('listingType', 'SALE');
    if (manufacturerId) params.set('manufacturerId', manufacturerId);
    if (modelId) params.set('modelId', modelId);
    if (categoryId) params.set('categoryId', categoryId);
    if (driveTypeId) params.set('driveTypeId', driveTypeId);
    if (year) {
      params.set('yearFrom', year);
      params.set('yearTo', year);
    }
    if (engine) {
      params.set('engineFrom', engine);
      params.set('engineTo', engine);
    }
    return `/search?${params.toString()}`;
  }, [categoryId, driveTypeId, engine, manufacturerId, modelId, year]);

  const calculate = async () => {
    if (!canCalculate) {
      setError(copy.required);
      return;
    }

    setIsLoading(true);
    setError('');

    const params = new URLSearchParams({ manufacturerId, modelId });
    if (year) params.set('year', year);
    if (categoryId) params.set('categoryId', categoryId);
    if (engine) params.set('engine', engine);
    if (driveTypeId) params.set('driveTypeId', driveTypeId);

    try {
      const response = await fetch(`/api/price-calculator?${params.toString()}`);
      const data = (await response.json()) as EstimateResponse & { error?: string };
      if (!response.ok) {
        setResult(null);
        setError(copy.failed);
        return;
      }
      setResult(data);
    } catch {
      setResult(null);
      setError(copy.failed);
    } finally {
      setIsLoading(false);
    }
  };

  const resetResult = () => setResult(null);

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.subtitle}>{copy.subtitle}</p>
        </header>

        <div className={styles.formRow}>
          <div className={styles.formCol}>
            <PriceCalculatorForm
              filterOptions={filterOptions}
              manufacturerId={manufacturerId}
              modelId={modelId}
              year={year}
              categoryId={categoryId}
              engine={engine}
              driveTypeId={driveTypeId}
              models={models}
              isLoading={isLoading}
              error={error}
              copy={copy}
              label={label}
              onManufacturerChange={(next) => {
                setManufacturerId(next);
                setModelId('');
                resetResult();
              }}
              onModelChange={(next) => {
                setModelId(next);
                resetResult();
              }}
              onYearChange={(next) => {
                setYear(next);
                resetResult();
              }}
              onCategoryChange={(next) => {
                setCategoryId(next);
                resetResult();
              }}
              onEngineChange={(next) => {
                setEngine(next);
                resetResult();
              }}
              onDriveTypeChange={(next) => {
                setDriveTypeId(next);
                resetResult();
              }}
              onCalculate={calculate}
            />

            <PriceCalculatorResult
              result={result}
              similarHref={similarHref}
              noResults={copy.noResults}
              estimateLabel={copy.estimateLabel}
              rangeLabel={copy.rangeLabel}
              basedOn={copy.basedOn}
              matchLabel={result ? copy.match[result.matchLevel] : ''}
              viewSimilar={copy.viewSimilar}
            />
          </div>

          <PriceCalculatorVisual />
        </div>

        <div className={styles.info}>
          <h2>{copy.howTitle}</h2>
          <p>{copy.howBody}</p>
        </div>
      </section>
    </div>
  );
}
