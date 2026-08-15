'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './StickerSlider.module.css';
import { StickerIcon } from './stickerSlider/StickerIcons';
import { mapStickerIcon, type StickerItem, type StickerSliderProps } from './stickerSlider/types';
import { useStickerSlider } from './stickerSlider/useStickerSlider';

export type { StickerCount } from './stickerSlider/types';

export default function StickerSlider({ stickers }: StickerSliderProps) {
  const { t, language } = useLanguage();

  const items = useMemo<StickerItem[]>(
    () =>
      [...stickers]
        .sort((a, b) => b.count - a.count)
        .map((sticker) => ({
          id: sticker.id,
          label: language === 'ru' ? sticker.nameRu : sticker.nameEn,
          count: t.stickerSlider.listingsCount.replace('{{count}}', String(sticker.count)),
          color: sticker.color,
          icon: mapStickerIcon(sticker.icon),
          href: `/search?stickerIds=${sticker.id}`,
        })),
    [stickers, language, t.stickerSlider.listingsCount],
  );

  const {
    viewportRef,
    didDragRef,
    canScrollLeft,
    canScrollRight,
    isDragging,
    handleScroll,
    scrollByAmount,
    handlePointerDown,
    handlePointerMove,
    endDrag,
    blockNativeDrag,
  } = useStickerSlider(items);

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.title}>{t.stickerSlider.title}</h2>
      </div>

      <div className={styles.sliderArea}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => scrollByAmount(-1)}
          disabled={!canScrollLeft}
          aria-label={t.stickerSlider.previous}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div
          ref={viewportRef}
          className={`${styles.viewport} ${isDragging ? styles.viewportDragging : ''}`}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDragStart={blockNativeDrag}>
          <div className={styles.track}>
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={styles.item}
                draggable={false}
                onDragStart={blockNativeDrag}
                onClick={(event) => {
                  if (didDragRef.current) {
                    event.preventDefault();
                    didDragRef.current = false;
                  }
                }}>
                <span className={styles.iconWrap}>
                  <StickerIcon icon={item.icon} color={item.color} />
                </span>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={styles.itemCount}>{item.count}</span>
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => scrollByAmount(1)}
          disabled={!canScrollRight}
          aria-label={t.stickerSlider.next}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
