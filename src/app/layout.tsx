import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leets | PRACTICE > ACHIEVE > INSPIRE",
  description: "Leets Sports - Premier Padel Academy, Functional Fitness, Pilates & Yoga Studios, Swimming Pool, Kids Area & F&B in Jeddah, Saudi Arabia",
  keywords: ["Leets", "Padel", "Sports", "Fitness", "Jeddah", "Saudi Arabia", "Gym", "Yoga", "Swimming"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} ${bebasNeue.variable} font-body antialiased bg-neutral-off-white text-neutral-charcoal`}>
        {children}
      </body>
    </html>
  );
}
