'use client';

import AccountStubPage from '@/components/AccountStubPage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WonLotsPage() {
  const { t } = useLanguage();
  return <AccountStubPage title={t.accountDashboard.wonLots} />;
}
