"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { KidsRegistrationForm } from "@/components/forms/KidsRegistrationForm";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const STATS = [
  { value: "500+", label: "Active Players" },
  { value: "12", label: "Pro Courts" },
  { value: "8+", label: "Expert Coaches" },
  { value: "50+", label: "Weekly Sessions" },
];

const FEATURES = [
  { icon: "🎾", title: "Padel Coaching", desc: "One-on-one and group coaching for all levels — beginner to advanced match play" },
  { icon: "🏋️", title: "Padel-Specific Fitness", desc: "Strength, agility & footwork programs designed to elevate your court performance" },
  { icon: "⚡", title: "Speed & Agility", desc: "Ladder drills, cone work, and reaction training to sharpen your movement" },
  { icon: "🧘", title: "Recovery & Mobility", desc: "Stretching routines and mobility work to prevent injuries and stay game-ready" },
  { icon: "📊", title: "Video Analysis", desc: "Record and review your technique with frame-by-frame coach feedback" },
  { icon: "🏆", title: "Match Play & Tournaments", desc: "Regular competitive play, club tournaments, and league participation" },
];



export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setLoaded(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    const unmute = () => {
      const v = videoRef.current;
      if (v) { v.muted = false; v.volume = 0.5; }
      document.removeEventListener("scroll", unmute);
      document.removeEventListener("click", unmute);
      document.removeEventListener("touchstart", unmute);
    };
    document.addEventListener("scroll", unmute);
    document.addEventListener("click", unmute);
    document.addEventListener("touchstart", unmute);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", unmute);
      document.removeEventListener("click", unmute);
      document.removeEventListener("touchstart", unmute);
    };
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
              <a href="#gallery" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Facilities</a>
              <a href="#features" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Features</a>
              <Link href="/marketplace" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Marketplace</Link>
              <Link href="/auth/login" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Sign Up</Link>
            </div>
            <div className="flex items-center gap-3">
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
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/padel-court-hero.jpg"
            alt="Professional padel court"
            fill
            priority
            className="object-cover scale-105 transition-transform duration-[20s]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/60 to-[#0F172A]/95" />
        </div>
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[#EA553B]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-[#EA553B]/10 rounded-full blur-[120px]" />
        </div>
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <img src="/leets-logo.png" alt="Leets Logo" className="w-48 h-auto sm:w-64 md:w-80 lg:w-96 mx-auto object-contain mb-8 drop-shadow-[0_8px_40px_rgba(234,85,59,0.5)]" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EA553B]/10 border border-[#EA553B]/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#EA553B] animate-pulse" />
            <span className="text-[#EA553B] text-sm font-semibold tracking-wider uppercase">PRACTICE &gt; ACHIEVE &gt; INSPIRE</span>
          </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight text-white mb-6">
            Saudi Arabia's
            <span className="block text-[#EA553B] mt-2">Premier Padel Coaching</span>
            <span className="block text-white/90 mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Academy</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-white/80 mb-4 max-w-3xl mx-auto">
            Train Smarter. Play Stronger. Win More.
          </p>
          <p className="font-body text-sm md:text-base text-white/60 mb-10 max-w-2xl mx-auto">
            Expert padel coaching and sport-specific fitness training for all levels
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#register" className="bg-[#EA553B] hover:bg-[#D14028] text-white px-8 py-3.5 rounded-lg font-display text-sm tracking-wide transition-all shadow-[0_4px_20px_rgba(234,85,59,0.4)]">
              Start Training
            </a>
            <a href="#gallery" className="border border-white/30 hover:border-white/60 text-white/90 hover:text-white px-8 py-3.5 rounded-lg font-display text-sm tracking-wide transition-all">
              Explore Facilities
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <AnimatedSection className="bg-[#0F172A] border-y border-[#EA553B]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl text-[#EA553B]">{s.value}</div>
                <div className="text-white/50 text-xs uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Gallery Section */}
      <section id="gallery" className="px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatedSection className="max-w-7xl mx-auto">
          <div className="text-center mb-12 pt-4">
            <span className="text-[#EA553B] text-sm font-semibold tracking-widest uppercase">Our Facilities</span>
            <h2 className="font-display text-5xl md:text-7xl text-white mt-2">Padel Training Center</h2>
            <p className="text-white/40 text-sm mt-3 max-w-xl mx-auto">
              Premium courts, expert coaching, and fitness built for padel athletes
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/Videos/dunes-kids-academy.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 rounded-xl pointer-events-none">
              <div className="text-white">
                <p className="font-display text-lg">Padel Training at Leets</p>
                <p className="text-white/60 text-xs">Watch our coaching program in action</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#F5F5F5] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[#EA553B] text-sm font-semibold tracking-widest uppercase">Train Like a Pro</span>
            <h2 className="font-display text-5xl md:text-7xl text-[#0F172A] mt-2">Coaching & Fitness</h2>
            <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
              Everything you need to take your padel game to the next level
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#EA553B]/20 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-[#EA553B]/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <h3 className="font-display text-xl text-[#0F172A] mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <AnimatedSection className="relative overflow-hidden">
        <div className="relative bg-gradient-to-r from-[#EA553B] to-[#D14028] px-4 sm:px-6 lg:px-8 py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="font-display text-5xl md:text-7xl text-white mb-4">Ready to Level Up?</h2>
            <p className="text-white/80 text-sm md:text-base mb-8 max-w-xl mx-auto">
              Book a coaching session or fitness assessment and start your padel journey today
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/classes/book-coach" className="bg-white text-[#EA553B] hover:bg-gray-100 px-8 py-3.5 rounded-lg font-display text-sm tracking-wide transition-all">
                Book a Coach
              </Link>
              <Link href="/classes/book-court" className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-3.5 rounded-lg font-display text-sm tracking-wide transition-all">
                Book a Court
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Registration Form */}
      <div id="register">
        <KidsRegistrationForm />
      </div>

      {/* Footer */}
      <footer className="bg-[#111111] border-t border-white/10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/leets-logo.png" alt="Leets Logo" className="w-10 h-10 object-contain" />
                <div>
                  <span className="font-display text-xl text-white tracking-tight">LEETS</span>
                  <p className="text-[#EA553B] text-xs uppercase tracking-wider">Padel Academy</p>
                </div>
              </div>
              <p className="text-white/40 text-sm max-w-md">
                Saudi Arabia's premier padel coaching academy in Jeddah. 
                Expert coaching, padel-specific fitness, and a community that trains together.
              </p>
            </div>
            <div>
              <h4 className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <Link href="/classes/book-court" className="text-white/40 hover:text-[#EA553B] text-sm transition-colors">Book Court</Link>
                <Link href="/classes/book-coach" className="text-white/40 hover:text-[#EA553B] text-sm transition-colors">Book Coach</Link>
                <Link href="/marketplace" className="text-white/40 hover:text-[#EA553B] text-sm transition-colors">Marketplace</Link>
                <Link href="/auth/login" className="text-white/40 hover:text-[#EA553B] text-sm transition-colors">Sign In</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-4">Contact</h4>
              <div className="flex flex-col gap-2 text-sm text-white/40">
                <span>Jeddah, Saudi Arabia</span>
                <a href="https://wa.me/201222288617" className="hover:text-[#EA553B] transition-colors">+20 122 228 8617</a>
                <a href="https://chat.whatsapp.com/BzRcZzhdHrRBjoJQpT8lj2" className="hover:text-[#EA553B] transition-colors">Join Padel Group</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">© 2026 Leets Sports. All rights reserved.</p>
            <p className="text-white/20 text-[10px] uppercase tracking-widest">PRACTICE &gt; ACHIEVE &gt; INSPIRE</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Buttons */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-4">
        <a href="https://wa.me/201222288617" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <span className="bg-white text-green-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg mr-2 whitespace-nowrap">
            Contact LEETS
          </span>
          <div className="w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all hover:scale-110 hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] border-2 border-white">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </a>
        <a href="https://chat.whatsapp.com/BzRcZzhdHrRBjoJQpT8lj2" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
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
    </div>
  );
}
