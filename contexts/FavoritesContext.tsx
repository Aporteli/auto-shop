'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

const EMPTY_IDS = new Set<number>();

type FavoritesContextType = {
  isReady: boolean;
  isFavorite: (listingId: number) => boolean;
  isPending: (listingId: number) => boolean;
  toggleFavorite: (listingId: number) => Promise<boolean>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [ids, setIds] = useState<Set<number>>(EMPTY_IDS);
  const [pending, setPending] = useState<Set<number>>(EMPTY_IDS);
  const [loadedForUser, setLoadedForUser] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const userId = user.id;
    let cancelled = false;

    fetch('/api/account/favorites')
      .then(async (res) => {
        if (!res.ok) return { listingIds: [] as number[] };
        return (await res.json()) as { listingIds?: number[] };
      })
      .then((data) => {
        if (cancelled) return;
        setIds(new Set(Array.isArray(data.listingIds) ? data.listingIds : []));
        setLoadedForUser(userId);
      })
      .catch(() => {
        if (cancelled) return;
        setIds(new Set());
        setLoadedForUser(userId);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const activeIds = user && loadedForUser === user.id ? ids : EMPTY_IDS;
  const isReady = !user || loadedForUser === user.id;

  const isFavorite = useCallback((listingId: number) => activeIds.has(listingId), [activeIds]);
  const isPending = useCallback((listingId: number) => pending.has(listingId), [pending]);

  const toggleFavorite = useCallback(
    async (listingId: number) => {
      if (!user) {
        const next = pathname && pathname !== '/' ? pathname : '/';
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return false;
      }

      const wasSaved = ids.has(listingId);
      setIds((current) => {
        const next = new Set(current);
        if (wasSaved) next.delete(listingId);
        else next.add(listingId);
        return next;
      });
      setPending((current) => new Set(current).add(listingId));

      try {
        const res = await fetch('/api/account/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId }),
        });

        if (res.status === 401) {
          setIds((current) => {
            const next = new Set(current);
            if (wasSaved) next.add(listingId);
            else next.delete(listingId);
            return next;
          });
          const next = pathname && pathname !== '/' ? pathname : '/';
          router.push(`/login?next=${encodeURIComponent(next)}`);
          return false;
        }

        if (!res.ok) {
          throw new Error('Could not update favorite');
        }

        const data = (await res.json()) as { saved?: boolean };
        const saved = Boolean(data.saved);
        setIds((current) => {
          const next = new Set(current);
          if (saved) next.add(listingId);
          else next.delete(listingId);
          return next;
        });
        return saved;
      } catch {
        setIds((current) => {
          const next = new Set(current);
          if (wasSaved) next.add(listingId);
          else next.delete(listingId);
          return next;
        });
        return wasSaved;
      } finally {
        setPending((current) => {
          const next = new Set(current);
          next.delete(listingId);
          return next;
        });
      }
    },
    [ids, pathname, router, user],
  );

  const value = useMemo(
    () => ({ isReady, isFavorite, isPending, toggleFavorite }),
    [isReady, isFavorite, isPending, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
