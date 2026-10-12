import type { Metadata } from "next";
import { Tektur } from "next/font/google";
import "./globals.css";
import LeadCaptureWidget from "@/components/LeadCaptureWidget";
import TennisBallCursor from "@/components/ui/TennisBallCursor";

const tektur = Tektur({
  subsets: ["latin"],
  variable: "--font-tektur",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.leetssports.com"),
  title: {
    default: "Leets Sports | Sports Management Company | Padel Clubs in Egypt & KSA",
    template: "%s | Leets Sports",
  },
  description: "Leets Sports owns and operates sports facilities across Egypt and Saudi Arabia: padel clubs, academies and boutique fitness studios.",
  openGraph: {
    title: "Leets Sports | Sports Management Company",
    description: "Leets Sports owns and operates sports facilities across Egypt and Saudi Arabia: padel clubs, academies and boutique fitness studios.",
    url: "https://www.leetssports.com",
    siteName: "Leets Sports",
    locale: "en_US",
    type: "website",
    images: [{ url: "/leets-logo.png", width: 612, height: 408, alt: "Leets Sports" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leets Sports | Sports Management Company",
    description: "Leets Sports builds, owns and operates padel clubs across Egypt and Saudi Arabia.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#172D4D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={tektur.variable}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png" />
        <meta name="apple-mobile-web-app-title" content="Leets Sports" />
        <meta name="application-name" content="Leets Sports" />
        <meta name="msapplication-TileColor" content="#172D4D" />
        <meta name="theme-color" content="#172D4D" />
      </head>
      <body className="font-sans antialiased bg-[#F5F5F7] text-[#111F35]">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <LeadCaptureWidget />
        <TennisBallCursor />
      </body>
    </html>
  );
}
