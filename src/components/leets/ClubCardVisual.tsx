"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "@/components/leets/Shell";
import type { Club } from "@/data/company";

interface ClubCardVisualProps {
  club: Club;
  priority?: boolean;
}

export function ClubCardVisual({ club, priority = false }: ClubCardVisualProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <Link
      href={`/clubs/${club.slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#EA553B]/60 hover:bg-white/[0.06] hover:shadow-[0_12px_40px_rgba(234,85,59,0.2)] active:scale-[0.99]"
    >
      {/* Visual Media Header (Video on hover / Poster) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0F1E]">
        {club.posterImage && (
          <Image
            src={club.posterImage}
            alt={club.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              isHovered && videoLoaded ? "opacity-0" : "opacity-100"
            }`}
          />
        )}

        {club.previewVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered ? "opacity-100 scale-105" : "opacity-0"
            }`}
          >
            <source src={club.previewVideo} type="video/mp4" />
          </video>
        )}

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <StatusBadge status={club.status} />
          <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md border border-white/10">
            {club.country}
          </span>
        </div>

        {/* Live Video Indicator on Hover */}
        {club.previewVideo && (
          <div
            className={`absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-md bg-[#0F172A]/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EA553B] backdrop-blur-md transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA553B] animate-ping" />
            Live Preview
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA553B]">
            {club.role}
          </span>
        </div>

        <h3 className="mt-2 font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white transition-colors duration-150 group-hover:text-[#EA553B]">
          {club.name}
        </h3>

        <p className="mt-1 text-xs sm:text-sm text-white/50">{club.city}</p>

        <p className="mt-3 text-sm text-white/70 line-clamp-2 leading-relaxed">
          {club.short}
        </p>

        {/* Highlights Tags */}
        {club.highlights && club.highlights.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {club.highlights.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer CTA */}
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/40 group-hover:text-white/70 transition-colors">
            Full Operations & Media
          </span>
          <span className="flex items-center gap-1.5 text-sm font-bold text-[#EA553B]">
            View Club
            <span className="transition-transform duration-200 group-hover:translate-x-1.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
