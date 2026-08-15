import { genericCarPhotoUrls, isPlaceholderImageUrl } from '@/lib/carImage';

export type BlogPostRecord = {
  id: number;
  slug: string;
  titleEn: string;
  titleRu: string;
  excerptEn: string | null;
  excerptRu: string | null;
  contentEn: string;
  contentRu: string;
  coverImage: string | null;
  publishedAt: Date | string | null;
};

export function blogTitle(post: BlogPostRecord, language: string) {
  return language === 'ru' ? post.titleRu : post.titleEn;
}

export function blogExcerpt(post: BlogPostRecord, language: string) {
  return language === 'ru' ? post.excerptRu ?? '' : post.excerptEn ?? '';
}

export function blogContent(post: BlogPostRecord, language: string) {
  return language === 'ru' ? post.contentRu : post.contentEn;
}

export function blogCover(post: BlogPostRecord) {
  if (post.coverImage && !isPlaceholderImageUrl(post.coverImage)) {
    return post.coverImage;
  }
  return genericCarPhotoUrls('blog', post.slug)[0];
}

export function formatBlogDate(date: Date | string | null | undefined, language: string) {
  if (!date) return '';
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  return value.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function estimateReadMinutes(content: string) {
  const text = content.replace(/<[^>]+>/g, ' ').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
