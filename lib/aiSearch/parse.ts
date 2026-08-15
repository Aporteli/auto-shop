import { EMPTY_FILTERS, type ExtractedFilters } from './types';

function asString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function asStringList(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    const items = [...new Set(value.map(asString).filter((item): item is string => item != null))];
    return items.length > 0 ? items : null;
  }
  const single = asString(value);
  return single ? [single] : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asBool(value: unknown): boolean | null {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  return null;
}

function asEnum<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase();
  return (allowed as readonly string[]).includes(normalized) ? (normalized as T) : null;
}

export function parseExtractedFilters(rawText: string | undefined): ExtractedFilters {
  if (!rawText) return { ...EMPTY_FILTERS };

  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;
    const currentYear = new Date().getFullYear();
    const minYear = asNumber(parsed.minYear);
    const maxYear = asNumber(parsed.maxYear);
    const bodyTypes =
      asStringList(parsed.bodyTypes) ?? asStringList(parsed.bodyType);

    return {
      manufacturer: asString(parsed.manufacturer),
      model: asString(parsed.model),
      color: asString(parsed.color),
      fuelType: asString(parsed.fuelType),
      transmission: asString(parsed.transmission),
      bodyTypes,
      city: asString(parsed.city),
      minPrice: asNumber(parsed.minPrice),
      maxPrice: asNumber(parsed.maxPrice),
      currency: asEnum(parsed.currency, ['USD', 'EUR', 'GEL'] as const),
      minYear: minYear != null && minYear >= 1950 && minYear <= currentYear + 1 ? Math.round(minYear) : null,
      maxYear: maxYear != null && maxYear >= 1950 && maxYear <= currentYear + 1 ? Math.round(maxYear) : null,
      engineFrom: asNumber(parsed.engineFrom),
      engineTo: asNumber(parsed.engineTo),
      engineVolume: asNumber(parsed.engineVolume),
      minMileage: asNumber(parsed.minMileage),
      maxMileage: asNumber(parsed.maxMileage),
      steeringWheel: asEnum(parsed.steeringWheel, ['LEFT', 'RIGHT'] as const),
      customsCleared: asBool(parsed.customsCleared),
      listingType: asEnum(parsed.listingType, ['SALE', 'RENT', 'AUCTION'] as const),
      intent: asString(parsed.intent),
    };
  } catch {
    return { ...EMPTY_FILTERS };
  }
}
