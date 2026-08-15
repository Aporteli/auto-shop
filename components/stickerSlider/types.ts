export type StickerIconName = 'alert' | 'sparkle' | 'car' | 'history' | 'usa' | 'center' | 'eco';

export type StickerCount = {
  id: number;
  nameEn: string;
  nameRu: string;
  color: string;
  icon: string;
  count: number;
};

export type StickerItem = {
  id: number;
  label: string;
  count: string;
  color: string;
  icon: StickerIconName;
  href: string;
};

export type StickerSliderProps = {
  stickers: StickerCount[];
};

export const KNOWN_ICONS: StickerIconName[] = ['alert', 'sparkle', 'car', 'history', 'usa', 'center', 'eco'];

export function mapStickerIcon(icon: string): StickerIconName {
  if (KNOWN_ICONS.includes(icon as StickerIconName)) {
    return icon as StickerIconName;
  }
  return 'sparkle';
}
