import type { AddListingFormState } from '@/lib/addListing';

export function countPrimaryProgress(form: AddListingFormState) {
  return [
    form.manufacturerId,
    form.modelId,
    form.year,
    form.fuelTypeId,
    form.bodyTypeId,
    form.transmissionId,
    form.driveTypeId,
    form.colorId,
    form.mileage,
    form.steeringWheel,
  ].filter(Boolean).length;
}
