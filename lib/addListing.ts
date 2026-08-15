export type AddListingFormState = {
  categoryId: number | '';
  listingType: 'SALE' | 'RENT';
  vin: string;
  manufacturerId: number | '';
  modelId: number | '';
  year: number | '';
  month: number | '';
  trim: string;
  fuelTypeId: number | '';
  bodyTypeId: number | '';
  cylinders: number | '';
  engineVolume: string;
  isTurbo: boolean;
  mileage: string;
  mileageUnit: 'KM' | 'MI';
  steeringWheel: 'LEFT' | 'RIGHT' | '';
  transmissionId: number | '';
  driveTypeId: number | '';
  airbags: number | '';
  colorId: number | '';
  interiorMaterial: string;
  interiorColor: string;
  featureIds: number[];
  descriptionEn: string;
  descriptionRu: string;
  cityId: number | '';
  customsCleared: boolean;
  techInspection: boolean;
  checkInspectionTime: boolean;
  imageUrls: string[];
  videoUrl: string;
  price: string;
  currency: 'USD' | 'EUR' | 'GEL';
  priceNegotiable: boolean;
  exchange: boolean;
  contactName: string;
  contactPhone: string;
  callTimeEnabled: boolean;
  promoPlan: '' | 'superVip' | 'vip' | 'vipPlus';
  addColourService: boolean;
  autoRenewal: boolean;
  stickerIds: number[];
};

export const defaultAddListingForm = (): AddListingFormState => ({
  categoryId: '',
  listingType: 'SALE',
  vin: '',
  manufacturerId: '',
  modelId: '',
  year: '',
  month: '',
  trim: '',
  fuelTypeId: '',
  bodyTypeId: '',
  cylinders: '',
  engineVolume: '',
  isTurbo: false,
  mileage: '',
  mileageUnit: 'KM',
  steeringWheel: '',
  transmissionId: '',
  driveTypeId: '',
  airbags: '',
  colorId: '',
  interiorMaterial: '',
  interiorColor: '',
  featureIds: [],
  descriptionEn: '',
  descriptionRu: '',
  cityId: '',
  customsCleared: false,
  techInspection: false,
  checkInspectionTime: false,
  imageUrls: [],
  videoUrl: '',
  price: '',
  currency: 'USD',
  priceNegotiable: false,
  exchange: false,
  contactName: '',
  contactPhone: '',
  callTimeEnabled: false,
  promoPlan: '',
  addColourService: false,
  autoRenewal: false,
  stickerIds: [],
});

export {
  INTERIOR_COLOR_KEYS,
  INTERIOR_MATERIAL_KEYS,
  interiorColorLabel,
  interiorMaterialLabel,
} from './addListingInterior';

export function buildListingPayload(form: AddListingFormState, status: 'ACTIVE' | 'DRAFT') {
  return {
    status,
    categoryId: Number(form.categoryId),
    listingType: form.listingType,
    modelId: Number(form.modelId),
    bodyTypeId: form.bodyTypeId === '' ? null : Number(form.bodyTypeId),
    fuelTypeId: form.fuelTypeId === '' ? null : Number(form.fuelTypeId),
    transmissionId: form.transmissionId === '' ? null : Number(form.transmissionId),
    driveTypeId: form.driveTypeId === '' ? null : Number(form.driveTypeId),
    colorId: form.colorId === '' ? null : Number(form.colorId),
    cityId: form.cityId === '' ? null : Number(form.cityId),
    year: Number(form.year),
    price: form.price,
    currency: form.currency,
    priceNegotiable: form.priceNegotiable,
    mileage: form.mileage === '' ? null : Number(form.mileage),
    mileageUnit: form.mileageUnit,
    engineVolume: form.engineVolume === '' ? null : form.engineVolume,
    cylinders: form.cylinders === '' ? null : Number(form.cylinders),
    isTurbo: form.isTurbo,
    steeringWheel: form.steeringWheel || 'LEFT',
    airbags: form.airbags === '' ? null : Number(form.airbags),
    customsCleared: form.customsCleared,
    techInspection: form.techInspection,
    exchange: form.exchange,
    vin: form.vin.trim() || null,
    trim: form.trim.trim(),
    descriptionEn: form.descriptionEn.trim(),
    descriptionRu: form.descriptionRu.trim(),
    interiorMaterial: form.interiorMaterial,
    interiorColor: form.interiorColor,
    featureIds: form.featureIds,
    stickerIds: form.stickerIds.slice(0, 3),
    imageUrls: form.imageUrls,
    videoUrl: form.videoUrl.trim() || null,
    isVip: form.promoPlan === 'superVip' || form.promoPlan === 'vipPlus' || form.promoPlan === 'vip',
    contactName: form.contactName.trim(),
    contactPhone: form.contactPhone.trim(),
  };
}
