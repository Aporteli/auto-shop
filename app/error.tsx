'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-[#1a1a2e]">Something went wrong</h1>
      <p className="mt-2 max-w-md text-[#6b7280]">
        The page could not be loaded. You can try again without leaving AutoShop.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 rounded-md bg-[#1a1a2e] px-4 py-2 text-sm font-medium text-white">
        Try again
      </button>
    </div>
  );
}
