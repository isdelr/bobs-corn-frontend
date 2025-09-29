"use client";
import { useQuery, useMutation, UseQueryOptions, keepPreviousData, QueryKey } from "@tanstack/react-query";
import type { Product } from "@/app/lib/products";
import { useAuth, type User } from "@/app/store/auth";
import { api } from "@/app/lib/api";

type AuthResponse = { user: User; token: string };

// Orders types
export type OrderItem = {
  productId: string;
  slug: string;
  title: string;
  price: number; // unit price
  quantity: number;
};

export type Order = {
  id: string;
  total: number;
  status: string;
  createdAt?: string;
  shippingAddress?: Record<string, unknown> | null;
  items: OrderItem[];
};

// PRODUCTS (via backend)
export function useProductsQuery(options?: { limit?: number } & Pick<UseQueryOptions<Product[], Error, Product[], QueryKey>, "enabled">) {
  const { limit, enabled } = options ?? {};
  return useQuery({
    queryKey: ["products", { limit }],
    queryFn: async () => {
      const params = typeof limit === "number" ? `?limit=${encodeURIComponent(limit)}` : "";
      return api.get<Product[]>(`/products${params}`);
    },
    placeholderData: keepPreviousData,
    enabled: enabled ?? true,
  });
}

export function useProductQuery(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      if (!slug) throw new Error("missing slug");
      return api.get<Product>(`/products/${encodeURIComponent(slug)}`);
    },
    enabled: Boolean(slug),
  });
}

export function useSearchProductsQuery(term: string) {
  const q = term.trim().toLowerCase();
  return useQuery({
    queryKey: ["products", "search", q],
    queryFn: async () => {
      if (q.length === 0) return [] as Product[];
      return api.get<Product[]>(`/products/search?q=${encodeURIComponent(q)}`);
    },
    enabled: q.length > 0,
  });
}

export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => api.get<Product[]>("/products/featured"),
  });
}

export type Category = { key: string; title: string; subtitle?: string };
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => api.get<Category[]>("/products/categories"),
  });
}

// AUTH (placeholder — local only)
export function useProfileQuery() {
  const token = useAuth((s) => s.token);
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => api.get<User>("/auth/me"),
    enabled: Boolean(token),
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload: { email: string; password: string }): Promise<User> => {
      const { user, token } = await api.post<AuthResponse>("/auth/login", payload);
      useAuth.getState().login(user, token);
      return user;
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: async (payload: { name?: string; email: string; password: string }): Promise<User> => {
      const { user, token } = await api.post<AuthResponse>("/auth/signup", payload);
      useAuth.getState().login(user, token);
      return user;
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: async () => {
      try {
        await api.post<{ success: boolean }>("/auth/logout", {});
      } catch {
        // ignore backend errors on logout
      }
      useAuth.getState().logout();
      return true;
    },
  });
}

// ORDERS
export function useOrdersQuery() {
  const token = useAuth((s) => s.token);
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => api.get<Order[]>("/orders"),
    enabled: Boolean(token),
  });
}

export function useOrderQuery(id: string | undefined) {
  const token = useAuth((s) => s.token);
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async (): Promise<Order> => {
      if (!id) throw new Error("missing id");
      return api.get<Order>(`/orders/${encodeURIComponent(id)}`);
    },
    enabled: Boolean(token && id),
  });
}

export function usePurchaseMutation() {
  return useMutation({
    mutationKey: ["orders", "purchase"],
    mutationFn: async (payload: {
      items: Array<{ slug?: string; productId?: string | number; quantity: number }>;
      shippingAddress?: Record<string, unknown>;
      saveAddress?: boolean;
    }): Promise<{ order: Order }> => {
      return api.post<{ order: Order }>("/orders/purchase", payload);
    },
  });
}
