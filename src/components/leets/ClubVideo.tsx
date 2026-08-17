"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Only the lead video plays on its own, and only when the visitor hasn't asked
 * for reduced motion. Everything else waits behind a poster and a play control,
 * so a club page no longer pulls several megabytes of looping video on open.
 */
export function ClubVideo({ src, lead = false }: { src: string; lead?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [autoplay, setAutoplay] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!lead) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Respect Data Saver where the browser exposes it.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!reduce && !conn?.saveData) {
      setAutoplay(true);
      setStarted(true);
    }
  }, [lead]);

  // The source can fail before React attaches its listener (and a <source>
  // error doesn't reach the parent), so check the element's own state too.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const check = () => {
      if (v.error || v.networkState === v.NETWORK_NO_SOURCE) setFailed(true);
    };
    check();
    v.addEventListener("error", check, true);
    const t = setTimeout(check, 4000);
    return () => {
      v.removeEventListener("error", check, true);
      clearTimeout(t);
    };
  }, [src]);

  function play() {
    setStarted(true);
    ref.current?.play();
  }

  // A source that can't load should read as "not available", not as a dead player.
  if (failed) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-white/60">
        This video isn&apos;t available right now.
      </div>
    );
  }

  return (
    <div className="relative">
      <video
        ref={ref}
        controls={started}
        autoPlay={autoplay}
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        className="w-full rounded-xl border border-white/10"
      >
        <source src={src} onError={() => setFailed(true)} />
      </video>

      {!started && (
        <button
          type="button"
          onClick={play}
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#0F172A]/40 transition-[background-color,transform] duration-100 hover:bg-[#0F172A]/25 active:scale-[0.99]"
          aria-label="Play video"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EA553B] shadow-[0_4px_24px_rgba(234,85,59,0.45)]">
            <svg width="22" height="24" viewBox="0 0 22 24" fill="white" aria-hidden="true">
              <path d="M21 12 0 24V0z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
