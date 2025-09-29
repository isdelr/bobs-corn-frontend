/**
 * Configuration Module
 * 
 * Centralized configuration for the Bob's Corn frontend application.
 * This module manages environment-specific settings and provides
 * a single source of truth for configuration values.
 * 
 * @module config
 */

/**
 * Base URL for the backend API
 * 
 * Uses environment variable for deployment flexibility:
 * - Development: Points to local backend (localhost:4000)
 * - Production: Can be configured via NEXT_PUBLIC_API_BASE env var
 * 
 * The NEXT_PUBLIC_ prefix makes this variable available in the browser.
 * 
 * @constant {string}
 * @default "http://localhost:4000/api"
 * 
 * @example
 * // Usage in API calls
 * const response = await fetch(`${API_BASE}/products`);
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

/**
 * Rate limit configuration for Bob's Corn business rule
 * 
 * BUSINESS REQUIREMENT: Bob's policy is to sell at most 1 corn per client per minute.
 * This constant can be used for client-side rate limit awareness.
 * 
 * @constant {Object}
 */
export const RATE_LIMIT = {
  MAX_PURCHASES_PER_MINUTE: 1,
  WINDOW_MS: 60000, // 1 minute in milliseconds
};

/**
 * Application metadata
 * 
 * @constant {Object}
 */
export const APP_CONFIG = {
  name: "Bob's Corn",
  tagline: "Farm-fresh popcorn, seasonings, gifts & more",
  company: "Bob's Corn Farm",
  supportEmail: "support@bobscorn.com",
};
