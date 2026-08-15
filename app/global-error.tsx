'use client';

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  console.error(error);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Something went wrong</h1>
          <p className="mt-2 text-[#6b7280]">AutoShop could not finish loading this page.</p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-6 rounded-md bg-[#1a1a2e] px-4 py-2 text-sm font-medium text-white">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
