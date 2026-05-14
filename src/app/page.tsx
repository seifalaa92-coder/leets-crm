"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { KidsRegistrationForm } from "@/components/forms/KidsRegistrationForm";



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
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
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
            Saudi Arabia's
            <span className="block text-[#EA553B] mt-2">Premier Kids Padel</span>
            <span className="block text-white/90 mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Academy</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-white/80 mb-4 max-w-3xl mx-auto">
            Where Young Athletes Become Champions
          </p>
          
          <p className="font-body text-sm md:text-base text-white/60 mb-10 max-w-2xl mx-auto">
            Professional padel coaching for kids ages 4-18. Register your child below.
          </p>
        </div>
      </section>

      <KidsRegistrationForm />

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
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-4">
        <a
          href="https://wa.me/201222288617"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <span className="bg-white text-green-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg mr-2 whitespace-nowrap">
            Contact LEETS
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
          className="flex items-center gap-2"
        >
          <span className="bg-white text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg mr-2 whitespace-nowrap">
            Join Padel Group
          </span>
          <div className="w-14 h-14 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-full shadow-[0_4px_20px_rgba(18,140,126,0.4)] flex items-center justify-center transition-all hover:scale-110 hover:shadow-[0_6px_25px_rgba(18,140,126,0.6)] border-2 border-white">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </a>
      </div>

      {/* Floating Mobile Button */}
      <Link href="/classes/book-court" className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 bg-[#EA553B] hover:bg-[#D14028] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </Link>
    </div>
  );
}
