'use client';

import styles from './HelpPage.module.css';

type HelpCopy = {
  contactTitle: string;
  contactSubtitle: string;
  hours: string;
  successTitle: string;
  successBody: string;
  sendAnother: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  sending: string;
  send: string;
  categories: Record<string, string>;
  errors: { name: string; email: string; message: string; failed: string };
};

const PHONE = '+995 32 280 00 45';
const EMAIL = 'info@autoshop.com';

export default function HelpContactSection({
  copy,
  name,
  email,
  topic,
  message,
  status,
  fieldError,
  setName,
  setEmail,
  setTopic,
  setMessage,
  setStatus,
  onSubmit,
}: {
  copy: HelpCopy;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: 'idle' | 'sending' | 'sent' | 'error';
  fieldError: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setTopic: (value: string) => void;
  setMessage: (value: string) => void;
  setStatus: (value: 'idle' | 'sending' | 'sent' | 'error') => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.contactInfo}>
        <h2>{copy.contactTitle}</h2>
        <p>{copy.contactSubtitle}</p>
        <a className={styles.contactLink} href={`tel:${PHONE.replace(/\s+/g, '')}`}>
          {PHONE}
        </a>
        <a className={styles.contactLink} href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        <p className={styles.hours}>{copy.hours}</p>
      </div>

      {status === 'sent' ? (
        <div className={styles.success}>
          <h3>{copy.successTitle}</h3>
          <p>{copy.successBody}</p>
          <button type="button" className={styles.submit} onClick={() => setStatus('idle')}>
            {copy.sendAnother}
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <label>
            {copy.name}
            <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
          </label>
          <label>
            {copy.email}
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
          </label>
          <label>
            {copy.topic}
            <select value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="buying">{copy.categories.buying}</option>
              <option value="selling">{copy.categories.selling}</option>
              <option value="services">{copy.categories.services}</option>
              <option value="account">{copy.categories.account}</option>
              <option value="other">{copy.categories.other}</option>
            </select>
          </label>
          <label>
            {copy.message}
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={5} />
          </label>
          {(fieldError || status === 'error') && (
            <p className={styles.formError}>{fieldError || copy.errors.failed}</p>
          )}
          <button type="submit" className={styles.submit} disabled={status === 'sending'}>
            {status === 'sending' ? copy.sending : copy.send}
          </button>
        </form>
      )}
    </section>
  );
}
