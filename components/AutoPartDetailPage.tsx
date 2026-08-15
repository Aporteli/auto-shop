'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  autoPartCategory,
  autoPartDescription,
  autoPartFunction,
  autoPartName,
  autoPartReplacement,
  type AutoPartRecord,
} from '@/lib/autoParts';
import styles from './AutoPartDetailPage.module.css';

type AutoPartDetailPageProps = {
  part: AutoPartRecord;
  related: AutoPartRecord[];
};

export default function AutoPartDetailPage({ part, related }: AutoPartDetailPageProps) {
  const { t, language } = useLanguage();
  const copy = t.autoParts;
  const name = autoPartName(part, language);
  const category = autoPartCategory(part, language);

  return (
    <article className={styles.page}>
      <Link href="/auto-parts" className={styles.back}>
        ← {copy.backToList}
      </Link>

      <div className={styles.card}>
        <p className={styles.badge}>{category}</p>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.lead}>{autoPartDescription(part, language)}</p>

        <div className={styles.blocks}>
          <section>
            <h2>{copy.whatItDoes}</h2>
            <p>{autoPartFunction(part, language)}</p>
          </section>
          <section>
            <h2>{copy.whenToReplace}</h2>
            <p>{autoPartReplacement(part, language)}</p>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <h2>{copy.related}</h2>
          <ul className={styles.relatedList}>
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/auto-parts/${item.slug}`}>{autoPartName(item, language)}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
