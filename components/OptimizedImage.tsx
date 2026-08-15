import Image from 'next/image';
import { optimizeUnsplashUrl, type UnsplashImageVariant } from '@/lib/carImage';

export const IMAGE_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGf/9k=';

const DEFAULT_SIZES: Record<UnsplashImageVariant, string> = {
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px',
  hero: '(max-width: 1024px) 100vw, 1200px',
};

const DEFAULT_DIMENSIONS: Record<UnsplashImageVariant, { width: number; height: number }> = {
  card: { width: 600, height: 400 },
  hero: { width: 1200, height: 800 },
};

type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  variant?: UnsplashImageVariant;
  sizes?: string;
  priority?: boolean;
  draggable?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain';
  onError?: () => void;
};

function isInlineSrc(url: string) {
  return url.startsWith('blob:') || url.startsWith('data:');
}

export default function OptimizedImage({
  src,
  alt,
  className,
  variant = 'card',
  sizes,
  priority = false,
  draggable = false,
  fill = false,
  width,
  height,
  fit = 'cover',
  onError,
}: OptimizedImageProps) {
  const url = optimizeUnsplashUrl(src, variant);
  const preventDrag = draggable ? undefined : (event: { preventDefault: () => void }) => event.preventDefault();

  if (isInlineSrc(url)) {
    return (
      // User-uploaded object URLs cannot go through the Next.js optimizer.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={alt}
        className={className}
        draggable={draggable}
        onDragStart={preventDrag}
        onError={onError}
      />
    );
  }

  const isSvg = url.endsWith('.svg');
  const dimensions = DEFAULT_DIMENSIONS[variant];

  const image = (
    <Image
      src={url}
      alt={alt}
      className={fill ? undefined : className}
      fill={fill}
      width={fill ? undefined : (width ?? dimensions.width)}
      height={fill ? undefined : (height ?? dimensions.height)}
      sizes={sizes ?? DEFAULT_SIZES[variant]}
      loading={priority ? undefined : 'lazy'}
      priority={priority}
      placeholder={isSvg ? 'empty' : 'blur'}
      blurDataURL={isSvg ? undefined : IMAGE_BLUR_DATA_URL}
      unoptimized={isSvg}
      draggable={draggable}
      onDragStart={preventDrag}
      onError={onError}
      style={{ objectFit: fit }}
    />
  );

  if (!fill) return image;

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'block',
        overflow: 'hidden',
        ...(className ? {} : { width: '100%', height: '100%' }),
      }}>
      {image}
    </span>
  );
}
