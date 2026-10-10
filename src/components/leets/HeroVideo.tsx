"use client";

import Link from "next/link";
import { COMPANY } from "@/data/company";

interface HeroVideoProps {
  stats: { value: string; label: string }[];
}

export function HeroVideo({ stats }: HeroVideoProps) {
  return (
    <section className="relative min-h-[92vh] md:min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#0A0F1E]">
      {/* Still Signature Navy Blue Background Design */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Deep Slate / Midnight Navy Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0A0F1E] to-[#0A0F1E]" />

        {/* Ambient Brand & Stadium Atmospheric Radial Glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-[#EA553B]/10 blur-[150px]" />
        <div className="absolute top-1/3 -left-40 h-[450px] w-[450px] rounded-full bg-[#1E293B]/60 blur-[130px]" />
        <div className="absolute bottom-10 -right-40 h-[500px] w-[500px] rounded-full bg-[#EA553B]/8 blur-[160px]" />

        {/* Subtle Athletic Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-24 text-center flex flex-col items-center">
        {/* Brand Energy Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md shadow-xl transition hover:border-[#EA553B]/50 hover:bg-white/[0.07]">
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
    </section>
  );
}
