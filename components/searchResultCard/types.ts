export type SearchResultListing = {
  id: number;
  year: number;
  price: string | number;
  currency: string;
  priceNegotiable: boolean;
  mileage: number | null;
  mileageUnit: string | null;
  engineVolume: string | number | null;
  steeringWheel: 'LEFT' | 'RIGHT' | string;
  customsCleared: boolean;
  isVip: boolean;
  views: number;
  createdAt: string;
  titleEn?: string | null;
  titleRu?: string | null;
  images: Array<{ url: string }>;
  model: { nameEn: string; nameRu: string; manufacturer: { nameEn: string; nameRu: string } };
  city: { nameEn: string; nameRu: string } | null;
  fuelType: { nameEn: string; nameRu: string } | null;
  transmission: { nameEn: string; nameRu: string } | null;
};

export type SearchResultCardProps = {
  listing: SearchResultListing;
};
