import Link from 'next/link';
import {
  autoPartCategory,
  autoPartDescription,
  autoPartName,
  type AutoPartRecord,
} from '@/lib/autoParts';
import styles from './AutoPartsPage.module.css';

export default function AutoPartsList({
  parts,
  language,
  showCategory,
}: {
  parts: AutoPartRecord[];
  language: string;
  showCategory: boolean;
}) {
  return (
    <ul className={styles.list}>
      {parts.map((part) => (
        <li key={part.id}>
          <Link href={`/auto-parts/${part.slug}`} className={styles.row}>
            <span className={styles.rowMain}>
              <span className={styles.rowName}>{autoPartName(part, language)}</span>
              <span className={styles.rowText}>{autoPartDescription(part, language)}</span>
            </span>
            {showCategory && <span className={styles.rowMeta}>{autoPartCategory(part, language)}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
