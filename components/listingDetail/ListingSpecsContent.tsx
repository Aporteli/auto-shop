import { useMemo } from 'react';
import {
  SPECIFICATION_GROUPS,
  formatDoors,
  formatDriveType,
  formatEngineVolume,
  formatMileage,
  formatYesNo,
  labelFor,
} from '@/lib/listingDetail';
import type { Listing, SpecItem } from './types';
import styles from '../ListingDetail.module.css';

type ListingSpecsContentProps = {
  listing: Listing;
  language: string;
  d: {
    description: string;
    mainSpecifications: string;
    specifications: string;
    manufacturer: string;
    model: string;
    year: string;
    category: string;
    mileage: string;
    fuelType: string;
    engineVolume: string;
    cylinders: string;
    gearbox: string;
    driveWheels: string;
    doors: string;
    thirdRowSeats: string;
    airbags: string;
    wheel: string;
    left: string;
    right: string;
    color: string;
    interiorColor: string;
    interiorMaterial: string;
    vin: string;
    exchange: string;
    techInspection: string;
    catalyst: string;
    groups: Record<string, string>;
  };
  title: string;
  location: string;
  highlights: SpecItem[];
};

export default function ListingSpecsContent({
  listing,
  language,
  d,
  title,
  location,
  highlights,
}: ListingSpecsContentProps) {
  const description = language === 'ru' ? listing.descriptionRu : listing.descriptionEn;
  const interiorColor = language === 'ru' ? listing.interiorColorRu : listing.interiorColorEn;
  const interiorMaterial = language === 'ru' ? listing.interiorMaterialRu : listing.interiorMaterialEn;

  const groupedFeatures = useMemo(
    () =>
      SPECIFICATION_GROUPS.map((group) => ({
        group,
        items: listing.features.filter((item) => item.feature.groupEn === group),
      })).filter((entry) => entry.items.length > 0),
    [listing],
  );

  const mainSpecs = [
    { label: d.manufacturer, value: labelFor(language, listing.model.manufacturer) },
    { label: d.model, value: labelFor(language, listing.model) },
    { label: d.year, value: String(listing.year) },
    { label: d.category, value: listing.bodyType ? labelFor(language, listing.bodyType) : '—' },
    { label: d.mileage, value: formatMileage(listing.mileage, listing.mileageUnit) },
    { label: d.fuelType, value: listing.fuelType ? labelFor(language, listing.fuelType) : '—' },
    { label: d.engineVolume, value: formatEngineVolume(listing.engineVolume, listing.isTurbo) },
    { label: d.cylinders, value: listing.cylinders != null ? String(listing.cylinders) : '—' },
    { label: d.gearbox, value: listing.transmission ? labelFor(language, listing.transmission) : '—' },
    { label: d.driveWheels, value: formatDriveType(listing.driveType, language) },
    { label: d.doors, value: formatDoors(listing.doors, language) },
    { label: d.thirdRowSeats, value: formatYesNo(listing.thirdRowSeats, language) },
    { label: d.airbags, value: listing.airbags != null ? String(listing.airbags) : '—' },
    { label: d.wheel, value: listing.steeringWheel === 'RIGHT' ? d.right : d.left },
    { label: d.color, value: listing.color ? labelFor(language, listing.color) : '—' },
    { label: d.interiorColor, value: interiorColor || '—' },
    { label: d.interiorMaterial, value: interiorMaterial || '—' },
    { label: d.vin, value: listing.vin || '—' },
    { label: d.exchange, value: formatYesNo(listing.exchange, language) },
    { label: d.techInspection, value: formatYesNo(listing.techInspection, language) },
    { label: d.catalyst, value: formatYesNo(listing.catalyst, language) },
  ];

  const groupTitle = (group: string) => {
    const key = group.toLowerCase() as keyof typeof d.groups;
    return d.groups[key] ?? group;
  };

  return (
    <div className={styles.content}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{location}</p>
      </div>

      <div className={styles.highlights}>
        {highlights.map((item) => (
          <div key={item.label} className={styles.highlight}>
            <span className={styles.highlightLabel}>{item.label}</span>
            <span className={styles.highlightValue}>{item.value}</span>
          </div>
        ))}
      </div>

      {description ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{d.description}</h2>
          <p className={styles.description}>{description}</p>
        </section>
      ) : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{d.mainSpecifications}</h2>
        <div className={styles.specTable}>
          {mainSpecs.map((spec) => (
            <div key={spec.label} className={styles.specRow}>
              <span className={styles.specLabel}>{spec.label}</span>
              <span className={styles.specValue}>{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {groupedFeatures.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{d.specifications}</h2>
          <div className={styles.specGroups}>
            {groupedFeatures.map(({ group, items }) => (
              <div key={group}>
                <h3 className={styles.specGroupTitle}>{groupTitle(group)}</h3>
                <div className={styles.featureList}>
                  {items.map(({ feature }) => (
                    <span key={feature.id} className={styles.featureChip}>
                      {labelFor(language, feature)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
