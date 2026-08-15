'use client';

import { AuthProvider } from '../contexts/AuthContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function LanguageProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
