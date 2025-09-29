"use client";

/**
 * Data Fetching Layer (React Query Hooks)
 * 
 * This module provides all data fetching hooks for Bob's Corn frontend.
 * Uses TanStack Query (React Query) for:
 * - Intelligent caching and synchronization
 * - Optimistic updates
 * - Background refetching
 * - Request deduplication
 * 
 * CRITICAL BUSINESS LOGIC:
 * The purchase mutation respects Bob's rate limit: "1 corn per client per minute".
 * The backend enforces this rule and returns 429 (Too Many Requests) when exceeded.
 * 
 * Architecture Pattern: Custom hooks wrapping React Query for type safety
 * and centralized query configuration.
 * 
 * @module lib/queries
 */

import { useQuery, useMutation, UseQueryOptions, keepPreviousData, QueryKey } from "@tanstack/react-query";
import type { Product } from "@/app/lib/products";
import { useAuth, type User } from "@/app/store/auth";
import { api } from "@/app/lib/api";

/**
 * Authentication response type from backend
 * @interface AuthResponse
 */
type AuthResponse = { user: User; token: string };

/**
 * Order item type - represents a single line in an order
 * 
 * @interface OrderItem
 * @property {string} productId - Product identifier
 * @property {string} slug - URL-friendly product identifier
 * @property {string} title - Product display name
 * @property {number} price - Unit price at time of purchase
 * @property {number} quantity - Number of units purchased
 */
export type OrderItem = {
  productId: string;
  slug: string;
  title: string;
  price: number; // unit price
  quantity: number;
};

/**
 * Complete order type
 * 
 * @interface Order
 * @property {string} id - Order identifier
 * @property {number} total - Order total in USD
 * @property {string} status - Order status (pending, completed, etc.)
 * @property {string} [createdAt] - ISO timestamp of order creation
 * @property {Object} [shippingAddress] - Shipping details
 * @property {OrderItem[]} items - Line items in the order
 */
export type Order = {
  id: string;
  total: number;
  status: string;
  createdAt?: string;
  shippingAddress?: Record<string, unknown> | null;
  items: OrderItem[];
};

/**
 * ===========================================
 * PRODUCT QUERIES
 * ===========================================
 */

/**
 * Fetch all products with optional limit
 * 
 * Features:
 * - Pagination support via limit parameter
 * - Keeps previous data during refetch (no loading flicker)
 * - Can be conditionally enabled/disabled
 * 
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of products to fetch
 * @param {boolean} [options.enabled] - Whether query should run
 * @returns {UseQueryResult} React Query result with Product[] data
 * 
 * @example
 * const { data: products, isLoading } = useProductsQuery({ limit: 10 });
 */
export function useProductsQuery(
  options?: { limit?: number } & Pick<UseQueryOptions<Product[], Error, Product[], QueryKey>, "enabled">
) {
  const { limit, enabled } = options ?? {};
  return useQuery({
    queryKey: ["products", { limit }], // Cache key includes limit for proper caching
    queryFn: async () => {
      const params = typeof limit === "number" ? `?limit=${encodeURIComponent(limit)}` : "";
      return api.get<Product[]>(`/products${params}`);
    },
    placeholderData: keepPreviousData, // Smooth transitions between pages
    enabled: enabled ?? true,
  });
}

/**
 * Fetch single product by slug
 * 
 * Used on product detail pages. Only runs when slug is provided.
 * 
 * @param {string} [slug] - Product slug (URL identifier)
 * @returns {UseQueryResult} React Query result with single Product
 * 
 * @example
 * // In product detail page
 * const { data: product, isLoading } = useProductQuery(params.slug);
 */
export function useProductQuery(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug], // Unique cache per product
    queryFn: async () => {
      if (!slug) throw new Error("missing slug");
      return api.get<Product>(`/products/${encodeURIComponent(slug)}`);
    },
    enabled: Boolean(slug), // Only fetch when slug exists
  });
}

/**
 * Search products by term
 * 
 * Implements search with automatic trimming and case normalization.
 * Only triggers search when term is non-empty.
 * 
 * @param {string} term - Search query
 * @returns {UseQueryResult} React Query result with matching products
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState("");
 * const { data: results } = useSearchProductsQuery(searchTerm);
 */
export function useSearchProductsQuery(term: string) {
  const q = term.trim().toLowerCase();
  return useQuery({
    queryKey: ["products", "search", q], // Cache searches separately
    queryFn: async () => {
      if (q.length === 0) return [] as Product[];
      return api.get<Product[]>(`/products/search?q=${encodeURIComponent(q)}`);
    },
    enabled: q.length > 0, // Prevent empty searches
  });
}

/**
 * Fetch featured products for homepage
 * 
 * Returns curated list of featured products.
 * Typically used for homepage hero sections.
 * 
 * @returns {UseQueryResult} React Query result with featured Product[]
 */
export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => api.get<Product[]>("/products/featured"),
  });
}

