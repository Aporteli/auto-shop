import type { AddListingFormState } from '@/lib/addListing';
import { useLanguage } from '@/contexts/LanguageContext';

export type FilterOption = {
  id: number;
  nameEn: string;
  nameRu: string;
  hex?: string | null;
  slug?: string;
};

export type ManufacturerOption = FilterOption & {
  models: FilterOption[];
};

export type CountryOption = {
  id: number;
  nameEn: string;
  nameRu: string;
  cities: FilterOption[];
};

export type ApiFilters = {
  manufacturers: ManufacturerOption[];
  bodyTypes: FilterOption[];
  fuelTypes: FilterOption[];
  transmissions: FilterOption[];
  driveTypes: FilterOption[];
  colors: FilterOption[];
  categories: FilterOption[];
  countries: CountryOption[];
  features: FilterOption[];
  stickers: FilterOption[];
};

export type SectionKey = 'primary' | 'location' | 'media' | 'price' | 'contact';

export type AddListingCopy = ReturnType<typeof useLanguage>['t']['addListing'];

export type FormUpdate = <K extends keyof AddListingFormState>(
  key: K,
  value: AddListingFormState[K],
) => void;

export type AddListingFieldsProps = {
  al: AddListingCopy;
  language: string;
  form: AddListingFormState;
  update: FormUpdate;
  filters: ApiFilters;
};
