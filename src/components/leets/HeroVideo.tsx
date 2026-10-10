"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COMPANY } from "@/data/company";

interface HeroVideoProps {
  stats: { value: string; label: string }[];
}

const HERO_SLIDES = [
  {
    src: "/clubs/pyramids-park-view/hero-slides/slide-1.jpg?v=20261011_v1",
    alt: "Pyramids Park View Flagship Championship Padel Courts",
    label: "Championship Courts",
  },
  {
    src: "/clubs/pyramids-park-view/hero-slides/slide-2.jpg?v=20261011_v1",
    alt: "Pyramids Park View Resort and Giza Pyramids Skyline",
    label: "Pyramids Skyline View",
  },
  {
    src: "/clubs/pyramids-park-view/hero-slides/slide-3.jpg?v=20261011_v1",
    alt: "Pro Padel Match Gear & Court Turf",
    label: "Pro Coaching & Gear",
  },
  {
    src: "/clubs/pyramids-park-view/hero-slides/slide-4.jpg?v=20261011_v1",
    alt: "Overhead Panoramic Perspective of Padel Courts",
    label: "Panoramic View",
  },
];

export function HeroVideo({ stats }: HeroVideoProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Natural flow slideshow auto-advance every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background Natural Flow Slideshow */}
      <div className="absolute inset-0 z-0 bg-[#0A0F1E]">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                role="presentation"
                className={`h-full w-full object-cover transform transition-transform duration-[7000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* Clean, Crisp Scrim - Preserves high contrast and sharp details while ensuring text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/25 to-black/35 pointer-events-none" />
      </div>

      {/* Hero Interactive Content */}
      <div className="relative z-20 mx-auto max-w-6xl px-4 py-20 md:py-24 text-center flex flex-col items-center">
        {/* Brand Energy Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-xl transition hover:border-[#EA553B]/50 hover:bg-black/60">
          <span className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-xs font-bold uppercase tracking-[0.25em] text-white/95">
            Est. 2019 · Egypt &amp; Saudi Arabia
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="mt-8 font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-extrabold uppercase leading-[0.88] tracking-[-0.02em] sm:text-7xl md:text-8xl lg:text-9xl text-white">
          A Social Sporty Lifestyle
          <span className="mt-2 block text-[#EA553B]">
            For All The Family.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base text-white/90 sm:text-lg md:text-xl font-medium leading-relaxed">
          {COMPANY.heroSub}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/clubs"
            className="group min-h-[52px] inline-flex items-center gap-2.5 rounded-xl bg-[#EA553B] px-8 py-3.5 font-[family-name:var(--font-display,'Barlow_Condensed')] text-base font-bold uppercase tracking-wider text-white shadow-[0_4px_30px_rgba(234,85,59,0.45)] transition-[background-color,transform,box-shadow] duration-150 hover:bg-[#FF6B4F] hover:shadow-[0_8px_40px_rgba(234,85,59,0.6)] active:scale-[0.97]"
          >
            <span>Explore Facilities</span>
            <svg
              className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            href="/kids"
            className="min-h-[52px] inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-[family-name:var(--font-display,'Barlow_Condensed')] text-base font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:border-white hover:bg-white/20 active:scale-[0.97]"
          >
            <span>Kids Academy</span>
            <span className="rounded-md bg-[#EA553B]/30 px-2 py-0.5 text-[11px] font-semibold text-[#FF8F78]">
              Free Trial
            </span>
          </Link>

          <Link
            href="/classes/book-court"
            className="min-h-[52px] inline-flex items-center rounded-xl border border-white/20 bg-transparent px-7 py-3.5 font-[family-name:var(--font-display,'Barlow_Condensed')] text-base font-bold uppercase tracking-wider text-white/80 transition hover:border-white/50 hover:text-white active:scale-[0.97]"
          >
            Book Court
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="mt-14 w-full max-w-4xl grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 border-t border-white/10 pt-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition duration-150 hover:border-[#EA553B]/40 hover:bg-white/[0.08]"
            >
              <p className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl sm:text-4xl font-extrabold text-[#EA553B] group-hover:scale-105 transition-transform duration-150">
                {s.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-white/60 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Slideshow Controls & Progress Indicator */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          title="Previous slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0F172A]/70 text-white/80 backdrop-blur-md transition hover:border-white/50 hover:text-white active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Slide Dots / Indicators */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#0F172A]/70 border border-white/15 backdrop-blur-md">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.label}`}
              title={slide.label}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? "w-6 bg-[#EA553B]"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          title="Next slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0F172A]/70 text-white/80 backdrop-blur-md transition hover:border-white/50 hover:text-white active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
