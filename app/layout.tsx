import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'ninexGo X Analytics',
  description: 'Free X analytics for non-premium users',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between">
            <Link href="/" className="text-xl font-bold">ninexGo</Link>
            <div>
              <Link href="/dashboard" className="mr-4 hover:underline">Dashboard</Link>
            </div>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
