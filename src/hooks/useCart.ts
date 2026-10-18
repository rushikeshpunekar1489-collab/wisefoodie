'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CART_STORAGE_KEY,
  parseCart,
  serializeCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  type CartItem,
  type SavedBasketList,
} from '@/lib/cart';

const CART_CHANGE_EVENT = 'wf:cart_changed';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedLists, setSavedLists] = useState<SavedBasketList[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        setCartItems(parseCart(raw));

        const rawLists = window.localStorage.getItem('wf_saved_baskets_v1');
        if (rawLists) {
          setSavedLists(JSON.parse(rawLists));
        }
      }
    } catch {
      setCartItems([]);
      setSavedLists([]);
    } finally {
      setIsReady(true);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        setCartItems(parseCart(e.newValue));
      }
      if (e.key === 'wf_saved_baskets_v1' && e.newValue) {
        try {
          setSavedLists(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<CartItem[]>;
      if (customEvent.detail) {
        setCartItems(customEvent.detail);
      } else {
        try {
          const raw = window.localStorage.getItem(CART_STORAGE_KEY);
          setCartItems(parseCart(raw));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(CART_CHANGE_EVENT, handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(CART_CHANGE_EVENT, handleCustomChange);
    };
  }, []);

  const saveItems = useCallback((items: CartItem[]) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(items));
        window.dispatchEvent(new CustomEvent<CartItem[]>(CART_CHANGE_EVENT, { detail: items }));
      }
    } catch {
      // storage disabled
    }
  }, []);

  const add = useCallback(
    (slug: string, quantity = 1) => {
      setCartItems((prev) => {
        const updated = addToCart(prev, slug, quantity);
        saveItems(updated);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(20);
        }
        return updated;
      });
    },
    [saveItems]
  );

  const updateQuantity = useCallback(
    (slug: string, quantity: number) => {
      setCartItems((prev) => {
        const updated = updateCartQuantity(prev, slug, quantity);
        saveItems(updated);
        return updated;
      });
    },
    [saveItems]
  );

  const remove = useCallback(
    (slug: string) => {
      setCartItems((prev) => {
        const updated = removeFromCart(prev, slug);
        saveItems(updated);
        return updated;
      });
    },
    [saveItems]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    saveItems([]);
  }, [saveItems]);

  const saveCurrentBasket = useCallback(
    (name: string) => {
      if (cartItems.length === 0) return;
      const newList: SavedBasketList = {
        id: `list-${Date.now()}`,
        name: name.trim() || `My Basket ${new Date().toLocaleDateString()}`,
        createdAt: Date.now(),
        items: [...cartItems],
      };

      setSavedLists((prev) => {
        const updated = [newList, ...prev];
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('wf_saved_baskets_v1', JSON.stringify(updated));
          }
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [cartItems]
  );

  const loadSavedBasket = useCallback(
    (listId: string) => {
      const found = savedLists.find((l) => l.id === listId);
      if (found) {
        setCartItems(found.items);
        saveItems(found.items);
      }
    },
    [savedLists, saveItems]
  );

  const deleteSavedBasket = useCallback((listId: string) => {
    setSavedLists((prev) => {
      const updated = prev.filter((l) => l.id !== listId);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('wf_saved_baskets_v1', JSON.stringify(updated));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const totalPacks = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    count: totalPacks,
    uniqueCount: cartItems.length,
    isReady,
    add,
    updateQuantity,
    remove,
    clearCart,
    savedLists,
    saveCurrentBasket,
    loadSavedBasket,
    deleteSavedBasket,
  };
}
