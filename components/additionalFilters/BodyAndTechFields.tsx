'use client';

import type { ReactNode } from 'react';
import SearchableFilterSelect from '../SearchableFilterSelect';
import type { SteeringWheelFilter } from '@/lib/additionalFilters';
import styles from '../AdditionalFiltersModal.module.css';
import { Chip, YesNoGroup } from './Chip';
import type { AdditionalFieldsProps, ApiFilters } from './types';

function driveTypeByLabel(filters: ApiFilters | null, key: 'front' | 'rear' | 'fourByFour') {
  if (!filters) return null;
  const matchers: Record<typeof key, string[]> = {
    front: ['Front-wheel drive'],
    rear: ['Rear-wheel drive'],
    fourByFour: ['All-wheel drive', '4WD'],
  };
  return filters.driveTypes.find((item) => matchers[key].includes(item.nameEn)) ?? null;
}

export default function BodyAndTechFields({
  m,
  draft,
  filters,
  label,
  updateDraft,
  children,
}: Omit<AdditionalFieldsProps, 'toggleId'> & { children?: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{m.vehicleInformation}</h3>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <span className={styles.label}>{m.engine}</span>
          <div className={styles.fieldGrid}>
            <input
              className={styles.input}
              type="number"
              min="0"
              step="0.1"
              placeholder={m.from}
              value={draft.engineFrom}
              onChange={(e) => updateDraft({ engineFrom: e.target.value })}
            />
            <input
              className={styles.input}
              type="number"
              min="0"
              step="0.1"
              placeholder={m.to}
              value={draft.engineTo}
              onChange={(e) => updateDraft({ engineTo: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>{m.mileage}</span>
          <div className={styles.fieldGrid}>
            <input
              className={styles.input}
              type="number"
              min="0"
              placeholder={m.from}
              value={draft.mileageFrom}
              onChange={(e) => updateDraft({ mileageFrom: e.target.value })}
            />
            <input
              className={styles.input}
              type="number"
              min="0"
              placeholder={m.to}
              value={draft.mileageTo}
              onChange={(e) => updateDraft({ mileageTo: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.field}>
          <SearchableFilterSelect
            title={m.category}
            value={draft.bodyTypeId === '' ? '' : String(draft.bodyTypeId)}
            options={(filters?.bodyTypes ?? []).map((item) => ({
              value: String(item.id),
              label: label(item),
            }))}
            emptyLabel={m.all}
            onChange={(next) => updateDraft({ bodyTypeId: next === '' ? '' : Number(next) })}
          />
        </div>
        <div className={styles.field}>
          <SearchableFilterSelect
            title={m.gearbox}
            value={draft.transmissionId === '' ? '' : String(draft.transmissionId)}
            options={(filters?.transmissions ?? []).map((item) => ({
              value: String(item.id),
              label: label(item),
            }))}
            emptyLabel={m.all}
            onChange={(next) => updateDraft({ transmissionId: next === '' ? '' : Number(next) })}
          />
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{m.wheel}</span>
        <div className={styles.chipGroup}>
          {(['LEFT', 'RIGHT'] as SteeringWheelFilter[]).map((side) => (
            <Chip
              key={side}
              active={draft.steeringWheel === side}
              onClick={() => updateDraft({ steeringWheel: draft.steeringWheel === side ? '' : side })}>
              {side === 'LEFT' ? m.left : m.right}
            </Chip>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{m.driveWheels}</span>
        <div className={styles.chipGroup}>
          {(['front', 'rear', 'fourByFour'] as const).map((key) => {
            const driveType = driveTypeByLabel(filters, key);
            if (!driveType) return null;
            return (
              <Chip
                key={key}
                active={draft.driveTypeId === driveType.id}
                onClick={() =>
                  updateDraft({ driveTypeId: draft.driveTypeId === driveType.id ? '' : driveType.id })
                }>
                {m.driveOptions[key]}
              </Chip>
            );
          })}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{m.doors}</span>
        <div className={styles.chipGroup}>
          {(['2-3', '4-5', '5+'] as const).map((option) => (
            <Chip
              key={option}
              active={draft.doors === option}
              onClick={() => updateDraft({ doors: draft.doors === option ? '' : option })}>
              {m.doorOptions[option]}
            </Chip>
          ))}
        </div>
      </div>

      <div className={styles.fieldGrid}>
        <YesNoGroup
          label={m.thirdRowSeats}
          value={draft.thirdRowSeats}
          onChange={(thirdRowSeats) => updateDraft({ thirdRowSeats })}
          yesLabel={m.yes}
          noLabel={m.no}
        />
        <YesNoGroup
          label={m.isNew}
          value={draft.isNew}
          onChange={(isNew) => updateDraft({ isNew })}
          yesLabel={m.yes}
          noLabel={m.no}
        />
        <YesNoGroup
          label={m.techInspection}
          value={draft.techInspection}
          onChange={(techInspection) => updateDraft({ techInspection })}
          yesLabel={m.yes}
          noLabel={m.no}
        />
        <YesNoGroup
          label={m.catalyst}
          value={draft.catalyst}
          onChange={(catalyst) => updateDraft({ catalyst })}
          yesLabel={m.yes}
          noLabel={m.no}
        />
      </div>
      {children}
    </section>
  );
}
