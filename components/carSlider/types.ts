export type CarSliderItem = {
  id: string;
  href?: string;
  imageUrl?: string | null;
  make?: string | null;
  modelName?: string | null;
  location: string;
  model: string;
  price: string;
  tag1?: string;
  tag2?: string;
};

export type CarSliderProps = {
  items: CarSliderItem[];
  title?: string;
  showBadge?: boolean;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
