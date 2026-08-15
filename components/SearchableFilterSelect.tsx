'use client';

import SearchableFilterRangeSelect from './searchableFilterSelect/SearchableFilterRangeSelect';
import SearchableFilterSingleSelect from './searchableFilterSelect/SearchableFilterSingleSelect';
import type { SearchableFilterSelectProps } from './searchableFilterSelect/types';

export type { SearchableFilterOption } from './searchableFilterSelect/types';

export default function SearchableFilterSelect(props: SearchableFilterSelectProps) {
  if (props.variant === 'range') {
    return <SearchableFilterRangeSelect {...props} />;
  }
  return <SearchableFilterSingleSelect {...props} />;
}
