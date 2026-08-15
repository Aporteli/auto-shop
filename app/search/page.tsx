import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';

export default function SearchPage() {
  return (
    <div className="flex w-full flex-1 flex-col bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="mx-auto w-full max-w-[1400px] p-8 text-center text-[#6b7280]">Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
