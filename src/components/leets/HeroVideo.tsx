"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { COMPANY } from "@/data/company";

interface HeroVideoProps {
  stats: { value: string; label: string }[];
}

export function HeroVideo({ stats }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Video with Poster Fallback */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/clubs/pyramids-park-view/hero-poster.jpg"
          onLoadedData={() => setVideoLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            videoLoaded ? "opacity-95" : "opacity-0"
          }`}
        >
          <source src="/clubs/pyramids-park-view/pyramids-hero.mp4" type="video/mp4" />
        </video>

        {/* Clean, Crisp Gradient Scrim — Keeps video sharp & visible while guaranteeing text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/25 to-[#0A0F1E]/60 pointer-events-none" />
      </div>

      {/* Hero Interactive Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-28 text-center flex flex-col items-center">
        {/* Brand Energy Pill */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-xl transition hover:border-[#EA553B]/50 hover:bg-black/60">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA553B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EA553B]"></span>
          </span>
          <span className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-xs font-bold uppercase tracking-[0.25em] text-white/95">
            Est. 2019 · Egypt & Saudi Arabia
          </span>
        </div>

        {/* Main Headline with drop shadow */}
        <h1 className="mt-8 font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-extrabold uppercase leading-[0.88] tracking-[-0.02em] sm:text-7xl md:text-8xl lg:text-9xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
          Elevate Your Sports
          <span className="mt-2 block bg-gradient-to-r from-[#EA553B] via-[#FF7A5C] to-[#FFA07A] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(234,85,59,0.4)]">
            Experience Every Day.
          </span>
        </h1>

        {/* Subtitle with drop shadow */}
        <p className="mt-6 max-w-2xl text-base text-white/95 sm:text-lg md:text-xl font-medium leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
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
        <div className="mt-16 w-full max-w-4xl grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 border-t border-white/10 pt-8">
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

      {/* Floating Media Controls (Mute / Pause) */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute court audio" : "Mute audio"}
          title={isMuted ? "Unmute court audio" : "Mute audio"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#0F172A]/70 text-white/80 backdrop-blur-md transition hover:border-white/50 hover:text-white active:scale-95"
        >
          {isMuted ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-[#EA553B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          title={isPlaying ? "Pause video" : "Play video"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#0F172A]/70 text-white/80 backdrop-blur-md transition hover:border-white/50 hover:text-white active:scale-95"
        >
          {isPlaying ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-[#EA553B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          )}
        </button>
      </div>

      {/* Down Scroll Prompt */}
      <a
        href="#facilities"
        aria-label="Scroll to facilities"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 transition hover:text-[#EA553B] group"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase font-[family-name:var(--font-display,'Barlow_Condensed')]">
          Scroll
        </span>
        <svg
          className="h-5 w-5 animate-bounce group-hover:text-[#EA553B]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </a>
    </section>
  );
}
