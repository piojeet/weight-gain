import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";
import { WishlistProvider } from "./hooks/useWishlist";
import { CartProvider } from "./hooks/useCart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheGrowthHealth",
  description: "Science-backed nutrition for your growth and health.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WishlistProvider>
        <CartProvider>
        <AppChrome>{children}</AppChrome>
        </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
