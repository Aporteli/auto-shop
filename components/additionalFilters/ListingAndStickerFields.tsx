'use client';

import { useMemo, useState } from 'react';
import styles from '../AdditionalFiltersModal.module.css';
import { Chip, ExpandableChips, ToggleRow } from './Chip';
import type { AdditionalFieldsProps } from './types';

export default function ListingAndStickerFields({
  m,
  draft,
  filters,
  label,
  updateDraft,
  toggleId,
}: AdditionalFieldsProps) {
  const [showOtherStickers, setShowOtherStickers] = useState(false);

  const primaryStickers = useMemo(() => {
    if (!filters) return [];
    return filters.stickers.slice(0, 6);
  }, [filters]);

  const otherStickers = useMemo(() => {
    if (!filters) return [];
    return filters.stickers.slice(6);
  }, [filters]);

  const toggleAllStickers = () => {
    if (!filters) return;
    const allIds = filters.stickers.map((sticker) => sticker.id);
    const allSelected = draft.stickerIds.length === allIds.length;
    updateDraft({ stickerIds: allSelected ? [] : allIds });
  };

  return (
    <>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{m.listingInformation}</h3>
        <div className={styles.field}>
          <span className={styles.label}>{m.applicant}</span>
          <div className={styles.chipGroup}>
            {(['private', 'dealer', 'showroom'] as const).map((key) => (
              <Chip
                key={key}
                active={draft.applicant === key}
                onClick={() => updateDraft({ applicant: draft.applicant === key ? '' : key })}>
                {m.applicants[key]}
              </Chip>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>{m.publicationDate}</span>
          <p className={styles.subsectionTitle}>{m.recentlyAdded}</p>
          <div className={styles.chipGroup}>
            {['1', '3', '6', '12', '24'].map((hours) => (
              <Chip
                key={hours}
                active={draft.publishedWithin === hours}
                onClick={() =>
                  updateDraft({ publishedWithin: draft.publishedWithin === hours ? '' : hours })
                }>
                {m.publicationHours[hours as keyof typeof m.publicationHours]}
              </Chip>
            ))}
          </div>
        </div>
        <ToggleRow
          label={m.exchange}
          on={draft.exchange}
          onToggle={() => updateDraft({ exchange: !draft.exchange })}
        />
        <ToggleRow
          label={m.auction}
          on={draft.auction}
          onToggle={() => updateDraft({ auction: !draft.auction })}
        />
        <ToggleRow
          label={m.withVideo}
          on={draft.withVideo}
          onToggle={() => updateDraft({ withVideo: !draft.withVideo })}
        />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{m.stickers}</h3>
        <p className={styles.subsectionTitle}>{m.multiSelectHint}</p>
        <div className={styles.chipGroup}>
          <Chip
            active={!!filters && draft.stickerIds.length === filters.stickers.length}
            onClick={toggleAllStickers}>
            {m.all}
          </Chip>
          {primaryStickers.map((sticker) => (
            <Chip
              key={sticker.id}
              active={draft.stickerIds.includes(sticker.id)}
              onClick={() => toggleId('stickerIds', sticker.id)}>
              {label(sticker)}
            </Chip>
          ))}
        </div>
        <ExpandableChips
          hasExtra={otherStickers.length > 0}
          show={showOtherStickers}
          onToggle={() => setShowOtherStickers((prev) => !prev)}
          moreLabel={m.otherStickers}
          lessLabel={m.seeLess}>
          <div className={styles.chipGroup}>
            {otherStickers.map((sticker) => (
              <Chip
                key={sticker.id}
                active={draft.stickerIds.includes(sticker.id)}
                onClick={() => toggleId('stickerIds', sticker.id)}>
                {label(sticker)}
              </Chip>
            ))}
          </div>
        </ExpandableChips>
      </section>
    </>
  );
}
