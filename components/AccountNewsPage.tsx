'use client';

import Link from 'next/link';
import AccountPageShell from '@/components/AccountPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { blogCover, blogExcerpt, blogTitle, formatBlogDate, type BlogPostRecord } from '@/lib/blog';
import styles from './AccountPage.module.css';

export default function AccountNewsPage({ posts }: { posts: BlogPostRecord[] }) {
  const { t, language } = useLanguage();

  return (
    <AccountPageShell title={t.header.account.news} subtitle={t.accountPages.newsSubtitle}>
      {posts.length === 0 ? (
        <p className={styles.empty}>{t.blog.empty}</p>
      ) : (
        <div className={styles.newsGrid}>
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className={styles.newsCard}>
              <img src={blogCover(post)} alt="" className={styles.newsThumb} />
              <div className={styles.meta}>
                <p className={styles.rowTitle}>{blogTitle(post, language)}</p>
                <p className={styles.rowDetail}>
                  {formatBlogDate(post.publishedAt ? new Date(post.publishedAt) : null, language)}
                </p>
                <p className={styles.rowDetail}>{blogExcerpt(post, language)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AccountPageShell>
  );
}
