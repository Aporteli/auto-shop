'use client';

import { getMapLocation } from '@/lib/mapLocation';
import styles from './ContactMap.module.css';

type ContactMapProps = {
  title: string;
  openMaps: string;
};

export default function ContactMap({ title, openMaps }: ContactMapProps) {
  const { embedUrl, openMapUrl, label } = getMapLocation();

  return (
    <div className={styles.wrap}>
      <iframe
        className={styles.frame}
        title={title}
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a className={styles.openMaps} href={openMapUrl} target="_blank" rel="noreferrer">
        {openMaps}
        <span>{label}</span>
      </a>
    </div>
  );
}
