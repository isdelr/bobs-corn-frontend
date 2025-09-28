"use client";
import { create } from "zustand";

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

// Minimal, client-side auth store (no persistence). Defaults to logged out.
export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export function useUser() {
  return useAuth((s) => s.user);
}
