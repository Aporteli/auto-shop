'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMapLocation } from '@/lib/mapLocation';
import ContactMap from './ContactMap';
import styles from './ContactPage.module.css';

const PHONE = '+995 32 280 00 45';
const EMAIL = 'info@autoshop.com';

export default function ContactPage() {
  const { t } = useLanguage();
  const copy = t.contactPage;
  const { openMapUrl } = getMapLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [fieldError, setFieldError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFieldError('');

    if (name.trim().length < 2) {
      setFieldError(copy.errors.name);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError(copy.errors.email);
      return;
    }
    if (message.trim().length < 10) {
      setFieldError(copy.errors.message);
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (!response.ok) {
        setStatus('error');
        return;
      }
      setStatus('sent');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>{copy.kicker}</p>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </header>

      <div className={styles.layout}>
        <ul className={styles.cards}>
          <li>
            <span>{copy.addressLabel}</span>
            <a href={openMapUrl} target="_blank" rel="noreferrer">
              {copy.address}
            </a>
          </li>
          <li>
            <span>{copy.phoneLabel}</span>
            <a href={`tel:${PHONE.replace(/\s+/g, '')}`}>{PHONE}</a>
          </li>
          <li>
            <span>{copy.emailLabel}</span>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </li>
          <li>
            <span>{copy.hoursLabel}</span>
            <strong>{copy.hours}</strong>
          </li>
        </ul>

        {status === 'sent' ? (
          <div className={styles.success}>
            <h2>{copy.successTitle}</h2>
            <p>{copy.successBody}</p>
            <button type="button" className={styles.submit} onClick={() => setStatus('idle')}>
              {copy.sendAnother}
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={submit} noValidate>
            <h2>{copy.formTitle}</h2>
            <label>
              {copy.name}
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label>
              {copy.email}
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label>
              {copy.phone}
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
              />
            </label>
            <label>
              {copy.message}
              <textarea
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={5}
                required
                minLength={10}
              />
            </label>
            {(fieldError || status === 'error') && (
              <p className={styles.formError}>{fieldError || copy.errors.failed}</p>
            )}
            <button type="submit" className={styles.submit} disabled={status === 'sending'}>
              {status === 'sending' ? copy.sending : copy.send}
            </button>
          </form>
        )}
      </div>

      <section className={styles.mapSection}>
        <div className={styles.mapHeader}>
          <h2>{copy.mapTitle}</h2>
          <p>{copy.mapSubtitle}</p>
        </div>
        <ContactMap title={copy.mapTitle} openMaps={copy.openMaps} />
      </section>
    </div>
  );
}
