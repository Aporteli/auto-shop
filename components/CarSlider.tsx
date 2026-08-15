'use client';

import styles from './CarSlider.module.css';
import CarSliderCard from './carSlider/CarSliderCard';
import type { CarSliderProps } from './carSlider/types';
import { useCarSlider } from './carSlider/useCarSlider';

export type { CarSliderItem } from './carSlider/types';

export default function CarSlider({ items, title, showBadge = false }: CarSliderProps) {
  const {
    viewportRef,
    trackRef,
    measureCardRef,
    didDragRef,
    cardWidth,
    index,
    maxIndex,
    isDragging,
    translateX,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPrev,
    onNext,
  } = useCarSlider(items.length);

  return (
    <div className={styles.sliderWrap}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          {showBadge && (
            <span className={styles.badge} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L6 13h5l-1 9 8-12h-5l2-8z" />
              </svg>
            </span>
          )}
          {title && <h2 className={styles.title}>{title}</h2>}
        </div>

        <div className={styles.controls}>
          <button type="button" className={styles.iconBtn} onClick={onPrev} disabled={index <= 0}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onNext}
            disabled={index >= maxIndex}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}>
        <div
          ref={trackRef}
          className={`${styles.track} ${isDragging ? styles.trackDragging : ''}`}
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: isDragging ? 'none' : 'transform 280ms ease',
          }}>
          {items.map((item, idx) => (
            <CarSliderCard
              key={item.id}
              item={item}
              cardRef={idx === 0 ? measureCardRef : undefined}
              cardWidth={cardWidth}
              didDragRef={didDragRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
