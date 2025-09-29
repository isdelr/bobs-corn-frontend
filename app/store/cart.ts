"use client";

/**
 * Shopping Cart Store
 * 
 * Manages shopping cart state for Bob's Corn e-commerce platform.
 * This store handles cart operations while respecting the business rule:
 * "At most 1 corn per client per minute" (rate limiting handled server-side).
 * 
 * Architecture: Using Zustand for state management with computed selectors
 * for performance optimization and React best practices.
 * 
 * Note: Cart state is ephemeral (not persisted) to ensure fresh pricing
 * and availability on page reload.
 * 
 * @module store/cart
 */

import React from "react";
import { create } from "zustand";

/**
 * Cart line item input type
 * 
 * Represents the minimal data needed to add a product to cart.
 * This is the input format for the addItem action.
 * 
 * @interface CartLine
 * @property {string} id - Product identifier
 * @property {string} title - Product display name
 * @property {number} price - Unit price in USD
 * @property {string} [image] - Optional product image URL
 * @property {string} [optionsKey] - Serialized product options (e.g., "size=1lb;color=red")
 */
export type CartLine = {
  id: string; // product id
  title: string;
  price: number; // unit price
  image?: string;
  optionsKey?: string; // e.g., size=1lb;color=red
};

/**
 * Complete cart item type
 * 
 * Extends CartLine with computed properties for cart display.
 * Each item is uniquely identified by product ID + options combination.
 * 
 * @interface CartItem
 * @extends {CartLine}
 * @property {string} key - Unique identifier (product + options)
 * @property {number} qty - Quantity (clamped between 1-99)
 * @property {number} subtotal - Line total (price × qty)
 */
export type CartItem = CartLine & {
  key: string; // unique key per product+options
  qty: number;
  subtotal: number;
};

/**
 * Cart state interface
 * 
 * Defines the cart store structure and available actions.
 * Uses a Record for O(1) lookups by item key.
 * 
 * @interface CartState
 * @property {Record<string, CartItem>} items - Cart items indexed by key
 * @property {Function} addItem - Add or increment item quantity
 * @property {Function} removeItem - Remove item from cart
 * @property {Function} setItemQty - Update item quantity
 * @property {Function} clear - Empty the entire cart
 */
type CartState = {
  items: Record<string, CartItem>; // key -> item
  addItem: (line: CartLine, qty?: number) => void;
  removeItem: (key: string) => void;
  setItemQty: (key: string, qty: number) => void;
  clear: () => void;
};

/**
 * Generate unique key for cart items
 * 
 * Creates a deterministic key from product ID and options.
 * This allows the same product with different options to be
 * treated as separate cart items.
 * 
 * @param {CartLine} line - Cart line item
 * @returns {string} Unique key for the item
 * 
 * @example
 * makeKey({ id: "corn-123", optionsKey: "size=large" })
 * // Returns: "corn-123__size=large"
 */
function makeKey(line: CartLine): string {
  return `${line.id}__${line.optionsKey ?? ""}`;
}

/**
 * Main cart store hook
 * 
 * Creates a Zustand store for cart management with optimistic updates.
 * All monetary calculations use proper decimal rounding to avoid
 * floating-point precision issues.
 * 
 * Business Logic:
 * - Quantity is clamped between 1-99 per item
 * - Subtotals are calculated and rounded to 2 decimal places
 * - Items are merged by product ID + options combination
 * 
 * @example
 * // In a component
 * const { addItem, removeItem } = useCart();
 * 
 * // Add to cart
 * addItem({ id: "1", title: "Yellow Corn", price: 5.99 });
 */
export const useCart = create<CartState>((set) => ({
  items: {},
  
  /**
   * Add item to cart or increment existing quantity
   * 
   * Implements smart merging: if the exact same product+options
   * already exists, increments quantity instead of duplicating.
   * 
   * @param {CartLine} line - Product to add
   * @param {number} qty - Quantity to add (default: 1)
   * 
   * Rate Limit Note: While multiple items can be added to cart,
   * the backend enforces the "1 corn per minute" rule at checkout.
   */
  addItem: (line, qty = 1) =>
    set((state) => {
      const key = makeKey(line);
      const prev = state.items[key];
      
      // Calculate new quantity with bounds checking
      const newQty = Math.max(1, Math.min(99, (prev?.qty ?? 0) + qty));
      
      // Create updated item with recalculated subtotal
      const item: CartItem = {
        ...line,
        key,
        qty: newQty,
        subtotal: Number((line.price * newQty).toFixed(2)), // Avoid floating-point errors
      };
      
      // Return immutable update
      return { items: { ...state.items, [key]: item } };
    }),
  
  /**
   * Remove item from cart completely
   * 
   * Uses object destructuring to create a new items object
   * without the removed item (immutable delete pattern).
   * 
   * @param {string} key - Unique item key to remove
   */
  removeItem: (key) => set((s) => {
    const { [key]: _, ...rest } = s.items;
    return { items: rest };
  }),
  
  /**
   * Update quantity for existing item
   * 
   * Allows direct quantity setting with automatic clamping.
   * Returns early if item doesn't exist to prevent errors.
   * 
   * @param {string} key - Item key to update
   * @param {number} qty - New quantity (will be clamped 1-99)
   */
  setItemQty: (key, qty) =>
    set((state) => {
      const item = state.items[key];
      if (!item) return state; // No-op if item doesn't exist
      
      // Clamp quantity and recalculate subtotal
      const clamped = Math.max(1, Math.min(99, qty));
      const next: CartItem = { 
        ...item, 
        qty: clamped, 
        subtotal: Number((item.price * clamped).toFixed(2)) 
      };
      
      return { items: { ...state.items, [key]: next } };
    }),
  
  /**
   * Clear entire cart
   * 
   * Used after successful checkout or when user wants to start over.
   * Simply replaces items with empty object.
   */
  clear: () => set({ items: {} }),
}));

/**
 * Selector: Get cart items as array
 * 
 * Converts the items Record to an array for easier iteration in UI.
 * Memoized to prevent unnecessary re-renders when items haven't changed.
 * 
 * @returns {CartItem[]} Array of cart items
 * 
 * @example
 * function CartList() {
 *   const items = useCartItems();
 *   return items.map(item => <CartRow key={item.key} item={item} />);
 * }
 */
export function useCartItems() {
  const map = useCart((s) => s.items);
  return React.useMemo(() => Object.values(map), [map]);
}

/**
 * Selector: Get total item count
 * 
 * Calculates the sum of all item quantities in cart.
 * Used for cart badge display in navigation.
 * 
 * @returns {number} Total quantity across all cart items
 * 
 * @example
 * function CartBadge() {
 *   const count = useCartCount();
 *   if (count === 0) return null;
 *   return <Badge>{count}</Badge>;
 * }
 */
export function useCartCount() {
  return useCart((s) => Object.values(s.items).reduce((sum, it) => sum + it.qty, 0));
}

/**
 * Selector: Get cart total price
 * 
 * Calculates the sum of all item subtotals.
 * Returns a properly rounded number for monetary display.
 * 
 * @returns {number} Total cart value in USD
 * 
 * @example
 * function CartTotal() {
 *   const total = useCartTotal();
 *   return <Typography>${total.toFixed(2)}</Typography>;
 * }
 */
export function useCartTotal() {
  return useCart((s) => 
    Number(Object.values(s.items).reduce((sum, it) => sum + it.subtotal, 0).toFixed(2))
  );
}
