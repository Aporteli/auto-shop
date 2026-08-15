'use client';

import { useEffect, useState } from 'react';
import { CAR_PLACEHOLDER_SRC, carImageCacheKey, isPlaceholderImageUrl } from '@/lib/carImage';

type CarImageProps = {
  make?: string | null;
  model?: string | null;
  src?: string | null;
  alt: string;
  className?: string;
  photoIndex?: number;
  draggable?: boolean;
};

const inflight = new Map<string, Promise<string[]>>();

function loadUnsplashUrls(make?: string | null, model?: string | null) {
  const key = carImageCacheKey(make, model);
  const existing = inflight.get(key);
  if (existing) return existing;

  const params = new URLSearchParams();
  if (make?.trim()) params.set('make', make.trim());
  if (model?.trim()) params.set('model', model.trim());

  const request = fetch(`/api/car-images?${params.toString()}`)
    .then(async (res) => {
      if (!res.ok) return [];
      const data = (await res.json()) as { urls?: unknown };
      return Array.isArray(data.urls) ? data.urls.filter((url): url is string => typeof url === 'string') : [];
    })
    .catch(() => []);

  inflight.set(key, request);
  return request;
}

export default function CarImage({
  make,
  model,
  src,
  alt,
  className,
  photoIndex = 0,
  draggable = false,
}: CarImageProps) {
  const uploadedSrc = src && !isPlaceholderImageUrl(src) ? src : null;
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedSrc) return;

    let cancelled = false;
    loadUnsplashUrls(make, model).then((urls) => {
      if (cancelled || urls.length === 0) return;
      const index = ((photoIndex % urls.length) + urls.length) % urls.length;
      setRemoteUrl(urls[index] ?? urls[0] ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, [uploadedSrc, make, model, photoIndex]);

  const url = uploadedSrc ?? remoteUrl ?? CAR_PLACEHOLDER_SRC;
  const displayUrl = failedUrl === url ? CAR_PLACEHOLDER_SRC : url;

  return (
    <img
      className={className}
      src={displayUrl}
      alt={alt}
      draggable={draggable}
      onDragStart={draggable ? undefined : (event) => event.preventDefault()}
      onError={() => setFailedUrl(url)}
    />
  );
}
