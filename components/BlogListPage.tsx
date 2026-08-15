'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedImage from '@/components/OptimizedImage';
import {
  blogCover,
  blogExcerpt,
  blogTitle,
  estimateReadMinutes,
  formatBlogDate,
  type BlogPostRecord,
} from '@/lib/blog';
import styles from './BlogListPage.module.css';

type BlogListPageProps = {
  posts: BlogPostRecord[];
};

export default function BlogListPage({ posts }: BlogListPageProps) {
  const { t, language } = useLanguage();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.blog.title}</h1>
        <p className={styles.subtitle}>{t.blog.subtitle}</p>
      </header>

      {posts.length === 0 ? (
        <p className={styles.empty}>{t.blog.empty}</p>
      ) : (
        <div className={styles.grid}>
          {posts.map((post) => {
            const title = blogTitle(post, language);
            const excerpt = blogExcerpt(post, language);
            const readMinutes = estimateReadMinutes(
              language === 'ru' ? post.contentRu : post.contentEn,
            );

            return (
              <article key={post.id} className={styles.card}>
                <Link href={`/blog/${post.slug}`} className={styles.imageLink}>
                  <OptimizedImage
                    className={styles.image}
                    src={blogCover(post)}
                    alt={title}
                    variant="card"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    draggable={false}
                  />
                </Link>
                <div className={styles.body}>
                  <div className={styles.meta}>
                    <span>{formatBlogDate(post.publishedAt, language)}</span>
                    <span>·</span>
                    <span>{t.blog.minRead.replace('{{minutes}}', String(readMinutes))}</span>
                  </div>
                  <h2 className={styles.cardTitle}>
                    <Link href={`/blog/${post.slug}`}>{title}</Link>
                  </h2>
                  <p className={styles.excerpt}>{excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                    {t.blog.readMore}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
