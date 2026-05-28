import type { Metadata } from "next";
import { Barlow_Condensed, Sora } from "next/font/google";
import "./globals.css";
import LeadCaptureWidget from "@/components/LeadCaptureWidget";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Leets | Practice > Achieve > Inspire",
  description: "Saudi Arabia's premier padel coaching academy in Jeddah — expert coaching, padel-specific fitness, and a community that trains together.",
  keywords: ["Leets", "Padel", "Sports", "Fitness", "Jeddah", "Saudi Arabia", "Padel Coaching"],
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