/**
 * Category type definition
 * @interface Category
 */
export type Category = { 
  key: string; 
  title: string; 
  subtitle?: string; 
};

/**
 * Fetch product categories
 * 
 * Returns all available product categories for navigation.
 * 
 * @returns {UseQueryResult} React Query result with Category[]
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => api.get<Category[]>("/products/categories"),
  });
}

/**
 * ===========================================
 * AUTHENTICATION QUERIES & MUTATIONS
 * ===========================================
 */

/**
 * Fetch current user profile
 * 
 * Only runs when user is authenticated (has token).
 * Used to verify and refresh user data.
 * 
 * @returns {UseQueryResult} React Query result with User data
 */
export function useProfileQuery() {
  const token = useAuth((s) => s.token);
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => api.get<User>("/auth/me"),
    enabled: Boolean(token), // Only fetch when authenticated
  });
}

/**
 * Login mutation
 * 
 * Authenticates user and updates global auth state.
 * Automatically stores token for subsequent API calls.
 * 
 * @returns {UseMutationResult} Mutation hook for login
 * 
 * @example
 * const loginMutation = useLoginMutation();
 * await loginMutation.mutateAsync({ email, password });
 */
export function useLoginMutation() {
  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload: { email: string; password: string }): Promise<User> => {
      const { user, token } = await api.post<AuthResponse>("/auth/login", payload);
      // Update global auth state after successful login
      useAuth.getState().login(user, token);
      return user;
    },
  });
}

/**
 * Signup mutation
 * 
 * Creates new user account and automatically logs them in.
 * 
 * @returns {UseMutationResult} Mutation hook for signup
 * 
 * @example
 * const signupMutation = useSignupMutation();
 * await signupMutation.mutateAsync({ name, email, password });
 */
export function useSignupMutation() {
  return useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: async (payload: { name?: string; email: string; password: string }): Promise<User> => {
      const { user, token } = await api.post<AuthResponse>("/auth/signup", payload);
      // Auto-login after successful signup
      useAuth.getState().login(user, token);
      return user;
    },
  });
}

/**
 * Logout mutation
 * 
 * Clears authentication on both backend and frontend.
 * Gracefully handles backend failures.
 * 
 * @returns {UseMutationResult} Mutation hook for logout
 */
export function useLogoutMutation() {
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: async () => {
      try {
        await api.post<{ success: boolean }>("/auth/logout", {});
      } catch {
        // Backend logout is optional - always clear frontend state
      }
      useAuth.getState().logout();
      return true;
    },
  });
}

/**
 * ===========================================
 * ORDER QUERIES & MUTATIONS
 * ===========================================
 */

/**
 * Fetch user's order history
 * 
 * Returns all orders for authenticated user.
 * Only runs when user has valid token.
 * 
 * @returns {UseQueryResult} React Query result with Order[]
 */
export function useOrdersQuery() {
  const token = useAuth((s) => s.token);
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => api.get<Order[]>("/orders"),
    enabled: Boolean(token), // Requires authentication
  });
}

/**
 * Fetch single order details
 * 
 * Returns detailed order information including all line items.
 * 
 * @param {string} [id] - Order identifier
 * @returns {UseQueryResult} React Query result with Order
 */
export function useOrderQuery(id: string | undefined) {
  const token = useAuth((s) => s.token);
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async (): Promise<Order> => {
      if (!id) throw new Error("missing id");
      return api.get<Order>(`/orders/${encodeURIComponent(id)}`);
    },
    enabled: Boolean(token && id), // Requires both auth and ID
  });
}

/**
 * Purchase mutation - The core business logic endpoint
 * 
 * CRITICAL: This mutation handles Bob's Corn purchases with rate limiting.
 * Business Rule: "At most 1 corn per client per minute"
 * 
 * The backend enforces rate limiting and will return:
 * - 200: Successful purchase (corn emoji 🌽)
 * - 429: Too Many Requests (rate limit exceeded)
 * 
 * @returns {UseMutationResult} Mutation hook for purchases
 * 
 * @example
 * const purchaseMutation = usePurchaseMutation();
 * try {
 *   await purchaseMutation.mutateAsync({ items: cartItems });
 *   // Success: Customer bought corn!
 * } catch (error) {
 *   if (error.status === 429) {
 *     // Rate limited: Customer must wait
 *     alert("You can only buy 1 corn per minute!");
 *   }
 * }
 */
export function usePurchaseMutation() {
  return useMutation({
    mutationKey: ["orders", "purchase"],
    mutationFn: async (payload: {
      items: Array<{ slug?: string; productId?: string | number; quantity: number }>;
      shippingAddress?: Record<string, unknown>;
      saveAddress?: boolean;
    }): Promise<{ order: Order }> => {
      // POST to purchase endpoint - rate limiting enforced server-side
      return api.post<{ order: Order }>("/orders/purchase", payload);
    },
  });
}
