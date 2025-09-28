"use client";
import { useQuery, useMutation, UseQueryOptions, keepPreviousData, QueryKey } from "@tanstack/react-query";
import { getAllProducts, getProductBySlug, type Product } from "@/app/lib/products";
import { useAuth, type User } from "@/app/store/auth";

// Small helper to simulate async work without backend
function delay<T>(val: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(val), ms));
}

// PRODUCTS
export function useProductsQuery(options?: { limit?: number } & Pick<UseQueryOptions<Product[], Error, Product[], QueryKey>, "enabled">) {
  const { limit, enabled } = options ?? {};
  return useQuery({
    queryKey: ["products", { limit }],
    queryFn: async () => {
      const all = getAllProducts();
      const list = typeof limit === "number" ? all.slice(0, limit) : all;
      return delay(list);
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
      const p = getProductBySlug(slug);
      if (!p) throw new Error("product not found");
      return delay(p);
    },
    enabled: Boolean(slug),
  });
}

export function useSearchProductsQuery(term: string) {
  const q = term.trim().toLowerCase();
  return useQuery({
    queryKey: ["products", "search", q],
    queryFn: async () => {
      const all = getAllProducts();
      const res = q.length === 0 ? [] : all.filter((p) => p.title.toLowerCase().includes(q));
      return delay(res);
    },
    enabled: q.length > 0,
  });
}

export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const all = getAllProducts();
      // Simple heuristic: best seller tag or highest rating
      const res = all
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
      return delay(res);
    },
  });
}

export type Category = { key: string; title: string; subtitle?: string };
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> =>
      delay([
        { key: "kernels", title: "Popcorn Kernels", subtitle: "Classic & heirloom" },
        { key: "seasonings", title: "Seasonings", subtitle: "Sweet & savory" },
        { key: "gourmet", title: "Gourmet Flavors", subtitle: "Small‑batch treats" },
        { key: "gifts", title: "Gifts & Bundles", subtitle: "Share the joy" },
        { key: "merch", title: "Merch", subtitle: "Tees, hats & more" },
      ]),
  });
}

// AUTH (placeholder — local only)
export function useProfileQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => delay(useAuth.getState().user),
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload: { email: string; password: string }): Promise<User> => {
      const name = payload.email.split("@")[0] || "User";
      const user: User = { name, email: payload.email };
      useAuth.getState().login(user);
      return delay(user, 100);
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: async (payload: { name?: string; email: string; password: string }): Promise<User> => {
      const name = payload.name && payload.name.trim().length > 0 ? payload.name : payload.email.split("@")[0] || "User";
      const user: User = { name, email: payload.email };
      useAuth.getState().login(user);
      return delay(user, 120);
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: async () => {
      useAuth.getState().logout();
      return delay(true, 80);
    },
  });
}
