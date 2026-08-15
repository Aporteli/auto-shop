'use client';

import { useEffect } from 'react';
import CarImage from '@/components/CarImage';
import styles from '../ListingDetail.module.css';

type ListingGalleryProps = {
  images: Array<{ url: string; position: number }>;
  activeImage: number;
  onSelect: (index: number | ((prev: number) => number)) => void;
  make: string;
  model: string;
  alt: string;
  photosLabel: string;
};

export default function ListingGallery({
  images,
  activeImage,
  onSelect,
  make,
  model,
  alt,
  photosLabel,
}: ListingGalleryProps) {
  useEffect(() => {
    if (images.length < 2) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') onSelect((index) => (index + 1) % images.length);
      if (event.key === 'ArrowLeft') onSelect((index) => (index - 1 + images.length) % images.length);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, onSelect]);

  const showPrev = () => onSelect((index) => (index - 1 + images.length) % images.length);
  const showNext = () => onSelect((index) => (index + 1) % images.length);

  return (
    <div>
      <div className={styles.gallery}>
        <CarImage
          src={images[activeImage]?.url}
          make={make}
          model={model}
          alt={alt}
          photoIndex={activeImage}
          draggable={false}
          variant="hero"
          sizes="(max-width: 1024px) 100vw, 760px"
          priority
        />
        {images.length > 1 && (
          <>
            <button type="button" className={`${styles.galleryNav} ${styles.galleryPrev}`} onClick={showPrev} aria-label="Previous photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2.2" strokeLinecap="round" d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" className={`${styles.galleryNav} ${styles.galleryNext}`} onClick={showNext} aria-label="Next photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2.2" strokeLinecap="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
        <span className={styles.galleryCount}>
          {photosLabel.replace('{{current}}', String(activeImage + 1)).replace('{{total}}', String(images.length))}
        </span>
      </div>
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              className={`${styles.thumb} ${index === activeImage ? styles.thumbActive : ''}`}
              onClick={() => onSelect(index)}>
              <CarImage
                src={image.url}
                make={make}
                model={model}
                alt=""
                photoIndex={index}
                draggable={false}
                sizes="86px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
