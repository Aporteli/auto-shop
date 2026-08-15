'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { calculateCustoms } from '@/lib/customsCalculator';
import {
  formatEngineSpec,
  formatListingTitle,
  formatMileage,
  formatRelativeTime,
} from '@/lib/listingCardFormat';
import HiddenSearchResultCard from './searchResultCard/HiddenSearchResultCard';
import SearchResultCardBody from './searchResultCard/SearchResultCardBody';
import { resolveFuelKind } from './searchResultCard/SpecIcon';
import type { SearchResultCardProps } from './searchResultCard/types';

export type { SearchResultListing } from './searchResultCard/types';

export default function SearchResultCard({ listing }: SearchResultCardProps) {
  const { t, language } = useLanguage();
  const { symbol: currencySymbol, convert, formatAmount } = useCurrency();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  const label = (item: { nameEn: string; nameRu: string }) =>
    language === 'ru' ? item.nameRu : item.nameEn;

  const locale = language === 'ru' ? 'ru-RU' : 'en-US';
  const title = formatListingTitle(listing, language);
  const fuelLabel = listing.fuelType ? label(listing.fuelType) : null;
  const transmissionLabel = listing.transmission ? label(listing.transmission) : '—';
  const engineSpec = formatEngineSpec(listing.engineVolume, fuelLabel, language);
  const mileageSpec = formatMileage(
    listing.mileage,
    listing.mileageUnit,
    language,
    t.searchResults.km,
    t.searchResults.mi,
  );
  const steeringLabel =
    listing.steeringWheel === 'RIGHT' ? t.searchResults.steeringRight : t.searchResults.steeringLeft;

  const priceAmount = listing.priceNegotiable
    ? t.searchResults.priceNegotiable
    : formatAmount(listing.price, listing.currency);

  const compactPrice = priceAmount;

  const customsEstimate = useMemo(() => {
    if (listing.customsCleared) return null;
    const liters = Number(listing.engineVolume);
    const result = calculateCustoms({
      vehicle: 'car',
      fuel: resolveFuelKind(listing.fuelType),
      registration: 'single',
      issueYear: listing.year,
      engineLiters: Number.isFinite(liters) && liters > 0 ? liters : 2,
      rate: 'current',
    });
    return result.total;
  }, [listing.customsCleared, listing.engineVolume, listing.fuelType, listing.year]);

  const postedAgo = formatRelativeTime(listing.createdAt, language, {
    justNow: t.searchResults.justNow,
    minutesAgo: t.searchResults.minutesAgo,
    hoursAgo: t.searchResults.hoursAgo,
    daysAgo: t.searchResults.daysAgo,
  });

  const galleryCount = Math.max(1, Math.min(5, listing.images.length || 1));
  const galleryImages = useMemo(() => {
    if (listing.images.length > 0) return listing.images.slice(0, galleryCount);
    return [{ url: null as string | null }];
  }, [galleryCount, listing.images]);

  const currentImage = galleryImages[activeImageIndex] ?? galleryImages[0];

  const handleImageAreaLeave = () => {
    setActiveImageIndex(0);
  };

  if (isHidden) {
    return (
      <HiddenSearchResultCard
        title={title}
        year={listing.year}
        yearSuffix={t.searchResults.yearSuffix}
        customsEstimate={customsEstimate}
        customsFeeLabel={t.searchResults.customsFee}
        convertedCustoms={
          customsEstimate != null ? Math.round(convert(customsEstimate)).toLocaleString(locale) : ''
        }
        currencySymbol={currencySymbol}
        compactPrice={compactPrice}
        showListingLabel={t.searchResults.showListing}
        onShow={() => setIsHidden(false)}
      />
    );
  }

  return (
    <SearchResultCardBody
      listing={listing}
      title={title}
      yearSuffix={t.searchResults.yearSuffix}
      locationLabel={listing.city ? label(listing.city) : t.searchResults.unknownLocation}
      customsClearedLabel={t.searchDashboard.filters.customsCleared}
      beforeCustomsLabel={t.searchDashboard.filters.beforeCustoms}
      engineSpec={engineSpec}
      transmissionLabel={transmissionLabel}
      mileageSpec={mileageSpec}
      steeringLabel={steeringLabel}
      superVipBadge={t.searchResults.superVipBadge}
      postedAgo={postedAgo}
      viewsLabel={t.searchResults.views.replace('{{count}}', String(listing.views))}
      priceAmount={priceAmount}
      compareLabel={t.searchResults.compare}
      contactLabel={t.searchResults.contact}
      hideListingLabel={t.searchResults.hideListing}
      imageNumberTemplate={t.searchResults.imageNumber}
      galleryImages={galleryImages}
      activeImageIndex={activeImageIndex}
      currentImage={currentImage}
      onImageAreaLeave={handleImageAreaLeave}
      onImageIndexChange={setActiveImageIndex}
      onHide={() => setIsHidden(true)}
    />
  );
}
