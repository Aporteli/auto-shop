export const SPECIFICATION_GROUPS = ['Comfort', 'Interior', 'Safety', 'Multimedia', 'Other'] as const;

export type BilingualLabel = { nameEn: string; nameRu: string };

export function labelFor(language: string, item: BilingualLabel) {
  return language === 'ru' ? item.nameRu : item.nameEn;
}

export function formatYesNo(value: boolean | null | undefined, language: string) {
  if (value == null) return '—';
  if (language === 'ru') return value ? 'Да' : 'Нет';
  return value ? 'Yes' : 'No';
}

export function formatDoors(doors: number | null | undefined, language: string) {
  if (doors == null) return '—';
  if (doors <= 3) return '2/3';
  if (doors <= 5) return '4/5';
  return language === 'ru' ? '>5' : '>5';
}

export function formatDriveType(
  driveType: BilingualLabel | null | undefined,
  language: string,
) {
  if (!driveType) return '—';
  const name = labelFor(language, driveType);
  if (name.toLowerCase().includes('all-wheel') || name === '4WD' || name.includes('Полный')) {
    return '4x4';
  }
  return name;
}

export function formatEngineVolume(volume: unknown, isTurbo: boolean) {
  if (volume == null || volume === '') return '—';
  const base = Number(volume).toFixed(1);
  return isTurbo ? `${base} turbo` : base;
}

export function formatMileage(mileage: number | null | undefined, unit: string) {
  if (mileage == null) return '—';
  const suffix = unit === 'MI' ? ' mi' : ' km';
  return `${mileage.toLocaleString()}${suffix}`;
}

export function formatPrice(
  price: unknown,
  currency: string,
  priceNegotiable: boolean,
  language: string,
) {
  if (priceNegotiable) {
    return language === 'ru' ? 'Цена договорная' : 'Price negotiable';
  }
  const amount = Number(price).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US');
  const symbol = currency === 'EUR' ? '€' : currency === 'GEL' ? '₾' : '$';
  return `${amount} ${symbol}`;
}

export const listingInclude = {
  model: { include: { manufacturer: true } },
  category: true,
  bodyType: true,
  fuelType: true,
  transmission: true,
  driveType: true,
  color: true,
  city: { include: { country: true } },
  images: { orderBy: { position: 'asc' as const } },
  features: { include: { feature: true } },
  stickers: { include: { sticker: true } },
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      dealership: {
        select: {
          companyName: true,
          companyNameRu: true,
          phone: true,
          verified: true,
        },
      },
    },
  },
};
