export type SearchHit = {
  id: number;
  year: number;
  price: string | number;
  currency: string;
  priceNegotiable: boolean;
  titleEn?: string | null;
  titleRu?: string | null;
  images: Array<{ url: string }>;
  model: {
    nameEn: string;
    nameRu: string;
    manufacturer: { nameEn: string; nameRu: string };
  };
  city: { nameEn: string; nameRu: string } | null;
};

export type HeaderSearchProps = {
  variant: 'desktop' | 'mobile';
  autoFocus?: boolean;
  onNavigate?: () => void;
};
