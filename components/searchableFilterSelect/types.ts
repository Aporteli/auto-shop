export type SearchableFilterOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  variant?: 'select';
  title: string;
  value: string;
  options: SearchableFilterOption[];
  onChange: (value: string) => void;
  emptyLabel?: string;
  disabled?: boolean;
};

export type RangeProps = {
  variant: 'range';
  title: string;
  from: string;
  to: string;
  onRangeChange: (from: string, to: string) => void;
  fromLabel: string;
  toLabel: string;
  clearLabel?: string;
  applyLabel?: string;
};

export type SearchableFilterSelectProps = SelectProps | RangeProps;

export function sanitizeNumberInput(value: string) {
  return value.replace(/[^\d.]/g, '');
}

export function formatRangeSummary(from: string, to: string, fromLabel: string, toLabel: string) {
  if (from && to) return `${from} - ${to}`;
  if (from) return `${fromLabel} ${from}`;
  if (to) return `${toLabel} ${to}`;
  return '';
}
