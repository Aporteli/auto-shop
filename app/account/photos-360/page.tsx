'use client';

import AccountStubPage from '@/components/AccountStubPage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Photos360Page() {
  const { t } = useLanguage();
  return <AccountStubPage title={t.accountDashboard.photos360} />;
}
