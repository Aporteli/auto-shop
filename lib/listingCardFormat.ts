export function formatRelativeTime(
  dateInput: string | Date,
  language: string,
  labels: { minutesAgo: string; hoursAgo: string; daysAgo: string; justNow: string },
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));

  if (minutes < 1) return labels.justNow;
  if (minutes < 60) {
    return language === 'ru'
      ? `${minutes} ${labels.minutesAgo}`
      : `${minutes} ${labels.minutesAgo}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return language === 'ru' ? `${hours} ${labels.hoursAgo}` : `${hours} ${labels.hoursAgo}`;
  }

  const days = Math.floor(hours / 24);
  return language === 'ru' ? `${days} ${labels.daysAgo}` : `${days} ${labels.daysAgo}`;
}

export function formatListingTitle(
  listing: {
    titleEn?: string | null;
    titleRu?: string | null;
    model: { nameEn: string; nameRu: string; manufacturer: { nameEn: string; nameRu: string } };
  },
  language: string,
): string {
  const customTitle = language === 'ru' ? listing.titleRu : listing.titleEn;
  if (customTitle?.trim()) return customTitle.trim();

  const manufacturer = language === 'ru' ? listing.model.manufacturer.nameRu : listing.model.manufacturer.nameEn;
  const model = language === 'ru' ? listing.model.nameRu : listing.model.nameEn;
  return `${manufacturer} ${model}`;
}

export function formatEngineSpec(
  engineVolume: string | number | null | undefined,
  fuelLabel: string | null,
  language: string,
): string {
  const parts: string[] = [];

  if (engineVolume != null && engineVolume !== '') {
    const numeric = Number(engineVolume);
    if (Number.isFinite(numeric)) {
      parts.push(
        numeric.toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US', {
          minimumFractionDigits: numeric % 1 === 0 ? 0 : 1,
          maximumFractionDigits: 1,
        }),
      );
    }
  }

  if (fuelLabel) parts.push(fuelLabel);
  return parts.join(' ') || '—';
}

export function formatMileage(
  mileage: number | null | undefined,
  unit: 'KM' | 'MI' | string | null | undefined,
  language: string,
  kmLabel: string,
  miLabel: string,
): string {
  if (mileage == null) return '—';
  const formatted = mileage.toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US');
  return `${formatted} ${unit === 'MI' ? miLabel : kmLabel}`;
}
