'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FAVOURITES_STORAGE_KEY,
  parseFavourites,
  serializeFavourites,
  toggleFavouriteRecord,
  isSlugFavourited,
  type FavouriteRecord,
} from '@/lib/favourites';

const FAVOURITES_CHANGE_EVENT = 'wf:favourites_changed';

/**
 * Hook providing reactive favourites state, cross-tab sync, and optimistic toggling.
 */
export function useFavourites() {
  const [favouriteRecords, setFavouriteRecords] = useState<FavouriteRecord[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(FAVOURITES_STORAGE_KEY);
        setFavouriteRecords(parseFavourites(raw));
      }
    } catch {
      // Storage blocked or unavailable
      setFavouriteRecords([]);
    } finally {
      setIsReady(true);
    }

    // Cross-tab sync handler
    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVOURITES_STORAGE_KEY) {
        setFavouriteRecords(parseFavourites(e.newValue));
      }
    };

    // Same-tab sync handler
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<FavouriteRecord[]>;
      if (customEvent.detail) {
        setFavouriteRecords(customEvent.detail);
      } else {
        try {
          const raw = window.localStorage.getItem(FAVOURITES_STORAGE_KEY);
          setFavouriteRecords(parseFavourites(raw));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(FAVOURITES_CHANGE_EVENT, handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(FAVOURITES_CHANGE_EVENT, handleCustomChange);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    setFavouriteRecords((prev) => {
      const { updated, isFavourited } = toggleFavouriteRecord(prev, slug);

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(FAVOURITES_STORAGE_KEY, serializeFavourites(updated));
          // Notify other components in the same tab
          window.dispatchEvent(
            new CustomEvent<FavouriteRecord[]>(FAVOURITES_CHANGE_EVENT, { detail: updated })
          );
        }
      } catch {
        // Storage disabled - state still updates in-memory for session
      }

      // Haptic feedback if available
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(isFavourited ? [15, 30, 20] : 15);
      }

      return updated;
    });
  }, []);

  const has = useCallback(
    (slug: string) => isSlugFavourited(favouriteRecords, slug),
    [favouriteRecords]
  );

  const clearAll = useCallback(() => {
    setFavouriteRecords([]);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(FAVOURITES_STORAGE_KEY);
        window.dispatchEvent(
          new CustomEvent<FavouriteRecord[]>(FAVOURITES_CHANGE_EVENT, { detail: [] })
        );
      }
    } catch {
      // ignore
    }
  }, []);

  return {
    favouriteRecords,
    favouriteSlugs: favouriteRecords.map((r) => r.slug),
    count: favouriteRecords.length,
    isReady,
    toggle,
    has,
    clearAll,
  };
}
