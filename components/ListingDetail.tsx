'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import CarSlider, { type CarSliderItem } from '@/components/CarSlider';
import {
  formatDriveType,
  formatEngineVolume,
  formatMileage,
  labelFor,
} from '@/lib/listingDetail';
import ListingGallery from './listingDetail/ListingGallery';
import ListingOfferCard from './listingDetail/ListingOfferCard';
import ListingSpecsContent from './listingDetail/ListingSpecsContent';
import type { ListingResponse } from './listingDetail/types';
import styles from './ListingDetail.module.css';

type ListingDetailProps = {
  listingId: number;
};

export default function ListingDetail({ listingId }: ListingDetailProps) {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [data, setData] = useState<ListingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    fetch(`/api/listings/${listingId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((json: ListingResponse) => {
        setData(json);
        setActiveImage(0);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [listingId]);

  const similarItems = useMemo((): CarSliderItem[] => {
    if (!data) return [];
    return data.similar.map((item) => ({
      id: String(item.id),
      href: `/listings/${item.id}`,
      imageUrl: item.images[0]?.url ?? null,
      make: item.model.manufacturer.nameEn,
      modelName: item.model.nameEn,
      location: item.city ? labelFor(language, item.city) : t.listingDetail.unknownLocation,
      model: `${item.year} - ${labelFor(language, item.model.manufacturer)} ${labelFor(language, item.model)}`,
      price: formatPrice(item.price, item.currency, item.priceNegotiable),
      tag1: item.bodyType ? labelFor(language, item.bodyType) : undefined,
      tag2: item.fuelType ? labelFor(language, item.fuelType) : undefined,
    }));
  }, [data, language, t.listingDetail.unknownLocation, formatPrice]);

  const images = useMemo(() => {
    if (!data) return [];
    if (data.listing.images.length > 0) return data.listing.images;
    return [{ url: '', position: 0 }];
  }, [data]);

  if (isLoading) {
    return <div className={styles.loading}>{t.listingDetail.loading}</div>;
  }

  if (error || !data) {
    return <div className={styles.error}>{t.listingDetail.notFound}</div>;
  }

  const { listing } = data;
  const d = t.listingDetail;
  const title =
    language === 'ru'
      ? listing.titleRu ?? `${listing.year} ${listing.model.manufacturer.nameRu} ${listing.model.nameRu}`
      : listing.titleEn ?? `${listing.year} ${listing.model.manufacturer.nameEn} ${listing.model.nameEn}`;
  const location = listing.city
    ? `${labelFor(language, listing.city)}, ${labelFor(language, listing.city.country)}`
    : d.unknownLocation;
  const sellerName = listing.user?.dealership
    ? language === 'ru'
      ? listing.user.dealership.companyNameRu || listing.user.dealership.companyName
      : listing.user.dealership.companyName
    : listing.user
      ? `${listing.user.firstName} ${listing.user.lastName}`.trim()
      : null;
  const sellerPhone = listing.user?.dealership?.phone || listing.user?.phone || null;

  const highlights = [
    { label: d.year, value: String(listing.year) },
    { label: d.mileage, value: formatMileage(listing.mileage, listing.mileageUnit) },
    { label: d.engineVolume, value: formatEngineVolume(listing.engineVolume, listing.isTurbo) },
    { label: d.fuelType, value: listing.fuelType ? labelFor(language, listing.fuelType) : '—' },
    { label: d.gearbox, value: listing.transmission ? labelFor(language, listing.transmission) : '—' },
    { label: d.driveWheels, value: formatDriveType(listing.driveType, language) },
  ];

  return (
    <div className={styles.page}>
      <Link href="/search" className={styles.backLink}>
        ← {d.backToSearch}
      </Link>

      <div className={styles.hero}>
        <ListingGallery
          images={images}
          activeImage={activeImage}
          onSelect={setActiveImage}
          make={listing.model.manufacturer.nameEn}
          model={listing.model.nameEn}
          alt={title}
          photosLabel={d.photos}
        />
        <ListingOfferCard
          listing={listing}
          language={language}
          d={d}
          priceLabel={formatPrice(listing.price, listing.currency, listing.priceNegotiable)}
          highlights={highlights}
          sellerName={sellerName}
          sellerPhone={sellerPhone}
          location={location}
        />
      </div>

      <ListingSpecsContent
        listing={listing}
        language={language}
        d={d}
        title={title}
        location={location}
        highlights={highlights}
      />

      {similarItems.length > 0 && (
        <div className={styles.similarSection}>
          <CarSlider items={similarItems} title={d.similarVehicles} />
        </div>
      )}
    </div>
  );
}
