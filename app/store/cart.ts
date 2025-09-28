"use client";
import { create } from "zustand";

export type CartLine = {
  id: string; // product id
  title: string;
  price: number; // unit price
  image?: string;
  optionsKey?: string; // e.g., size=1lb;color=red
};

export type CartItem = CartLine & {
  key: string; // unique key per product+options
  qty: number;
  subtotal: number;
};

type CartState = {
  items: Record<string, CartItem>; // key -> item
  addItem: (line: CartLine, qty?: number) => void;
  removeItem: (key: string) => void;
  setItemQty: (key: string, qty: number) => void;
  clear: () => void;
};

function makeKey(line: CartLine): string {
  return `${line.id}__${line.optionsKey ?? ""}`;
}

export const useCart = create<CartState>((set) => ({
  items: {},
  addItem: (line, qty = 1) =>
    set((state) => {
      const key = makeKey(line);
      const prev = state.items[key];
      const newQty = Math.max(1, Math.min(99, (prev?.qty ?? 0) + qty));
      const item: CartItem = {
        ...line,
        key,
        qty: newQty,
        subtotal: Number((line.price * newQty).toFixed(2)),
      };
      return { items: { ...state.items, [key]: item } };
    }),
  removeItem: (key) => set((s) => {
    const { [key]: _, ...rest } = s.items;
    return { items: rest };
  }),
  setItemQty: (key, qty) =>
    set((state) => {
      const item = state.items[key];
      if (!item) return state;
      const clamped = Math.max(1, Math.min(99, qty));
      const next: CartItem = { ...item, qty: clamped, subtotal: Number((item.price * clamped).toFixed(2)) };
      return { items: { ...state.items, [key]: next } };
    }),
  clear: () => set({ items: {} }),
}));

// Selectors
export function useCartItems() {
  return useCart((s) => Object.values(s.items));
}

export function useCartCount() {
  return useCart((s) => Object.values(s.items).reduce((sum, it) => sum + it.qty, 0));
}

export function useCartTotal() {
  return useCart((s) => Number(Object.values(s.items).reduce((sum, it) => sum + it.subtotal, 0).toFixed(2)));
}
