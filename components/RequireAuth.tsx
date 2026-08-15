'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || user) return;
    const next = pathname && pathname !== '/' ? pathname : '/';
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [isLoading, user, pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-[#6b7280]">
        Loading...
      </div>
    );
  }

  return children;
}
