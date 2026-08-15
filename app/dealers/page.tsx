import { Suspense } from 'react';
import DealersPage from '@/components/DealersPage';

export default function DealersRoutePage() {
  return (
    <div className="flex flex-1 flex-col bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="mx-auto w-full max-w-[1400px] p-8 text-center text-[#6b7280]">Loading...</div>}>
        <DealersPage />
      </Suspense>
    </div>
  );
}
