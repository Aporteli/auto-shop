'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import SearchableFilterSelect from './SearchableFilterSelect';

type PriceRangeFilterProps = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
};

export default function PriceRangeFilter({ from, to, onChange }: PriceRangeFilterProps) {
  const { t } = useLanguage();

  return (
    <SearchableFilterSelect
      variant="range"
      title={t.searchDashboard.filters.price}
      from={from}
      to={to}
      fromLabel={t.additionalFiltersModal.from}
      toLabel={t.additionalFiltersModal.to}
      clearLabel={t.searchDashboard.clearFilters}
      applyLabel={t.additionalFiltersModal.apply}
      onRangeChange={onChange}
    />
  );
}
