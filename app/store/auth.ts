"use client";
import { create } from "zustand";

export type User = {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  login: (user: User, token?: string | null) => void;
  logout: () => void;
};

// Client-side auth store with simple localStorage persistence.
const initial = (() => {
  if (typeof window === "undefined") return { user: null as User | null, token: null as string | null };
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const parsed = JSON.parse(raw) as { user: User | null; token: string | null };
      return { user: parsed.user, token: parsed.token };
    }
  } catch {
    // ignore
  }
  return { user: null as User | null, token: null as string | null };
})();

export const useAuth = create<AuthState>((set) => ({
  user: initial.user,
  token: initial.token,
  login: (user, token: string | null = null) => {
    set({ user, token });
    try {
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    } catch {
      // ignore
    }
  },
  logout: () => {
    set({ user: null, token: null });
    try {
      localStorage.removeItem("auth");
    } catch {
      // ignore
    }
  },
}));

export function useUser() {
  return useAuth((s) => s.user);
}
