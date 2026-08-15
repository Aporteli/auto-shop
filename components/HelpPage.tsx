'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import HelpContactSection from './HelpContactSection';
import styles from './HelpPage.module.css';

type FaqItem = { id: string; category: string; q: string; a: string };
type TopicCard = { id: string; title: string; text: string; href: string };

export default function HelpPage() {
  const { t } = useLanguage();
  const copy = t.helpPage;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('buying');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [fieldError, setFieldError] = useState('');

  const faqs = copy.faqs as FaqItem[];
  const topics = copy.topics as TopicCard[];

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
    if (hash === 'faq') {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const filteredFaqs = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faqs.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!needle) return true;
      return `${item.q} ${item.a}`.toLowerCase().includes(needle);
    });
  }, [category, faqs, query]);

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
      const response = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      if (!response.ok) {
        setStatus('error');
        return;
      }
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
      setTopic('buying');
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
        <label className={styles.search}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            aria-label={copy.searchPlaceholder}
          />
        </label>
      </header>

      <section className={styles.section}>
        <h2>{copy.topicsTitle}</h2>
        <div className={styles.topicGrid}>
          {topics.map((item) => (
            <Link key={item.id} href={item.href} className={styles.topicCard}>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} id="faq">
        <div className={styles.faqHeader}>
          <h2>{copy.faqTitle}</h2>
          <div className={styles.chips} role="tablist" aria-label={copy.faqTitle}>
            {(['all', 'buying', 'selling', 'services', 'account'] as const).map((id) => (
              <button
                key={id}
                type="button"
                className={`${styles.chip} ${category === id ? styles.chipActive : ''}`}
                onClick={() => setCategory(id)}>
                {copy.categories[id]}
              </button>
            ))}
          </div>
        </div>

        {filteredFaqs.length === 0 ? (
          <p className={styles.empty}>{copy.empty}</p>
        ) : (
          <div className={styles.faqList}>
            {filteredFaqs.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className={styles.faqItem}>
                  <button
                    type="button"
                    className={styles.faqButton}
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : item.id)}>
                    {item.q}
                    <span aria-hidden="true">{isOpen ? '–' : '+'}</span>
                  </button>
                  {isOpen && <p className={styles.faqAnswer}>{item.a}</p>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <HelpContactSection
        copy={copy}
        name={name}
        email={email}
        topic={topic}
        message={message}
        status={status}
        fieldError={fieldError}
        setName={setName}
        setEmail={setEmail}
        setTopic={setTopic}
        setMessage={setMessage}
        setStatus={setStatus}
        onSubmit={submit}
      />
    </div>
  );
}
