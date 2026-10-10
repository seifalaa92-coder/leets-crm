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
      if (videoRef.current.readyState >= 2) {
        setVideoLoaded(true);
      }
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setVideoLoaded(true)).catch(() => {});
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
      className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[#E7E8EC] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(17,31,53,0.06)] active:scale-[0.99]"
    >
      {/* Visual Media Header (Video on hover / Poster) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#101D32]">
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
            onLoadedMetadata={() => setVideoLoaded(true)}
            onLoadedData={() => setVideoLoaded(true)}
            onCanPlay={() => setVideoLoaded(true)}
            onPlaying={() => setVideoLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered ? "opacity-100 scale-105" : "opacity-0"
            }`}
          >
            <source src={club.previewVideo} type="video/mp4" />
          </video>
        )}

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <StatusBadge status={club.status} />
          <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            {club.country}
          </span>
        </div>

        {/* Live Video Indicator on Hover */}
        {club.previewVideo && (
          <div
            className={`absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur-md transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live Preview
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#172D4D]">
            {club.role}
          </span>
        </div>

        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.5px] text-[#111F35] transition-colors duration-150 group-hover:text-[#172D4D]">
          {club.name}
        </h3>

        <p className="mt-1 text-xs text-[#667080]">{club.city}</p>

        <p className="mt-3 text-sm text-[#687383] line-clamp-2 leading-relaxed">
          {club.short}
        </p>

        {/* Highlights Tags */}
        {club.highlights && club.highlights.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {club.highlights.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#E7E8EC] bg-[#F5F5F7] px-2.5 py-1 text-[10px] font-medium text-[#667080]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer CTA */}
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-[#E7E8EC]">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#758191]">
            Project Overview
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[#172D4D]">
            Explore
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              ↗
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
