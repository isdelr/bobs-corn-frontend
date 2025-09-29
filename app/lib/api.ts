"use client";

import { useAuth } from "@/app/store/auth";
import { API_BASE } from "@/app/lib/config";

/**
 * API Client Module
 * 
 * This module provides a centralized API client for all backend communications.
 * Key features:
 * - Automatic token injection for authenticated requests
 * - Consistent error handling across the application
 * - Automatic 401 handling with logout
 * - Type-safe request/response handling
 * 
 * @module api
 */

/**
 * Type definition for JSON-serializable data
 * Used to ensure type safety for API payloads
 */
type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

/**
 * Core request function that handles all HTTP communications with the backend
 * 
 * Features:
 * - Automatic base URL prefixing for relative paths
 * - JWT token injection from auth store
 * - Standardized error handling with status codes
 * - Automatic session cleanup on 401 (unauthorized)
 * 
 * @template T - The expected response type
 * @param {string} path - API endpoint path (can be relative or absolute)
 * @param {RequestInit} init - Fetch API configuration options
 * @returns {Promise<T>} Typed response data
 * @throws {Error} Enhanced error with status code and response data
 * 
 * @example
 * // Authenticated request
 * const user = await request<User>('/api/users/me');
 * 
 * // POST with body
 * const order = await request<Order>('/api/orders', {
 *   method: 'POST',
 *   body: JSON.stringify({ items: [...] })
 * });
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  // Construct full URL - support both relative and absolute paths
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  
  // Set up headers with proper defaults
  const headers = new Headers(init.headers || {});
  
  // Ensure JSON content type for requests with body
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  // Inject authentication token if available
  // Using .getState() for synchronous access outside of React components
  const token = useAuth.getState().token;
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Execute the request
  const res = await fetch(url, { ...init, headers });
  
  // Parse response body safely
  const text = await res.text();
  const data = text ? (JSON.parse(text) as any) : undefined;
  
  // Handle error responses
  if (!res.ok) {
    // Auto-logout on 401 (Unauthorized) to maintain security
    // This handles expired tokens or invalid sessions gracefully
    if (res.status === 401) {
      try {
        useAuth.getState().logout();
      } catch {
        // Fail silently if logout fails to prevent error cascading
      }
    }
    
    // Create enhanced error object with additional context
    const err: any = new Error(data?.error || data?.message || res.statusText);
    err.status = res.status; // Attach HTTP status for error handling
    err.data = data; // Attach response data for debugging
    throw err;
  }
  
  return data as T;
}

/**
 * Public API interface with convenience methods
 * 
 * Provides a clean, RESTful interface for API operations.
 * All methods return typed promises and handle errors consistently.
 * 
 * @example
 * // GET request
 * const products = await api.get<Product[]>('/products');
 * 
 * // POST request with body
 * const result = await api.post<PurchaseResult>('/purchase', {
 *   productId: '123',
 *   quantity: 1
 * });
 */
export const api = {
  /**
   * Performs a GET request
   * @template T - Expected response type
   * @param {string} path - API endpoint path
   * @param {RequestInit} init - Additional fetch options
   * @returns {Promise<T>} Typed response data
   */
  get: <T>(path: string, init: RequestInit = {}) => 
    request<T>(path, { ...init, method: "GET" }),
  
  /**
   * Performs a POST request
   * @template T - Expected response type
   * @param {string} path - API endpoint path
   * @param {Json} body - Optional request body (will be JSON stringified)
   * @param {RequestInit} init - Additional fetch options
   * @returns {Promise<T>} Typed response data
   */
  post: <T>(path: string, body?: Json, init: RequestInit = {}) =>
    request<T>(path, { 
      ...init, 
      method: "POST", 
      body: body ? JSON.stringify(body) : undefined 
    }),
};
