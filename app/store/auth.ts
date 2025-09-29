"use client";

/**
 * Authentication Store
 * 
 * Manages user authentication state using Zustand for state management.
 * Features persistent session storage via localStorage and provides
 * centralized authentication state for the entire application.
 * 
 * Architecture Decision: Using Zustand for its simplicity, TypeScript support,
 * and minimal boilerplate compared to Redux or Context API.
 * 
 * @module store/auth
 */

import { create } from "zustand";

/**
 * User model interface
 * 
 * Represents the authenticated user's data structure.
 * This type is used throughout the application for type safety.
 * 
 * @interface User
 * @property {string} [id] - Unique user identifier (optional for new users)
 * @property {string} name - User's display name
 * @property {string} email - User's email address (used for authentication)
 * @property {string} [avatarUrl] - Optional profile picture URL
 */
export type User = {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

/**
 * Authentication state interface
 * 
 * Defines the shape of the authentication store including
 * state properties and action methods.
 * 
 * @interface AuthState
 * @property {User | null} user - Current authenticated user or null
 * @property {string | null} token - JWT token for API authentication
 * @property {Function} login - Action to authenticate user
 * @property {Function} logout - Action to clear authentication
 */
type AuthState = {
  user: User | null;
  token: string | null;
  login: (user: User, token?: string | null) => void;
  logout: () => void;
};

/**
 * Initialize authentication state from localStorage
 * 
 * This IIFE (Immediately Invoked Function Expression) handles:
 * 1. SSR safety check (typeof window check)
 * 2. localStorage parsing with error handling
 * 3. Hydration of initial state from persistent storage
 * 
 * Security Note: Storing JWT in localStorage has XSS risks.
 * For production, consider httpOnly cookies or more secure storage.
 * 
 * @returns {Object} Initial auth state from localStorage or defaults
 */
const initial = (() => {
  // Guard against SSR execution where window/localStorage doesn't exist
  if (typeof window === "undefined") {
    return { user: null as User | null, token: null as string | null };
  }
  
  try {
    // Attempt to restore previous session from localStorage
    const raw = localStorage.getItem("auth");
    if (raw) {
      const parsed = JSON.parse(raw) as { user: User | null; token: string | null };
      return { user: parsed.user, token: parsed.token };
    }
  } catch (error) {
    // Silent fail on parse errors to prevent app crashes
    // In production, consider logging to error tracking service
    console.warn("Failed to parse auth from localStorage:", error);
  }
  
  // Return default unauthenticated state
  return { user: null as User | null, token: null as string | null };
})();

/**
 * Main authentication store hook
 * 
 * Creates a Zustand store with authentication state and actions.
 * This store is globally accessible and automatically syncs with localStorage.
 * 
 * @example
 * // In a component
 * const { user, login, logout } = useAuth();
 * 
 * // Access token directly (outside React)
 * const token = useAuth.getState().token;
 */
export const useAuth = create<AuthState>((set) => ({
  // Initialize state from localStorage (handles SSR)
  user: initial.user,
  token: initial.token,
  
  /**
   * Login action - Updates state and persists to localStorage
   * 
   * @param {User} user - User object from authentication response
   * @param {string | null} token - JWT token for API calls (optional)
   * 
   * Side effects:
   * - Updates Zustand store state
   * - Persists to localStorage for session persistence
   * - Triggers re-renders in all components using this store
   */
  login: (user, token: string | null = null) => {
    // Update store state
    set({ user, token });
    
    // Persist to localStorage for session recovery
    try {
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    } catch (error) {
      // Handle quota exceeded or other storage errors
      console.error("Failed to persist auth to localStorage:", error);
    }
  },
  
  /**
   * Logout action - Clears authentication state
   * 
   * Performs complete authentication cleanup:
   * - Clears store state
   * - Removes localStorage data
   * - Triggers re-renders to update UI
   * 
   * Note: This is also called automatically on 401 responses in api.ts
   */
  logout: () => {
    // Clear store state
    set({ user: null, token: null });
    
    // Clear persisted session
    try {
      localStorage.removeItem("auth");
    } catch (error) {
      // Fail silently as logout should always succeed from user perspective
      console.error("Failed to clear auth from localStorage:", error);
    }
  },
}));

/**
 * Convenience hook to access only the user object
 * 
 * Optimized selector that only triggers re-renders when user changes,
 * not when token or actions change. This follows React performance best practices.
 * 
 * @returns {User | null} Current authenticated user or null
 * 
 * @example
 * function UserProfile() {
 *   const user = useUser();
 *   if (!user) return <Login />;
 *   return <div>Welcome, {user.name}!</div>;
 * }
 */
export function useUser() {
  return useAuth((state) => state.user);
}
