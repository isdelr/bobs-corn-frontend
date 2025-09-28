import type { Metadata } from "next";
import ThemeProvider from "@/app/components/shared/ThemeProvider";
import Navbar from "@/app/components/shared/Navbar";

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
        <ThemeProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
