import { useState, useEffect } from 'react';

const STORAGE_KEY = 'samgat_wishlist';

export function useWishlist() {
  const [items, setItems] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const toggle = (productId: number) => {
    setItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const has = (productId: number) => items.includes(productId);

  const clear = () => setItems([]);

  return { items, toggle, has, clear, count: items.length };
}
