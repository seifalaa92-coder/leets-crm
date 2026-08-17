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
    default: "Leets Sports — Sports Management Company | Padel Clubs in Egypt & KSA",
    template: "%s | Leets Sports",
  },
  description: "Leets Sports owns and operates sports facilities across Egypt and Saudi Arabia — padel clubs, academies and boutique fitness studios.",
  openGraph: {
    title: "Leets Sports — Sports Management Company",
    description: "Leets Sports owns and operates sports facilities across Egypt and Saudi Arabia — padel clubs, academies and boutique fitness studios.",
    url: "https://www.leetssports.com",
    siteName: "Leets Sports",
    locale: "en_US",
    type: "website",
    images: [{ url: "/leets-logo.png", width: 612, height: 408, alt: "Leets Sports" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leets Sports — Sports Management Company",
    description: "Leets Sports builds, owns and operates padel clubs across Egypt and Saudi Arabia.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables live on <html> so :root can resolve them — declaring
    // --font-body in :root while --font-sora sat on <body> made the whole
    // declaration invalid, and every page fell back to the system UI font.
    <html lang="en" dir="ltr" className={`${barlowCondensed.variable} ${sora.variable}`}>
      <body className="font-body antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <LeadCaptureWidget />
      </body>
    </html>
  );
}
