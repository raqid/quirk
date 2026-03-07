import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Quirk — Your Data Trains AI. You Should Get Paid.",
  description: "Capture photos, videos, and audio. Earn upfront + royalties every time your data is licensed by AI companies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

// Note: Providers wrapper is only applied in /app and /login layouts,
// not on the landing page which doesn't need auth/Google SDK.
