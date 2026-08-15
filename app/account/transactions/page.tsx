'use client';

import AccountStubPage from '@/components/AccountStubPage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TransactionsPage() {
  const { t } = useLanguage();
  return <AccountStubPage title={t.accountDashboard.transactions} />;
}
