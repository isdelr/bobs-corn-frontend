import type { Metadata } from "next";
import ThemeProvider from "@/app/components/shared/ThemeProvider";
import NavGate from "@/app/components/shared/NavGate";
import QueryProvider from "@/app/components/shared/QueryProvider";
import ToastProvider from "@/app/components/shared/ToastProvider";

export const metadata: Metadata = {
  title: "Bob's Corn — Farm‑fresh popcorn, seasonings, gifts & more",
  description: "Discover farm‑fresh popcorn, artisanal seasonings, gift bundles, and more. Clean, fast shopping experience inspired by the best storefronts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider>
              <NavGate />
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
