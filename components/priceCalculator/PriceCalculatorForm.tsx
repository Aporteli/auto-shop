'use client';

import SearchableFilterSelect from '../SearchableFilterSelect';
import styles from '../PriceCalculatorPage.module.css';
import { ENGINE_VOLUMES, YEARS, type FilterOption, type FiltersResponse } from './constants';

type PriceCalculatorFormProps = {
  filterOptions: FiltersResponse | null;
  manufacturerId: string;
  modelId: string;
  year: string;
  categoryId: string;
  engine: string;
  driveTypeId: string;
  models: FilterOption[];
  isLoading: boolean;
  error: string;
  copy: {
    manufacturer: string;
    model: string;
    year: string;
    category: string;
    engine: string;
    driveWheels: string;
    calculating: string;
    calculate: string;
  };
  label: (item: { nameEn: string; nameRu: string }) => string;
  onManufacturerChange: (next: string) => void;
  onModelChange: (next: string) => void;
  onYearChange: (next: string) => void;
  onCategoryChange: (next: string) => void;
  onEngineChange: (next: string) => void;
  onDriveTypeChange: (next: string) => void;
  onCalculate: () => void;
};

export default function PriceCalculatorForm({
  filterOptions,
  manufacturerId,
  modelId,
  year,
  categoryId,
  engine,
  driveTypeId,
  models,
  isLoading,
  error,
  copy,
  label,
  onManufacturerChange,
  onModelChange,
  onYearChange,
  onCategoryChange,
  onEngineChange,
  onDriveTypeChange,
  onCalculate,
}: PriceCalculatorFormProps) {
  return (
    <>
      <div className={styles.grid}>
        <SearchableFilterSelect
          title={copy.manufacturer}
          value={manufacturerId}
          options={(filterOptions?.manufacturers ?? []).map((item) => ({
            value: String(item.id),
            label: label(item),
          }))}
          onChange={onManufacturerChange}
        />
        <SearchableFilterSelect
          title={copy.model}
          value={modelId}
          options={models.map((item) => ({ value: String(item.id), label: label(item) }))}
          onChange={onModelChange}
          disabled={!manufacturerId}
        />
        <SearchableFilterSelect
          title={copy.year}
          value={year}
          options={YEARS.map((item) => ({ value: String(item), label: String(item) }))}
          onChange={onYearChange}
        />
        <SearchableFilterSelect
          title={copy.category}
          value={categoryId}
          options={(filterOptions?.categories ?? []).map((item) => ({
            value: String(item.id),
            label: label(item),
          }))}
          onChange={onCategoryChange}
        />
        <SearchableFilterSelect
          title={copy.engine}
          value={engine}
          options={ENGINE_VOLUMES.map((item) => ({ value: item, label: item }))}
          onChange={onEngineChange}
        />
        <SearchableFilterSelect
          title={copy.driveWheels}
          value={driveTypeId}
          options={(filterOptions?.driveTypes ?? []).map((item) => ({
            value: String(item.id),
            label: label(item),
          }))}
          onChange={onDriveTypeChange}
        />
      </div>

      <button type="button" className={styles.calculate} onClick={onCalculate} disabled={isLoading}>
        {isLoading ? copy.calculating : copy.calculate}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </>
  );
}
