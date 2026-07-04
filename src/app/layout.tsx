import type { Metadata } from "next";
import { Barlow_Condensed, Sora } from "next/font/google";
import "./globals.css";
import LeadCaptureWidget from "@/components/LeadCaptureWidget";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  fallback: ["Arial Narrow", "sans-serif"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  fallback: ["Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.leetssports.com"),
  title: {
    default: "Leets | Practice > Achieve > Inspire",
    template: "%s | Leets Sports",
  },
  description: "Saudi Arabia's premier padel coaching academy in Jeddah — expert coaching, padel-specific fitness, and a community that trains together.",
  openGraph: {
    title: "Leets Sports — Padel Academy Jeddah",
    description: "Expert padel coaching, fitness, and community in Jeddah.",
    url: "https://www.leetssports.com",
    siteName: "Leets Sports",
    locale: "en_US",
    type: "website",
    images: [{ url: "/leets-logo.png", width: 612, height: 408, alt: "Leets Sports" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leets Sports — Padel Academy Jeddah",
    description: "Expert padel coaching, fitness, and community in Jeddah.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${barlowCondensed.variable} ${sora.variable} font-body antialiased`}>
        {children}
        <LeadCaptureWidget />
      </body>
    </html>
  );
}
