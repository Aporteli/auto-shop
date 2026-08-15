'use client';

import { useMemo, useState } from 'react';
import {
  FEATURE_NAME_BY_KEY,
  FEATURE_OPTION_KEYS,
  PRIMARY_COLOR_NAMES,
} from '@/lib/additionalFilters';
import styles from '../AdditionalFiltersModal.module.css';
import { Chip, ColorLabel, ExpandableChips } from './Chip';
import type { AdditionalFieldsProps } from './types';

const isPrimaryColor = (nameEn: string) =>
  PRIMARY_COLOR_NAMES.includes(nameEn as (typeof PRIMARY_COLOR_NAMES)[number]);

export function AdditionalOptionsFields({
  m,
  draft,
  filters,
  label,
  toggleId,
}: AdditionalFieldsProps) {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const extraFeatures = useMemo(() => {
    if (!filters) return [];
    const names = new Set(Object.values(FEATURE_NAME_BY_KEY));
    return filters.features.filter((feature) => !names.has(feature.nameEn));
  }, [filters]);

  const featureIdForKey = (key: (typeof FEATURE_OPTION_KEYS)[number]) => {
    const name = FEATURE_NAME_BY_KEY[key];
    return filters?.features.find((feature) => feature.nameEn === name)?.id;
  };

  return (
    <div className={styles.field}>
      <span className={styles.label}>{m.additionalOptions}</span>
      <div className={styles.chipGroup}>
        {FEATURE_OPTION_KEYS.map((key) => {
          const featureId = featureIdForKey(key);
          const isDisabled = !featureId;
          return (
            <Chip
              key={key}
              active={featureId ? draft.featureIds.includes(featureId) : false}
              onClick={() => {
                if (featureId) toggleId('featureIds', featureId);
              }}>
              <span style={isDisabled ? { opacity: 0.55 } : undefined}>{m.features[key]}</span>
            </Chip>
          );
        })}
      </div>
      <ExpandableChips
        hasExtra={extraFeatures.length > 0}
        show={showAllFeatures}
        onToggle={() => setShowAllFeatures((prev) => !prev)}
        moreLabel={m.seeMore}
        lessLabel={m.seeLess}>
        <div className={styles.chipGroup}>
          {extraFeatures.map((feature) => (
            <Chip
              key={feature.id}
              active={draft.featureIds.includes(feature.id)}
              onClick={() => toggleId('featureIds', feature.id)}>
              {label(feature)}
            </Chip>
          ))}
        </div>
      </ExpandableChips>
    </div>
  );
}

export default function ColorFeatureFields({
  m,
  draft,
  filters,
  label,
  updateDraft,
  toggleId,
}: AdditionalFieldsProps) {
  const [showOtherColors, setShowOtherColors] = useState(false);
  const [showOtherInteriorColors, setShowOtherInteriorColors] = useState(false);

  const primaryColors = useMemo(
    () => (filters ? filters.colors.filter((color) => isPrimaryColor(color.nameEn)) : []),
    [filters],
  );
  const otherColors = useMemo(
    () => (filters ? filters.colors.filter((color) => !isPrimaryColor(color.nameEn)) : []),
    [filters],
  );

  const toggleAllColors = () => {
    if (!filters) return;
    const allIds = filters.colors.map((color) => color.id);
    const allSelected = draft.colorIds.length === allIds.length;
    updateDraft({ colorIds: allSelected ? [] : allIds });
  };

  return (
    <>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{m.carColor}</h3>
        <p className={styles.subsectionTitle}>{m.multiSelectHint}</p>
        <div className={styles.chipGroup}>
          <Chip active={!!filters && draft.colorIds.length === filters.colors.length} onClick={toggleAllColors}>
            {m.all}
          </Chip>
          {primaryColors.map((color) => (
            <Chip
              key={color.id}
              active={draft.colorIds.includes(color.id)}
              onClick={() => toggleId('colorIds', color.id)}>
              <ColorLabel hex={color.hex}>{label(color)}</ColorLabel>
            </Chip>
          ))}
        </div>
        <ExpandableChips
          hasExtra={otherColors.length > 0}
          show={showOtherColors}
          onToggle={() => setShowOtherColors((prev) => !prev)}
          moreLabel={m.otherColors}
          lessLabel={m.seeLess}>
          <div className={styles.chipGroup}>
            {otherColors.map((color) => (
              <Chip
                key={color.id}
                active={draft.colorIds.includes(color.id)}
                onClick={() => toggleId('colorIds', color.id)}>
                <ColorLabel hex={color.hex}>{label(color)}</ColorLabel>
              </Chip>
            ))}
          </div>
        </ExpandableChips>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{m.interiorMaterialColor}</h3>
        <div className={styles.field}>
          <span className={styles.label}>{m.interiorMaterial}</span>
          <div className={styles.chipGroup}>
            {(['fabric', 'leather', 'artificialLeather', 'combined', 'alcantara'] as const).map((key) => (
              <Chip
                key={key}
                active={draft.interiorMaterial === key}
                onClick={() =>
                  updateDraft({ interiorMaterial: draft.interiorMaterial === key ? '' : key })
                }>
                {m.interiorMaterials[key]}
              </Chip>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>{m.interiorColor}</span>
          <div className={styles.chipGroup}>
            <Chip active={draft.interiorColor === ''} onClick={() => updateDraft({ interiorColor: '' })}>
              {m.all}
            </Chip>
            {(['black', 'white', 'grey', 'brown', 'beige', 'red'] as const).map((key) => (
              <Chip
                key={key}
                active={draft.interiorColor === key}
                onClick={() => updateDraft({ interiorColor: draft.interiorColor === key ? '' : key })}>
                {m.interiorColors[key]}
              </Chip>
            ))}
          </div>
          <button
            type="button"
            className={styles.expandButton}
            onClick={() => setShowOtherInteriorColors((prev) => !prev)}>
            {showOtherInteriorColors ? m.seeLess : m.otherColors}
          </button>
          {showOtherInteriorColors && (
            <div className={styles.chipGroup}>
              {(['green', 'yellow', 'orange', 'purple', 'burgundy'] as const).map((key) => (
                <Chip
                  key={key}
                  active={draft.interiorColor === key}
                  onClick={() =>
                    updateDraft({ interiorColor: draft.interiorColor === key ? '' : key })
                  }>
                  {m.interiorColors[key]}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
