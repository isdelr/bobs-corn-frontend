"use client";
import { create } from 'zustand';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  optionsKey?: string; // e.g., size=1lb;color=red
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (id: string, optionsKey?: string) => void;
  updateQty: (id: string, qty: number, optionsKey?: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  addItem: (item, qty = 1) => {
    set((state) => {
      const keyMatch = (i: CartItem) => i.id === item.id && i.optionsKey === item.optionsKey;
      const existing = state.items.find(keyMatch);
      if (existing) {
        return {
          items: state.items.map((i) => (keyMatch(i) ? { ...i, qty: i.qty + qty } : i)),
        };
      }
      return { items: [...state.items, { ...item, qty }] };
    });
  },
  removeItem: (id, optionsKey) => {
    set((state) => ({ items: state.items.filter((i) => !(i.id === id && i.optionsKey === optionsKey)) }));
  },
  updateQty: (id, qty, optionsKey) => {
    if (qty <= 0) {
      set((state) => ({ items: state.items.filter((i) => !(i.id === id && i.optionsKey === optionsKey)) }));
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.id === id && i.optionsKey === optionsKey ? { ...i, qty } : i)),
    }));
  },
  clear: () => set({ items: [] }),
}));

export function useCartCount() {
  const items = useCart((s) => s.items);
  return items.reduce((sum, i) => sum + i.qty, 0);
}
