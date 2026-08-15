export const INTERIOR_MATERIAL_KEYS = [
  'fabric',
  'leather',
  'artificialLeather',
  'combined',
  'alcantara',
] as const;

export const INTERIOR_COLOR_KEYS = [
  'black',
  'white',
  'grey',
  'brown',
  'beige',
  'red',
  'blue',
  'yellow',
  'orange',
  'burgundy',
  'golden',
] as const;

const MATERIAL_EN: Record<string, string> = {
  fabric: 'Fabric',
  leather: 'Leather',
  artificialLeather: 'Artificial leather',
  combined: 'Combined',
  alcantara: 'Alcantara',
};

const MATERIAL_RU: Record<string, string> = {
  fabric: 'Ткань',
  leather: 'Кожа',
  artificialLeather: 'Искусственная кожа',
  combined: 'Комбинированный',
  alcantara: 'Алькантара',
};

const COLOR_EN: Record<string, string> = {
  black: 'Black',
  white: 'White',
  grey: 'Grey',
  brown: 'Brown',
  beige: 'Beige',
  red: 'Red',
  blue: 'Blue',
  yellow: 'Yellow',
  orange: 'Orange',
  burgundy: 'Burgundy',
  golden: 'Golden',
};

const COLOR_RU: Record<string, string> = {
  black: 'Чёрный',
  white: 'Белый',
  grey: 'Серый',
  brown: 'Коричневый',
  beige: 'Бежевый',
  red: 'Красный',
  blue: 'Синий',
  yellow: 'Жёлтый',
  orange: 'Оранжевый',
  burgundy: 'Бордовый',
  golden: 'Золотой',
};

export function interiorMaterialLabel(key: string, language: string) {
  return language === 'ru' ? MATERIAL_RU[key] ?? key : MATERIAL_EN[key] ?? key;
}

export function interiorColorLabel(key: string, language: string) {
  return language === 'ru' ? COLOR_RU[key] ?? key : COLOR_EN[key] ?? key;
}
