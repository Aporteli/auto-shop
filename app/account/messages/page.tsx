'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import AccountPageShell from '@/components/AccountPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '@/components/AccountPage.module.css';

type MessageItem = {
  id: number;
  subject: string | null;
  body: string;
  from: string;
  to: string;
  createdAt: string;
};

export default function MessagesPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/account/messages')
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data.messages) ? data.messages : []))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <RequireAuth>
      <AccountPageShell title={t.header.account.messages} subtitle={t.accountPages.messagesSubtitle}>
        {isLoading ? (
          <p className={styles.empty}>{t.accountPages.loading}</p>
        ) : messages.length === 0 ? (
          <p className={styles.empty}>{t.accountPages.emptyMessages}</p>
        ) : (
          <div className={styles.list}>
            {messages.map((message) => (
              <article key={message.id} className={styles.row}>
                <div className={styles.meta}>
                  <p className={styles.rowTitle}>{message.subject || message.body.slice(0, 80)}</p>
                  <p className={styles.rowDetail}>
                    {t.accountPages.from} {message.from} · {t.accountPages.to} {message.to}
                  </p>
                  <p className={styles.rowDetail}>
                    {new Date(message.createdAt).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </AccountPageShell>
    </RequireAuth>
  );
}
