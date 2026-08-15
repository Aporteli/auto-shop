'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedImage from '@/components/OptimizedImage';
import {
  blogCover,
  blogExcerpt,
  blogTitle,
  formatBlogDate,
  type BlogPostRecord,
} from '@/lib/blog';
import styles from './BlogSection.module.css';

type BlogSectionProps = {
  posts: BlogPostRecord[];
};

export default function BlogSection({ posts }: BlogSectionProps) {
  const { t, language } = useLanguage();

  const [featuredPost, ...sidePosts] = posts;

  if (!featuredPost) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t.blogSection.title}</h2>
        <Link href="/blog" className={styles.viewAll}>
          {t.blogSection.seeAll}
        </Link>
      </div>

      <div className={styles.grid}>
        <article className={styles.featuredCard}>
          <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredImageLink}>
            <OptimizedImage
              className={styles.featuredImage}
              src={blogCover(featuredPost)}
              alt={blogTitle(featuredPost, language)}
              variant="card"
              fill
              sizes="224px"
              draggable={false}
            />
          </Link>

          <div className={styles.featuredContent}>
            <h3 className={styles.featuredTitle}>
              <Link href={`/blog/${featuredPost.slug}`}>{blogTitle(featuredPost, language)}</Link>
            </h3>
            <p className={styles.featuredDescription}>{blogExcerpt(featuredPost, language)}</p>
            <span className={styles.meta}>{formatBlogDate(featuredPost.publishedAt, language)}</span>
          </div>
        </article>

        <div className={styles.sideColumn}>
          {sidePosts.map((post) => (
            <article key={post.id} className={styles.sideCard}>
              <Link href={`/blog/${post.slug}`} className={styles.sideImageLink}>
                <OptimizedImage
                  className={styles.sideImage}
                  src={blogCover(post)}
                  alt={blogTitle(post, language)}
                  variant="card"
                  fill
                  sizes="104px"
                  draggable={false}
                />
              </Link>

              <div className={styles.sideContent}>
                <h3 className={styles.sideTitle}>
                  <Link href={`/blog/${post.slug}`}>{blogTitle(post, language)}</Link>
                </h3>
                <span className={styles.meta}>{formatBlogDate(post.publishedAt, language)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
