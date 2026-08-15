'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function AuctionPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-1 flex-col bg-[#f5f5f5] px-5 py-10 md:px-10 md:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-[#1a1a2e] md:text-4xl">{t.auction.title}</h1>
        <p className="mt-3 max-w-2xl text-base text-[#6b7280] md:text-lg">{t.auction.description}</p>

        <div className="mt-10 rounded-lg border border-[#c6d6e1] bg-white p-8 text-center text-[#6b7280]">
          {t.auction.comingSoon}
        </div>
      </div>
    </div>
  );
}
