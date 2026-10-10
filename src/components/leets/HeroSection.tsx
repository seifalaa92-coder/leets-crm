"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const SLIDES = [
  {
    src: "/clubs/pyramids-park-view/hero-slides/slide-1.jpg",
    alt: "Pyramids Park View Padel Courts Sheikh Zayed",
    label: "Pyramids Park View · Court Perspective",
  },
  {
    src: "/clubs/pyramids-park-view/hero-slides/slide-2.jpg",
    alt: "Pyramids Park View Resort and Club Overview",
    label: "Pyramids Park View · Aerial Horizon",
  },
];

export function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  // Autoplay video on load (unless reduced motion preferred)
  useEffect(() => {
    if (!videoRef.current) return;
    if (reduceMotion) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
      return;
    }

    videoRef.current
      .play()
      .then(() => {
        setIsVideoPlaying(true);
      })
      .catch(() => {
        setIsVideoPlaying(false);
      });
  }, [reduceMotion]);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsVideoPlaying(true))
        .catch(() => {
          setVideoAvailable(false);
          setIsVideoPlaying(false);
        });
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <section className="relative bg-[#F5F5F7] pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 text-center">
        {/* Eyebrow */}
        <p className="text-[10px] font-medium tracking-[1.5px] uppercase text-[#697789]">
          EST. 2019 <span className="mx-2 text-[#9BA8B8]">/</span> EGYPT & KSA{" "}
          <span className="mx-2 text-[#9BA8B8]">/</span> SPORT. PEOPLE. COMMUNITY.
        </p>

        {/* Headline */}
        <h1 className="mx-auto mt-5 mb-5 max-w-[780px] text-[38px] sm:text-[54px] md:text-[68px] font-semibold leading-[1.08] tracking-[-2px] text-[#111F35]">
          Your game.
          <br />
          <em className="not-italic text-[#61768D]">Elevated.</em>
        </h1>

        {/* Supporting Copy */}
        <p className="mx-auto mb-8 max-w-[560px] text-[15px] sm:text-[16px] leading-[1.65] text-[#687383]">
          From your first rally to your next big win.
          <br className="hidden sm:inline" />
          {" "}Courts, coaching and a community to call your own.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12 sm:mb-16">
          <Link
            href="/classes/book-court"
            className="rounded-full bg-[#172D4D] px-6 py-3.5 text-[11px] font-medium tracking-[0.2px] text-white shadow-sm transition-all duration-200 hover:bg-[#304865] hover:-translate-y-0.5 active:translate-y-0"
          >
            BOOK A COURT ↗
          </Link>
          <Link
            href="/kids"
            className="rounded-full border border-[#172D4D] bg-transparent px-6 py-3.5 text-[11px] font-medium tracking-[0.2px] text-[#172D4D] transition-all duration-200 hover:bg-[#172D4D] hover:text-white hover:-translate-y-0.5 active:translate-y-0"
          >
            EXPLORE ACADEMY ↗
          </Link>
        </div>

        {/* Lower Hero Real Media Visual */}
        <div className="relative mx-auto max-w-4xl rounded-[24px] sm:rounded-[28px] overflow-hidden bg-white shadow-[0_20px_50px_rgba(17,31,53,0.08)] border border-[#E7E8EC]">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#101D32]">
            {/* Primary High-Resolution Photography fallback / poster */}
            <Image
              src={SLIDES[activeSlide].src}
              alt={SLIDES[activeSlide].alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className={`object-cover object-center transition-opacity duration-500 ${
                isVideoPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />

            {/* Inline Autoplaying Video Player */}
            {videoAvailable && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                loop
                preload="auto"
                poster="/clubs/pyramids-park-view/hero-poster.jpg"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  isVideoPlaying ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                }`}
              >
                <source src="/clubs/pyramids-park-view/Pyramids Park Video 1.mp4" type="video/mp4" />
              </video>
            )}

            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-20" />

            {/* Control Bar Overlay */}
            <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex items-center justify-between z-30">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[9px] font-medium tracking-wider uppercase text-white/90">
                  {SLIDES[activeSlide].label}
                </span>
                <span className="hidden sm:inline-block rounded-full bg-emerald-500/80 px-2.5 py-0.5 text-[8px] font-semibold tracking-wider uppercase text-white">
                  Active Flagship
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Slide Toggle */}
                {!isVideoPlaying && (
                  <div className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md p-1">
                    {SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        aria-label={`View slide ${idx + 1}`}
                        className={`h-2 w-2 rounded-full transition-all ${
                          activeSlide === idx ? "w-5 bg-white" : "bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Video Play/Pause Control */}
                {videoAvailable && !reduceMotion && (
                  <button
                    type="button"
                    onClick={toggleVideo}
                    aria-label={isVideoPlaying ? "Pause preview video" : "Play preview video"}
                    className="flex items-center gap-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1 text-[9px] font-medium text-white transition-colors"
                  >
                    {isVideoPlaying ? (
                      <>
                        <Pause className="h-2.5 w-2.5 fill-current" />
                        <span>PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-2.5 w-2.5 fill-current" />
                        <span>VIDEO</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-note */}
        <p className="mt-4 text-[9px] tracking-wider uppercase text-[#7A8593]">
          PYRAMIDS PARK VIEW · SHEIKH ZAYED, CAIRO
        </p>
      </div>
    </section>
  );
}
