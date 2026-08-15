'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedImage from '@/components/OptimizedImage';
import {
  blogContent,
  blogCover,
  blogTitle,
  estimateReadMinutes,
  formatBlogDate,
  type BlogPostRecord,
} from '@/lib/blog';
import styles from './BlogPostPage.module.css';

type BlogPostPageProps = {
  post: BlogPostRecord;
};

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const { t, language } = useLanguage();
  const title = blogTitle(post, language);
  const content = blogContent(post, language);
  const readMinutes = estimateReadMinutes(content);

  return (
    <article className={styles.page}>
      <Link href="/blog" className={styles.back}>
        ← {t.blog.backToBlog}
      </Link>

      <header className={styles.header}>
        <div className={styles.meta}>
          <span>{formatBlogDate(post.publishedAt, language)}</span>
          <span>·</span>
          <span>{t.blog.minRead.replace('{{minutes}}', String(readMinutes))}</span>
        </div>
        <h1 className={styles.title}>{title}</h1>
      </header>

      <OptimizedImage
        className={styles.cover}
        src={blogCover(post)}
        alt={title}
        variant="hero"
        fill
        sizes="(max-width: 768px) 100vw, 760px"
        priority
        draggable={false}
      />

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
