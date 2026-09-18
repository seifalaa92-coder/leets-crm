"use client";

import { useRef, useState } from "react";
import Link from "next/link";

interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  videoSrc: string;
  posterSrc: string;
  clubHref?: string;
  description: string;
}

const SHOWCASE_VIDEOS: VideoItem[] = [
  {
    id: "pyramids",
    title: "Pyramids Park View Flagship",
    subtitle: "Full Facility Tour & Match Play",
    location: "Sheikh Zayed, Cairo",
    videoSrc: "/clubs/pyramids-park-view/Pyramids%20Main%20Video.mp4",
    posterSrc: "/clubs/pyramids-park-view/poster.jpg",
    clubHref: "/clubs/pyramids-park-view",
    description: "Experience our flagship venue featuring championship padel courts, boutique fitness gym, and athlete recovery.",
  },
  {
    id: "training",
    title: "High-Performance Coaching",
    subtitle: "WPT Drills & Video Analysis",
    location: "Cairo & Jeddah",
    videoSrc: "/training.mp4",
    posterSrc: "/training-poster.jpg",
    clubHref: "/clubs",
    description: "Professional padel coaching methodology designed for rapid technical refinement, court footwork, and match tactics.",
  },
  {
    id: "westmark",
    title: "Westmark Mall Arena",
    subtitle: "Destination Sports Club",
    location: "Sheikh Zayed, Cairo",
    videoSrc: "/clubs/westmark-mall/Westmark%201.mp4",
    posterSrc: "/clubs/westmark-mall/poster.jpg",
    clubHref: "/clubs/westmark-mall",
    description: "Transforming prime urban spaces into thriving sports hubs with daily tournaments and league sessions.",
  },
  {
    id: "padel-ace",
    title: "Padel Ace New Cairo",
    subtitle: "Community & Youth Sessions",
    location: "New Cairo",
    videoSrc: "/clubs/padel-ace/Padel%20ACe%201.mp4",
    posterSrc: "/clubs/padel-ace/poster.jpg",
    clubHref: "/clubs/padel-ace",
    description: "East Cairo's lively padel community with structured academy programs and competitive leagues.",
  },
];

export function VideoShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeVideo = SHOWCASE_VIDEOS[activeIdx];

  const handleSelectVideo = (idx: number) => {
    setActiveIdx(idx);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !videoRef.current.muted;
    videoRef.current.muted = next;
    setIsMuted(next);
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
    <section className="relative border-t border-white/10 bg-[#0F172A] py-24 overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EA553B]/30 bg-[#EA553B]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#EA553B] mb-3">
            Real Action · Real Venues
          </span>
          <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white">
            Experience Leets in Motion
          </h2>
          <p className="mt-4 text-base text-white/70">
            Step onto the courts and see how we deliver championship-level facilities, high-energy coaching, and an active community lifestyle.
          </p>
        </div>

        {/* Video Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {SHOWCASE_VIDEOS.map((v, i) => {
            const isSelected = i === activeIdx;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelectVideo(i)}
                className={`group flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  isSelected
                    ? "bg-[#EA553B] text-white shadow-[0_4px_20px_rgba(234,85,59,0.35)]"
                    : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isSelected ? "bg-white animate-pulse" : "bg-white/30"
                  }`}
                />
                <span className="font-[family-name:var(--font-display,'Barlow_Condensed')] tracking-wide uppercase">
                  {v.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Video Player Container */}
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-black/60 shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
          <div className="relative aspect-video w-full overflow-hidden">
            <video
              ref={videoRef}
              key={activeVideo.videoSrc}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              poster={activeVideo.posterSrc}
              className="h-full w-full object-cover"
            >
              <source src={activeVideo.videoSrc} type="video/mp4" />
            </video>

            {/* Video Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar on Video */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="rounded-full bg-black/60 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
                {activeVideo.location}
              </span>

              {/* Sound and Play Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-black/90 hover:text-[#EA553B] transition"
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
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-black/90 hover:text-[#EA553B] transition"
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
            </div>

            {/* Bottom Info on Video */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#EA553B] font-bold">
                  {activeVideo.subtitle}
                </p>
                <h3 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
                  {activeVideo.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-xl line-clamp-2">
                  {activeVideo.description}
                </p>
              </div>

              {activeVideo.clubHref && (
                <Link
                  href={activeVideo.clubHref}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 transition hover:bg-[#EA553B] hover:border-[#EA553B]"
                >
                  <span>Explore Club</span>
                  <span>→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
