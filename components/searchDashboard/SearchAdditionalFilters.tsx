'use client';

import { useMemo } from 'react';
import { defaultAdditionalFilterFields } from '@/lib/additionalFilters';
import type { SearchFiltersState } from '@/lib/searchParams';
import AdditionalFiltersModal, { type AdditionalModalState } from '../AdditionalFiltersModal';
import type { ApiFiltersResponse } from './types';

type SearchAdditionalFiltersProps = {
  isOpen: boolean;
  onClose: () => void;
  filterOptions: ApiFiltersResponse | null;
  filters: SearchFiltersState;
  setFilters: (patch: Partial<SearchFiltersState>) => void;
};

export default function SearchAdditionalFilters({
  isOpen,
  onClose,
  filterOptions,
  filters,
  setFilters,
}: SearchAdditionalFiltersProps) {
  const additionalModalValue = useMemo<AdditionalModalState>(
    () => ({
      bodyTypeId: filters.bodyTypeId,
      transmissionId: filters.transmissionId,
      driveTypeId: filters.driveTypeId,
      engineFrom: filters.engineFrom,
      engineTo: filters.engineTo,
      mileageFrom: filters.mileageFrom,
      mileageTo: filters.mileageTo,
      steeringWheel: filters.steeringWheel,
      doors: filters.doors,
      thirdRowSeats: filters.thirdRowSeats,
      isNew: filters.isNew,
      techInspection: filters.techInspection,
      catalyst: filters.catalyst,
      featureIds: filters.featureIds,
      colorIds: filters.colorIds,
      interiorMaterial: filters.interiorMaterial,
      interiorColor: filters.interiorColor,
      applicant: filters.applicant,
      publishedWithin: filters.publishedWithin,
      exchange: filters.exchange,
      auction: filters.auction,
      withVideo: filters.withVideo,
      stickerIds: filters.stickerIds,
    }),
    [filters],
  );

  const handleApplyAdditionalFilters = (value: AdditionalModalState) => {
    setFilters({
      bodyTypeId: value.bodyTypeId,
      transmissionId: value.transmissionId,
      driveTypeId: value.driveTypeId,
      engineFrom: value.engineFrom,
      engineTo: value.engineTo,
      mileageFrom: value.mileageFrom,
      mileageTo: value.mileageTo,
      steeringWheel: value.steeringWheel,
      doors: value.doors,
      thirdRowSeats: value.thirdRowSeats,
      isNew: value.isNew,
      techInspection: value.techInspection,
      catalyst: value.catalyst,
      featureIds: value.featureIds,
      colorIds: value.colorIds,
      interiorMaterial: value.interiorMaterial,
      interiorColor: value.interiorColor,
      applicant: value.applicant,
      publishedWithin: value.publishedWithin,
      exchange: value.exchange,
      auction: value.auction,
      withVideo: value.withVideo,
      stickerIds: value.stickerIds,
    });
  };

  const handleClearAdditionalFilters = () => {
    setFilters({
      bodyTypeId: '',
      transmissionId: '',
      driveTypeId: '',
      ...defaultAdditionalFilterFields(),
    });
  };

  return (
    <AdditionalFiltersModal
      isOpen={isOpen}
      onClose={onClose}
      filters={
        filterOptions
          ? {
              bodyTypes: filterOptions.bodyTypes.map((item) => ({
                id: item.id,
                nameEn: item.nameEn ?? '',
                nameRu: item.nameRu ?? '',
              })),
              transmissions: filterOptions.transmissions.map((item) => ({
                id: item.id,
                nameEn: item.nameEn ?? '',
                nameRu: item.nameRu ?? '',
              })),
              driveTypes: filterOptions.driveTypes.map((item) => ({
                id: item.id,
                nameEn: item.nameEn ?? '',
                nameRu: item.nameRu ?? '',
              })),
              colors: filterOptions.colors.map((item) => ({
                id: item.id,
                nameEn: item.nameEn ?? '',
                nameRu: item.nameRu ?? '',
                hex: 'hex' in item ? (item as { hex?: string | null }).hex : undefined,
              })),
              features: filterOptions.features,
              stickers: filterOptions.stickers,
            }
          : null
      }
      value={additionalModalValue}
      onApply={handleApplyAdditionalFilters}
      onClear={handleClearAdditionalFilters}
    />
  );
}
