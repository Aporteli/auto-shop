import { Suspense } from 'react';
import CataloguePage from '@/components/CataloguePage';

export default function CatalogueRoutePage() {
  return (
    <div className="flex flex-1 flex-col bg-[#f3f5f8] px-4 py-6 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="mx-auto w-full max-w-[1200px] p-8 text-center text-[#6b7280]">Loading...</div>}>
        <CataloguePage />
      </Suspense>
    </div>
  );
}
