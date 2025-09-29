/**
 * Root Layout Component
 * 
 * This is the main application layout that wraps all pages in the Next.js app.
 * It provides essential context providers and global components.
 * 
 * Architecture Decisions:
 * 1. Provider Hierarchy: QueryProvider > ThemeProvider > ToastProvider
 *    - QueryProvider at top for data fetching
 *    - ThemeProvider for consistent UI theming
 *    - ToastProvider for global notifications
 * 
 * 2. NavGate for conditional navigation rendering
 *    - Automatically hides on auth pages (login/signup)
 * 
 * 3. SEO optimized metadata for better search visibility
 * 
 * @module app/layout
 */

import type { Metadata } from "next";
import ThemeProvider from "@/app/components/shared/ThemeProvider";
import NavGate from "@/app/components/shared/NavGate";
import QueryProvider from "@/app/components/shared/QueryProvider";
import ToastProvider from "@/app/components/shared/ToastProvider";

/**
 * Page Metadata
 * 
 * SEO-optimized metadata for the entire application.
 * These values can be overridden on individual pages.
 */
export const metadata: Metadata = {
  title: "Bob's Corn — Farm‑fresh popcorn, seasonings, gifts & more",
  description: "Discover farm‑fresh popcorn, artisanal seasonings, gift bundles, and more. Clean, fast shopping experience inspired by the best storefronts.",
  // Additional metadata for better SEO
  keywords: "corn, popcorn, farm fresh, Bob's Corn, kernels, gourmet popcorn",
  authors: [{ name: "Bob's Corn Farm" }],
  openGraph: {
    title: "Bob's Corn - Premium Farm Fresh Popcorn",
    description: "Shop the finest corn products with our fair pricing policy",
    type: "website",
  },
};

/**
 * Root Layout Component
 * 
 * Provides the foundational structure for all pages:
 * - Data fetching infrastructure (React Query)
 * - Theme consistency (Material-UI)
 * - Toast notifications
 * - Conditional navigation
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render
 * @returns {JSX.Element} Complete HTML document structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* React Query Provider - Manages all data fetching and caching */}
        <QueryProvider>
          {/* Material-UI Theme Provider - Ensures consistent styling */}
          <ThemeProvider>
            {/* Toast Notification Provider - Global error/success messages */}
            <ToastProvider>
              {/* Conditional Navigation - Hidden on auth pages */}
              <NavGate />
              {/* Main Content Area - Where pages render */}
              <main>
                {children}
              </main>
            </ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
