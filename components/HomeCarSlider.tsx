'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import CarSlider from '@/components/CarSlider';
import { mapListingsToSliderItems, type ListingForSlider } from '@/lib/listingSlider';

type HomeCarSliderProps = {
  variant: 'superVip' | 'vipPlus';
  listings: ListingForSlider[];
};

export default function HomeCarSlider({ variant, listings }: HomeCarSliderProps) {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();

  const items = useMemo(
    () => mapListingsToSliderItems(listings, language, t.searchResults.unknownLocation, formatPrice),
    [listings, language, t.searchResults.unknownLocation, formatPrice],
  );

  const title = variant === 'superVip' ? t.homeSliders.superVip : t.homeSliders.vipPlus;

  return <CarSlider title={title} showBadge items={items} />;
}
