import type { CarSliderItem } from '@/components/CarSlider';
import { labelFor } from '@/lib/listingDetail';

export type SliderPriceFormatter = (
  price: unknown,
  currency: string,
  priceNegotiable: boolean,
) => string;

export type ListingForSlider = {
  id: number;
  year: number;
  price: { toString(): string } | number | string;
  currency: string;
  priceNegotiable: boolean;
  model: {
    nameEn: string;
    nameRu: string;
    manufacturer: { nameEn: string; nameRu: string };
  };
  bodyType: { nameEn: string; nameRu: string } | null;
  fuelType: { nameEn: string; nameRu: string } | null;
  city: { nameEn: string; nameRu: string } | null;
  images: Array<{ url: string }>;
};

export function serializeListingsForSlider(
  listings: Array<
    ListingForSlider & {
      price: { toString(): string };
    }
  >,
): ListingForSlider[] {
  return listings.map((listing) => ({
    id: listing.id,
    year: listing.year,
    price: listing.price.toString(),
    currency: listing.currency,
    priceNegotiable: listing.priceNegotiable,
    model: listing.model,
    bodyType: listing.bodyType,
    fuelType: listing.fuelType,
    city: listing.city,
    images: listing.images,
  }));
}

export function mapListingToSliderItem(
  listing: ListingForSlider,
  language: string,
  unknownLocation: string,
  formatPrice: SliderPriceFormatter,
): CarSliderItem {
  return {
    id: String(listing.id),
    href: `/listings/${listing.id}`,
    imageUrl: listing.images[0]?.url ?? null,
    make: listing.model.manufacturer.nameEn,
    modelName: listing.model.nameEn,
    location: listing.city ? labelFor(language, listing.city) : unknownLocation,
    model: `${listing.year} - ${labelFor(language, listing.model.manufacturer)} ${labelFor(language, listing.model)}`,
    price: formatPrice(listing.price, listing.currency, listing.priceNegotiable),
    tag1: listing.bodyType ? labelFor(language, listing.bodyType) : undefined,
    tag2: listing.fuelType ? labelFor(language, listing.fuelType) : undefined,
  };
}

export function mapListingsToSliderItems(
  listings: ListingForSlider[],
  language: string,
  unknownLocation: string,
  formatPrice: SliderPriceFormatter,
): CarSliderItem[] {
  return listings.map((listing) =>
    mapListingToSliderItem(listing, language, unknownLocation, formatPrice),
  );
}
