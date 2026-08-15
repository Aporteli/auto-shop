export type ListingFeature = {
  feature: { id: number; nameEn: string; nameRu: string; groupEn: string | null; groupRu: string | null };
};

export type SpecItem = { label: string; value: string };

export type ListingResponse = {
  listing: {
    id: number;
    year: number;
    price: string | number;
    currency: string;
    priceNegotiable: boolean;
    mileage: number | null;
    mileageUnit: string;
    engineVolume: string | number | null;
    enginePower: number | null;
    cylinders: number | null;
    doors: number | null;
    vin: string | null;
    views: number;
    exchange: boolean;
    techInspection: boolean;
    catalyst: boolean;
    thirdRowSeats: boolean;
    airbags: number | null;
    isTurbo: boolean;
    steeringWheel: string;
    interiorColorEn: string | null;
    interiorColorRu: string | null;
    interiorMaterialEn: string | null;
    interiorMaterialRu: string | null;
    descriptionEn: string | null;
    descriptionRu: string | null;
    titleEn: string | null;
    titleRu: string | null;
    model: { nameEn: string; nameRu: string; manufacturer: { nameEn: string; nameRu: string } };
    category: { nameEn: string; nameRu: string };
    bodyType: { nameEn: string; nameRu: string } | null;
    fuelType: { nameEn: string; nameRu: string } | null;
    transmission: { nameEn: string; nameRu: string } | null;
    driveType: { nameEn: string; nameRu: string } | null;
    color: { nameEn: string; nameRu: string; hex: string | null } | null;
    city: { nameEn: string; nameRu: string; country: { nameEn: string; nameRu: string } } | null;
    images: Array<{ url: string; position: number }>;
    features: ListingFeature[];
    stickers: Array<{ sticker: { nameEn: string; nameRu: string; color: string | null } }>;
    user?: {
      firstName: string;
      lastName: string;
      phone: string | null;
      dealership: {
        companyName: string;
        companyNameRu: string | null;
        phone: string | null;
        verified: boolean;
      } | null;
    };
  };
  similar: Array<{
    id: number;
    year: number;
    price: string | number;
    currency: string;
    priceNegotiable: boolean;
    model: { nameEn: string; nameRu: string; manufacturer: { nameEn: string; nameRu: string } };
    bodyType: { nameEn: string; nameRu: string } | null;
    fuelType: { nameEn: string; nameRu: string } | null;
    city: { nameEn: string; nameRu: string } | null;
    images: Array<{ url: string }>;
  }>;
};

export type Listing = ListingResponse['listing'];
