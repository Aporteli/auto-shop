'use client';

import AccountStubPage from '@/components/AccountStubPage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CardsPage() {
  const { t } = useLanguage();
  return <AccountStubPage title={t.accountDashboard.cards} />;
}
