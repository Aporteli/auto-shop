export type CategoryBodyTypeOption = {
  /** Display / DB English name */
  nameEn: string;
  nameRu: string;
  /** Alternate English names already in DB that should map to this option */
  aliases?: string[];
};

/** Body-type chips shown in the Category filter, keyed by vehicle category slug. */
export const CATEGORY_BODY_TYPES: Record<string, CategoryBodyTypeOption[]> = {
  cars: [
    { nameEn: 'Sedan', nameRu: 'Седан' },
    { nameEn: 'Jeep', nameRu: 'Джип', aliases: ['SUV'] },
    { nameEn: 'Coupe', nameRu: 'Купе' },
    { nameEn: 'Hatchback', nameRu: 'Хэтчбек' },
    { nameEn: 'Universal', nameRu: 'Универсал', aliases: ['Wagon'] },
    { nameEn: 'Cabriolet', nameRu: 'Кабриолет', aliases: ['Convertible'] },
    { nameEn: 'Pickup', nameRu: 'Пикап' },
    { nameEn: 'Minivan', nameRu: 'Минивэн', aliases: ['Van', 'MPV'] },
    { nameEn: 'Limousine', nameRu: 'Лимузин' },
    { nameEn: 'Crossover', nameRu: 'Кроссовер' },
  ],
  'custom-vehicles': [
    { nameEn: 'Semi-trailer truck', nameRu: 'Седельный тягач', aliases: ['Tractor Unit'] },
    { nameEn: 'Truck', nameRu: 'Грузовик', aliases: ['Box Truck'] },
    { nameEn: 'Dump truck', nameRu: 'Самосвал', aliases: ['Dump Truck'] },
    { nameEn: 'Agricultural', nameRu: 'Сельхозтехника' },
    { nameEn: 'Cranes', nameRu: 'Краны' },
    { nameEn: 'Excavators', nameRu: 'Экскаваторы' },
    { nameEn: 'Custom machinery', nameRu: 'Спецтехника' },
    { nameEn: 'Trailer', nameRu: 'Прицеп' },
    { nameEn: 'Loader', nameRu: 'Погрузчик' },
    { nameEn: 'Concrete pump truck', nameRu: 'Бетононасос' },
    { nameEn: 'Road', nameRu: 'Дорожная техника' },
    { nameEn: 'Warehouse truck', nameRu: 'Складской погрузчик' },
  ],
  motorcycles: [
    { nameEn: 'Motorcycle', nameRu: 'Мотоцикл' },
    { nameEn: 'Scooter', nameRu: 'Скутер' },
    { nameEn: 'Quad bike', nameRu: 'Квадроцикл' },
    { nameEn: 'Water transport', nameRu: 'Водный транспорт' },
    { nameEn: 'Tricycle', nameRu: 'Трицикл' },
    { nameEn: 'Buggy', nameRu: 'Багги' },
    { nameEn: 'Snowmobile', nameRu: 'Снегоход' },
    { nameEn: 'Trailer for boat', nameRu: 'Прицеп для лодки' },
    { nameEn: 'Trailer for motorcycle', nameRu: 'Прицеп для мотоцикла' },
    { nameEn: 'Karting-car', nameRu: 'Карт' },
  ],
};

export type ResolvedCategoryBodyType = {
  key: string;
  nameEn: string;
  nameRu: string;
  /** Matched DB body type ids (aliases may resolve to multiple) */
  ids: number[];
};

export function resolveCategoryBodyTypes(
  categorySlug: string | undefined,
  bodyTypes: Array<{ id: number; nameEn: string; nameRu: string }>,
): ResolvedCategoryBodyType[] {
  if (!categorySlug) return [];
  const defs = CATEGORY_BODY_TYPES[categorySlug] ?? [];
  const byName = new Map(bodyTypes.map((b) => [b.nameEn.toLowerCase(), b]));

  return defs.map((def) => {
    const names = [def.nameEn, ...(def.aliases ?? [])];
    const ids = names
      .map((name) => byName.get(name.toLowerCase())?.id)
      .filter((id): id is number => typeof id === 'number');

    const uniqueIds = [...new Set(ids)];
    return {
      key: def.nameEn,
      nameEn: def.nameEn,
      nameRu: def.nameRu,
      ids: uniqueIds,
    };
  });
}
