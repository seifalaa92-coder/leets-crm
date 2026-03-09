"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);

const features = [
  { title: "QR Access Control", description: "Contactless entry with dynamic QR codes.", color: "#22C55E" },
  { title: "Smart Scheduling", description: "Book courts and classes with ease.", color: "#EA553B" },
  { title: "Loyalty Rewards", description: "Earn points and get rewarded.", color: "#F59E0B" },
];

const stats = [
  { value: "10K+", label: "Active Members" },
  { value: "50+", label: "Sports Venues" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0F172A]/95 backdrop-blur-xl shadow-lg" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3">
              <img src="/leets-logo.png" alt="Leets Logo" className="w-10 h-10 object-contain" />
              <span className="font-display text-2xl text-white tracking-tight">LEETS</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Features</a>
              <Link href="/shop" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Shop</Link>
              <Link href="/auth/login" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Sign Up</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/shop" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-display text-base tracking-wide transition-all font-bold">
                🛒 SHOP
              </Link>
              <Link href="/classes/book-court" className="hidden sm:flex items-center gap-2 bg-[#EA553B] hover:bg-[#D14028] text-white px-5 py-2.5 rounded-lg font-display text-sm tracking-wide transition-all">
                Book Court
              </Link>
              <Link href="/classes/book-coach" className="hidden md:flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2.5 rounded-lg font-display text-sm tracking-wide transition-all">
                Book Coach
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/padel-court-hero.jpg"
            alt="Professional padel court"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/70 to-[#0F172A]/95" />
        </div>

        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#EA553B]/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#EA553B]/10 rounded-full blur-[100px]" />
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <img src="/leets-logo.png" alt="Leets Logo" className="w-48 h-auto sm:w-64 md:w-80 lg:w-96 mx-auto object-contain mb-8 drop-shadow-[0_8px_40px_rgba(234,85,59,0.5)]" />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EA553B]/10 border border-[#EA553B]/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#EA553B] animate-pulse" />
            <span className="text-[#EA553B] text-sm font-semibold tracking-wider uppercase">PRACTICE &gt; ACHIEVE &gt; INSPIRE</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight text-white mb-6">
            The New
            <span className="block text-[#EA553B] mt-2">Luxury Social Club</span>
            <span className="block text-white/90 mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Experience in Saudi Arabia</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-white/80 mb-4 max-w-3xl mx-auto">
            The Complete CRM Platform for Modern Sports Venues
          </p>
          
          <p className="font-body text-sm md:text-base text-white/60 mb-10 max-w-2xl mx-auto">
            Book courts, hire coaches, track progress, and manage your memberships all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/classes/book-court" className="flex items-center gap-3 bg-[#EA553B] hover:bg-[#D14028] text-white px-8 py-4 rounded-xl font-display text-lg tracking-wide transition-all w-full sm:w-auto justify-center">
              Book a Court
              <ArrowRightIcon />
            </Link>
            <Link href="/classes/book-coach" className="flex items-center gap-3 bg-transparent hover:bg-white/10 text-white border-2 border-white/40 hover:border-white px-8 py-4 rounded-xl font-display text-lg tracking-wide transition-all w-full sm:w-auto justify-center">
              Book a Coach
            </Link>
            <Link href="/auth/signup" className="flex items-center gap-3 bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-xl font-display text-lg tracking-wide transition-all w-full sm:w-auto justify-center">
              Sign Up
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="font-display text-3xl md:text-4xl text-[#EA553B]">{stat.value}</div>
                <div className="font-body text-xs text-white/60 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#EA553B] text-sm font-semibold tracking-widest uppercase mb-4 block">Features</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-black mb-4">Everything You Need</h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto">Powerful features designed to streamline your sports experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4`} style={{ backgroundColor: feature.color }}>
                  {index === 0 && (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 20h2v-4H6v4zm6-8h2V8h-2v4zM6 12h2V8H6v4zm12-4V4h-4v4h4zm0 6v-2h-4v2h4zM8 4v4H4V4h4z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-display text-xl text-black mb-2">{feature.title}</h3>
                <p className="font-body text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-6">Ready to Start Playing?</h2>
          <p className="font-body text-white/60 mb-8 max-w-2xl mx-auto">Book your first court or coaching session today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/classes/book-court" className="flex items-center gap-3 bg-[#EA553B] hover:bg-[#D14028] text-white px-8 py-4 rounded-xl font-display text-lg w-full sm:w-auto justify-center transition-all">
              <CalendarIcon />
              Book a Court
            </Link>
            <Link href="/classes/book-coach" className="flex items-center gap-3 bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-xl font-display text-lg w-full sm:w-auto justify-center transition-all">
              <UserIcon />
              Hire a Coach
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] border-t border-white/10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/leets-logo.png" alt="Leets Logo" className="w-10 h-10 object-contain" />
              <div>
                <span className="font-display text-xl text-white tracking-tight">LEETS</span>
                <p className="text-[#EA553B] text-xs uppercase tracking-wider">Sports CRM</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/classes/book-court" className="font-body text-sm text-white/60 hover:text-[#EA553B] transition-colors">Book Court</Link>
              <Link href="/classes/book-coach" className="font-body text-sm text-white/60 hover:text-[#EA553B] transition-colors">Book Coach</Link>
              <Link href="/auth/login" className="font-body text-sm text-white/60 hover:text-[#EA553B] transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="font-body text-sm text-white/60 hover:text-[#EA553B] transition-colors">Sign Up</Link>
            </div>
            <p className="font-body text-xs text-white/40">© 2026 Leets Sports. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Mobile Button */}
      <Link href="/classes/book-court" className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 bg-[#EA553B] hover:bg-[#D14028] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110">
        <CalendarIcon />
      </Link>
    </div>
  );
}
