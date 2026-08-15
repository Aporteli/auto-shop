export type AutoPartRecord = {
  id: number;
  slug: string;
  nameEn: string;
  nameRu: string;
  categorySlug: string;
  categoryEn: string;
  categoryRu: string;
  descriptionEn: string;
  descriptionRu: string;
  functionEn: string;
  functionRu: string;
  replacementEn: string;
  replacementRu: string;
};

export type AutoPartSort = 'name-asc' | 'name-desc' | 'category';

export function autoPartName(part: AutoPartRecord, language: string) {
  return language === 'ru' ? part.nameRu : part.nameEn;
}

export function autoPartCategory(part: AutoPartRecord, language: string) {
  return language === 'ru' ? part.categoryRu : part.categoryEn;
}

export function autoPartDescription(part: AutoPartRecord, language: string) {
  return language === 'ru' ? part.descriptionRu : part.descriptionEn;
}

export function autoPartFunction(part: AutoPartRecord, language: string) {
  return language === 'ru' ? part.functionRu : part.functionEn;
}

export function autoPartReplacement(part: AutoPartRecord, language: string) {
  return language === 'ru' ? part.replacementRu : part.replacementEn;
}

export function autoPartSearchText(part: AutoPartRecord) {
  return [
    part.nameEn,
    part.nameRu,
    part.categoryEn,
    part.categoryRu,
    part.descriptionEn,
    part.descriptionRu,
  ]
    .join(' ')
    .toLowerCase();
}
