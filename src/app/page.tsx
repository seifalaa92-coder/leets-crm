"use client";

/**
 * Leets Landing Page - NO EMOJIS
 * Easy navigation to booking pages
 */

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { VisitorTracker } from "@/components/tracking/VisitorTracker";
// SVG Icons

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

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const QrIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 20h2v-4H6v4zm6-8h2V8h-2v4zM6 12h2V8H6v4zm12-4V4h-4v4h4zm0 6v-2h-4v2h4zM8 4v4H4V4h4z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

// Feature images - reduced for performance
const features = [
  { 
    title: "QR Access Control", 
    description: "Contactless entry with dynamic QR codes.", 
    Icon: QrIcon, 
    color: "#22C55E",
    image: "/images/padel-court-1.jpg"
  },
  { 
    title: "Smart Scheduling", 
    description: "Book courts and classes with ease.", 
    Icon: CalendarIcon, 
    color: "#EA553B",
    image: "/images/padel-court-2.jpg"
  },
  { 
    title: "Loyalty Rewards", 
    description: "Earn points and get rewarded.", 
    Icon: StarIcon, 
    color: "#F59E0B",
    image: "/images/padel-court-3.jpg"
  },
];

const stats = [
  { value: "10K+", label: "Active Members" },
  { value: "50+", label: "Sports Venues" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

// Gallery images - reduced for performance
const galleryImages = [
  { 
    src: "/images/padel-court-1.jpg", 
    alt: "Professional padel court with glass walls",
    span: "col-span-2 row-span-2"
  },
  { 
    src: "/images/padel-court-2.jpg", 
    alt: "Padel court view",
    span: "col-span-1 row-span-1"
  },
  { 
    src: "/images/padel-court-3.jpg", 
    alt: "Indoor padel court facility",
    span: "col-span-1 row-span-1"
  },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleImageLoad = (id: string) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Visitor Tracking */}
      <VisitorTracker />
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0F172A]/95 backdrop-blur-xl shadow-lg" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/leets-logo.png" 
                alt="Leets Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="font-display text-2xl text-white tracking-tight">LEETS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Features</a>
              <a href="#gallery" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Gallery</a>
              <button 
                onClick={() => setIsLeadFormOpen(true)}
                className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors"
              >
                Contact Us
              </button>
              <Link href="/auth/login" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Sign In</Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link 
                href="/classes/book-court" 
                className="hidden sm:flex items-center gap-2 bg-[#EA553B] hover:bg-[#D14028] text-white px-5 py-2.5 rounded-lg font-display text-sm tracking-wide transition-all"
              >
                Book Court
              </Link>
              <Link 
                href="/classes/book-coach" 
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2.5 rounded-lg font-display text-sm tracking-wide transition-all"
              >
                Book Coach
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Background Image - Padel Court */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/padel-court-hero.jpg"
            alt="Professional padel court with glass walls"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/70 to-[#0F172A]/95" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#EA553B]/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#EA553B]/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Leets Logo - Extra Large and Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <img 
              src="/leets-logo.png" 
              alt="Leets Logo" 
              className="w-48 h-auto sm:w-64 md:w-80 lg:w-96 mx-auto object-contain drop-shadow-[0_8px_40px_rgba(234,85,59,0.5)]"
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EA553B]/10 border border-[#EA553B]/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#EA553B] animate-pulse" />
            <span className="text-[#EA553B] text-sm font-semibold tracking-wider uppercase">PRACTICE &gt; ACHIEVE &gt; INSPIRE</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight text-white mb-6"
          >
            The New
            <span className="block text-[#EA553B] mt-2">Luxury Social Club</span>
            <span className="block text-white/90 mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Experience in Saudi Arabia</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-body text-lg md:text-xl text-white/80 mb-4 max-w-3xl mx-auto"
          >
            The Complete CRM Platform for Modern Sports Venues
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-body text-sm md:text-base text-white/60 mb-10 max-w-2xl mx-auto"
          >
            Book courts, hire coaches, track progress, and manage your memberships all in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link 
              href="/classes/book-court" 
              className="group flex items-center gap-3 bg-[#EA553B] hover:bg-[#D14028] text-white px-8 py-4 rounded-xl font-display text-lg tracking-wide transition-all w-full sm:w-auto justify-center"
            >
              Book a Court
              <ArrowRightIcon />
            </Link>
            <Link 
              href="/classes/book-coach" 
              className="group flex items-center gap-3 bg-transparent hover:bg-white/10 text-white border-2 border-white/40 hover:border-white px-8 py-4 rounded-xl font-display text-lg tracking-wide transition-all w-full sm:w-auto justify-center"
            >
              Book a Coach
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="font-display text-3xl md:text-4xl text-[#EA553B]">{stat.value}</div>
                <div className="font-body text-xs text-white/60 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white/60 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#EA553B] text-sm font-semibold tracking-widest uppercase mb-4 block">Gallery</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Experience Padel
            </h2>
            <p className="font-body text-white/60 max-w-2xl mx-auto">
              World-class facilities designed for champions
            </p>
          </div>

          {/* Masonry Grid Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${img.span}`}
              >
                {/* Skeleton Loader */}
                {!imageLoaded[`gallery-${index}`] && (
                  <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                )}
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  loading="lazy"
                  className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                    imageLoaded[`gallery-${index}`] ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoad={() => handleImageLoad(`gallery-${index}`)}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-body text-sm text-white">{img.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section id="features" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#EA553B] text-sm font-semibold tracking-widest uppercase mb-4 block">Features</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-black mb-4">
              Everything You Need
            </h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your sports experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Feature Image */}
                <div className="relative h-48 overflow-hidden">
                  {!imageLoaded[`feature-${index}`] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    loading="lazy"
                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                      imageLoaded[`feature-${index}`] ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onLoad={() => handleImageLoad(`feature-${index}`)}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Icon Badge */}
                  <div 
                    className="absolute bottom-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: feature.color }}
                  >
                    <feature.Icon />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl text-black mb-2 group-hover:text-[#EA553B] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="font-body text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video/Showcase Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Video/Image Preview */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
            >
              <Image
                src="/images/padel-court-1.jpg"
                alt="Padel facility tour"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-[#EA553B] rounded-full flex items-center justify-center text-white shadow-2xl"
                >
                  <PlayIcon />
                </motion.div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#EA553B] text-sm font-semibold tracking-widest uppercase mb-4 block">
                Take a Tour
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-black mb-6">
                World-Class Facilities
              </h2>
              <p className="font-body text-gray-600 text-lg mb-6">
                Experience our state-of-the-art padel courts designed for players of all levels. 
                From professional training to casual matches, we provide the perfect environment.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Professional-grade padel courts",
                  "Climate-controlled indoor facilities",
                  "Premium lighting for night play",
                  "Pro shop with equipment rental"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-body text-gray-700">
                    <svg className="w-5 h-5 text-[#EA553B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link 
                href="/classes/book-court"
                className="inline-flex items-center gap-2 bg-[#EA553B] hover:bg-[#D14028] text-white px-8 py-4 rounded-xl font-display text-lg tracking-wide transition-all"
              >
                Book a Court
                <ArrowRightIcon />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-6">
            Ready to Start Playing?
          </h2>
          <p className="font-body text-white/60 mb-8 max-w-2xl mx-auto">
            Book your first court or coaching session today. No registration required to browse availability.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/classes/book-court" 
              className="flex items-center gap-3 bg-[#EA553B] hover:bg-[#D14028] text-white px-8 py-4 rounded-xl font-display text-lg w-full sm:w-auto justify-center transition-all"
            >
              <CalendarIcon />
              Book a Court
            </Link>
            <Link 
              href="/classes/book-coach" 
              className="flex items-center gap-3 bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-xl font-display text-lg w-full sm:w-auto justify-center transition-all"
            >
              <UserIcon />
              Hire a Coach
            </Link>
            <button 
              onClick={() => setIsLeadFormOpen(true)}
              className="flex items-center gap-3 bg-transparent hover:bg-white/10 text-white border-2 border-white/40 hover:border-white px-8 py-4 rounded-xl font-display text-lg w-full sm:w-auto justify-center transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] border-t border-white/10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img 
                src="/leets-logo.png" 
                alt="Leets Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="font-display text-xl text-white tracking-tight">LEETS</span>
                <p className="text-[#EA553B] text-xs uppercase tracking-wider">Sports CRM</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-6">
              <Link href="/classes/book-court" className="font-body text-sm text-white/60 hover:text-[#EA553B] transition-colors">
                Book Court
              </Link>
              <Link href="/classes/book-coach" className="font-body text-sm text-white/60 hover:text-[#EA553B] transition-colors">
                Book Coach
              </Link>
              <Link href="/auth/login" className="font-body text-sm text-white/60 hover:text-[#EA553B] transition-colors">
                Sign In
              </Link>
            </div>

            {/* Copyright */}
            <p className="font-body text-xs text-white/40">
              © 2026 Leets Sports. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Quick Book Button (Mobile) */}
      <Link
        href="/classes/book-court"
        className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 bg-[#EA553B] hover:bg-[#D14028] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
      >
        <CalendarIcon />
      </Link>

      {/* Lead Capture Form Modal */}
      <LeadCaptureForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        triggerSource="landing_page_auto"
      />
    </div>
  );
}
