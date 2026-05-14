"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { KidsRegistrationForm } from "@/components/forms/KidsRegistrationForm";

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
                🛒 SHOP+
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

      {/* Kids Registration */}
      <KidsRegistrationForm />

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

      {/* Floating WhatsApp Buttons */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
        <a
          href="https://wa.me/201222288617"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2"
        >
          <span className="bg-white text-green-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity mr-2 whitespace-nowrap">
            Chat with us
          </span>
          <div className="w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all hover:scale-110 hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] border-2 border-white">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </a>
        <a
          href="https://chat.whatsapp.com/BzRcZzhdHrRBjoJQpT8lj2"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2"
        >
          <span className="bg-white text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity mr-2 whitespace-nowrap">
            Join Our Group
          </span>
          <div className="w-14 h-14 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-full shadow-[0_4px_20px_rgba(18,140,126,0.4)] flex items-center justify-center transition-all hover:scale-110 hover:shadow-[0_6px_25px_rgba(18,140,126,0.6)] border-2 border-white">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.666 1.438 5.189L2 22l4.811-1.438A9.965 9.965 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.89 0-3.666-.524-5.189-1.438l-.372-.224-2.866.857.857-2.866-.224-.372A7.965 7.965 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4-6.5c-.25-.125-1.475-.725-1.7-.825-.225-.1-.4-.15-.575.15-.175.3-.675.825-.825 1-.15.175-.3.2-.55.075-.25-.125-1.05-.425-1.975-1.25-.75-.675-1.25-1.5-1.4-1.75-.15-.25-.025-.375.1-.5.1-.1.225-.275.35-.425.125-.15.175-.25.25-.425.075-.175.025-.3-.025-.425-.05-.125-.575-1.4-.775-1.9-.2-.5-.4-.425-.55-.425-.15 0-.325-.01-.5-.01s-.45.075-.675.325c-.225.25-.9.875-.9 2.125s.9 2.45 1.025 2.625c.125.175 1.775 2.8 4.325 3.9.6.275 1.075.425 1.45.55.6.2 1.15.175 1.575.1.5-.075 1.5-.625 1.7-1.225.2-.6.2-1.125.15-1.225-.075-.1-.25-.175-.5-.3z"/>
            </svg>
          </div>
        </a>
      </div>

      {/* Floating Mobile Button */}
      <Link href="/classes/book-court" className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 bg-[#EA553B] hover:bg-[#D14028] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110">
        <CalendarIcon />
      </Link>
    </div>
  );
}
