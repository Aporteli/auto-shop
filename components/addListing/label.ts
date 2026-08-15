import type { FilterOption } from './types';

export function label(option: FilterOption, language: string) {
  return language === 'ru' ? option.nameRu : option.nameEn;
}
