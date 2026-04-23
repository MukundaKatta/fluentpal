import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FluentPal — Learn English by talking.",
  description:
    "An AI tutor in your pocket. Real conversations, gentle corrections.",
  openGraph: {
    title: "FluentPal — Learn English by talking.",
    description:
      "An AI tutor in your pocket. Real conversations, gentle corrections.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} bg-white text-neutral-900 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
