import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "GET STUDIO | Photo Booth & Studio Booking",
  description: "Book your photo studio session at GET STUDIO in Jakarta. Choose your package, date, and time with instant availability.",
  keywords: ["photo studio", "foto studio", "jakarta", "booking system", "get studio"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GET STUDIO | Photo Booth & Studio Booking",
    description: "Book your photo studio session at GET STUDIO in Jakarta.",
    url: "/",
    siteName: "GET STUDIO",
    type: "website",
    images: [{ url: "/window.svg", width: 1200, height: 630, alt: "GET STUDIO" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GET STUDIO | Photo Booth & Studio Booking",
    description: "Book your photo studio session at GET STUDIO in Jakarta.",
    images: ["/window.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
