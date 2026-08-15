import type enTranslations from '../../locales/en.json';
import {
  defaultAdditionalFilterFields,
  type AdditionalFilterFields,
} from '@/lib/additionalFilters';

export type ModalCopy = typeof enTranslations.additionalFiltersModal;

export type FilterOption = { id: number; nameEn: string; nameRu: string; hex?: string | null };

export type ApiFilters = {
  bodyTypes: FilterOption[];
  transmissions: FilterOption[];
  driveTypes: FilterOption[];
  colors: FilterOption[];
  features: FilterOption[];
  stickers: FilterOption[];
};

export type AdditionalModalState = {
  bodyTypeId: number | '';
  transmissionId: number | '';
  driveTypeId: number | '';
} & AdditionalFilterFields;

export type LabelFn = (item: { nameEn: string; nameRu: string }) => string;

export type IdListKey = 'featureIds' | 'colorIds' | 'stickerIds';

export type AdditionalFieldsProps = {
  m: ModalCopy;
  draft: AdditionalModalState;
  filters: ApiFilters | null;
  label: LabelFn;
  updateDraft: (patch: Partial<AdditionalModalState>) => void;
  toggleId: (key: IdListKey, id: number) => void;
};

export const defaultModalState = (): AdditionalModalState => ({
  bodyTypeId: '',
  transmissionId: '',
  driveTypeId: '',
  ...defaultAdditionalFilterFields(),
});
